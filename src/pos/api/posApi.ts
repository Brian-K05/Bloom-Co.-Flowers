import { getSupabase } from '../../lib/supabase'
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
  // Older projects may not have run migrate_shop_options.sql yet
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
): Promise<PosOrder> {
  const lines: PosOrder['items'] = []
  for (const line of input.items) {
    const product = products.find((p) => p.id === line.productId)
    if (!product || line.quantity < 1) throw new Error('Invalid product selection')
    if (product.stockQty < line.quantity && !input.isPreorder) {
      throw new Error(`Not enough stock for ${product.name}`)
    }
    lines.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: line.quantity,
    })
  }
  if (!lines.length) throw new Error('Add at least one product')
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0)
  const order: PosOrder = {
    id: nextPosId(orders),
    createdAt: new Date().toISOString(),
    source: input.source,
    status: 'pending',
    customerName: input.customerName.trim(),
    customerPhone: input.customerPhone.trim(),
    recipientName: input.recipientName.trim(),
    recipientPhone: input.recipientPhone.trim(),
    location: input.location,
    fulfillment: input.fulfillment,
    scheduleDate: input.scheduleDate,
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
        text: `Order encoded from ${input.source}`,
      },
    ],
    subtotal,
    total: subtotal,
    stockApplied: false,
  }
  const { data, error } = await getSupabase()
    .from('pos_orders')
    .insert(toDbOrderInsert(order))
    .select('*')
    .single()
  if (error) throw error
  return mapOrder(data as DbOrder)
}

export async function apiUpdateOrder(
  id: string,
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
  if (historyText) {
    next.history = [
      ...current.history,
      { at: new Date().toISOString(), by: actor, text: historyText },
    ]
  }
  const { data, error } = await getSupabase()
    .from('pos_orders')
    .update({
      ...toDbOrderInsert(next),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw error
  return mapOrder(data as DbOrder)
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
  const sb = getSupabase()

  if (status === 'confirmed' && !order.stockApplied) {
    for (const item of order.items) {
      const product = nextProducts.find((p) => p.id === item.productId)
      if (!product) throw new Error(`Missing product ${item.productId}`)
      if (product.stockQty < item.quantity) {
        throw new Error(`Not enough stock for ${product.name} (have ${product.stockQty})`)
      }
    }
    nextProducts = products.map((p) => {
      const line = order.items.find((i) => i.productId === p.id)
      if (!line) return p
      const stockQty = p.stockQty - line.quantity
      return { ...p, stockQty, available: stockQty > 0 }
    })
    stockApplied = true
    for (const p of nextProducts) {
      const changed = products.find((o) => o.id === p.id)
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

  if (status === 'cancelled' && order.stockApplied) {
    nextProducts = products.map((p) => {
      const line = order.items.find((i) => i.productId === p.id)
      if (!line) return p
      const stockQty = p.stockQty + line.quantity
      return { ...p, stockQty, available: stockQty > 0 }
    })
    stockApplied = false
    for (const p of nextProducts) {
      const changed = products.find((o) => o.id === p.id)
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

  const historyText =
    status === 'confirmed' && !order.stockApplied
      ? 'Status → Confirmed (stock deducted)'
      : status === 'cancelled' && order.stockApplied
        ? 'Status → Cancelled (stock restored)'
        : `Status → ${status}`

  const updated = await apiUpdateOrder(
    id,
    { status, stockApplied },
    historyText,
    actor,
    order,
  )
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
