import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPHP } from '../../lib/format'
import { usePosTheme } from '../PosThemeProvider'
import { StatusBadge, statusLabel } from '../components/StatusBadge'
import { POS_LOCATIONS } from '../seed'
import { usePos } from '../store/PosContext'
import type { PosOrderSource, PosOrderStatus } from '../types'

const boardColumns: PosOrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready_out', 'completed']

export function PosOrdersPage() {
  const { orders, getProduct } = usePos()
  const { theme } = usePosTheme()
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('all')
  const [status, setStatus] = useState<'all' | PosOrderStatus>('all')
  const [source, setSource] = useState<'all' | PosOrderSource>('all')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      if (date && order.scheduleDate !== date) return false
      if (location !== 'all' && order.location !== location) return false
      if (status !== 'all' && order.status !== status) return false
      if (source !== 'all' && order.source !== source) return false
      return true
    })
  }, [date, location, orders, source, status])

  const filters = (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <label className="pos-label">
        Schedule date
        <input type="date" className="pos-field mt-1" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <label className="pos-label">
        Location
        <select className="pos-field mt-1" value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="all">All</option>
          {POS_LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </label>
      <label className="pos-label">
        Status
        <select
          className="pos-field mt-1"
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
        >
          <option value="all">All</option>
          {(['pending', 'confirmed', 'preparing', 'ready_out', 'completed', 'cancelled'] as PosOrderStatus[]).map(
            (s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ),
          )}
        </select>
      </label>
      <label className="pos-label">
        Source
        <select
          className="pos-field mt-1"
          value={source}
          onChange={(e) => setSource(e.target.value as typeof source)}
        >
          <option value="all">All</option>
          <option value="messenger">Messenger</option>
          <option value="walk-in">Walk-in</option>
          <option value="call">Call</option>
        </select>
      </label>
    </div>
  )

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl">Orders</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--pos-muted)' }}>
            {theme.layout === 'kanban'
              ? 'War-room board — scan by status for peak-day prep.'
              : 'Filter by date, location, status, or source for peak-day prep.'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="pos-btn pos-btn-secondary sm:hidden"
            onClick={() => setFiltersOpen((v) => !v)}
          >
            Filters
          </button>
          <Link to="/admin/orders/new" className="pos-btn pos-btn-primary hidden sm:inline-flex">
            + New order
          </Link>
        </div>
      </div>

      <div className={`pos-surface mt-6 p-4 ${filtersOpen ? 'block' : 'hidden sm:block'}`}>{filters}</div>

      <p className="mt-4 text-sm" style={{ color: 'var(--pos-muted)' }}>
        {filtered.length} order{filtered.length === 1 ? '' : 's'}
      </p>

      {theme.layout === 'kanban' ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {boardColumns.map((col) => {
            const column = filtered.filter((o) => o.status === col)
            return (
              <div key={col} className="pos-surface p-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em]">
                  {statusLabel(col)} · {column.length}
                </p>
                <ul className="mt-3 space-y-2">
                  {column.map((order) => {
                    const img = getProduct(order.items[0]?.productId)?.image
                    return (
                      <li key={order.id}>
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="block rounded border p-3"
                          style={{ borderColor: 'var(--pos-line)', background: 'var(--pos-bg)' }}
                        >
                          <div className="flex gap-2">
                            {img ? <img src={img} alt="" className="h-11 w-11 rounded object-cover" /> : null}
                            <div className="min-w-0">
                              <p className="pos-mono text-[11px]" style={{ color: 'var(--pos-muted)' }}>
                                {order.id}
                              </p>
                              <p className="truncate font-medium">{order.customerName}</p>
                              <p className="truncate text-xs" style={{ color: 'var(--pos-muted)' }}>
                                {order.items[0]?.name}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 flex justify-between gap-2 text-[10px] uppercase tracking-wide">
                            <span style={{ color: 'var(--pos-muted)' }}>{order.location}</span>
                            <span style={{ color: 'var(--pos-accent)' }}>{order.source}</span>
                          </div>
                        </Link>
                      </li>
                    )
                  })}
                  {!column.length ? (
                    <li className="py-4 text-xs" style={{ color: 'var(--pos-muted)' }}>
                      —
                    </li>
                  ) : null}
                </ul>
              </div>
            )
          })}
        </div>
      ) : (
        <>
          <div className="mt-4 hidden overflow-x-auto pos-surface md:block">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead style={{ color: 'var(--pos-muted)' }}>
                <tr className="border-b" style={{ borderColor: 'var(--pos-line)' }}>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">When / where</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-b last:border-0" style={{ borderColor: 'var(--pos-line)' }}>
                    <td className="px-4 py-3">
                      <Link to={`/admin/orders/${order.id}`} className="pos-mono font-medium hover:underline">
                        {order.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{order.customerName}</td>
                    <td className="px-4 py-3">
                      {order.scheduleDate}
                      <br />
                      <span style={{ color: 'var(--pos-muted)' }}>{order.location}</span>
                    </td>
                    <td className="px-4 py-3 capitalize">{order.source}</td>
                    <td className="px-4 py-3">{formatPHP(order.total)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length ? (
              <p className="px-4 py-10 text-center text-sm" style={{ color: 'var(--pos-muted)' }}>
                No orders match these filters.
              </p>
            ) : null}
          </div>

          <ul className="mt-4 space-y-3 md:hidden">
            {filtered.map((order) => (
              <li key={order.id}>
                <Link to={`/admin/orders/${order.id}`} className="pos-surface flex items-start justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="pos-mono text-xs" style={{ color: 'var(--pos-muted)' }}>
                      {order.id}
                    </p>
                    <p className="mt-1 font-medium">{order.customerName}</p>
                    <p className="text-xs" style={{ color: 'var(--pos-muted)' }}>
                      {order.scheduleDate} · {order.location} · {order.source}
                    </p>
                    <p className="mt-1 text-sm">{formatPHP(order.total)}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </Link>
              </li>
            ))}
            {!filtered.length ? (
              <li className="pos-surface p-8 text-center text-sm" style={{ color: 'var(--pos-muted)' }}>
                No orders match these filters.
              </li>
            ) : null}
          </ul>
        </>
      )}
    </div>
  )
}
