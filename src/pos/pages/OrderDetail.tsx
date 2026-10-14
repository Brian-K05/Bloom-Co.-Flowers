import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'
import { formatDateTime, formatPHP } from '../../lib/format'
import { StatusBadge, statusLabel } from '../components/StatusBadge'
import { RIBBON_OPTIONS, WRAPPER_OPTIONS } from '../seed'
import { usePos } from '../store/PosContext'
import type { PosOrder, PosOrderStatus } from '../types'

const nextStatuses: PosOrderStatus[] = [
  'pending',
  'confirmed',
  'preparing',
  'ready_out',
  'completed',
  'cancelled',
]

export function PosOrderDetailPage() {
  const { id } = useParams()
  const { getOrder } = usePos()
  const order = id ? getOrder(id) : undefined

  if (!order) {
    return (
      <div>
        <h1 className="text-3xl">Order not found</h1>
        <Link to="/admin/orders" className="mt-4 inline-block text-sm underline">
          Back to orders
        </Link>
      </div>
    )
  }

  return <OrderDetailView order={order} />
}

function OrderDetailView({ order }: { order: PosOrder }) {
  const { setOrderStatus, updateOrder } = usePos()
  const { notify } = useToast()
  const [ribbon, setRibbon] = useState(order.customization.ribbon)
  const [wrapper, setWrapper] = useState(order.customization.wrapper)
  const [cardMessage, setCardMessage] = useState(order.customization.cardMessage)

  async function changeStatus(status: PosOrderStatus) {
    const result = await setOrderStatus(order.id, status)
    if (!result.ok) notify(result.error ?? 'Could not update status')
    else notify(`Updated to ${statusLabel(status)}`)
  }

  async function saveCustomization() {
    await updateOrder(
      order.id,
      {
        customization: {
          ...order.customization,
          ribbon,
          wrapper,
          cardMessage,
        },
      },
      'Customization updated',
    )
    notify('Customization saved')
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/admin/orders" className="text-xs uppercase tracking-[0.16em]" style={{ color: 'var(--pos-muted)' }}>
        ← Orders
      </Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="pos-mono text-sm" style={{ color: 'var(--pos-muted)' }}>
            {order.id}
          </p>
          <h1 className="mt-1 text-3xl">{order.customerName}</h1>
          <p className="mt-1 text-sm capitalize" style={{ color: 'var(--pos-muted)' }}>
            {order.source} · {order.fulfillment} · {order.scheduleDate} · {order.location}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {nextStatuses.map((status) => (
          <button
            key={status}
            type="button"
            className="pos-btn pos-btn-secondary !min-h-9"
            onClick={() => changeStatus(status)}
            disabled={order.status === status}
          >
            {statusLabel(status)}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="pos-surface p-5">
          <h2 className="text-xl">Line items</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {order.items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-3">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatPHP(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t pt-3 font-semibold" style={{ borderColor: 'var(--pos-line)' }}>
            Total {formatPHP(order.total)}
          </p>
          <p className="mt-2 text-xs" style={{ color: 'var(--pos-muted)' }}>
            Stock applied: {order.stockApplied ? 'Yes' : 'No (pending confirm)'}
          </p>
        </div>

        <div className="pos-surface p-5">
          <h2 className="text-xl">Customization</h2>
          <div className="mt-4 grid gap-3">
            <label className="pos-label">
              Ribbon
              <select className="pos-field mt-1" value={ribbon} onChange={(e) => setRibbon(e.target.value)}>
                {RIBBON_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
            <label className="pos-label">
              Wrapper
              <select className="pos-field mt-1" value={wrapper} onChange={(e) => setWrapper(e.target.value)}>
                {WRAPPER_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
            <label className="pos-label">
              Card message
              <textarea
                className="pos-field mt-1 min-h-20"
                value={cardMessage}
                onChange={(e) => setCardMessage(e.target.value)}
              />
            </label>
            <button type="button" className="pos-btn pos-btn-primary" onClick={saveCustomization}>
              Save changes
            </button>
          </div>
          {order.customization.addOns ? (
            <p className="mt-3 text-sm">Add-ons: {order.customization.addOns}</p>
          ) : null}
          {order.customization.notes ? (
            <p className="mt-2 text-sm" style={{ color: 'var(--pos-muted)' }}>
              Notes: {order.customization.notes}
            </p>
          ) : null}
        </div>
      </div>

      <div className="pos-surface mt-6 p-5">
        <h2 className="text-xl">History</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {[...order.history].reverse().map((entry, index) => (
            <li key={`${entry.at}-${index}`}>
              <p className="font-medium">{entry.text}</p>
              <p className="text-xs" style={{ color: 'var(--pos-muted)' }}>
                {entry.by} · {formatDateTime(entry.at)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
