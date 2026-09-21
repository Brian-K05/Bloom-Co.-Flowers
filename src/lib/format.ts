export function formatPHP(amount: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return new Intl.DateTimeFormat('en-PH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-PH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function todayISODate() {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  const local = new Date(now.getTime() - offset * 60_000)
  return local.toISOString().slice(0, 10)
}

export function nextOrderId(existing: string[]) {
  const numbers = existing.map((id) => Number(id.replace('BC-', ''))).filter((n) => !Number.isNaN(n))
  const next = Math.max(1024, ...numbers, 1024) + 1
  return `BC-${next}`
}

export function paymentLabel(method: string) {
  if (method === 'cod') return 'Cash on Delivery / Pickup'
  if (method === 'gcash') return 'GCash'
  if (method === 'maya') return 'Maya'
  if (method === 'bank') return 'Bank Transfer'
  return method
}

export function paymentStatusLabel(status: string) {
  if (status === 'pending') return 'Pending'
  if (status === 'submitted') return 'Submitted'
  if (status === 'verified') return 'Verified'
  if (status === 'rejected') return 'Rejected'
  return status
}

export function orderStatusLabel(status: string, fulfillment?: string) {
  if (status === 'pending') return 'Pending'
  if (status === 'confirmed') return 'Confirmed'
  if (status === 'preparing') return 'Preparing'
  if (status === 'out_for_delivery') {
    return fulfillment === 'pickup' ? 'Ready for Pickup' : 'Out for Delivery'
  }
  if (status === 'completed') return 'Completed'
  if (status === 'cancelled') return 'Cancelled'
  return status
}

export function categoryLabel(category: string) {
  if (category === 'roses') return 'Roses'
  if (category === 'bouquets') return 'Bouquets'
  if (category === 'boxes') return 'Flower Boxes'
  return category
}
