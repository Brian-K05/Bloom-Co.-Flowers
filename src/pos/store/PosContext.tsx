import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { clearStorage, readStorage, writeStorage } from '../../lib/storage'
import { usePosAuth } from '../auth/PosAuthContext'
import { seedArticles, seedOrders, seedProducts } from '../seed'
import type {
  PosArticle,
  PosOrder,
  PosOrderInput,
  PosOrderStatus,
  PosProduct,
} from '../types'

const KEYS = {
  products: 'bloomco.pos.products',
  orders: 'bloomco.pos.orders',
  articles: 'bloomco.pos.articles',
}

type PosContextValue = {
  products: PosProduct[]
  orders: PosOrder[]
  articles: PosArticle[]
  createOrder: (input: PosOrderInput) => PosOrder | null
  updateOrder: (id: string, patch: Partial<PosOrder>, historyText?: string) => void
  setOrderStatus: (id: string, status: PosOrderStatus) => { ok: boolean; error?: string }
  restockProduct: (id: string, qty: number) => void
  updateProductStock: (id: string, qty: number) => void
  upsertProduct: (product: PosProduct) => void
  deleteProduct: (id: string) => void
  toggleReminderDone: (orderId: string) => void
  updateArticle: (id: string, patch: Partial<PosArticle>) => void
  resetDemo: () => void
  getOrder: (id: string) => PosOrder | undefined
  getProduct: (id: string) => PosProduct | undefined
}

const PosContext = createContext<PosContextValue | null>(null)

function nextPosId(orders: PosOrder[]) {
  const nums = orders.map((o) => Number(o.id.replace('POS-', ''))).filter((n) => !Number.isNaN(n))
  const next = Math.max(1000, ...nums, 1000) + 1
  return `POS-${next}`
}

function applyStock(
  products: PosProduct[],
  items: PosOrder['items'],
  direction: 'deduct' | 'restore',
): { products: PosProduct[]; ok: boolean; error?: string } {
  const next = products.map((p) => ({ ...p }))
  for (const item of items) {
    const product = next.find((p) => p.id === item.productId)
    if (!product) return { products, ok: false, error: `Missing product ${item.productId}` }
    if (direction === 'deduct') {
      if (product.stockQty < item.quantity) {
        return {
          products,
          ok: false,
          error: `Not enough stock for ${product.name} (have ${product.stockQty})`,
        }
      }
      product.stockQty -= item.quantity
    } else {
      product.stockQty += item.quantity
    }
    product.available = product.stockQty > 0
  }
  return { products: next, ok: true }
}

