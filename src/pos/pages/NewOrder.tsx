import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatPHP, todayISODate } from '../../lib/format'
import { useToast } from '../../context/ToastContext'
import { formatRecipe, nowSlotTime } from '../lib/catalog'
import { usePosTheme } from '../PosThemeProvider'
import { usePos } from '../store/PosContext'
import type { PosFulfillment, PosOrderSource, PosOrderStatus } from '../types'
import { BloomImage } from '../../components/ui/BloomImage'

export function PosNewOrderPage() {
  const { products, createOrder, locations, ribbons, wrappers, backend } = usePos()
  const { theme } = usePosTheme()
  const { notify } = useToast()
  const navigate = useNavigate()

  const [source, setSource] = useState<PosOrderSource>('messenger')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [recipientPhone, setRecipientPhone] = useState('')
  const [location, setLocation] = useState('')
  const [fulfillment, setFulfillment] = useState<PosFulfillment>('delivery')
  const [scheduleDate, setScheduleDate] = useState(todayISODate())
  const [slotTime, setSlotTime] = useState(nowSlotTime())
  const [paymentStatus, setPaymentStatus] = useState<PosOrderStatus>('not_paid')
  const [deliveryFee, setDeliveryFee] = useState('0')
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [ribbon, setRibbon] = useState('')
  const [wrapper, setWrapper] = useState('')
  const [cardMessage, setCardMessage] = useState('')
  const [addOns, setAddOns] = useState('')
  const [notes, setNotes] = useState('')
  const [isPreorder, setIsPreorder] = useState(false)
  const [supplierNote, setSupplierNote] = useState('')
  const [reminderDue, setReminderDue] = useState(todayISODate())

  useEffect(() => {
    if (!location && locations[0]) setLocation(locations[0])
  }, [location, locations])
  useEffect(() => {
    if (!ribbon && ribbons[0]) setRibbon(ribbons[0])
  }, [ribbon, ribbons])
  useEffect(() => {
    if (!wrapper && wrappers[0]) setWrapper(wrappers[0])
  }, [wrapper, wrappers])
  useEffect(() => {
    if (!productId) {
      const first = products.find((p) => p.stockQty > 0)?.id ?? products[0]?.id ?? ''
      if (first) setProductId(first)
    }
  }, [productId, products])

  const selected = products.find((p) => p.id === productId)
  const availableProducts = useMemo(
    () => products.filter((p) => p.stockQty > 0 || isPreorder),
    [isPreorder, products],
  )

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!customerName.trim() || !productId) {
      notify('Customer name and at least one product are required.')
      return
    }
    const fee = fulfillment === 'delivery' ? Math.max(0, Number(deliveryFee) || 0) : 0
    try {
      const order = await createOrder({
        source,
        customerName,
        customerPhone,
        recipientName: recipientName || customerName,
        recipientPhone: recipientPhone || customerPhone,
        location,
        fulfillment,
        scheduleDate,
        slotTime,
        items: [{ productId, quantity }],
        customization: { ribbon, wrapper, cardMessage, addOns, notes },
        isPreorder,
        supplierNote,
        reminderDue: isPreorder ? reminderDue : null,
        status: paymentStatus,
        deliveryFee: fee,
      })
      if (!order) {
        notify('Could not create order — check stock or product selection.')
        return
      }
      notify(`${order.id} saved — showing on the order log`)
      navigate(`/admin/orders?highlight=${order.id}`)
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not create order')
    }
  }

  const form = (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="pos-label">
          Source
          <select className="pos-field mt-1" value={source} onChange={(e) => setSource(e.target.value as PosOrderSource)}>
            <option value="messenger">Messenger</option>
            <option value="walk-in">Walk-in</option>
            <option value="call">Call</option>
          </select>
        </label>
        <label className="pos-label">
          Fulfillment
          <select
            className="pos-field mt-1"
            value={fulfillment}
            onChange={(e) => setFulfillment(e.target.value as PosFulfillment)}
          >
            <option value="delivery">Delivery</option>
            <option value="pickup">Pickup</option>
          </select>
        </label>
        <label className="pos-label">
          Schedule date
          <input
            type="date"
            className="pos-field mt-1"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            required
          />
        </label>
        <label className="pos-label">
          Time slot
          <input
            type="time"
            className="pos-field mt-1"
            value={slotTime}
            onChange={(e) => setSlotTime(e.target.value)}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="pos-label">
          Payment status
          <select
            className="pos-field mt-1"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value as PosOrderStatus)}
          >
            <option value="not_paid">Not paid</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
          </select>
        </label>
        {fulfillment === 'delivery' ? (
          <label className="pos-label">
            Maxim / delivery fee
            <input
              type="number"
              min={0}
              step={1}
              className="pos-field mt-1"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(e.target.value)}
            />
          </label>
        ) : (
          <p className="self-end text-sm" style={{ color: 'var(--pos-muted)' }}>
            Pickup — no delivery fee
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="pos-label">
          Customer name
          <input className="pos-field mt-1" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
        </label>
        <label className="pos-label">
          Customer phone
          <input className="pos-field mt-1" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
        </label>
        <label className="pos-label">
          Recipient name
          <input className="pos-field mt-1" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
        </label>
        <label className="pos-label">
          Recipient phone
          <input className="pos-field mt-1" value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)} />
        </label>
      </div>

      <label className="pos-label">
        Location
        <select className="pos-field mt-1" value={location} onChange={(e) => setLocation(e.target.value)}>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-[1.4fr_0.6fr]">
        <label className="pos-label">
          Product
          <select className="pos-field mt-1" value={productId} onChange={(e) => setProductId(e.target.value)} required>
            {availableProducts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {formatPHP(p.price)} · stock {p.stockQty}
                {p.stockQty <= 0 ? ' (pre-order)' : ''}
              </option>
            ))}
          </select>
        </label>
        <label className="pos-label">
          Qty
          <input
            type="number"
            min={1}
            className="pos-field mt-1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </label>
      </div>
      {selected?.recipe?.length ? (
        <p className="text-sm" style={{ color: 'var(--pos-muted)' }} data-testid="pos-recipe-preview">
          Inside: {formatRecipe(selected.recipe)}
          {selected.size && selected.color ? ` · ${selected.size} ${selected.color}` : ''}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="pos-label">
          Ribbon
          <select className="pos-field mt-1" value={ribbon} onChange={(e) => setRibbon(e.target.value)}>
            {ribbons.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
        <label className="pos-label">
          Wrapper
          <select className="pos-field mt-1" value={wrapper} onChange={(e) => setWrapper(e.target.value)}>
            {wrappers.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="pos-label">
        Card message
        <textarea className="pos-field mt-1 min-h-20" value={cardMessage} onChange={(e) => setCardMessage(e.target.value)} />
      </label>
      <label className="pos-label">
        Add-ons
        <input className="pos-field mt-1" value={addOns} onChange={(e) => setAddOns(e.target.value)} />
      </label>
      <label className="pos-label">
        Staff notes
        <textarea className="pos-field mt-1 min-h-16" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isPreorder} onChange={(e) => setIsPreorder(e.target.checked)} />
        Imported / pre-order (supplier follow-up)
      </label>
      {isPreorder ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="pos-label">
            Supplier note
            <input className="pos-field mt-1" value={supplierNote} onChange={(e) => setSupplierNote(e.target.value)} />
          </label>
          <label className="pos-label">
            Reminder due
            <input type="date" className="pos-field mt-1" value={reminderDue} onChange={(e) => setReminderDue(e.target.value)} />
          </label>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4" style={{ borderColor: 'var(--pos-line)' }}>
        <p className="text-sm" style={{ color: 'var(--pos-muted)' }}>
          Order total:{' '}
          <strong style={{ color: 'var(--pos-ink)' }}>
            {selected
              ? formatPHP(
                  selected.price * quantity +
                    (fulfillment === 'delivery' ? Math.max(0, Number(deliveryFee) || 0) : 0),
                )
              : '—'}
          </strong>
        </p>
        <button type="submit" className="pos-btn pos-btn-primary">
          Save order
        </button>
      </div>
    </form>
  )

  if (theme.layout === 'split') {
    return (
      <div>
        <h1 className="text-3xl">New order</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--pos-muted)' }}>
          Studio Grid — pick stock on the left, encode on the right.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-3">
            {products.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setProductId(p.id)}
                className={`pos-surface overflow-hidden text-left ${productId === p.id ? 'ring-2 ring-[var(--pos-accent)]' : ''}`}
              >
                <div className="aspect-square">
                  <BloomImage src={p.image} alt={p.name} className="h-full w-full" />
                </div>
                <div className="p-2">
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs" style={{ color: 'var(--pos-muted)' }}>
                    {formatPHP(p.price)} · {p.stockQty <= 0 ? 'Sold out' : `${p.stockQty} left`}
                  </p>
                </div>
              </button>
            ))}
          </div>
          <div className="pos-surface p-5">{form}</div>
        </div>
      </div>
    )
  }

  const emptyCatalog =
    !products.length || !locations.length ? (
      <p className="mt-4 text-sm" style={{ color: 'var(--pos-danger)' }}>
        {backend === 'supabase'
          ? 'No catalog in the database yet. Run supabase/migrate_shop_options.sql (or bootstrap.sql), then Dashboard → Reset demo.'
          : 'No products loaded. Use Reset demo or configure Supabase.'}
      </p>
    ) : null

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl">New order</h1>
      <p className="mt-2 text-sm" style={{ color: 'var(--pos-muted)' }}>
        Default source is Messenger — confirm details in chat, then save here.
      </p>
      {emptyCatalog}
      <div className="pos-surface mt-6 p-5 sm:p-6">{form}</div>
    </div>
  )
}
