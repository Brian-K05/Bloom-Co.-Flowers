import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { defaultProfile, products as seedProducts, seedOrders } from '../data/catalog'
import { nextOrderId } from '../lib/format'
import { clearStorage, readStorage, writeStorage } from '../lib/storage'
import type {
  CartItem,
  CheckoutPayload,
  Order,
  PaymentStatus,
  Product,
  Profile,
  OrderStatus,
} from '../types'

const KEYS = {
  cart: 'bloomco.v2.cart',
  products: 'bloomco.v2.products',
  orders: 'bloomco.v2.orders',
  profile: 'bloomco.v2.profile',
}

type ShopContextValue = {
  products: Product[]
  cart: CartItem[]
  orders: Order[]
  profile: Profile
  cartCount: number
  cartSubtotal: number
  cartDetailed: Array<CartItem & { product: Product; lineTotal: number }>
  addToCart: (productId: string, quantity?: number, message?: string) => boolean
  updateCartQuantity: (productId: string, quantity: number) => void
  updateCartMessage: (productId: string, message: string) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  placeOrder: (payload: CheckoutPayload) => Order | null
  getProduct: (id: string) => Product | undefined
  getOrder: (id: string) => Order | undefined
  updateProfile: (profile: Profile) => void
  addProduct: (product: Omit<Product, 'id'> & { id?: string }) => void
  updateProduct: (id: string, patch: Partial<Product>) => void
  deleteProduct: (id: string) => void
  toggleAvailability: (id: string) => void
  updateOrderStatus: (id: string, status: OrderStatus) => void
  updatePaymentStatus: (id: string, status: PaymentStatus) => void
  resetDemo: () => void
}

