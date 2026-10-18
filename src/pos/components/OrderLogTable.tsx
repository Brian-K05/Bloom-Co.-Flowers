import { Link } from 'react-router-dom'
import { formatPHP } from '../../lib/format'
import type { PosOrder } from '../types'
import { RemarksBlock } from './StatusBadge'

function orderNo(id: string) {
  const n = id.replace(/^POS-/, '')
  return n || id
}

function timeLabel(order: PosOrder) {
  return new Date(order.createdAt).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })
}

export function OrderLogTable({
  orders,
  emptyMessage,
  linkPrefix = '/admin/orders',
}: {
  orders: PosOrder[]
  emptyMessage: string
  linkPrefix?: string
}) {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-left text-sm" data-testid="order-log-table">
          <thead style={{ color: 'var(--pos-muted)' }}>
            <tr className="border-b" style={{ borderColor: 'var(--pos-line)' }}>
              <th className="px-4 py-3 font-medium">No.</th>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
              <th className="px-4 py-3 font-medium">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b align-top last:border-0" style={{ borderColor: 'var(--pos-line)' }}>
                <td className="px-4 py-3">
                  <Link to={`${linkPrefix}/${order.id}`} className="pos-mono text-xs font-medium hover:underline">
                    {orderNo(order.id)}
                  </Link>
                </td>
                <td className="px-4 py-3 pos-mono text-xs whitespace-nowrap">{timeLabel(order)}</td>
                <td className="px-4 py-3">
                  <p className="font-medium">{order.customerName}</p>
                  {order.customerPhone ? (
                    <p className="text-xs" style={{ color: 'var(--pos-muted)' }}>
                      {order.customerPhone}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <ul className="space-y-1">
                    {order.items.map((item) => (
                      <li key={`${order.id}-${item.productId}`} className="flex justify-between gap-4">
                        <span>
                          {item.name}
                          {item.quantity > 1 ? ` × ${item.quantity}` : ''}
                        </span>
                        <span className="pos-mono text-xs whitespace-nowrap" style={{ color: 'var(--pos-muted)' }}>
                          {formatPHP(item.price * item.quantity)}
                        </span>
                      </li>
                    ))}
                    {order.deliveryFee > 0 ? (
                      <li className="flex justify-between gap-4" style={{ color: 'var(--pos-muted)' }}>
                        <span>del</span>
                        <span className="pos-mono text-xs whitespace-nowrap">{formatPHP(order.deliveryFee)}</span>
                      </li>
                    ) : null}
                  </ul>
                </td>
                <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">{formatPHP(order.total)}</td>
                <td className="px-4 py-3">
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
          <li key={order.id} className="space-y-2 px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link to={`${linkPrefix}/${order.id}`} className="font-medium hover:underline">
                  {order.customerName}
                </Link>
                <p className="pos-mono text-[11px]" style={{ color: 'var(--pos-muted)' }}>
                  #{orderNo(order.id)} · {timeLabel(order)}
                </p>
              </div>
              <p className="font-semibold whitespace-nowrap">{formatPHP(order.total)}</p>
            </div>
            <ul className="text-sm" style={{ color: 'var(--pos-muted)' }}>
              {order.items.map((item) => (
                <li key={`${order.id}-m-${item.productId}`}>
                  {item.name}
                  {item.quantity > 1 ? ` × ${item.quantity}` : ''} · {formatPHP(item.price * item.quantity)}
                </li>
              ))}
              {order.deliveryFee > 0 ? <li>del · {formatPHP(order.deliveryFee)}</li> : null}
            </ul>
            <RemarksBlock status={order.status} fulfillment={order.fulfillment} location={order.location} compact />
          </li>
        ))}
        {!orders.length ? (
          <li className="px-4 py-8 text-sm" style={{ color: 'var(--pos-muted)' }}>
            {emptyMessage}
          </li>
        ) : null}
      </ul>
    </>
  )
}
