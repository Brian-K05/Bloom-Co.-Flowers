import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { todayISODate } from '../../lib/format'
import { useToast } from '../../context/ToastContext'
import { StatusBadge } from '../components/StatusBadge'
import { usePos } from '../store/PosContext'

export function PosPreordersPage() {
  const { orders, toggleReminderDone } = usePos()
  const { notify } = useToast()
  const today = todayISODate()

  const preorders = useMemo(
    () =>
      orders
        .filter((o) => o.isPreorder && o.status !== 'cancelled')
        .sort((a, b) => (a.reminderDue ?? '').localeCompare(b.reminderDue ?? '')),
    [orders],
  )

  return (
    <div>
      <div>
        <h1 className="text-3xl">Pre-orders</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--pos-muted)' }}>
          Supplier reminder checklist for flagged pre-orders. Mark done when you ordered stock.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {preorders.map((order) => {
          const due = order.reminderDue ?? order.scheduleDate
          const overdue = due < today && !order.reminderDone
          return (
            <article
              key={order.id}
              className="pos-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              style={overdue ? { outline: '2px solid var(--pos-danger)' } : undefined}
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link to={`/admin/orders/${order.id}`} className="pos-mono text-sm font-medium hover:underline">
                    {order.id}
                  </Link>
                  <StatusBadge status={order.status} />
                  {overdue ? (
                    <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--pos-danger)' }}>
                      Reminder overdue
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 font-medium">{order.customerName}</p>
                <p className="text-sm" style={{ color: 'var(--pos-muted)' }}>
                  Schedule {order.scheduleDate} · Reminder due {due}
                </p>
                <p className="mt-1 text-sm">
                  {order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
                </p>
                {order.supplierNote ? (
                  <p className="mt-1 text-xs" style={{ color: 'var(--pos-muted)' }}>
                    {order.supplierNote}
                  </p>
                ) : null}
              </div>
              <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={order.reminderDone}
                  onChange={() => {
                    toggleReminderDone(order.id)
                    notify(order.reminderDone ? 'Reminder reopened' : 'Reminder marked done')
                  }}
                />
                Supplier ordered
              </label>
            </article>
          )
        })}
        {!preorders.length ? (
          <p className="pos-surface p-8 text-center text-sm" style={{ color: 'var(--pos-muted)' }}>
            No active pre-orders. Flag “Pre-order” when encoding an order that needs supplier lead time.
          </p>
        ) : null}
      </div>
    </div>
  )
}
