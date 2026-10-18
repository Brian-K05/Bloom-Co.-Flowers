import type { PosOrderItem } from '../types'

export function orderSubtotal(items: PosOrderItem[]) {
  return items.reduce((sum, l) => sum + l.price * l.quantity, 0)
}

export function orderTotal(subtotal: number, deliveryFee: number) {
  return subtotal + Math.max(0, deliveryFee)
}
