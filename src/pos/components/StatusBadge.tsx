import type { PosOrderStatus } from '../types'

const labels: Record<PosOrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready_out: 'Ready / Out',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export function statusLabel(status: PosOrderStatus) {
  return labels[status]
}

export function StatusBadge({ status }: { status: PosOrderStatus }) {
  return (
    <span
      data-status-badge
      className="inline-flex rounded-sm px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]"
      style={{
        background: 'var(--pos-chip)',
        color: status === 'cancelled' ? 'var(--pos-danger)' : 'var(--pos-ink)',
        border: '1px solid var(--pos-line)',
      }}
    >
      {labels[status]}
    </span>
  )
}
