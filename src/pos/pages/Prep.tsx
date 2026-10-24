import { useMemo, useState } from 'react'
import { formatPHP, todayISODate } from '../../lib/format'
import {
  BOUQUET_COLORS,
  BOUQUET_SIZES,
  PRICE_BUCKETS,
  arrangementLabel,
  formatRecipe,
  stemDotColor,
  tallyOrders,
} from '../lib/catalog'
import { usePos } from '../store/PosContext'

const FUNERAL_KINDS = ['basket', 'spray', 'stand', 'box'] as const

export function PosPrepPage() {
  const { orders } = usePos()
  const [date, setDate] = useState(todayISODate())
  const dayOrders = useMemo(
    () => orders.filter((o) => o.scheduleDate === date && o.status !== 'cancelled'),
    [date, orders],
  )
  const tally = useMemo(() => tallyOrders(dayOrders), [dayOrders])
  const stemRows = Object.entries(tally.stems).sort((a, b) => b[1] - a[1])
  const bouquetTotal = Object.values(tally.bouquet).reduce((n, v) => n + v, 0)
  const funeralTotal = Object.values(tally.funeral).reduce((n, v) => n + v, 0)
  const stemTotal = stemRows.reduce((n, [, qty]) => n + qty, 0)
  const scheduleCaption = useMemo(() => {
    const d = new Date(`${date}T00:00:00`)
    return d.toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric' })
  }, [date])

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl">Flower Tally</h1>
          <p className="mt-1 max-w-2xl text-sm" style={{ color: 'var(--pos-muted)' }}>
            Count bouquets by size and color, funeral pieces by price, and stems to pull — without opening each
            order.
          </p>
        </div>
        <label className="pos-label">
          Schedule date
          <input type="date" className="pos-field mt-1" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Orders scheduled', value: dayOrders.length },
          { label: 'Bouquets', value: bouquetTotal },
          { label: 'Box / spray / stand', value: funeralTotal },
          { label: 'Stems to pull', value: stemTotal },
        ].map((card) => (
          <div key={card.label} className="pos-surface px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--pos-muted)' }}>
              {card.label}
            </p>
            <p className="mt-1 text-3xl font-semibold">{card.value}</p>
            <p className="mt-1 text-xs" style={{ color: 'var(--pos-muted)' }}>
              {scheduleCaption}
            </p>
          </div>
        ))}
      </div>

      <section className="pos-surface mt-6 overflow-x-auto p-4" data-testid="pos-bouquet-tally">
        <h2 className="text-xl">Bouquet tally</h2>
        <p className="mt-1 text-sm" style={{ color: 'var(--pos-muted)' }}>
          Size × color — the handwritten peak-day grid.
        </p>
        <table className="mt-3 w-full min-w-[420px] text-center text-sm">
          <thead>
            <tr>
              <th className="px-2 py-2 text-left font-medium" style={{ color: 'var(--pos-muted)' }}>
                Size
              </th>
              {BOUQUET_COLORS.map((c) => (
                <th key={c} className="px-2 py-2 font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: stemDotColor(c) }} />
                    {c}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BOUQUET_SIZES.map((size) => (
              <tr key={size} className="border-t" style={{ borderColor: 'var(--pos-line)' }}>
                <td className="px-2 py-2 text-left font-semibold">{size}</td>
                {BOUQUET_COLORS.map((color) => (
                  <td key={color} className="px-2 py-2 pos-mono">
                    {tally.bouquet[`${size}|${color}`] || '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="pos-surface mt-6 overflow-x-auto p-4" data-testid="pos-funeral-tally">
        <h2 className="text-xl">Box / spray / stand</h2>
        <table className="mt-3 w-full min-w-[480px] text-center text-sm">
          <thead>
            <tr>
              <th className="px-2 py-2 text-left font-medium" style={{ color: 'var(--pos-muted)' }}>
                Type
              </th>
              {PRICE_BUCKETS.map((p) => (
                <th key={p} className="px-2 py-2 font-medium" style={{ color: 'var(--pos-muted)' }}>
                  {formatPHP(p)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FUNERAL_KINDS.map((kind) => (
              <tr key={kind} className="border-t" style={{ borderColor: 'var(--pos-line)' }}>
                <td className="px-2 py-2 text-left font-semibold">{arrangementLabel(kind)}</td>
                {PRICE_BUCKETS.map((price) => (
                  <td key={price} className="px-2 py-2 pos-mono">
                    {tally.funeral[`${kind}|${price}`] || '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="pos-surface mt-6 p-4" data-testid="pos-stem-tally">
        <h2 className="text-xl">Stems to pull</h2>
        <p className="mt-1 text-sm" style={{ color: 'var(--pos-muted)' }}>
          Combined recipe from every arrangement on this date (e.g. 5 red + 2 lilies + 2 yellow).
        </p>
        {stemRows.length ? (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {stemRows.map(([name, qty]) => (
              <li
                key={name}
                className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3"
                style={{ background: 'var(--pos-chip)' }}
              >
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: stemDotColor(undefined, name) }} />
                  {name}
                </span>
                <span className="pos-mono text-lg font-semibold">{qty}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm" style={{ color: 'var(--pos-muted)' }}>
            No recipes on this day’s orders yet. Set stems on each product in Inventory.
          </p>
        )}
      </section>

      <section className="mt-6">
        <h2 className="text-lg">Orders feeding this tally</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {dayOrders.map((order) => (
            <li key={order.id} className="pos-surface px-4 py-3">
              <p className="font-medium">
                {order.customerName}{' '}
                <span className="pos-mono text-xs font-normal" style={{ color: 'var(--pos-muted)' }}>
                  {order.id}
                </span>
              </p>
              <ul className="mt-1" style={{ color: 'var(--pos-muted)' }}>
                {order.items.map((item) => (
                  <li key={`${order.id}-${item.productId}`}>
                    {item.name}
                    {item.quantity > 1 ? ` × ${item.quantity}` : ''}
                    {item.recipe?.length ? ` — ${formatRecipe(item.recipe)}` : ''}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
