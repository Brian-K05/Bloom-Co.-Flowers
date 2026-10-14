import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { todayISODate } from '../../lib/format'
import { usePosTheme } from '../PosThemeProvider'
import { StatusBadge } from '../components/StatusBadge'
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

export function PosCalendarPage() {
  const { orders } = usePos()
  const { theme } = usePosTheme()
  const [anchor, setAnchor] = useState(() => startOfWeek(new Date()))

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(anchor)
      d.setDate(anchor.getDate() + i)
      return d
    })
  }, [anchor])

  const scheduled = orders.filter((o) => o.status !== 'cancelled')
  const confirmed = orders.filter((o) => !['pending', 'cancelled'].includes(o.status))

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
              : 'Confirmed and active orders by scheduled date.'}
          </p>
        </div>
        <div className="flex gap-2">
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
          return (
            <div
              key={iso}
              className="pos-surface min-h-40 p-3"
              style={isToday ? { outline: '2px solid var(--pos-accent)' } : undefined}
            >
              <p className="text-[11px] uppercase tracking-[0.14em]" style={{ color: 'var(--pos-muted)' }}>
                {day.toLocaleDateString('en-PH', { weekday: 'short' })}
              </p>
              <p className="mt-1 text-lg font-semibold">{day.getDate()}</p>
              <ul className="mt-3 space-y-2">
                {dayOrders.map((order) => (
                  <li key={order.id}>
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="block rounded-[calc(var(--pos-radius)*0.6)] border p-2 text-xs hover:border-[var(--pos-accent)]"
                      style={{ borderColor: 'var(--pos-line)' }}
                    >
                      <span className="pos-mono">{order.id.replace('POS-', '')}</span>
                      <p className="mt-1 font-medium">{order.customerName}</p>
                      <p style={{ color: 'var(--pos-muted)' }}>
                        {order.fulfillment} · {order.location}
                      </p>
                      <div className="mt-1">
                        <StatusBadge status={order.status} />
                      </div>
                    </Link>
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
        Active scheduled: {scheduled.length} · Post-confirm focus: {confirmed.length}
      </p>
    </div>
  )
}
