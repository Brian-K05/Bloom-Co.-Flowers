import type { PosOrder } from '../types'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function icsDate(isoDate: string) {
  return isoDate.replace(/-/g, '')
}

function icsEscape(text: string) {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
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

export function buildOrderIcs(order: PosOrder) {
  const stamp = new Date()
  const stampStr = `${stamp.getUTCFullYear()}${pad(stamp.getUTCMonth() + 1)}${pad(stamp.getUTCDate())}T${pad(stamp.getUTCHours())}${pad(stamp.getUTCMinutes())}${pad(stamp.getUTCSeconds())}Z`
  const start = icsDate(order.scheduleDate)
  const end = icsDate(nextDayIso(order.scheduleDate))
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Bloom Desk//POS//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${order.id}@bloomdesk.pos`,
    `DTSTAMP:${stampStr}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${icsEscape(orderTitle(order))}`,
    `DESCRIPTION:${icsEscape(orderDescription(order))}`,
    `LOCATION:${icsEscape(order.location)}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT12H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Bloom Desk schedule reminder',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function buildWeekIcs(orders: PosOrder[]) {
  const stamp = new Date()
  const stampStr = `${stamp.getUTCFullYear()}${pad(stamp.getUTCMonth() + 1)}${pad(stamp.getUTCDate())}T${pad(stamp.getUTCHours())}${pad(stamp.getUTCMinutes())}${pad(stamp.getUTCSeconds())}Z`
  const events = orders
    .filter((o) => o.status !== 'cancelled')
    .map((order) => {
      const start = icsDate(order.scheduleDate)
      const end = icsDate(nextDayIso(order.scheduleDate))
      return [
        'BEGIN:VEVENT',
        `UID:${order.id}@bloomdesk.pos`,
        `DTSTAMP:${stampStr}`,
        `DTSTART;VALUE=DATE:${start}`,
        `DTEND;VALUE=DATE:${end}`,
        `SUMMARY:${icsEscape(orderTitle(order))}`,
        `DESCRIPTION:${icsEscape(orderDescription(order))}`,
        `LOCATION:${icsEscape(order.location)}`,
        'BEGIN:VALARM',
        'TRIGGER:-PT12H',
        'ACTION:DISPLAY',
        'DESCRIPTION:Bloom Desk schedule reminder',
        'END:VALARM',
        'END:VEVENT',
      ].join('\r\n')
    })
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Bloom Desk//POS//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', ...events, 'END:VCALENDAR'].join(
    '\r\n',
  )
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

/** Outlook / Hotmail / Microsoft 365 — Windows laptops + Outlook mobile */
export function outlookCalendarUrl(order: PosOrder) {
  const params = new URLSearchParams({
    allday: 'true',
    subject: orderTitle(order),
    body: orderDescription(order),
    location: order.location,
    startdt: order.scheduleDate,
    enddt: nextDayIso(order.scheduleDate),
    path: '/calendar/action/compose',
    rru: 'addevent',
  })
  return `https://outlook.live.com/calendar/0/action/compose?${params.toString()}`
}

function icsFile(content: string, filename: string) {
  return new File([content], filename, { type: 'text/calendar;charset=utf-8' })
}

/**
 * Best path for Apple Calendar / Samsung / any phone:
 * 1) Web Share with .ics file when supported (iOS Safari, Android Chrome)
 * 2) Otherwise download / open the .ics so the OS calendar app can import it
 */
export async function shareOrDownloadIcs(
  content: string,
  filename: string,
): Promise<'shared' | 'downloaded'> {
  const file = icsFile(content, filename)
  const canShareFiles =
    typeof navigator !== 'undefined' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [file] })

  if (canShareFiles && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        files: [file],
        title: 'Bloom Desk schedule',
        text: 'Add this Bloom Desk schedule to your calendar',
      })
      return 'shared'
    } catch (err) {
      // User cancelled share — fall through to download
      if (err instanceof DOMException && err.name === 'AbortError') throw err
    }
  }

  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  // iOS Safari sometimes needs the blob kept briefly
  setTimeout(() => URL.revokeObjectURL(url), 2500)
  return 'downloaded'
}

export async function shareOrDownloadOrderIcs(order: PosOrder) {
  return shareOrDownloadIcs(buildOrderIcs(order), `${order.id}-${order.scheduleDate}.ics`)
}

export async function shareOrDownloadWeekIcs(orders: PosOrder[], filename: string) {
  return shareOrDownloadIcs(buildWeekIcs(orders), filename)
}
