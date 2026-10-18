export type PosRole = 'owner' | 'staff'

export type PosOrderSource = 'messenger' | 'walk-in' | 'call'

export type PosFulfillment = 'delivery' | 'pickup'

/** Shop-floor payment status (prep pipeline removed). */
export type PosOrderStatus = 'not_paid' | 'paid' | 'partial' | 'cancelled'

export type PosThemeId =
  | 'counter-clear'
  | 'peak-board'
  | 'bloom-ledger'
  | 'night-shift'
  | 'studio-grid'

export type PosProduct = {
  id: string
  name: string
  price: number
  category: string
  stockQty: number
  available: boolean
  image: string
  isImported?: boolean
}

export type PosOrderItem = {
  productId: string
  name: string
  price: number
  quantity: number
}

export type PosCustomization = {
  ribbon: string
  wrapper: string
  cardMessage: string
  addOns: string
  notes: string
}

export type PosChangeEntry = {
  at: string
  by: string
  text: string
}

export type PosOrder = {
  id: string
  createdAt: string
  source: PosOrderSource
  status: PosOrderStatus
  customerName: string
  customerPhone: string
  recipientName: string
  recipientPhone: string
  location: string
  fulfillment: PosFulfillment
  scheduleDate: string
  items: PosOrderItem[]
  customization: PosCustomization
  isPreorder: boolean
  supplierNote: string
  reminderDue: string | null
  reminderDone: boolean
  history: PosChangeEntry[]
  subtotal: number
  deliveryFee: number
  total: number
  stockApplied: boolean
}

export type PosArticle = {
  id: string
  title: string
  category: 'flower' | 'color' | 'tip'
  body: string
}

export type PosUser = {
  username: string
  role: PosRole
  displayName: string
}

export type PosOrderInput = {
  source: PosOrderSource
  customerName: string
  customerPhone: string
  recipientName: string
  recipientPhone: string
  location: string
  fulfillment: PosFulfillment
  scheduleDate: string
  items: Array<{ productId: string; quantity: number }>
  customization: PosCustomization
  isPreorder: boolean
  supplierNote: string
  reminderDue: string | null
  status?: PosOrderStatus
  deliveryFee?: number
}
