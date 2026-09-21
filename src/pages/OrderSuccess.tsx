import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { BloomImage } from '../components/ui/BloomImage'
import { Button } from '../components/ui/Button'
import { useShop } from '../context/ShopContext'
import { downloadOrderSummary } from '../lib/orderSummary'
import { formatDate, formatPHP, orderStatusLabel, paymentLabel, paymentStatusLabel } from '../lib/format'

export function OrderSuccessPage() {
  const [params] = useSearchParams()
  const { getOrder } = useShop()
  const order = getOrder(params.get('order') ?? '')

  if (!order) {
    return <Navigate to="/orders" replace />
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
      <p className="text-[11px] uppercase tracking-[0.28em] text-sage">Confirmed</p>
      <h1 className="mt-3 font-display text-5xl leading-tight">Your order is with the studio</h1>
      <p className="mt-4 text-muted">
        Thank you, {order.customer.name.split(' ')[0]}. We’ve received your order and will update this page as it moves
        from preparation to delivery.
      </p>
      <p className="mt-6 font-display text-3xl">
        Order number <span className="text-rose">{order.id}</span>
      </p>

      <div className="mt-10 border border-line bg-paper p-6">
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">Customer</dt>
            <dd className="mt-1">{order.customer.name}</dd>
            <dd className="text-muted">{order.customer.email}</dd>
            <dd className="text-muted">{order.customer.phone}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">Recipient</dt>
            <dd className="mt-1">{order.recipient.name}</dd>
            <dd className="text-muted">{order.recipient.phone}</dd>
            <dd className="text-muted">{order.recipient.address}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">
              {order.fulfillment === 'delivery' ? 'Delivery' : 'Pickup'}
            </dt>
            <dd className="mt-1">{formatDate(order.scheduleDate)}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">Payment</dt>
            <dd className="mt-1">{paymentLabel(order.paymentMethod)}</dd>
            <dd className="text-muted">{paymentStatusLabel(order.paymentStatus)}</dd>
          </div>
        </dl>

        <ul className="mt-6 divide-y divide-line border-t border-line">
          {order.items.map((item) => (
            <li key={item.productId} className="flex items-center gap-3 py-3">
              <BloomImage src={item.image} alt="" className="h-14 w-14" />
              <div className="flex-1">
                <p>{item.name}</p>
                <p className="text-sm text-muted">Qty {item.quantity}</p>
              </div>
              <p>{formatPHP(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between">
          <span>Total</span>
          <span>{formatPHP(order.total)}</span>
        </div>
        {order.personalizedMessage ? (
          <p className="mt-6 border-t border-line pt-4 text-sm italic text-muted">“{order.personalizedMessage}”</p>
        ) : null}
        <p className="mt-4 text-sm text-muted">Status: {orderStatusLabel(order.orderStatus, order.fulfillment)}</p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button href={`/orders/${order.id}`}>Track Order</Button>
        <Button type="button" variant="secondary" onClick={() => downloadOrderSummary(order)}>
          Download Order Summary
        </Button>
      </div>
      <p className="mt-6 text-sm text-muted">
        You can also find this under{' '}
        <Link to="/account" className="underline underline-offset-4">
          your account
        </Link>
        .
      </p>
    </div>
  )
}
