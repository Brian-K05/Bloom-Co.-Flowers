import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { formatPHP } from '../../lib/format'
import {
  ARRANGEMENT_KINDS,
  PRICE_BUCKETS,
  SLOT_HOURS,
  arrangementLabel,
  formatRecipe,
  formatSlotTime,
  hourLabel,
  nearestPriceBucket,
  parseSlotHour,
} from '../lib/catalog'
import { usePosTheme } from '../PosThemeProvider'
import { OrderLogTable } from '../components/OrderLogTable'
import { StatusBadge, statusLabel } from '../components/StatusBadge'
import { usePos } from '../store/PosContext'
import type { PosArrangementKind, PosOrderSource, PosOrderStatus } from '../types'

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
  const [hour, setHour] = useState('all')
  const [kind, setKind] = useState<'all' | PosArrangementKind>('all')
  const [priceBucket, setPriceBucket] = useState('all')
  const [query, setQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [moreFilters, setMoreFilters] = useState(false)
  const [params] = useSearchParams()
  const highlightId = params.get('highlight') ?? undefined

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
      if (hour !== 'all' && parseSlotHour(order.slotTime, order.createdAt) !== Number(hour)) return false
      if (kind !== 'all' && !order.items.some((i) => (i.kind ?? getProduct(i.productId)?.kind) === kind)) return false
      if (priceBucket !== 'all') {
        const bucket = Number(priceBucket)
        if (!order.items.some((i) => nearestPriceBucket(i.price) === bucket)) return false
      }
      if (query.trim()) {
        const q = query.trim().toLowerCase()
        const hay = [
          order.id,
          order.customerName,
          order.customerPhone,
          order.recipientName,
          ...order.items.map((i) => i.name),
        ]
          .join(' ')
          .toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [category, color, date, getProduct, hour, kind, location, orders, priceBucket, productId, query, source, status])

  const scheduleCaption = useMemo(() => {
    if (!date) return 'All scheduled dates'
    const d = new Date(`${date}T00:00:00`)
    return d.toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric' })
  }, [date])

  const scheduledValue = filtered.reduce((sum, order) => sum + order.total, 0)

  function exportList() {
    const rows = [
      ['Order no.', 'Time', 'Customer', 'Phone', 'Order', 'Amount', 'Payment', 'Pickup or delivery', 'Place', 'Notes'],
      ...filtered.map((order) => [
        order.id.replace(/^POS-/, '#'),
        formatSlotTime(order.slotTime, order.createdAt),
        order.customerName,
        order.customerPhone,
        order.items
          .map((item) => `${item.name}${item.recipe?.length ? ` (${formatRecipe(item.recipe)})` : ''}`)
          .join('; '),
        String(order.total),
        statusLabel(order.status),
        order.fulfillment === 'delivery' ? 'Delivery' : 'Pickup',
        order.location,
        order.customization.notes,
      ]),
    ]
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bloom-desk-orders${date ? `-${date}` : ''}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filters = (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        Time slot
        <select className="pos-field mt-1" value={hour} onChange={(e) => setHour(e.target.value)}>
          <option value="all">All</option>
          {SLOT_HOURS.map((h) => (
            <option key={h} value={String(h)}>
              {hourLabel(h)}
            </option>
          ))}
        </select>
      </label>
      <label className="pos-label sm:col-span-2">
        Search order / customer
        <input
          type="search"
          className="pos-field mt-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Name, phone, or order number"
        />
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
      <div className="flex items-end">
        <button type="button" className="pos-btn pos-btn-secondary w-full" onClick={() => setMoreFilters((v) => !v)}>
          {moreFilters ? 'Hide extra filters' : 'More filters'}
        </button>
      </div>
      {moreFilters ? (
        <>
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
          <label className="pos-label">
            Arrangement
            <select
              className="pos-field mt-1"
              value={kind}
              onChange={(e) => setKind(e.target.value as typeof kind)}
            >
              <option value="all">All</option>
              {ARRANGEMENT_KINDS.map((k) => (
                <option key={k} value={k}>
                  {arrangementLabel(k)}
                </option>
              ))}
            </select>
          </label>
          <label className="pos-label">
            Price
            <select className="pos-field mt-1" value={priceBucket} onChange={(e) => setPriceBucket(e.target.value)}>
              <option value="all">All</option>
              {PRICE_BUCKETS.map((p) => (
                <option key={p} value={String(p)}>
                  ₱{p}
                </option>
              ))}
            </select>
          </label>
        </>
      ) : null}
    </div>
  )

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl">Orders</h1>
          <p className="mt-1 text-base" style={{ color: 'var(--pos-muted)' }}>
            {theme.layout === 'kanban'
              ? 'Tap a card to open the order.'
              : 'Find an order by date, name, or phone. Big print, one row each.'}
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

      <div className="pos-surface mt-5 min-w-0">
        <div
          className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3 text-sm"
          style={{ borderColor: 'var(--pos-line)' }}
        >
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold">Schedule</p>
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
              style={{ background: 'var(--pos-accent-soft)', color: 'var(--pos-accent-ink)' }}
            >
              {filtered.length} visible
            </span>
            <span style={{ color: 'var(--pos-muted)' }}>| {scheduleCaption}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3" style={{ color: 'var(--pos-muted)' }}>
            <span>
              {filtered.length} order{filtered.length === 1 ? '' : 's'}
            </span>
            <span className="font-semibold" style={{ color: 'var(--pos-ink)' }}>
              {formatPHP(scheduledValue)} scheduled value
            </span>
            <button type="button" className="pos-btn pos-btn-secondary !min-h-8 !px-3 text-xs" onClick={exportList}>
              Export list
            </button>
          </div>
        </div>

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
        <OrderLogTable
          orders={filtered}
          emptyMessage="No orders match these filters."
          linkPrefix="/admin/orders"
          highlightId={highlightId}
        />
      )}
      </div>
    </div>
  )
}
