export type Category = 'roses' | 'bouquets' | 'boxes'

export type OccasionSlug =
  | 'birthday'
  | 'anniversary'
  | 'valentines'
  | 'mothers-day'
  | 'graduation'
  | 'christmas'
  | 'just-because'

export type Product = {
  id: string
  name: string
  shortDescription: string
  description: string
  price: number
  category: Category
  occasions: OccasionSlug[]
  images: string[]
  available: boolean
  bestSeller?: boolean
  seasonal?: boolean
}

export type CartItem = {
  productId: string
  quantity: number
  message?: string
}

export type Fulfillment = 'delivery' | 'pickup'

export type PaymentMethod = 'cod' | 'gcash' | 'maya' | 'bank'

export type PaymentStatus = 'pending' | 'submitted' | 'verified' | 'rejected'

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled'

export type CustomerInfo = {
  name: string
  email: string
  phone: string
}

export type RecipientInfo = {
  name: string
  phone: string
  address: string
}

export type OrderItem = {
  productId: string
  name: string
  image: string
  price: number
  quantity: number
}

export type Order = {
  id: string
  createdAt: string
  customer: CustomerInfo
  recipient: RecipientInfo
  fulfillment: Fulfillment
  scheduleDate: string
  notes: string
  personalizedMessage: string
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  orderStatus: OrderStatus
  items: OrderItem[]
  subtotal: number
  total: number
  paymentReference?: string
  paymentProofName?: string
  paymentProofData?: string
}

export type Profile = CustomerInfo

export type CheckoutPayload = {
  customer: CustomerInfo
  recipient: RecipientInfo
  fulfillment: Fulfillment
  scheduleDate: string
  notes: string
  personalizedMessage: string
  paymentMethod: PaymentMethod
  paymentReference?: string
  paymentProofName?: string
  paymentProofData?: string
}
