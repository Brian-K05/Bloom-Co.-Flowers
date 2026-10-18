import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePosTheme } from '../PosThemeProvider'
import { OrderLogTable } from '../components/OrderLogTable'
import { StatusBadge, statusLabel } from '../components/StatusBadge'
import { usePos } from '../store/PosContext'
import type { PosOrderSource, PosOrderStatus } from '../types'

const boardColumns: PosOrderStatus[] = ['not_paid', 'paid', 'partial', 'cancelled']

const COLOR_FILTERS = ['Pink', 'Yellow', 'Red', 'Ivory', 'Sage', 'Gold', 'White', 'Blush', 'Pastel']

function orderMatchesColor(order: { items: { name: string }[]; customization: { ribbon: string; notes: string; addOns: string } }, color: string) {
  const needle = color.toLowerCase()
  const hay = [
    ...order.items.map((i) => i.name),
    order.customization.ribbon,
    order.customization.notes,
    order.customization.addOns,
  ]
    .join(' ')
    .toLowerCase()
  return hay.includes(needle)
}

export function PosOrdersPage() {
  const { orders, products, getProduct, locations } = usePos()
  const { theme } = usePosTheme()
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('all')
  const [status, setStatus] = useState<'all' | PosOrderStatus>('all')
  const [source, setSource] = useState<'all' | PosOrderSource>('all')
  const [productId, setProductId] = useState('all')
  const [category, setCategory] = useState('all')
  const [color, setColor] = useState('all')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))].sort((a, b) => a.localeCompare(b)),
    [products],
  )

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      if (date && order.scheduleDate !== date) return false
      if (location !== 'all' && order.location !== location) return false
      if (status !== 'all' && order.status !== status) return false
      if (source !== 'all' && order.source !== source) return false
      if (productId !== 'all' && !order.items.some((i) => i.productId === productId)) return false
      if (category !== 'all') {
        const byProduct = order.items.some((i) => getProduct(i.productId)?.category === category)
        if (!byProduct) return false
      }
      if (color !== 'all' && !orderMatchesColor(order, color)) return false
      return true
    })
  }, [category, color, date, getProduct, location, orders, productId, source, status])

  const filters = (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <label className="pos-label">
        Schedule date
        <input type="date" className="pos-field mt-1" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <label className="pos-label">
        Location
        <select className="pos-field mt-1" value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="all">All</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </label>
      <label className="pos-label">
        Payment status
        <select
          className="pos-field mt-1"
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
        >
          <option value="all">All</option>
          {(['not_paid', 'paid', 'partial', 'cancelled'] as PosOrderStatus[]).map((s) => (
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
      <label className="pos-label">
        Product
        <select className="pos-field mt-1" value={productId} onChange={(e) => setProductId(e.target.value)}>
          <option value="all">All</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <label className="pos-label">
        Flower type / category
        <select className="pos-field mt-1" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className="pos-label">
        Color
        <select className="pos-field mt-1" value={color} onChange={(e) => setColor(e.target.value)}>
          <option value="all">All</option>
          {COLOR_FILTERS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
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
              ? 'War-room board — scan by payment for peak-day prep.'
              : 'Filter by date, location, payment, product, flower type, or color.'}
          </p>
        </div>
        <button
          type="button"
          className="pos-btn pos-btn-secondary sm:hidden"
          onClick={() => setFiltersOpen((v) => !v)}
        >
          Filters
        </button>
      </div>

      <div className={`pos-surface mt-6 p-4 ${filtersOpen ? 'block' : 'hidden sm:block'}`}>{filters}</div>

      <p className="mt-4 text-sm" style={{ color: 'var(--pos-muted)' }}>
        {filtered.length} order{filtered.length === 1 ? '' : 's'}
      </p>

      {theme.layout === 'kanban' ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
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
                            <StatusBadge status={order.status} />
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
        <div className="pos-surface mt-4 overflow-hidden">
          <OrderLogTable
            orders={filtered}
            emptyMessage="No orders match these filters."
            linkPrefix="/admin/orders"
          />
        </div>
      )}
    </div>
  )
}
