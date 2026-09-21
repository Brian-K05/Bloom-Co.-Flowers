import { Link, useParams } from 'react-router-dom'
import { OrderTimeline } from '../components/order/OrderTimeline'
import { BloomImage } from '../components/ui/BloomImage'
import { Button } from '../components/ui/Button'
import { useShop } from '../context/ShopContext'
import { downloadOrderSummary, printOrderSummary } from '../lib/orderSummary'
import { formatDate, formatPHP, orderStatusLabel, paymentLabel, paymentStatusLabel } from '../lib/format'

export function OrderDetailPage() {
  const { id } = useParams()
  const { getOrder } = useShop()
  const order = getOrder(id ?? '')

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="font-display text-4xl">Order not found</h1>
        <p className="mt-3 text-muted">This demonstration order is not stored on this device.</p>
        <div className="mt-8">
          <Button href="/orders">Back to orders</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted">
        <Link to="/orders" className="hover:text-rose">
          Orders
        </Link>
        <span className="mx-2">/</span>
        {order.id}
      </p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl">{order.id}</h1>
          <p className="mt-2 text-muted">
            {orderStatusLabel(order.orderStatus, order.fulfillment)} · {paymentStatusLabel(order.paymentStatus)}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={() => downloadOrderSummary(order)}>
            Download Summary
          </Button>
          <Button type="button" variant="secondary" onClick={() => printOrderSummary(order)}>
            Print
          </Button>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border border-line bg-paper p-6">
          <h2 className="font-display text-3xl">Status</h2>
          <div className="mt-6">
            <OrderTimeline order={order} />
          </div>
        </div>
        <div className="space-y-6">
          <div className="border border-line bg-paper p-6">
            <h2 className="font-display text-3xl">Details</h2>
            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted">Customer</dt>
                <dd>{order.customer.name}</dd>
              </div>
              <div>
                <dt className="text-muted">Recipient</dt>
                <dd>{order.recipient.name}</dd>
              </div>
              <div>
                <dt className="text-muted">{order.fulfillment === 'delivery' ? 'Delivery date' : 'Pickup date'}</dt>
                <dd>{formatDate(order.scheduleDate)}</dd>
              </div>
              <div>
                <dt className="text-muted">Payment</dt>
                <dd>
                  {paymentLabel(order.paymentMethod)} · {paymentStatusLabel(order.paymentStatus)}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-muted">Address</dt>
                <dd>{order.recipient.address}</dd>
              </div>
              {order.personalizedMessage ? (
                <div className="sm:col-span-2">
                  <dt className="text-muted">Personalized message</dt>
                  <dd className="italic">“{order.personalizedMessage}”</dd>
                </div>
              ) : null}
            </dl>
          </div>
          <div className="border border-line bg-paper p-6">
            <h2 className="font-display text-3xl">Pieces</h2>
            <ul className="mt-5 divide-y divide-line">
              {order.items.map((item) => (
                <li key={item.productId} className="flex items-center gap-3 py-3">
                  <BloomImage src={item.image} alt="" className="h-16 w-16" />
                  <div className="flex-1">
                    <p>{item.name}</p>
                    <p className="text-sm text-muted">Qty {item.quantity}</p>
                  </div>
                  <p>{formatPHP(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-line pt-4">
              <span>Total</span>
              <span>{formatPHP(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
