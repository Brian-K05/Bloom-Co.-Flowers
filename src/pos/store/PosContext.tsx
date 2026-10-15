import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { isSupabaseConfigured } from '../../lib/supabase'
import { clearStorage, readStorage, writeStorage } from '../../lib/storage'
import {
  apiCreateOrder,
  apiDeleteProduct,
  apiResetDemo,
  apiRestockProduct,
  apiSetOrderStatus,
  apiUpdateArticle,
  apiUpdateOrder,
  apiUpdateProductStock,
  apiUpsertProduct,
  fetchPosSnapshot,
} from '../api/posApi'
import { usePosAuth } from '../auth/PosAuthContext'
import { POS_LOCATIONS, RIBBON_OPTIONS, WRAPPER_OPTIONS, seedArticles, seedOrders, seedProducts } from '../seed'
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
  locations: 'bloomco.pos.locations',
  ribbons: 'bloomco.pos.ribbons',
  wrappers: 'bloomco.pos.wrappers',
}

type PosContextValue = {
  products: PosProduct[]
  orders: PosOrder[]
  articles: PosArticle[]
  /** Delivery / pickup labels from DB (or local seed fallback) */
  locations: string[]
  ribbons: string[]
  wrappers: string[]
  ready: boolean
  loading: boolean
  error: string | null
  backend: 'supabase' | 'local'
  refresh: () => Promise<void>
  createOrder: (input: PosOrderInput) => Promise<PosOrder | null>
  updateOrder: (id: string, patch: Partial<PosOrder>, historyText?: string) => Promise<void>
  setOrderStatus: (id: string, status: PosOrderStatus) => Promise<{ ok: boolean; error?: string }>
  restockProduct: (id: string, qty: number) => Promise<void>
  updateProductStock: (id: string, qty: number) => Promise<void>
  upsertProduct: (product: PosProduct) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  toggleReminderDone: (orderId: string) => Promise<void>
  updateArticle: (id: string, patch: Partial<PosArticle>) => Promise<void>
  resetDemo: () => Promise<void>
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
  const backend: 'supabase' | 'local' = isSupabaseConfigured ? 'supabase' : 'local'
  const [products, setProducts] = useState<PosProduct[]>([])
  const [orders, setOrders] = useState<PosOrder[]>([])
  const [articles, setArticles] = useState<PosArticle[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [ribbons, setRibbons] = useState<string[]>([])
  const [wrappers, setWrappers] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const actor = user?.displayName ?? 'Staff'

  const persistLocal = useCallback(
    (nextProducts: PosProduct[], nextOrders: PosOrder[], nextArticles: PosArticle[]) => {
      setProducts(nextProducts)
      setOrders(nextOrders)
      setArticles(nextArticles)
      writeStorage(KEYS.products, nextProducts)
      writeStorage(KEYS.orders, nextOrders)
      writeStorage(KEYS.articles, nextArticles)
    },
    [],
  )

  const applyShopOptions = useCallback((locs: string[], rib: string[], wrap: string[]) => {
    setLocations(locs)
    setRibbons(rib)
    setWrappers(wrap)
    writeStorage(KEYS.locations, locs)
    writeStorage(KEYS.ribbons, rib)
    writeStorage(KEYS.wrappers, wrap)
  }, [])

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (backend === 'supabase') {
        const snap = await fetchPosSnapshot()
        setProducts(snap.products)
        setOrders(snap.orders)
        setArticles(snap.articles)
        // Prefer DB rows; if migrate SQL not run yet, keep empty so UI prompts seed — do not silently hardcode catalog
        applyShopOptions(snap.locations, snap.ribbons, snap.wrappers)
      } else {
        setProducts(readStorage(KEYS.products, seedProducts))
        setOrders(readStorage(KEYS.orders, seedOrders))
        setArticles(readStorage(KEYS.articles, seedArticles))
        applyShopOptions(
          readStorage(KEYS.locations, POS_LOCATIONS),
          readStorage(KEYS.ribbons, RIBBON_OPTIONS),
          readStorage(KEYS.wrappers, WRAPPER_OPTIONS),
        )
      }
      setReady(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load POS data'
      setError(message)
      setReady(false)
    } finally {
      setLoading(false)
    }
  }, [applyShopOptions, backend])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const createOrder = useCallback(
    async (input: PosOrderInput) => {
      try {
        if (backend === 'supabase') {
          const order = await apiCreateOrder(input, products, orders, actor)
          setOrders((prev) => [order, ...prev])
          return order
        }
        const lines: PosOrder['items'] = []
        for (const line of input.items) {
          const product = products.find((p) => p.id === line.productId)
          if (!product || line.quantity < 1) return null
          if (product.stockQty < line.quantity && !input.isPreorder) return null
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
            { at: new Date().toISOString(), by: actor, text: `Order encoded from ${input.source}` },
          ],
          subtotal,
          total: subtotal,
          stockApplied: false,
        }
        const nextOrders = [order, ...orders]
        persistLocal(products, nextOrders, articles)
        return order
      } catch {
        return null
      }
    },
    [actor, articles, backend, orders, persistLocal, products],
  )

  const updateOrder = useCallback(
    async (id: string, patch: Partial<PosOrder>, historyText?: string) => {
      const current = orders.find((o) => o.id === id)
      if (!current) return
      if (backend === 'supabase') {
        const updated = await apiUpdateOrder(id, patch, historyText, actor, current)
        setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)))
        return
      }
      const nextOrders = orders.map((order) => {
        if (order.id !== id) return order
        const next = { ...order, ...patch, id: order.id }
        if (historyText) {
          next.history = [
            ...order.history,
            { at: new Date().toISOString(), by: actor, text: historyText },
          ]
        }
        return next
      })
      persistLocal(products, nextOrders, articles)
    },
    [actor, articles, backend, orders, persistLocal, products],
  )

  const setOrderStatus = useCallback(
    async (id: string, status: PosOrderStatus) => {
      const order = orders.find((o) => o.id === id)
      if (!order) return { ok: false, error: 'Order not found' }
      try {
        if (backend === 'supabase') {
          const result = await apiSetOrderStatus(id, status, actor, order, products)
          setOrders((prev) => prev.map((o) => (o.id === id ? result.order : o)))
          setProducts(result.products)
          return { ok: true }
        }
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
        const nextOrders = orders.map((o) =>
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
        )
        persistLocal(nextProducts, nextOrders, articles)
        return { ok: true }
      } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : 'Status update failed' }
      }
    },
    [actor, articles, backend, orders, persistLocal, products],
  )

  const restockProduct = useCallback(
    async (id: string, qty: number) => {
      if (qty <= 0) return
      const current = products.find((p) => p.id === id)
      if (!current) return
      if (backend === 'supabase') {
        const updated = await apiRestockProduct(id, qty, current)
        setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)))
        return
      }
      persistLocal(
        products.map((p) =>
          p.id === id
            ? { ...p, stockQty: p.stockQty + qty, available: p.stockQty + qty > 0 }
            : p,
        ),
        orders,
        articles,
      )
    },
    [articles, backend, orders, persistLocal, products],
  )

  const updateProductStock = useCallback(
    async (id: string, qty: number) => {
      if (!Number.isFinite(qty) || qty < 0) return
      if (backend === 'supabase') {
        const updated = await apiUpdateProductStock(id, qty)
        setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)))
        return
      }
      persistLocal(
        products.map((p) => (p.id === id ? { ...p, stockQty: qty, available: qty > 0 } : p)),
        orders,
        articles,
      )
    },
    [articles, backend, orders, persistLocal, products],
  )

  const upsertProduct = useCallback(
    async (product: PosProduct) => {
      if (backend === 'supabase') {
        const updated = await apiUpsertProduct(product)
        setProducts((prev) => {
          const exists = prev.some((p) => p.id === updated.id)
          return exists
            ? prev.map((p) => (p.id === updated.id ? updated : p))
            : [...prev, updated]
        })
        return
      }
      const exists = products.some((p) => p.id === product.id)
      const next = exists
        ? products.map((p) =>
            p.id === product.id ? { ...product, available: product.stockQty > 0 } : p,
          )
        : [...products, { ...product, available: product.stockQty > 0 }]
      persistLocal(next, orders, articles)
    },
    [articles, backend, orders, persistLocal, products],
  )

  const deleteProduct = useCallback(
    async (id: string) => {
      if (backend === 'supabase') {
        await apiDeleteProduct(id)
        setProducts((prev) => prev.filter((p) => p.id !== id))
        return
      }
      persistLocal(
        products.filter((p) => p.id !== id),
        orders,
        articles,
      )
    },
    [articles, backend, orders, persistLocal, products],
  )

  const toggleReminderDone = useCallback(
    async (orderId: string) => {
      const order = orders.find((o) => o.id === orderId)
      if (!order) return
      await updateOrder(
        orderId,
        { reminderDone: !order.reminderDone },
        order.reminderDone ? 'Supplier reminder reopened' : 'Supplier reminder done',
      )
    },
    [orders, updateOrder],
  )

  const updateArticle = useCallback(
    async (id: string, patch: Partial<PosArticle>) => {
      if (backend === 'supabase') {
        const updated = await apiUpdateArticle(id, patch)
        setArticles((prev) => prev.map((a) => (a.id === id ? updated : a)))
        return
      }
      persistLocal(
        products,
        orders,
        articles.map((a) => (a.id === id ? { ...a, ...patch } : a)),
      )
    },
    [articles, backend, orders, persistLocal, products],
  )

  const resetDemo = useCallback(async () => {
    if (backend === 'supabase') {
      const snap = await apiResetDemo()
      setProducts(snap.products)
      setOrders(snap.orders)
      setArticles(snap.articles)
      applyShopOptions(snap.locations, snap.ribbons, snap.wrappers)
      return
    }
    clearStorage([KEYS.products, KEYS.orders, KEYS.articles, KEYS.locations, KEYS.ribbons, KEYS.wrappers])
    persistLocal(seedProducts, seedOrders, seedArticles)
    applyShopOptions(POS_LOCATIONS, RIBBON_OPTIONS, WRAPPER_OPTIONS)
  }, [applyShopOptions, backend, persistLocal])

  const value = useMemo(
    () => ({
      products,
      orders,
      articles,
      locations,
      ribbons,
      wrappers,
      ready,
      loading,
      error,
      backend,
      refresh,
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
      backend,
      createOrder,
      deleteProduct,
      error,
      loading,
      locations,
      orders,
      products,
      ready,
      refresh,
      resetDemo,
      restockProduct,
      ribbons,
      setOrderStatus,
      toggleReminderDone,
      updateArticle,
      updateOrder,
      updateProductStock,
      upsertProduct,
      wrappers,
    ],
  )

  return <PosContext.Provider value={value}>{children}</PosContext.Provider>
}

export function usePos() {
  const ctx = useContext(PosContext)
  if (!ctx) throw new Error('usePos must be used within PosProvider')
  return ctx
}
