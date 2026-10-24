import { getSupabase } from '../../lib/supabase'
import { lineFromProduct, nowSlotTime } from '../lib/catalog'
import { orderSubtotal, orderTotal } from '../lib/orderMoney'
import type { PosArticle, PosOrder, PosOrderInput, PosOrderStatus, PosProduct } from '../types'
import {
  mapArticle,
  mapOrder,
  mapProduct,
  toDbOrderInsert,
  toDbProduct,
  type DbArticle,
  type DbOrder,
  type DbProduct,
} from './mappers'

function nextPosId(orders: PosOrder[]) {
  const nums = orders.map((o) => Number(o.id.replace('POS-', ''))).filter((n) => !Number.isNaN(n))
  const next = Math.max(1000, ...nums, 1000) + 1
  return `POS-${next}`
}

export type PosShopOptions = {
  locations: string[]
  ribbons: string[]
  wrappers: string[]
}

export type PosSnapshot = {
  products: PosProduct[]
  orders: PosOrder[]
  articles: PosArticle[]
  locations: string[]
  ribbons: string[]
  wrappers: string[]
}

type DbLocation = { id: string; label: string; sort_order: number }
type DbOption = { id: string; kind: string; label: string; sort_order: number }

async function persistProductStock(products: PosProduct[], previous: PosProduct[]) {
  const sb = getSupabase()
  for (const p of products) {
    const changed = previous.find((o) => o.id === p.id)
    if (changed && changed.stockQty !== p.stockQty) {
      const { error } = await sb
        .from('pos_products')
        .update({
          stock_qty: p.stockQty,
          available: p.available,
          updated_at: new Date().toISOString(),
        })
        .eq('id', p.id)
      if (error) throw error
    }
  }
}

function deductStock(
  products: PosProduct[],
  items: PosOrder['items'],
): { ok: true; products: PosProduct[] } | { ok: false; error: string } {
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId)
    if (!product) return { ok: false, error: `Missing product ${item.productId}` }
    if (product.stockQty < item.quantity) {
      return { ok: false, error: `Not enough stock for ${product.name} (have ${product.stockQty})` }
    }
  }
  return {
    ok: true,
    products: products.map((p) => {
      const line = items.find((i) => i.productId === p.id)
      if (!line) return p
      const stockQty = p.stockQty - line.quantity
      return { ...p, stockQty, available: stockQty > 0 }
    }),
  }
}

function restoreStock(products: PosProduct[], items: PosOrder['items']): PosProduct[] {
  return products.map((p) => {
    const line = items.find((i) => i.productId === p.id)
    if (!line) return p
    const stockQty = p.stockQty + line.quantity
    return { ...p, stockQty, available: stockQty > 0 }
  })
}

export async function fetchPosSnapshot(): Promise<PosSnapshot> {
  const sb = getSupabase()
  const [productsRes, ordersRes, articlesRes, locationsRes, optionsRes] = await Promise.all([
    sb.from('pos_products').select('*').order('name'),
    sb.from('pos_orders').select('*').order('created_at', { ascending: false }),
    sb.from('pos_articles').select('*').order('title'),
    sb.from('pos_locations').select('id,label,sort_order').order('sort_order'),
    sb.from('pos_options').select('id,kind,label,sort_order').order('sort_order'),
  ])
  if (productsRes.error) throw productsRes.error
  if (ordersRes.error) throw ordersRes.error
  if (articlesRes.error) throw articlesRes.error
  const locations =
    locationsRes.error || !locationsRes.data
      ? []
      : (locationsRes.data as DbLocation[]).map((r) => r.label)
  const options = optionsRes.error || !optionsRes.data ? [] : (optionsRes.data as DbOption[])
  const ribbons = options.filter((o) => o.kind === 'ribbon').map((o) => o.label)
  const wrappers = options.filter((o) => o.kind === 'wrapper').map((o) => o.label)
  return {
    products: (productsRes.data as DbProduct[]).map(mapProduct),
    orders: (ordersRes.data as DbOrder[]).map(mapOrder),
    articles: (articlesRes.data as DbArticle[]).map(mapArticle),
    locations,
    ribbons,
    wrappers,
  }
}

