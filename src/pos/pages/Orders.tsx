import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPHP } from '../../lib/format'
import { POS_LOCATIONS } from '../seed'
import { StatusBadge, statusLabel } from '../components/StatusBadge'
import { usePos } from '../store/PosContext'
import type { PosOrderSource, PosOrderStatus } from '../types'

export function PosOrdersPage() {
  const { orders } = usePos()
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('all')
  const [status, setStatus] = useState<'all' | PosOrderStatus>('all')
  const [source, setSource] = useState<'all' | PosOrderSource>('all')

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      if (date && order.scheduleDate !== date) return false
      if (location !== 'all' && order.location !== location) return false
      if (status !== 'all' && order.status !== status) return false
      if (source !== 'all' && order.source !== source) return false
      return true
    })
  }, [date, location, orders, source, status])

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl">Orders</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--pos-muted)' }}>
            Filter by date, location, status, or source for peak-day prep.
          </p>
        </div>
        <Link to="/admin/orders/new" className="pos-btn pos-btn-primary">
          New order
        </Link>
      </div>

      <div className="pos-surface mt-6 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
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
            {(
              ['pending', 'confirmed', 'preparing', 'ready_out', 'completed', 'cancelled'] as PosOrderStatus[]
            ).map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
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

      <p className="mt-4 text-sm" style={{ color: 'var(--pos-muted)' }}>
        {filtered.length} order{filtered.length === 1 ? '' : 's'}
      </p>

      <div className="mt-4 overflow-x-auto pos-surface">
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
    </div>
  )
}
