import type { PosOrder } from '../types'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function icsDate(isoDate: string) {
  return isoDate.replace(/-/g, '')
}

function orderTitle(order: PosOrder) {
  const items = order.items.map((i) => i.name).join(', ')
  return `Bloom Desk · ${order.fulfillment} · ${order.customerName}${items ? ` · ${items}` : ''}`
}

function orderDescription(order: PosOrder) {
  return [
    `Order ${order.id}`,
    `Source: ${order.source}`,
    `Status: ${order.status}`,
    `Location: ${order.location}`,
    `Phone: ${order.customerPhone || '—'}`,
    order.customization.cardMessage ? `Card: ${order.customization.cardMessage}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

function nextDayIso(isoDate: string) {
  const d = new Date(`${isoDate}T12:00:00`)
  d.setDate(d.getDate() + 1)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Google Calendar — Android, iOS Google Calendar app, laptops */
export function googleCalendarUrl(order: PosOrder) {
  const dates = `${icsDate(order.scheduleDate)}/${icsDate(nextDayIso(order.scheduleDate))}`
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: orderTitle(order),
    dates,
    details: orderDescription(order),
    location: order.location,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