const ShopContext = createContext<ShopContextValue | null>(null)

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [productList, setProductList] = useState<Product[]>(() =>
    readStorage(KEYS.products, seedProducts),
  )
  const [cart, setCart] = useState<CartItem[]>(() => readStorage(KEYS.cart, []))
  const [orders, setOrders] = useState<Order[]>(() => readStorage(KEYS.orders, seedOrders))
  const [profile, setProfile] = useState<Profile>(() => readStorage(KEYS.profile, defaultProfile))

  const persistProducts = useCallback((next: Product[]) => {
    setProductList(next)
    writeStorage(KEYS.products, next)
  }, [])

  const persistCart = useCallback((next: CartItem[]) => {
    setCart(next)
    writeStorage(KEYS.cart, next)
  }, [])

  const persistOrders = useCallback((next: Order[]) => {
    setOrders(next)
    writeStorage(KEYS.orders, next)
  }, [])

  const addToCart = useCallback(
    (productId: string, quantity = 1, message?: string) => {
      const product = productList.find((item) => item.id === productId)
      if (!product || !product.available) return false
      const existing = cart.find((item) => item.productId === productId)
      const nextQuantity = (existing?.quantity ?? 0) + quantity
      const nextMessage = message ?? existing?.message
      const next = existing
        ? cart.map((item) =>
            item.productId === productId
              ? { ...item, quantity: nextQuantity, message: nextMessage }
              : item,
          )
        : [...cart, { productId, quantity, message }]
      persistCart(next)
      return true
    },
    [cart, persistCart, productList],
  )

  const updateCartQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity < 1) {
        persistCart(cart.filter((item) => item.productId !== productId))
        return
      }
      persistCart(cart.map((item) => (item.productId === productId ? { ...item, quantity } : item)))
    },
    [cart, persistCart],
  )

  const updateCartMessage = useCallback(
    (productId: string, message: string) => {
      persistCart(cart.map((item) => (item.productId === productId ? { ...item, message } : item)))
    },
    [cart, persistCart],
  )

  const removeFromCart = useCallback(
    (productId: string) => {
      persistCart(cart.filter((item) => item.productId !== productId))
    },
    [cart, persistCart],
  )

  const clearCart = useCallback(() => persistCart([]), [persistCart])

  const cartDetailed = useMemo(
    () =>
      cart.flatMap((item) => {
        const product = productList.find((entry) => entry.id === item.productId)
        if (!product) return []
        return [{ ...item, product, lineTotal: product.price * item.quantity }]
      }),
    [cart, productList],
  )

  const cartSubtotal = useMemo(
    () => cartDetailed.reduce((sum, item) => sum + item.lineTotal, 0),
    [cartDetailed],
  )

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  )

  const placeOrder = useCallback(
    (payload: CheckoutPayload) => {
      if (cartDetailed.length === 0) return null
      const order: Order = {
        id: nextOrderId(orders.map((item) => item.id)),
        createdAt: new Date().toISOString(),
        customer: payload.customer,
        recipient: payload.recipient,
        fulfillment: payload.fulfillment,
        scheduleDate: payload.scheduleDate,
        notes: payload.notes,
        personalizedMessage: payload.personalizedMessage,
        paymentMethod: payload.paymentMethod,
        paymentStatus: payload.paymentMethod === 'cod' ? 'pending' : 'submitted',
        orderStatus: 'pending',
        items: cartDetailed.map((item) => ({
          productId: item.productId,
          name: item.product.name,
          image: item.product.images[0],
          price: item.product.price,
          quantity: item.quantity,
        })),
        subtotal: cartSubtotal,
        total: cartSubtotal,
        paymentReference: payload.paymentReference,
        paymentProofName: payload.paymentProofName,
        paymentProofData: payload.paymentProofData,
      }
      persistOrders([order, ...orders])
      persistCart([])
      writeStorage(KEYS.profile, payload.customer)
      setProfile(payload.customer)
      return order
    },
    [cartDetailed, cartSubtotal, orders, persistCart, persistOrders],
  )

  const getProduct = useCallback(
    (id: string) => productList.find((item) => item.id === id),
    [productList],
  )

  const getOrder = useCallback((id: string) => orders.find((item) => item.id === id), [orders])

  const updateProfile = useCallback((next: Profile) => {
    setProfile(next)
    writeStorage(KEYS.profile, next)
  }, [])

  const addProduct = useCallback(
    (product: Omit<Product, 'id'> & { id?: string }) => {
      const id = product.id?.trim() || slugify(product.name) || `product-${Date.now()}`
      const uniqueId = productList.some((item) => item.id === id) ? `${id}-${Date.now()}` : id
      persistProducts([
        {
          ...product,
          id: uniqueId,
          images: product.images.length ? product.images : seedProducts[0].images,
        },
        ...productList,
      ])
    },
    [persistProducts, productList],
  )

  const updateProduct = useCallback(
    (id: string, patch: Partial<Product>) => {
      persistProducts(productList.map((item) => (item.id === id ? { ...item, ...patch } : item)))
    },
    [persistProducts, productList],
  )

  const deleteProduct = useCallback(
    (id: string) => {
      persistProducts(productList.filter((item) => item.id !== id))
    },
    [persistProducts, productList],
  )

  const toggleAvailability = useCallback(
    (id: string) => {
      persistProducts(
        productList.map((item) => (item.id === id ? { ...item, available: !item.available } : item)),
      )
    },
    [persistProducts, productList],
  )

  const updateOrderStatus = useCallback(
    (id: string, status: OrderStatus) => {
      persistOrders(orders.map((item) => (item.id === id ? { ...item, orderStatus: status } : item)))
    },
    [orders, persistOrders],
  )

  const updatePaymentStatus = useCallback(
    (id: string, status: PaymentStatus) => {
      persistOrders(orders.map((item) => (item.id === id ? { ...item, paymentStatus: status } : item)))
    },
    [orders, persistOrders],
  )

  const resetDemo = useCallback(() => {
    clearStorage(Object.values(KEYS))
    setProductList(seedProducts)
    setCart([])
    setOrders(seedOrders)
    setProfile(defaultProfile)
  }, [])

  const value = useMemo(
    () => ({
      products: productList,
      cart,
      orders,
      profile,
      cartCount,
      cartSubtotal,
      cartDetailed,
      addToCart,
      updateCartQuantity,
      updateCartMessage,
      removeFromCart,
      clearCart,
      placeOrder,
      getProduct,
      getOrder,
      updateProfile,
      addProduct,
      updateProduct,
      deleteProduct,
      toggleAvailability,
      updateOrderStatus,
      updatePaymentStatus,
      resetDemo,
    }),
    [
      addProduct,
      addToCart,
      cart,
      cartCount,
      cartDetailed,
      cartSubtotal,
      clearCart,
      deleteProduct,
      getOrder,
      getProduct,
      orders,
      placeOrder,
      productList,
      profile,
      removeFromCart,
      resetDemo,
      toggleAvailability,
      updateCartMessage,
      updateCartQuantity,
      updateOrderStatus,
      updatePaymentStatus,
      updateProduct,
      updateProfile,
    ],
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const context = useContext(ShopContext)
  if (!context) {
    throw new Error('useShop must be used within ShopProvider')
  }
  return context
}
