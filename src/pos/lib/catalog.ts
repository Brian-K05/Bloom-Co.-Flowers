import type {
  PosArrangementKind,
  PosOrder,
  PosOrderItem,
  PosOrderSource,
  PosProduct,
  PosStemLine,
} from '../types'

export const BOUQUET_SIZES = [3, 6, 12, 18, 24] as const
export const BOUQUET_COLORS = ['Red', 'White', 'Pink'] as const
export const ARRANGEMENT_KINDS: PosArrangementKind[] = ['bouquet', 'box', 'basket', 'spray', 'stand', 'other']
export const PRICE_BUCKETS = [350, 500, 800, 1000] as const
export const SLOT_HOURS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
export const SLOT_TIMES = SLOT_HOURS.flatMap((h) => [
  `${String(h).padStart(2, '0')}:00`,
  `${String(h).padStart(2, '0')}:30`,
])

export function arrangementLabel(kind: PosArrangementKind) {
  return kind.charAt(0).toUpperCase() + kind.slice(1)
}

export function hourLabel(hour: number) {
  if (hour === 0) return '12 am'
  if (hour === 12) return '12 nn'
  if (hour < 12) return `${hour} am`
  return `${hour - 12} pm`
}

export function nowSlotTime() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function parseSlotHour(slotTime: string | undefined, createdAt: string) {
  if (slotTime && /^\d{1,2}:/.test(slotTime)) {
    return Math.min(23, Math.max(0, Number(slotTime.split(':')[0])))
  }
  return new Date(createdAt).getHours()
}

export function formatSlotTime(slotTime: string | undefined, createdAt: string) {
  let h: number
  let m: number
  if (slotTime && /^\d{1,2}:\d{2}$/.test(slotTime)) {
    ;[h, m] = slotTime.split(':').map(Number)
  } else {
    const d = new Date(createdAt)
    h = d.getHours()
    m = d.getMinutes()
  }
  const ampm = h >= 12 ? 'PM' : 'AM'
  return `${String(h % 12 || 12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`
}

export function sourceChannelLabel(source: PosOrderSource) {
  if (source === 'messenger') return 'Online'
  if (source === 'walk-in') return 'Walk-in'
  return 'Call'
}

export function messengerHandle(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.|\.$/g, '')
  return slug ? `@${slug}` : ''
}

export function stemDotColor(color?: string, name?: string) {
  const c = `${color ?? ''} ${name ?? ''}`.toLowerCase()
  if (c.includes('red')) return '#c45c5c'
  if (c.includes('pink') || c.includes('blush')) return '#d4899a'
  if (c.includes('white') || c.includes('ivory')) return '#b8c0b4'
  if (c.includes('yellow') || c.includes('sun')) return '#d4a017'
  if (c.includes('peach')) return '#e09a7a'
  if (c.includes('tulip')) return '#c97ba0'
  return '#8aa08a'
}

export function nearestPriceBucket(price: number): number | null {
  return PRICE_BUCKETS.includes(price as (typeof PRICE_BUCKETS)[number]) ? price : null
}

export function parseRecipeText(raw: string): PosStemLine[] {
  return raw
    .split(/\n|;/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(\d+)\s*[x×]\s*(.+)$/i) || line.match(/^(.+?)\s*[x×]\s*(\d+)$/i)
      if (match) {
        const a = match[1]
        const b = match[2]
        if (/^\d+$/.test(a)) return { name: b.trim(), qty: Number(a) }
        return { name: a.trim(), qty: Number(b) }
      }
      return { name: line, qty: 1 }
    })
    .filter((s) => s.name && s.qty > 0)
}

export function recipeText(recipe: PosStemLine[] | undefined) {
  return (recipe ?? []).map((s) => `${s.qty} × ${s.name}`).join('\n')
}

export function formatRecipe(recipe: PosStemLine[] | undefined) {
  if (!recipe?.length) return ''
  return recipe.map((s) => `${s.qty} ${s.name}`).join(', ')
}

export function lineFromProduct(product: PosProduct, quantity: number): PosOrderItem {
  return {
    productId: product.id,
    name: product.name,
    price: product.price,
    quantity,
    kind: product.kind ?? 'other',
    size: product.size,
    color: product.color,
    recipe: product.recipe ?? [],
  }
}

export function tallyOrders(orders: PosOrder[]) {
  const bouquet: Record<string, number> = {}
  const funeral: Record<string, number> = {}
  const stems: Record<string, number> = {}

  for (const order of orders) {
    if (order.status === 'cancelled') continue
    for (const item of order.items) {
      const qty = item.quantity
      const kind = item.kind ?? 'other'
      if (kind === 'bouquet' && item.size && item.color) {
        const key = `${item.size}|${item.color}`
        bouquet[key] = (bouquet[key] ?? 0) + qty
      }
      if (kind === 'box' || kind === 'basket' || kind === 'spray' || kind === 'stand') {
        const bucket = nearestPriceBucket(item.price)
        const key = `${kind}|${bucket ?? 'other'}`
        funeral[key] = (funeral[key] ?? 0) + qty
      }
      for (const stem of item.recipe ?? []) {
        stems[stem.name] = (stems[stem.name] ?? 0) + stem.qty * qty
      }
    }
  }

  return { bouquet, funeral, stems }
}
