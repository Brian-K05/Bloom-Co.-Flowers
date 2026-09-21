import { useMemo, useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { PaymentPanel } from '../components/checkout/PaymentPanel'
import { BloomImage } from '../components/ui/BloomImage'
import { Button } from '../components/ui/Button'
import { useShop } from '../context/ShopContext'
import { brand } from '../data/catalog'
import { formatPHP, isEmail, todayISODate } from '../lib/format'
import type { Fulfillment, PaymentMethod } from '../types'

type Errors = Record<string, string>

export function CheckoutPage() {
  const { cartDetailed, cartSubtotal, profile, placeOrder } = useShop()
  const navigate = useNavigate()
  const giftPrefill = useMemo(
    () => cartDetailed.map((item) => item.message).filter(Boolean).join('\n'),
    [cartDetailed],
  )

  const [customerName, setCustomerName] = useState(profile.name)
  const [email, setEmail] = useState(profile.email)
  const [phone, setPhone] = useState(profile.phone)
  const [recipientName, setRecipientName] = useState('')
  const [recipientPhone, setRecipientPhone] = useState('')
  const [address, setAddress] = useState('')
  const [fulfillment, setFulfillment] = useState<Fulfillment>('delivery')
  const [scheduleDate, setScheduleDate] = useState(todayISODate())
  const [notes, setNotes] = useState('')
  const [message, setMessage] = useState(giftPrefill)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')
  const [reference, setReference] = useState('')
  const [proofName, setProofName] = useState('')
  const [proofData, setProofData] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  if (!cartDetailed.length) {
    return <Navigate to="/cart" replace />
  }

  function validate(): Errors {
    const next: Errors = {}
    if (!customerName.trim()) next.customerName = 'Please enter your full name.'
    if (!isEmail(email)) next.email = 'Please enter a valid email address.'
    if (!phone.trim()) next.phone = 'Please enter a contact number.'
    if (fulfillment === 'delivery') {
      if (!recipientName.trim()) next.recipientName = 'Recipient name is required for delivery.'
      if (!recipientPhone.trim()) next.recipientPhone = 'Recipient contact number is required.'
      if (!address.trim()) next.address = 'Please enter a delivery address.'
    }
    if (!scheduleDate) next.scheduleDate = 'Please choose a date.'
    if (paymentMethod !== 'cod') {
      if (!proofData) next.proof = 'Please upload a payment screenshot for manual payment.'
      if (!reference.trim()) next.reference = 'Please enter the payment reference number.'
    }
    return next
  }

  function onFile(file: File | undefined) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setProofName(file.name)
      setProofData(String(reader.result ?? ''))
    }
    reader.readAsDataURL(file)
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setSubmitting(true)
    const order = placeOrder({
      customer: { name: customerName.trim(), email: email.trim(), phone: phone.trim() },
      recipient: {
        name: fulfillment === 'delivery' ? recipientName.trim() : customerName.trim(),
        phone: fulfillment === 'delivery' ? recipientPhone.trim() : phone.trim(),
        address: fulfillment === 'delivery' ? address.trim() : brand.address,
      },
      fulfillment,
      scheduleDate,
      notes: notes.trim(),
      personalizedMessage: message.trim(),
      paymentMethod,
      paymentReference: reference.trim() || undefined,
      paymentProofName: proofName || undefined,
      paymentProofData: proofData || undefined,
    })
    if (order) {
      navigate(`/order-success?order=${order.id}`)
    }
    setSubmitting(false)
  }

  const fieldClass = 'mt-2 w-full border border-line bg-paper px-3 py-2.5 text-sm text-ink'
  const manual = paymentMethod !== 'cod'

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
      <p className="text-[11px] uppercase tracking-[0.28em] text-rose">Checkout</p>
      <h1 className="mt-2 font-display text-5xl">Almost there</h1>
      <p className="mt-3 max-w-xl text-muted">
        Share delivery details and choose how you’d like to pay. This demonstration does not charge a real payment.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-10">
          <section>
            <h2 className="font-display text-3xl">Customer Information</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2 text-[11px] uppercase tracking-[0.16em] text-muted">
                Full name
                <input className={fieldClass} value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                {errors.customerName ? <ErrorText>{errors.customerName}</ErrorText> : null}
              </label>
              <label className="text-[11px] uppercase tracking-[0.16em] text-muted">
                Email
                <input className={fieldClass} value={email} onChange={(e) => setEmail(e.target.value)} />
                {errors.email ? <ErrorText>{errors.email}</ErrorText> : null}
              </label>
              <label className="text-[11px] uppercase tracking-[0.16em] text-muted">
                Contact number
                <input className={fieldClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
                {errors.phone ? <ErrorText>{errors.phone}</ErrorText> : null}
              </label>
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl">Fulfillment</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <RadioCard
                checked={fulfillment === 'delivery'}
                onChange={() => setFulfillment('delivery')}
                title="Delivery"
                body="Sent to a recipient address in Metro Manila."
              />
              <RadioCard
                checked={fulfillment === 'pickup'}
                onChange={() => setFulfillment('pickup')}
                title="Store Pickup"
                body={`Collect from ${brand.address}.`}
              />
            </div>
            <label className="mt-5 block text-[11px] uppercase tracking-[0.16em] text-muted">
              {fulfillment === 'delivery' ? 'Delivery date' : 'Pickup date'}
              <input
                type="date"
                min={todayISODate()}
                className={fieldClass}
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
              />
              {errors.scheduleDate ? <ErrorText>{errors.scheduleDate}</ErrorText> : null}
            </label>
            {fulfillment === 'delivery' ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="text-[11px] uppercase tracking-[0.16em] text-muted">
                  Recipient name
                  <input className={fieldClass} value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
                  {errors.recipientName ? <ErrorText>{errors.recipientName}</ErrorText> : null}
                </label>
                <label className="text-[11px] uppercase tracking-[0.16em] text-muted">
                  Recipient contact number
                  <input className={fieldClass} value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)} />
                  {errors.recipientPhone ? <ErrorText>{errors.recipientPhone}</ErrorText> : null}
                </label>
                <label className="sm:col-span-2 text-[11px] uppercase tracking-[0.16em] text-muted">
                  Delivery address
                  <textarea
                    rows={3}
                    className={fieldClass}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, village or building, city"
                  />
                  {errors.address ? <ErrorText>{errors.address}</ErrorText> : null}
                </label>
              </div>
            ) : null}
            <label className="mt-5 block text-[11px] uppercase tracking-[0.16em] text-muted">
              {fulfillment === 'delivery' ? 'Delivery notes' : 'Pickup notes'}
              <textarea
                rows={3}
                className={fieldClass}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={fulfillment === 'delivery' ? 'Gate instructions, preferred time window' : 'Approximate arrival time'}
              />
            </label>
          </section>

          <section>
            <h2 className="font-display text-3xl">Personalized Message</h2>
            <textarea
              rows={4}
              className={`${fieldClass} mt-5`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="The note that will accompany the flowers"
            />
          </section>

          <section>
            <h2 className="font-display text-3xl">Payment</h2>
            <div className="mt-5 grid gap-3">
              <RadioCard
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                title="Cash on Delivery / Pickup"
                body="Pay when the arrangement arrives or when you collect it."
              />
              <RadioCard
                checked={paymentMethod === 'gcash'}
                onChange={() => setPaymentMethod('gcash')}
                title="GCash"
                body="Manual online payment. Upload a screenshot after sending."
              />
              <RadioCard
                checked={paymentMethod === 'maya'}
                onChange={() => setPaymentMethod('maya')}
                title="Maya"
                body="Manual online payment. Verified by the shop."
              />
              <RadioCard
                checked={paymentMethod === 'bank'}
                onChange={() => setPaymentMethod('bank')}
                title="Bank Transfer"
                body="Send to our demo BDO account, then attach proof."
              />
            </div>
            {manual && (paymentMethod === 'gcash' || paymentMethod === 'maya' || paymentMethod === 'bank') ? (
              <div className="mt-5">
                <PaymentPanel method={paymentMethod} />
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="text-[11px] uppercase tracking-[0.16em] text-muted">
                    Reference number
                    <input className={fieldClass} value={reference} onChange={(e) => setReference(e.target.value)} />
                    {errors.reference ? <ErrorText>{errors.reference}</ErrorText> : null}
                  </label>
                  <label className="text-[11px] uppercase tracking-[0.16em] text-muted">
                    Payment screenshot
                    <input
                      type="file"
                      accept="image/*"
                      className={`${fieldClass} file:mr-3 file:border-0 file:bg-transparent file:text-sm`}
                      onChange={(e) => onFile(e.target.files?.[0])}
                    />
                    {proofName ? <p className="mt-1 text-xs tracking-normal text-sage">Attached: {proofName}</p> : null}
                    {errors.proof ? <ErrorText>{errors.proof}</ErrorText> : null}
                  </label>
                </div>
              </div>
            ) : null}
          </section>
        </div>

        <aside className="h-fit border border-line bg-paper p-6">
          <h2 className="font-display text-3xl">Order</h2>
          <ul className="mt-5 divide-y divide-line">
            {cartDetailed.map((item) => (
              <li key={item.productId} className="flex gap-3 py-3">
                <BloomImage src={item.product.images[0]} alt="" className="h-16 w-16 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-xl">{item.product.name}</p>
                  <p className="text-sm text-muted">
                    {item.quantity} × {formatPHP(item.product.price)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-line pt-4">
            <span>Total</span>
            <span>{formatPHP(cartSubtotal)}</span>
          </div>
          <div className="mt-6">
            <Button type="submit" disabled={submitting} size="lg" className="w-full">
              Place Order
            </Button>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            Demo Prototype — placing an order stores it on this device only. No payment is taken and no florist is notified.
          </p>
        </aside>
      </form>
    </div>
  )
}

function ErrorText({ children }: { children: string }) {
  return <span className="mt-1 block text-xs tracking-normal text-rose">{children}</span>
}

function RadioCard({
  checked,
  onChange,
  title,
  body,
}: {
  checked: boolean
  onChange: () => void
  title: string
  body: string
}) {
  return (
    <label className={`block cursor-pointer border p-4 ${checked ? 'border-ink bg-cream' : 'border-line bg-paper'}`}>
      <input type="radio" className="sr-only" checked={checked} onChange={onChange} />
      <p className="font-display text-xl">{title}</p>
      <p className="mt-1 text-sm tracking-normal text-muted">{body}</p>
    </label>
  )
}
