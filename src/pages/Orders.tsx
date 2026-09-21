import { Link } from 'react-router-dom'
import { EmptyState } from '../components/ui/EmptyState'
import { useShop } from '../context/ShopContext'
import { formatDate, formatPHP, orderStatusLabel } from '../lib/format'

export function OrdersPage() {
  const { orders, profile } = useShop()
  const mine = orders.filter((order) => order.customer.email === profile.email)

  if (!mine.length) {
    return (
      <EmptyState
        eyebrow="Orders"
        title="You haven't placed an order yet."
        body="When you do, you’ll be able to follow it from the studio to the door."
        actionLabel="Explore Flowers"
        actionHref="/shop"
      />
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
      <p className="text-[11px] uppercase tracking-[0.28em] text-rose">Your studio orders</p>
      <h1 className="mt-2 font-display text-5xl">My Orders</h1>
      <ul className="mt-10 divide-y divide-line border-y border-line">
        {mine.map((order) => (
          <li key={order.id}>
            <Link to={`/orders/${order.id}`} className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-2xl">{order.id}</p>
                <p className="text-sm text-muted">{formatDate(order.createdAt)}</p>
              </div>
              <div className="flex items-center justify-between gap-8 sm:justify-end">
                <p>{formatPHP(order.total)}</p>
                <p className="text-sm text-rose">{orderStatusLabel(order.orderStatus, order.fulfillment)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
