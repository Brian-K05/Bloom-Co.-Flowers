import { Link } from 'react-router-dom'
import { formatPHP } from '../../lib/format'
import {
  formatRecipe,
  formatSlotTime,
  messengerHandle,
  sourceChannelLabel,
  stemDotColor,
} from '../lib/catalog'
import type { PosOrder } from '../types'
import { RemarksBlock } from './StatusBadge'

function orderNo(id: string) {
  const n = id.replace(/^POS-/, '')
  return n || id
}

function Breakdown({ order }: { order: PosOrder }) {
  const extras = [
    order.customization.addOns,
    order.customization.cardMessage ? `Message card` : '',
  ].filter(Boolean)

  return (
    <ul className="space-y-1.5 text-sm">
      {order.items.map((item) => (
        <li key={`${order.id}-${item.productId}`}>
          <p className="flex gap-2 font-medium">
            <span
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
              style={{ background: stemDotColor(item.color, item.name) }}
            />
            <span>
              {item.name}
              {item.quantity > 1 ? ` × ${item.quantity}` : ''}
            </span>
          </p>
          {item.recipe?.length ? (
            <p className="ml-4 flex gap-2 text-xs" style={{ color: 'var(--pos-muted)' }}>
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                style={{ background: '#9aab9a' }}
              />
              {formatRecipe(item.recipe)}
            </p>
          ) : null}
        </li>
      ))}
      {extras.map((line) => (
        <li key={line} className="ml-4 flex gap-2 text-xs" style={{ color: 'var(--pos-muted)' }}>
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: '#9aab9a' }} />
          {line}
        </li>
      ))}
      {order.deliveryFee > 0 ? (
        <li className="ml-4 flex justify-between gap-4 text-xs" style={{ color: 'var(--pos-muted)' }}>
          <span>Maxim / delivery</span>
          <span className="pos-mono">{formatPHP(order.deliveryFee)}</span>
        </li>
      ) : null}
    </ul>
  )
}

export function OrderLogTable({
  orders,
  emptyMessage,
  linkPrefix = '/admin/orders',
  highlightId,
}: {
  orders: PosOrder[]
  emptyMessage: string
  linkPrefix?: string
  highlightId?: string
}) {
  return (
    <div data-testid="order-log-table">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead style={{ color: 'var(--pos-muted)' }}>
            <tr className="border-b" style={{ borderColor: 'var(--pos-line)' }}>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em]">Order no.</th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em]">Time slot</th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em]">Customer</th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em]">
                Full order breakdown
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.12em]">
                Amount
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em]">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b align-top last:border-0"
                style={{
                  borderColor: 'var(--pos-line)',
                  background: highlightId === order.id ? 'var(--pos-accent-soft)' : undefined,
                }}
              >
                <td className="px-4 py-4">
                  <Link to={`${linkPrefix}/${order.id}`} className="font-semibold hover:underline">
                    #{orderNo(order.id)}
                  </Link>
                  <p className="mt-0.5 text-xs" style={{ color: 'var(--pos-muted)' }}>
                    {sourceChannelLabel(order.source)}
                  </p>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <p className="font-semibold">{formatSlotTime(order.slotTime, order.createdAt)}</p>
                  {order.status !== 'cancelled' ? (
                    <p className="mt-1 flex items-center gap-1.5 text-xs" style={{ color: '#2f7a45' }}>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#2f7a45]" />
                      Scheduled
                    </p>
                  ) : (
                    <p className="mt-1 text-xs" style={{ color: 'var(--pos-muted)' }}>
                      Cancelled
                    </p>
                  )}
                </td>
                <td className="px-4 py-4">
                  <p className="font-semibold">{order.customerName}</p>
                  {order.customerPhone ? (
                    <p className="text-xs" style={{ color: 'var(--pos-muted)' }}>
                      {order.customerPhone}
                    </p>
                  ) : null}
                  {order.source === 'messenger' ? (
                    <p
                      className="mt-1.5 inline-flex rounded-full px-2 py-0.5 text-[11px]"
                      style={{ background: 'var(--pos-chip)', color: 'var(--pos-muted)' }}
                    >
                      Messenger · {messengerHandle(order.customerName)}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-4">
                  <Breakdown order={order} />
                </td>
                <td className="px-4 py-4 text-right font-semibold whitespace-nowrap">{formatPHP(order.total)}</td>
                <td className="px-4 py-4">
                  <RemarksBlock status={order.status} fulfillment={order.fulfillment} location={order.location} compact />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!orders.length ? (
          <p className="px-4 py-10 text-sm" style={{ color: 'var(--pos-muted)' }}>
            {emptyMessage}
          </p>
        ) : null}
      </div>

      <ul className="divide-y md:hidden" style={{ borderColor: 'var(--pos-line)' }} data-testid="order-log-mobile">
        {orders.map((order) => (
          <li
            key={order.id}
            className="space-y-2 px-4 py-3"
            style={{ background: highlightId === order.id ? 'var(--pos-accent-soft)' : undefined }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link to={`${linkPrefix}/${order.id}`} className="font-medium hover:underline">
                  {order.customerName}
                </Link>
                <p className="text-[11px]" style={{ color: 'var(--pos-muted)' }}>
                  #{orderNo(order.id)} · {formatSlotTime(order.slotTime, order.createdAt)} ·{' '}
                  {sourceChannelLabel(order.source)}
                </p>
              </div>
              <p className="font-semibold whitespace-nowrap">{formatPHP(order.total)}</p>
            </div>
            <Breakdown order={order} />
            <RemarksBlock status={order.status} fulfillment={order.fulfillment} location={order.location} compact />
          </li>
        ))}
        {!orders.length ? (
          <li className="px-4 py-8 text-sm" style={{ color: 'var(--pos-muted)' }}>
            {emptyMessage}
          </li>
        ) : null}
      </ul>
    </div>
  )
}
