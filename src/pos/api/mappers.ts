import type { PosArticle, PosChangeEntry, PosCustomization, PosOrder, PosOrderItem, PosProduct } from '../types'

export type DbProduct = {
  id: string
  name: string
  price: number | string
  category: string
  stock_qty: number
  available: boolean
  image: string
  is_imported: boolean
}

export type DbOrder = {
  id: string
  created_at: string
  source: PosOrder['source']
  status: PosOrder['status']
  customer_name: string
  customer_phone: string
  recipient_name: string
  recipient_phone: string
  location: string
  fulfillment: PosOrder['fulfillment']
  schedule_date: string
  items: PosOrderItem[] | string
  customization: PosCustomization | string
  is_preorder: boolean
  supplier_note: string
  reminder_due: string | null
  reminder_done: boolean
  history: PosChangeEntry[] | string
  subtotal: number | string
  total: number | string
  stock_applied: boolean
}

export type DbArticle = {
  id: string
  title: string
  category: PosArticle['category']
  body: string
}

function parseJson<T>(value: T | string, fallback: T): T {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T
    } catch {
      return fallback
    }
  }
  return value ?? fallback
}

export function mapProduct(row: DbProduct): PosProduct {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    category: row.category,
    stockQty: row.stock_qty,
    available: row.available,
    image: row.image,
    isImported: row.is_imported,
  }
}

export function mapOrder(row: DbOrder): PosOrder {
  return {
    id: row.id,
    createdAt: row.created_at,
    source: row.source,
    status: row.status,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    recipientName: row.recipient_name,
    recipientPhone: row.recipient_phone,
    location: row.location,
    fulfillment: row.fulfillment,
    scheduleDate: String(row.schedule_date).slice(0, 10),
    items: parseJson(row.items, []),
    customization: parseJson(row.customization, {
      ribbon: '',
      wrapper: '',
      cardMessage: '',
      addOns: '',
      notes: '',
    }),
    isPreorder: row.is_preorder,
    supplierNote: row.supplier_note ?? '',
    reminderDue: row.reminder_due ? String(row.reminder_due).slice(0, 10) : null,
    reminderDone: row.reminder_done,
    history: parseJson(row.history, []),
    subtotal: Number(row.subtotal),
    total: Number(row.total),
    stockApplied: row.stock_applied,
  }
}

export function mapArticle(row: DbArticle): PosArticle {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    body: row.body,
  }
}

export function toDbProduct(product: PosProduct): DbProduct {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    category: product.category,
    stock_qty: product.stockQty,
    available: product.available,
    image: product.image,
    is_imported: Boolean(product.isImported),
  }
}

export function toDbOrderInsert(order: PosOrder) {
  return {
    id: order.id,
    created_at: order.createdAt,
    source: order.source,
    status: order.status,
    customer_name: order.customerName,
    customer_phone: order.customerPhone,
    recipient_name: order.recipientName,
    recipient_phone: order.recipientPhone,
    location: order.location,
    fulfillment: order.fulfillment,
    schedule_date: order.scheduleDate,
    items: order.items,
    customization: order.customization,
    is_preorder: order.isPreorder,
    supplier_note: order.supplierNote,
    reminder_due: order.reminderDue,
    reminder_done: order.reminderDone,
    history: order.history,
    subtotal: order.subtotal,
    total: order.total,
    stock_applied: order.stockApplied,
  }
}
