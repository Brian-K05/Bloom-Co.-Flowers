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
import { StatusRemarks } from './StatusBadge'

function orderNo(id: string) {
  const n = id.replace(/^POS-/, '')
  return n || id
}

function Breakdown({ order }: { order: PosOrder }) {
  const extras = [order.customization.addOns, order.customization.cardMessage ? 'Message card' : ''].filter(Boolean)

  return (
    <ul className="space-y-1 text-[13px] leading-snug">
      {order.items.map((item) => (
        <li key={`${order.id}-${item.productId}`}>
          <p className="flex gap-2 font-semibold">
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
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: '#9aab9a' }} />
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
    </ul>
  )
}

function MoneyBlock({ order, simple }: { order: PosOrder; simple?: boolean }) {
  if (simple) {
    return <p className="text-right text-[15px] font-semibold whitespace-nowrap">{formatPHP(order.total)}</p>
  }
  return (
    <div className="min-w-[10.5rem] text-[13px]">
      <div className="flex justify-between gap-6" style={{ color: 'var(--pos-muted)' }}>
        <span>Flowers</span>
        <span>{formatPHP(order.subtotal)}</span>
      </div>
      {order.deliveryFee > 0 ? (
        <div className="mt-0.5 flex justify-between gap-6" style={{ color: 'var(--pos-muted)' }}>
          <span>Delivery</span>
          <span>{formatPHP(order.deliveryFee)}</span>
        </div>
      ) : null}
      <div
        className="mt-1.5 flex justify-between gap-6 border-t pt-1.5 font-semibold"
        style={{ borderColor: 'var(--pos-line)' }}
      >
        <span>Total</span>
        <span>{formatPHP(order.total)}</span>
      </div>
    </div>
  )
}

export function OrderLogTable({
  orders,
  emptyMessage,
  linkPrefix = '/admin/orders',
  highlightId,
  variant = 'desk',
}: {
  orders: PosOrder[]
  emptyMessage: string
  linkPrefix?: string
  highlightId?: string
  variant?: 'desk' | 'today'
}) {
  const simple = variant === 'today'

  return (
    <div data-testid="order-log-table" className="min-w-0">
      <div className="hidden overflow-x-auto md:block">
        <table className={`w-full text-left ${simple ? 'min-w-[820px]' : 'min-w-[1100px]'}`}>
          <thead style={{ color: 'var(--pos-muted)' }}>
            <tr className="border-b" style={{ borderColor: 'var(--pos-line)' }}>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em]">Order no.</th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em]">Time slot</th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em]">Customer</th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em]">
                Full order breakdown
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.12em]">
                {simple ? 'Amount' : 'Total amount'}
              </th>
              {simple ? null : (
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em]">Status / remarks</th>
              )}
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
                  <Link to={`${linkPrefix}/${order.id}`} className="text-[15px] font-semibold hover:underline">
                    #{orderNo(order.id)}
                  </Link>
                  <p className="mt-0.5 text-xs" style={{ color: 'var(--pos-muted)' }}>
                    {sourceChannelLabel(order.source)}
                  </p>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <p className="text-[15px] font-semibold">{formatSlotTime(order.slotTime, order.createdAt)}</p>
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
                  <p className="text-[15px] font-semibold">{order.customerName}</p>
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
                <td className="px-4 py-4 text-right align-top">
                  <MoneyBlock order={order} simple={simple} />
                </td>
                {simple ? null : (
                  <td className="px-4 py-4">
                    <StatusRemarks order={order} />
                  </td>
                )}
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
            className="space-y-2 px-4 py-4"
            style={{ background: highlightId === order.id ? 'var(--pos-accent-soft)' : undefined }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link to={`${linkPrefix}/${order.id}`} className="text-base font-semibold hover:underline">
                  {order.customerName}
                </Link>
                <p className="text-xs" style={{ color: 'var(--pos-muted)' }}>
                  #{orderNo(order.id)} · {formatSlotTime(order.slotTime, order.createdAt)} ·{' '}
                  {sourceChannelLabel(order.source)}
                </p>
              </div>
              <p className="text-base font-semibold whitespace-nowrap">{formatPHP(order.total)}</p>
            </div>
            <Breakdown order={order} />
            <StatusRemarks order={order} />
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
