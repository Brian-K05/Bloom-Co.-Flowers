import { Link } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'
import { formatPHP, todayISODate } from '../../lib/format'
import { usePosAuth } from '../auth/PosAuthContext'
import { usePosTheme } from '../PosThemeProvider'
import { StatusBadge, statusLabel } from '../components/StatusBadge'
import { usePos } from '../store/PosContext'
import type { PosOrder, PosOrderStatus } from '../types'

const boardColumns: PosOrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready_out']

export function PosDashboardPage() {
  const { orders, products, resetDemo, getProduct, backend } = usePos()
  const { theme } = usePosTheme()
  const { user } = usePosAuth()
  const { notify } = useToast()
  const today = todayISODate()
  const todayOrders = orders.filter((o) => o.scheduleDate === today && o.status !== 'cancelled')
  const deliveries = todayOrders.filter((o) => o.fulfillment === 'delivery').length
  const pickups = todayOrders.filter((o) => o.fulfillment === 'pickup').length
  const pendingReminders = orders.filter((o) => o.isPreorder && !o.reminderDone && o.reminderDue)
  const lowStock = products.filter((p) => p.stockQty > 0 && p.stockQty <= 5)
  const soldOut = products.filter((p) => p.stockQty <= 0)
  const attentionStock = [...soldOut, ...lowStock]
  const salesToday = todayOrders
    .filter((o) => o.status !== 'cancelled' && o.stockApplied)
    .reduce((sum, o) => sum + o.total, 0)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--pos-muted)' }}>
            {theme.name}
          </p>
          <h1 className="mt-1 text-3xl sm:text-4xl">
            {greeting}
            {user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}
          </h1>
          <p className="mt-2 max-w-xl text-sm" style={{ color: 'var(--pos-muted)' }}>
            Encode Messenger orders here so stock, calendar, and prep stay in sync.
          </p>
        </div>
        <button
          type="button"
          className="pos-btn pos-btn-secondary hidden sm:inline-flex"
          onClick={() => {
            void resetDemo()
              .then(() => notify(backend === 'supabase' ? 'Supabase demo data reset' : 'Local demo data reset'))
              .catch((err: unknown) =>
                notify(err instanceof Error ? err.message : 'Reset failed'),
              )
          }}
        >
          Reset demo
        </button>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Today’s scheduled"
          value={String(todayOrders.length)}
          hint={`${deliveries} delivery · ${pickups} pickup`}
        />
        <Stat label="Confirmed sales" value={formatPHP(salesToday)} hint="Stock applied today" />
        <Stat
          label="Low stock"
          value={String(attentionStock.length)}
          hint={attentionStock.length ? 'Needs restock' : 'All healthy'}
        />
        <Stat
          label="Supplier reminders"
          value={String(pendingReminders.length)}
          hint={pendingReminders.length ? 'Due / open' : 'None open'}
        />
      </div>

      {theme.layout === 'kanban' ? (
        <section className="mt-10">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl">Peak board — today</h2>
            <Link to="/admin/orders" className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--pos-accent)' }}>
              Open orders
            </Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {boardColumns.map((status) => {
              const column = todayOrders.filter((o) => o.status === status)
              return (
                <div key={status} className="pos-surface p-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em]">
                    {statusLabel(status)} · {column.length}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {column.map((order) => (
                      <li key={order.id}>
                        <KanbanCard order={order} productImage={getProduct(order.items[0]?.productId)?.image} />
                      </li>
                    ))}
                    {!column.length ? (
                      <li className="px-1 py-4 text-xs" style={{ color: 'var(--pos-muted)' }}>
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
        <section className="mt-10 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="pos-surface overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b px-5 py-4" style={{ borderColor: 'var(--pos-line)' }}>
              <h2 className="text-xl">Today’s orders</h2>
              <Link to="/admin/orders" className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--pos-accent)' }}>
                View all
              </Link>
            </div>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead style={{ color: 'var(--pos-muted)' }}>
                  <tr className="border-b" style={{ borderColor: 'var(--pos-line)' }}>
                    <th className="px-5 py-3 font-medium">Time</th>
                    <th className="px-5 py-3 font-medium">Order</th>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Product</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {todayOrders.slice(0, 8).map((order) => (
                    <tr key={order.id} className="border-b last:border-0" style={{ borderColor: 'var(--pos-line)' }}>
                      <td className="px-5 py-3 pos-mono text-xs">
                        {new Date(order.createdAt).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-5 py-3">
                        <Link to={`/admin/orders/${order.id}`} className="pos-mono text-xs font-medium hover:underline">
                          {order.id}
                        </Link>
                      </td>
                      <td className="px-5 py-3 font-medium">{order.customerName}</td>
                      <td className="px-5 py-3" style={{ color: 'var(--pos-muted)' }}>
                        {order.items.map((i) => i.name).join(', ')}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-3 capitalize">{order.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!todayOrders.length ? (
                <p className="px-5 py-10 text-sm" style={{ color: 'var(--pos-muted)' }}>
                  No orders scheduled today yet. Encode from Messenger when a chat closes.
                </p>
              ) : null}
            </div>
            <ul className="divide-y md:hidden" style={{ borderColor: 'var(--pos-line)' }}>
              {todayOrders.slice(0, 8).map((order) => (
                <li key={order.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <Link to={`/admin/orders/${order.id}`} className="font-medium hover:underline">
                      {order.customerName}
                    </Link>
                    <p className="truncate text-xs" style={{ color: 'var(--pos-muted)' }}>
                      <span className="pos-mono">{order.id}</span> · {order.items[0]?.name}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </li>
              ))}
              {!todayOrders.length ? (
                <li className="px-4 py-8 text-sm" style={{ color: 'var(--pos-muted)' }}>
                  No orders scheduled today yet.
                </li>
              ) : null}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="pos-surface p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg">Low stock</h2>
                <Link to="/admin/inventory" className="text-xs font-semibold" style={{ color: 'var(--pos-accent)' }}>
                  Inventory
                </Link>
              </div>
              <ul className="mt-4 space-y-3 text-sm">
                {attentionStock.slice(0, 5).map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3">
                    <span className="truncate">{p.name}</span>
                    <span className="pos-mono text-xs font-semibold" style={{ color: p.stockQty <= 0 ? 'var(--pos-danger)' : 'var(--pos-muted)' }}>
                      {p.stockQty <= 0 ? 'Sold out' : `${p.stockQty} left`}
                    </span>
                  </li>
                ))}
                {!attentionStock.length ? (
                  <li style={{ color: 'var(--pos-muted)' }}>Stock looks healthy.</li>
                ) : null}
              </ul>
            </div>
            <div className="pos-surface p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg">Supplier reminders</h2>
                <Link to="/admin/preorders" className="text-xs font-semibold" style={{ color: 'var(--pos-accent)' }}>
                  Pre-orders
                </Link>
              </div>
              <ul className="mt-4 space-y-3 text-sm">
                {pendingReminders.slice(0, 5).map((o) => (
                  <li key={o.id}>
                    <Link to={`/admin/orders/${o.id}`} className="font-medium hover:underline">
                      {o.customerName}
                    </Link>
                    <p className="text-xs" style={{ color: 'var(--pos-muted)' }}>
                      Due {o.reminderDue} · {o.items[0]?.name}
                    </p>
                  </li>
                ))}
                {!pendingReminders.length ? (
                  <li style={{ color: 'var(--pos-muted)' }}>No open supplier reminders.</li>
                ) : null}
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="pos-surface p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--pos-muted)' }}>
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs" style={{ color: 'var(--pos-muted)' }}>
        {hint}
      </p>
    </div>
  )
}

function KanbanCard({ order, productImage }: { order: PosOrder; productImage?: string }) {
  return (
    <Link
      to={`/admin/orders/${order.id}`}
      className="block rounded-[calc(var(--pos-radius)*0.7)] border p-3 transition hover:border-[var(--pos-accent)]"
      style={{ borderColor: 'var(--pos-line)', background: 'var(--pos-bg)' }}
    >
      <div className="flex gap-3">
        {productImage ? (
          <img src={productImage} alt="" className="h-12 w-12 rounded object-cover" />
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="pos-mono text-[11px]" style={{ color: 'var(--pos-muted)' }}>
            {order.id}
          </p>
          <p className="mt-0.5 truncate font-medium">{order.customerName}</p>
          <p className="truncate text-xs" style={{ color: 'var(--pos-muted)' }}>
            {order.items[0]?.name}
          </p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <StatusBadge status={order.status} />
        <span className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--pos-muted)' }}>
          {order.source}
        </span>
      </div>
    </Link>
  )
}
