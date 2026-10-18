import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { todayISODate } from '../../lib/format'
import { StatusBadge } from '../components/StatusBadge'
import { AddToPhoneCalendar } from '../components/AddToPhoneCalendar'
import { usePosTheme } from '../PosThemeProvider'
import { usePos } from '../store/PosContext'

function startOfWeek(date: Date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function toISO(date: Date) {
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10)
}

function parseIsoLocal(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function PosCalendarPage() {
  const { orders } = usePos()
  const { theme } = usePosTheme()
  const [searchParams] = useSearchParams()
  const focusDate = searchParams.get('date')
  const [anchor, setAnchor] = useState(() => startOfWeek(focusDate ? parseIsoLocal(focusDate) : new Date()))

  useEffect(() => {
    if (focusDate) setAnchor(startOfWeek(parseIsoLocal(focusDate)))
  }, [focusDate])

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(anchor)
      d.setDate(anchor.getDate() + i)
      return d
    })
  }, [anchor])

  const scheduled = orders.filter((o) => o.status !== 'cancelled')
  const confirmed = orders.filter((o) => o.status === 'paid' || o.status === 'partial')
  const weekOrders = useMemo(() => {
    const keys = new Set(days.map(toISO))
    return scheduled.filter((o) => keys.has(o.scheduleDate))
  }, [days, scheduled])

  function shiftWeek(delta: number) {
    const next = new Date(anchor)
    next.setDate(anchor.getDate() + delta * 7)
    setAnchor(startOfWeek(next))
  }

  const today = todayISODate()

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl">Calendar</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--pos-muted)' }}>
            {theme.layout === 'night'
              ? 'Night Shift week strip — scan pickups and deliveries quickly.'
              : 'Confirmed and active orders by scheduled date. Add each order to Google Calendar for reminders.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="pos-btn pos-btn-secondary" onClick={() => shiftWeek(-1)}>
            Prev week
          </button>
          <button type="button" className="pos-btn pos-btn-secondary" onClick={() => setAnchor(startOfWeek(new Date()))}>
            This week
          </button>
          <button type="button" className="pos-btn pos-btn-secondary" onClick={() => shiftWeek(1)}>
            Next week
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-7">
        {days.map((day) => {
          const iso = toISO(day)
          const dayOrders = scheduled.filter((o) => o.scheduleDate === iso)
          const isToday = iso === today
          const isFocus = focusDate === iso
          return (
            <div
              key={iso}
              id={`cal-day-${iso}`}
              className="pos-surface min-h-40 p-3"
              style={
                isFocus || isToday
                  ? { outline: `2px solid ${isFocus ? 'var(--pos-accent)' : 'var(--pos-line)'}` }
                  : undefined
              }
            >
              <p className="text-[11px] uppercase tracking-[0.14em]" style={{ color: 'var(--pos-muted)' }}>
                {day.toLocaleDateString('en-PH', { weekday: 'short' })}
              </p>
              <p className="mt-1 text-lg font-semibold">{day.getDate()}</p>
              <ul className="mt-3 space-y-2">
                {dayOrders.map((order) => (
                  <li key={order.id}>
                    <div
                      className="rounded-[calc(var(--pos-radius)*0.6)] border p-2 text-xs"
                      style={{ borderColor: 'var(--pos-line)' }}
                    >
                      <Link to={`/admin/orders/${order.id}`} className="block hover:underline">
                        <span className="pos-mono">{order.id.replace('POS-', '')}</span>
                        <p className="mt-1 font-medium">{order.customerName}</p>
                        <p style={{ color: 'var(--pos-muted)' }}>
                          {order.fulfillment} · {order.location}
                        </p>
                      </Link>
                      <div className="mt-1">
                        <StatusBadge status={order.status} />
                      </div>
                      <AddToPhoneCalendar order={order} compact />
                    </div>
                  </li>
                ))}
                {!dayOrders.length ? (
                  <li className="text-xs" style={{ color: 'var(--pos-muted)' }}>
                    —
                  </li>
                ) : null}
              </ul>
            </div>
          )
        })}
      </div>

      <p className="mt-4 text-xs" style={{ color: 'var(--pos-muted)' }}>
        Active scheduled: {scheduled.length} · Paid / partial: {confirmed.length} · This week: {weekOrders.length}
      </p>
    </div>
  )
}