export async function apiCreateOrder(
  input: PosOrderInput,
  products: PosProduct[],
  orders: PosOrder[],
  actor: string,
): Promise<{ order: PosOrder; products: PosProduct[] }> {
  const lines: PosOrder['items'] = []
  for (const line of input.items) {
    const product = products.find((p) => p.id === line.productId)
    if (!product || line.quantity < 1) throw new Error('Invalid product selection')
    if (product.stockQty < line.quantity && !input.isPreorder) {
      throw new Error(`Not enough stock for ${product.name}`)
    }
    lines.push(lineFromProduct(product, line.quantity))
  }
  if (!lines.length) throw new Error('Add at least one product')

  const subtotal = orderSubtotal(lines)
  const deliveryFee = Math.max(0, Number(input.deliveryFee ?? 0))
  const paymentStatus: PosOrderStatus =
    input.status === 'paid' || input.status === 'partial' || input.status === 'not_paid'
      ? input.status
      : 'not_paid'

  let nextProducts = products
  let stockApplied = false
  if (!input.isPreorder) {
    const deducted = deductStock(products, lines)
    if (!deducted.ok) throw new Error(deducted.error)
    nextProducts = deducted.products
    stockApplied = true
  }

  const order: PosOrder = {
    id: nextPosId(orders),
    createdAt: new Date().toISOString(),
    source: input.source,
    status: paymentStatus,
    customerName: input.customerName.trim(),
    customerPhone: input.customerPhone.trim(),
    recipientName: input.recipientName.trim(),
    recipientPhone: input.recipientPhone.trim(),
    location: input.location,
    fulfillment: input.fulfillment,
    scheduleDate: input.scheduleDate,
    slotTime: input.slotTime || nowSlotTime(),
    items: lines,
    customization: input.customization,
    isPreorder: input.isPreorder,
    supplierNote: input.supplierNote,
    reminderDue: input.isPreorder ? input.reminderDue : null,
    reminderDone: false,
    history: [
      {
        at: new Date().toISOString(),
        by: actor,
        text: stockApplied
          ? `Order encoded from ${input.source} (stock deducted)`
          : `Order encoded from ${input.source}`,
      },
    ],
    subtotal,
    deliveryFee,
    total: orderTotal(subtotal, deliveryFee),
    stockApplied,
  }

  if (stockApplied) {
    await persistProductStock(nextProducts, products)
  }

  let toSave = order
  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      const saved = await writeOrderRow(toSave, 'insert')
      return { order: saved, products: nextProducts }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      const code = typeof err === 'object' && err && 'code' in err ? String((err as { code?: string }).code) : ''
      if (code === '23505' || /duplicate key|unique constraint/i.test(message)) {
        const n = Number(toSave.id.replace('POS-', '')) || 1000
        toSave = { ...toSave, id: `POS-${n + 1}` }
        continue
      }
      throw err
    }
  }
  throw new Error('Could not allocate an order number')
}

async function writeOrderRow(order: PosOrder, mode: 'insert' | 'update') {
  const sb = getSupabase()
  const payload: Record<string, unknown> = {
    ...toDbOrderInsert(order),
    ...(mode === 'update' ? { updated_at: new Date().toISOString() } : {}),
  }
  const exec = (body: Record<string, unknown>) =>
    mode === 'insert'
      ? sb.from('pos_orders').insert(body).select('*').single()
      : sb.from('pos_orders').update(body).eq('id', order.id).select('*').single()

  let { data, error } = await exec(payload)
  if (error && (error.code === '42703' || /slot_time|delivery_fee|schema cache/i.test(error.message))) {
    const slim = { ...payload }
    delete slim.slot_time
    delete slim.delivery_fee
    ;({ data, error } = await exec(slim))
  }
  if (error) throw error
  return mapOrder(data as DbOrder)
}

