import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { useShop } from '../../context/ShopContext'
import { formatDateTime, formatPHP, orderStatusLabel, paymentStatusLabel } from '../../lib/format'

export function AdminDashboardPage() {
  const { orders, products, resetDemo } = useShop()
  const pending = orders.filter((order) => !['completed', 'cancelled'].includes(order.orderStatus))
  const customers = new Set(orders.map((order) => order.customer.email)).size
  const recent = orders.slice(0, 5)

  const activity = [
    ...orders.slice(0, 4).map((order) => ({
      id: `order-${order.id}`,
      text: `Order ${order.id} is ${orderStatusLabel(order.orderStatus, order.fulfillment).toLowerCase()}.`,
      meta: formatDateTime(order.createdAt),
    })),
    {
      id: 'catalog',
      text: `${products.filter((item) => item.available).length} arrangements currently available.`,
      meta: 'Catalog',
    },
  ]

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.28em] text-rose">Overview</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-5xl">Studio desk</h1>
        <Button type="button" variant="secondary" size="sm" onClick={resetDemo}>
          Reset demo data
        </Button>
      </div>
      <p className="mt-3 max-w-xl text-muted">
        A lightweight view of orders and the catalog. Changes stay on this browser — there is no live backend.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total Orders" value={String(orders.length)} />
        <Stat label="Pending Orders" value={String(pending.length)} />
        <Stat label="Products" value={String(products.length)} />
        <Stat label="Customers" value={String(customers)} />
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-display text-3xl">Recent orders</h2>
            <Link to="/admin/orders" className="text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink">
              Manage
            </Link>
          </div>
          <ul className="divide-y divide-line border-y border-line">
            {recent.map((order) => (
              <li key={order.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-display text-xl">{order.id}</p>
                  <p className="text-sm text-muted">{order.customer.name}</p>
                </div>
                <div className="text-right text-sm">
                  <p>{formatPHP(order.total)}</p>
                  <p className="text-rose">
                    {orderStatusLabel(order.orderStatus, order.fulfillment)} · {paymentStatusLabel(order.paymentStatus)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-3xl">Recent activity</h2>
          <ul className="mt-4 space-y-4">
            {activity.map((item) => (
              <li key={item.id} className="border-l border-gold pl-4">
                <p>{item.text}</p>
                <p className="text-sm text-muted">{item.meta}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line bg-paper px-5 py-6">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-3 font-display text-4xl">{value}</p>
    </div>
  )
}
