import { Link } from 'react-router-dom'
import { useShop } from '../../context/ShopContext'
import { useToast } from '../../context/ToastContext'
import { formatDate, formatPHP, orderStatusLabel, paymentStatusLabel } from '../../lib/format'
import type { OrderStatus, PaymentStatus } from '../../types'

const paymentOptions: PaymentStatus[] = ['pending', 'submitted', 'verified', 'rejected']
const orderOptions: OrderStatus[] = [
  'pending',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'completed',
  'cancelled',
]

export function AdminOrdersPage() {
  const { orders, updateOrderStatus, updatePaymentStatus } = useShop()
  const { notify } = useToast()

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.28em] text-rose">Fulfillment</p>
      <h1 className="mt-2 font-display text-5xl">Orders</h1>
      <p className="mt-3 max-w-xl text-muted">
        Change payment verification and fulfillment status. The customer order timeline updates immediately on this device.
      </p>

      <div className="mt-8 overflow-x-auto border border-line bg-paper">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-line text-[11px] uppercase tracking-[0.16em] text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Order status</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-line last:border-0 align-top">
                <td className="px-4 py-4">
                  <Link to={`/orders/${order.id}`} className="font-display text-xl hover:text-rose">
                    {order.id}
                  </Link>
                  <p className="text-xs text-muted">{order.items.map((item) => item.name).join(', ')}</p>
                </td>
                <td className="px-4 py-4">
                  {order.customer.name}
                  <p className="text-xs text-muted">{order.customer.email}</p>
                </td>
                <td className="px-4 py-4">{formatPHP(order.total)}</td>
                <td className="px-4 py-4">
                  <select
                    value={order.paymentStatus}
                    onChange={(event) => {
                      const value = event.target.value as PaymentStatus
                      updatePaymentStatus(order.id, value)
                      notify(`${order.id} payment marked ${paymentStatusLabel(value).toLowerCase()}.`)
                    }}
                    className="border border-line bg-cream px-2 py-2 text-sm"
                  >
                    {paymentOptions.map((status) => (
                      <option key={status} value={status}>
                        {paymentStatusLabel(status)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-4">
                  <select
                    value={order.orderStatus}
                    onChange={(event) => {
                      const value = event.target.value as OrderStatus
                      updateOrderStatus(order.id, value)
                      notify(`${order.id} moved to ${orderStatusLabel(value, order.fulfillment).toLowerCase()}.`)
                    }}
                    className="border border-line bg-cream px-2 py-2 text-sm"
                  >
                    {orderOptions.map((status) => (
                      <option key={status} value={status}>
                        {orderStatusLabel(status, order.fulfillment)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-4 text-muted">{formatDate(order.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