export async function apiUpdateOrder(
  _id: string,
  patch: Partial<PosOrder>,
  historyText: string | undefined,
  actor: string,
  current: PosOrder,
): Promise<PosOrder> {
  const next: PosOrder = {
    ...current,
    ...patch,
    id: current.id,
  }
  if (patch.items || patch.deliveryFee !== undefined || patch.subtotal !== undefined) {
    next.subtotal = patch.subtotal ?? orderSubtotal(next.items)
    next.deliveryFee = Math.max(0, Number(next.deliveryFee ?? 0))
    next.total = orderTotal(next.subtotal, next.deliveryFee)
  }
  if (historyText) {
    next.history = [
      ...current.history,
      { at: new Date().toISOString(), by: actor, text: historyText },
    ]
  }
  return writeOrderRow(next, 'update')
}

export async function apiSetOrderStatus(
  id: string,
  status: PosOrderStatus,
  actor: string,
  order: PosOrder,
  products: PosProduct[],
): Promise<{ order: PosOrder; products: PosProduct[] }> {
  if (order.status === status) return { order, products }

  let nextProducts = products
  let stockApplied = order.stockApplied

  if (status === 'cancelled' && order.stockApplied) {
    nextProducts = restoreStock(products, order.items)
    stockApplied = false
    await persistProductStock(nextProducts, products)
  }

  // Re-encode after cancel: if moving away from cancelled back to a payment status, re-deduct
  if (order.status === 'cancelled' && status !== 'cancelled' && !order.stockApplied && !order.isPreorder) {
    const deducted = deductStock(products, order.items)
    if (!deducted.ok) throw new Error(deducted.error)
    nextProducts = deducted.products
    stockApplied = true
    await persistProductStock(nextProducts, products)
  }

  const historyText =
    status === 'cancelled' && order.stockApplied
      ? 'Status → Cancelled (stock restored)'
      : `Payment → ${status}`

  const updated = await apiUpdateOrder(id, { status, stockApplied }, historyText, actor, order)
  return { order: updated, products: nextProducts }
}

export async function apiUpdateProductStock(id: string, qty: number): Promise<PosProduct> {
  const { data, error } = await getSupabase()
    .from('pos_products')
    .update({
      stock_qty: qty,
      available: qty > 0,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw error
  return mapProduct(data as DbProduct)
}

export async function apiRestockProduct(id: string, qty: number, current: PosProduct): Promise<PosProduct> {
  return apiUpdateProductStock(id, current.stockQty + qty)
}

export async function apiUpsertProduct(product: PosProduct): Promise<PosProduct> {
  const row = toDbProduct({ ...product, available: product.stockQty > 0 })
  const { data, error } = await getSupabase()
    .from('pos_products')
    .upsert({ ...row, updated_at: new Date().toISOString() })
    .select('*')
    .single()
  if (error) throw error
  return mapProduct(data as DbProduct)
}

export async function apiDeleteProduct(id: string): Promise<void> {
  const { error } = await getSupabase().from('pos_products').delete().eq('id', id)
  if (error) throw error
}

export async function apiUpdateArticle(id: string, patch: Partial<PosArticle>): Promise<PosArticle> {
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (patch.title !== undefined) payload.title = patch.title
  if (patch.category !== undefined) payload.category = patch.category
  if (patch.body !== undefined) payload.body = patch.body
  const { data, error } = await getSupabase()
    .from('pos_articles')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw error
  return mapArticle(data as DbArticle)
}

export async function apiResetDemo(): Promise<PosSnapshot> {
  const { error } = await getSupabase().rpc('reset_pos_demo')
  if (error) throw error
  return fetchPosSnapshot()
}
