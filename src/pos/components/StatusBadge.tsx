import type { PosOrderStatus } from '../types'

const labels: Record<PosOrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready_out: 'Ready / Out',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const tones: Record<PosOrderStatus, { bg: string; ink: string }> = {
  pending: { bg: 'var(--pos-status-pending)', ink: 'var(--pos-status-pending-ink)' },
  confirmed: { bg: 'var(--pos-status-confirmed)', ink: 'var(--pos-status-confirmed-ink)' },
  preparing: { bg: 'var(--pos-status-preparing)', ink: 'var(--pos-status-preparing-ink)' },
  ready_out: { bg: 'var(--pos-status-ready)', ink: 'var(--pos-status-ready-ink)' },
  completed: { bg: 'var(--pos-status-completed)', ink: 'var(--pos-status-completed-ink)' },
  cancelled: { bg: 'var(--pos-status-cancelled)', ink: 'var(--pos-status-cancelled-ink)' },
}

export function statusLabel(status: PosOrderStatus) {
  return labels[status]
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
