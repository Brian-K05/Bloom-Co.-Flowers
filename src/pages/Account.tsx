import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { useShop } from '../context/ShopContext'
import { useToast } from '../context/ToastContext'
import { formatPHP, isEmail, orderStatusLabel } from '../lib/format'

export function AccountPage() {
  const { profile, updateProfile, orders } = useShop()
  const { notify } = useToast()
  const [name, setName] = useState(profile.name)
  const [email, setEmail] = useState(profile.email)
  const [phone, setPhone] = useState(profile.phone)
  const [error, setError] = useState('')

  const mine = orders.filter((order) => order.customer.email === profile.email)
  const current = mine.find((order) => !['completed', 'cancelled'].includes(order.orderStatus))
  const recent = mine.slice(0, 4)

  function save(event: FormEvent) {
    event.preventDefault()
    if (!name.trim() || !isEmail(email) || !phone.trim()) {
      setError('Please complete name, a valid email, and a contact number.')
      return
    }
    setError('')
    updateProfile({ name: name.trim(), email: email.trim(), phone: phone.trim() })
    notify('Profile updated on this device.')
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <p className="text-[11px] uppercase tracking-[0.28em] text-rose">Welcome</p>
      <h1 className="mt-2 font-display text-5xl">Hello, {profile.name.split(' ')[0]}</h1>
      <p className="mt-3 max-w-xl text-muted">
        Your orders and profile are stored on this device for the demonstration — no password required.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="border border-line bg-paper p-6 lg:col-span-2">
          <h2 className="font-display text-3xl">Current order</h2>
          {current ? (
            <Link to={`/orders/${current.id}`} className="mt-4 block">
              <p className="font-display text-2xl">{current.id}</p>
              <p className="mt-1 text-sm text-muted">
                {orderStatusLabel(current.orderStatus, current.fulfillment)} · {formatPHP(current.total)}
              </p>
            </Link>
          ) : (
            <p className="mt-4 text-muted">No order in progress. When you place one, it will appear here.</p>
          )}
        </div>
        <div className="border border-line bg-paper p-6">
          <h2 className="font-display text-3xl">Studio</h2>
          <p className="mt-3 text-sm text-muted">Browse the collection or continue an unfinished thought.</p>
          <div className="mt-5">
            <Button href="/shop" size="sm">
              Shop Flowers
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <form onSubmit={save} className="border border-line bg-paper p-6">
          <h2 className="font-display text-3xl">Profile</h2>
          <label className="mt-5 block text-[11px] uppercase tracking-[0.16em] text-muted">
            Name
            <input
              className="mt-2 w-full border border-line bg-cream px-3 py-2.5 text-sm tracking-normal text-ink"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="mt-4 block text-[11px] uppercase tracking-[0.16em] text-muted">
            Email
            <input
              className="mt-2 w-full border border-line bg-cream px-3 py-2.5 text-sm tracking-normal text-ink"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="mt-4 block text-[11px] uppercase tracking-[0.16em] text-muted">
            Contact
            <input
              className="mt-2 w-full border border-line bg-cream px-3 py-2.5 text-sm tracking-normal text-ink"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
          {error ? <p className="mt-3 text-sm text-rose">{error}</p> : null}
          <div className="mt-6">
            <Button type="submit">Save profile</Button>
          </div>
        </form>

        <div>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-display text-3xl">Recent orders</h2>
            <Link to="/orders" className="text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink">
              View all
            </Link>
          </div>
          {recent.length ? (
            <ul className="divide-y divide-line border-y border-line">
              {recent.map((order) => (
                <li key={order.id}>
                  <Link to={`/orders/${order.id}`} className="flex items-center justify-between py-4">
                    <span className="font-display text-xl">{order.id}</span>
                    <span className="text-sm text-muted">
                      {formatPHP(order.total)} · {orderStatusLabel(order.orderStatus, order.fulfillment)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No orders yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
