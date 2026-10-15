import { googleCalendarUrl } from '../lib/phoneCalendar'
import type { PosOrder } from '../types'

type Props = {
  order: PosOrder
  compact?: boolean
}

export function AddToPhoneCalendar({ order, compact }: Props) {
  if (compact) {
    return (
      <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
        <a
          className="underline"
          style={{ color: 'var(--pos-accent)' }}
          href={googleCalendarUrl(order)}
          target="_blank"
          rel="noreferrer"
        >
          Google Calendar
        </a>
      </div>
    )
  }

  return (
    <div className="pos-surface p-4">
      <p className="text-sm font-medium">Add to Google Calendar</p>
      <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--pos-muted)' }}>
        Opens Google Calendar with this order’s schedule day and a 12-hour reminder. Works on Android, iPhone
        (with the Google Calendar app), and laptops.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a className="pos-btn pos-btn-primary" href={googleCalendarUrl(order)} target="_blank" rel="noreferrer">
          Google Calendar
        </a>
      </div>
    </div>
  )
}