export function PosProvider({ children }: { children: ReactNode }) {
  const { user } = usePosAuth()
  const [products, setProducts] = useState<PosProduct[]>(() =>
    readStorage(KEYS.products, seedProducts),
  )
  const [orders, setOrders] = useState<PosOrder[]>(() => readStorage(KEYS.orders, seedOrders))
  const [articles, setArticles] = useState<PosArticle[]>(() =>
    readStorage(KEYS.articles, seedArticles),
  )

  const persistProducts = useCallback((next: PosProduct[]) => {
    setProducts(next)
    writeStorage(KEYS.products, next)
  }, [])

  const persistOrders = useCallback((next: PosOrder[]) => {
    setOrders(next)
    writeStorage(KEYS.orders, next)
  }, [])

  const persistArticles = useCallback((next: PosArticle[]) => {
    setArticles(next)
    writeStorage(KEYS.articles, next)
  }, [])

  const actor = user?.displayName ?? 'Staff'

  const createOrder = useCallback(
    (input: PosOrderInput) => {
      const lines: PosOrder['items'] = []
      for (const line of input.items) {
        const product = products.find((p) => p.id === line.productId)
        if (!product || line.quantity < 1) return null
        if (product.stockQty < line.quantity && !input.isPreorder) {
          return null
        }
        lines.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: line.quantity,
        })
      }
      if (!lines.length) return null
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
      persistOrders([order, ...orders])
      return order
    },
    [actor, orders, persistOrders, products],
  )

  const updateOrder = useCallback(
    (id: string, patch: Partial<PosOrder>, historyText?: string) => {
      persistOrders(
        orders.map((order) => {
          if (order.id !== id) return order
          const next = { ...order, ...patch, id: order.id }
          if (historyText) {
            next.history = [
              ...order.history,
              { at: new Date().toISOString(), by: actor, text: historyText },
            ]
          }
          return next
        }),
      )
    },
    [actor, orders, persistOrders],
  )

  const setOrderStatus = useCallback(
    (id: string, status: PosOrderStatus) => {
      const order = orders.find((o) => o.id === id)
      if (!order) return { ok: false, error: 'Order not found' }
      if (order.status === status) return { ok: true }

      let nextProducts = products
      let stockApplied = order.stockApplied

      if (status === 'confirmed' && !order.stockApplied) {
        const result = applyStock(products, order.items, 'deduct')
        if (!result.ok) return { ok: false, error: result.error }
        nextProducts = result.products
        stockApplied = true
      }

      if (status === 'cancelled' && order.stockApplied) {
        const result = applyStock(products, order.items, 'restore')
        if (!result.ok) return { ok: false, error: result.error }
        nextProducts = result.products
        stockApplied = false
      }

      if (nextProducts !== products) persistProducts(nextProducts)

      persistOrders(
        orders.map((o) =>
          o.id === id
            ? {
                ...o,
                status,
                stockApplied,
                history: [
                  ...o.history,
                  {
                    at: new Date().toISOString(),
                    by: actor,
                    text:
                      status === 'confirmed' && !order.stockApplied
                        ? 'Status → Confirmed (stock deducted)'
                        : status === 'cancelled' && order.stockApplied
                          ? 'Status → Cancelled (stock restored)'
                          : `Status → ${status}`,
                  },
                ],
              }
            : o,
        ),
      )
      return { ok: true }
    },
    [actor, orders, persistOrders, persistProducts, products],
  )

  const restockProduct = useCallback(
    (id: string, qty: number) => {
      if (qty <= 0) return
      persistProducts(
        products.map((p) =>
          p.id === id
            ? { ...p, stockQty: p.stockQty + qty, available: p.stockQty + qty > 0 }
            : p,
        ),
      )
    },
    [persistProducts, products],
  )

  const updateProductStock = useCallback(
    (id: string, qty: number) => {
      if (!Number.isFinite(qty) || qty < 0) return
      persistProducts(
        products.map((p) =>
          p.id === id ? { ...p, stockQty: qty, available: qty > 0 } : p,
        ),
      )
    },
    [persistProducts, products],
  )

  const upsertProduct = useCallback(
    (product: PosProduct) => {
      const exists = products.some((p) => p.id === product.id)
      const next = exists
        ? products.map((p) => (p.id === product.id ? { ...product, available: product.stockQty > 0 } : p))
        : [...products, { ...product, available: product.stockQty > 0 }]
      persistProducts(next)
    },
    [persistProducts, products],
  )

  const deleteProduct = useCallback(
    (id: string) => {
      persistProducts(products.filter((p) => p.id !== id))
    },
    [persistProducts, products],
  )

  const toggleReminderDone = useCallback(
    (orderId: string) => {
      persistOrders(
        orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                reminderDone: !o.reminderDone,
                history: [
                  ...o.history,
                  {
                    at: new Date().toISOString(),
                    by: actor,
                    text: o.reminderDone ? 'Supplier reminder reopened' : 'Supplier reminder done',
                  },
                ],
              }
            : o,
        ),
      )
    },
    [actor, orders, persistOrders],
  )

  const updateArticle = useCallback(
    (id: string, patch: Partial<PosArticle>) => {
      persistArticles(articles.map((a) => (a.id === id ? { ...a, ...patch } : a)))
    },
    [articles, persistArticles],
  )

  const resetDemo = useCallback(() => {
    clearStorage([KEYS.products, KEYS.orders, KEYS.articles])
    persistProducts(seedProducts)
    persistOrders(seedOrders)
    persistArticles(seedArticles)
  }, [persistArticles, persistOrders, persistProducts])

  const value = useMemo(
    () => ({
      products,
      orders,
      articles,
      createOrder,
      updateOrder,
      setOrderStatus,
      restockProduct,
      updateProductStock,
      upsertProduct,
      deleteProduct,
      toggleReminderDone,
      updateArticle,
      resetDemo,
      getOrder: (id: string) => orders.find((o) => o.id === id),
      getProduct: (id: string) => products.find((p) => p.id === id),
    }),
    [
      articles,
      createOrder,
      deleteProduct,
      orders,
      products,
      resetDemo,
      restockProduct,
      setOrderStatus,
      toggleReminderDone,
      updateArticle,
      updateOrder,
      updateProductStock,
      upsertProduct,
    ],
  )

  return <PosContext.Provider value={value}>{children}</PosContext.Provider>
}

export function usePos() {
  const ctx = useContext(PosContext)
  if (!ctx) throw new Error('usePos must be used within PosProvider')
  return ctx
}
