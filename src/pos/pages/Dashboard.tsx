import { Link } from 'react-router-dom'
import { formatPHP, todayISODate } from '../../lib/format'
import { usePosTheme } from '../PosThemeProvider'
import { StatusBadge, statusLabel } from '../components/StatusBadge'
import { usePos } from '../store/PosContext'
import type { PosOrderStatus } from '../types'

const boardColumns: PosOrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready_out']

export function PosDashboardPage() {
  const { orders, products, resetDemo } = usePos()
  const { theme } = usePosTheme()
  const today = todayISODate()
  const todayOrders = orders.filter((o) => o.scheduleDate === today && o.status !== 'cancelled')
  const pendingReminders = orders.filter((o) => o.isPreorder && !o.reminderDone && o.reminderDue)
  const lowStock = products.filter((p) => p.stockQty > 0 && p.stockQty <= 5)
  const soldOut = products.filter((p) => p.stockQty <= 0)
  const salesToday = todayOrders
    .filter((o) => o.status !== 'cancelled' && o.stockApplied)
    .reduce((sum, o) => sum + o.total, 0)

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em]" style={{ color: 'var(--pos-muted)' }}>
            {theme.name}
          </p>
          <h1 className="mt-1 text-3xl sm:text-4xl">Today at the desk</h1>
          <p className="mt-2 max-w-xl text-sm" style={{ color: 'var(--pos-muted)' }}>
            Encode Messenger orders here so stock, calendar, and prep stay in sync.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/orders/new" className="pos-btn pos-btn-primary">
            New order
          </Link>
          <button type="button" className="pos-btn pos-btn-secondary" onClick={resetDemo}>
            Reset demo
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Scheduled today" value={String(todayOrders.length)} />
        <Stat label="Sales confirmed today" value={formatPHP(salesToday)} />
        <Stat label="Supplier reminders" value={String(pendingReminders.length)} />
        <Stat label="Sold out SKUs" value={String(soldOut.length)} />
      </div>

      {theme.layout === 'kanban' ? (
        <section className="mt-10">
          <h2 className="text-xl">Peak board — today</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {boardColumns.map((status) => {
              const column = todayOrders.filter((o) => o.status === status)
              return (
                <div key={status} className="pos-surface p-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em]">
                    {statusLabel(status)} · {column.length}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {column.map((order) => (
                      <li key={order.id}>
                        <Link to={`/admin/orders/${order.id}`} className="block border border-[var(--pos-line)] p-3 hover:border-[var(--pos-accent)]">
                          <p className="pos-mono text-xs">{order.id}</p>
                          <p className="mt-1 font-medium">{order.customerName}</p>
                          <p className="text-xs" style={{ color: 'var(--pos-muted)' }}>
                            {order.location}
                          </p>
                        </Link>
                      </li>
                    ))}
                    {!column.length ? (
                      <li className="text-xs" style={{ color: 'var(--pos-muted)' }}>
                        Empty
                      </li>
                    ) : null}
                  </ul>
                </div>
              )
            })}
          </div>
        </section>
      ) : (
        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="pos-surface p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl">Today’s orders</h2>
              <Link to="/admin/orders" className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--pos-accent)' }}>
                View all
              </Link>
            </div>
            <ul className="mt-4 divide-y" style={{ borderColor: 'var(--pos-line)' }}>
              {todayOrders.slice(0, 6).map((order) => (
                <li key={order.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <Link to={`/admin/orders/${order.id}`} className="font-medium hover:underline">
                      {order.customerName}
                    </Link>
                    <p className="truncate text-xs" style={{ color: 'var(--pos-muted)' }}>
                      <span className="pos-mono">{order.id}</span> · {order.location} · {order.source}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </li>
              ))}
              {!todayOrders.length ? (
                <li className="py-6 text-sm" style={{ color: 'var(--pos-muted)' }}>
                  No orders scheduled today yet.
                </li>
              ) : null}
            </ul>
          </div>
          <div className="pos-surface p-5">
            <h2 className="text-xl">Needs attention</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {pendingReminders.slice(0, 4).map((o) => (
                <li key={o.id}>
                  <Link to="/admin/preorders" className="hover:underline">
                    Pre-order reminder · {o.customerName} (due {o.reminderDue})
                  </Link>
                </li>
              ))}
              {lowStock.slice(0, 4).map((p) => (
                <li key={p.id}>
                  <Link to="/admin/inventory" className="hover:underline">
                    Low stock · {p.name} ({p.stockQty} left)
                  </Link>
                </li>
              ))}
              {!pendingReminders.length && !lowStock.length ? (
                <li style={{ color: 'var(--pos-muted)' }}>All clear for now.</li>
              ) : null}
            </ul>
          </div>
        </section>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="pos-surface p-4">
      <p className="text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--pos-muted)' }}>
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  )
}
