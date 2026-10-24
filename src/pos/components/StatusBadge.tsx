import type { PosFulfillment, PosOrder, PosOrderStatus } from '../types'

const labels: Record<PosOrderStatus, string> = {
  not_paid: 'Not paid',
  paid: 'Paid',
  partial: 'Partial',
  cancelled: 'Cancelled',
}

const shortLabels: Record<PosOrderStatus, string> = {
  not_paid: 'NP',
  paid: 'Paid',
  partial: 'Partial',
  cancelled: 'Cancelled',
}

const tones: Record<PosOrderStatus, { bg: string; ink: string }> = {
  not_paid: { bg: 'var(--pos-status-pending)', ink: 'var(--pos-status-pending-ink)' },
  paid: { bg: 'var(--pos-status-confirmed)', ink: 'var(--pos-status-confirmed-ink)' },
  partial: { bg: 'var(--pos-status-preparing)', ink: 'var(--pos-status-preparing-ink)' },
  cancelled: { bg: 'var(--pos-status-cancelled)', ink: 'var(--pos-status-cancelled-ink)' },
}

export function statusLabel(status: PosOrderStatus) {
  return labels[status]
}

export function statusShortLabel(status: PosOrderStatus) {
  return shortLabels[status]
}

export function fulfillmentLabel(fulfillment: PosFulfillment) {
  return fulfillment === 'delivery' ? 'For delivery' : 'For pickup'
}

export function StatusBadge({ status }: { status: PosOrderStatus }) {
  const tone = tones[status]
  return (
    <span
      data-status-badge
      className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]"
      style={{
        background: tone.bg,
        color: tone.ink,
      }}
    >
      {labels[status]}
    </span>
  )
}

export function FulfillmentBadge({ fulfillment }: { fulfillment: PosFulfillment }) {
  return (
    <span
      data-fulfillment-badge
      className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]"
      style={{
        background: 'var(--pos-status-ready)',
        color: 'var(--pos-status-ready-ink)',
      }}
    >
      {fulfillmentLabel(fulfillment)}
    </span>
  )
}

function shortLocation(location: string) {
  const part = location.split(/[–—-]/).pop()?.trim()
  return (part || location).toUpperCase()
}

export function Chip({ children }: { children: string }) {
  return (
    <span
      className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]"
      style={{ background: 'var(--pos-chip)', color: 'var(--pos-ink)' }}
    >
      {children}
    </span>
  )
}

/** Payment + place + pickup/delivery, then a plain-language note. */
export function StatusRemarks({ order }: { order: PosOrder }) {
  const note = [order.customization.notes, order.customization.addOns].filter(Boolean)[0]
  return (
    <div className="space-y-1.5 text-xs" data-testid="order-remarks">
      <div className="flex flex-wrap gap-1.5">
        <StatusBadge status={order.status} />
        {order.location ? <Chip>{shortLocation(order.location)}</Chip> : null}
        <FulfillmentBadge fulfillment={order.fulfillment} />
      </div>
      {note ? <p style={{ color: 'var(--pos-muted)' }}>{note}</p> : null}
    </div>
  )
}

/** Word-log style remarks: payment + pickup/delivery (+ optional location). */
export function RemarksBlock({
  status,
  fulfillment,
  location,
  compact,
}: {
  status: PosOrderStatus
  fulfillment: PosFulfillment
  location?: string
  compact?: boolean
}) {
  return (
    <div className={compact ? 'space-y-0.5 text-xs' : 'space-y-1 text-sm'} data-testid="order-remarks">
      <div className="flex flex-wrap gap-1.5">
        <StatusBadge status={status} />
        {location ? <Chip>{shortLocation(location)}</Chip> : null}
        <FulfillmentBadge fulfillment={fulfillment} />
      </div>
    </div>
  )
}
