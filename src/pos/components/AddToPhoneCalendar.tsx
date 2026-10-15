import { useToast } from '../../context/ToastContext'
import {
  googleCalendarUrl,
  outlookCalendarUrl,
  shareOrDownloadOrderIcs,
} from '../lib/phoneCalendar'
import type { PosOrder } from '../types'

type Props = {
  order: PosOrder
  compact?: boolean
}

export function AddToPhoneCalendar({ order, compact }: Props) {
  const { notify } = useToast()

  async function onAppleOrPhone() {
    try {
      const mode = await shareOrDownloadOrderIcs(order)
      notify(
        mode === 'shared'
          ? 'Choose Calendar / Apple Calendar on your phone to save the reminder'
          : 'Downloaded .ics — open the file to add it to Apple, Samsung, or Outlook Calendar',
      )
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      notify('Could not export calendar file')
    }
  }

  if (compact) {
    return (
      <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
        <a className="underline" style={{ color: 'var(--pos-accent)' }} href={googleCalendarUrl(order)} target="_blank" rel="noreferrer">
          Google
        </a>
        <a className="underline" style={{ color: 'var(--pos-accent)' }} href={outlookCalendarUrl(order)} target="_blank" rel="noreferrer">
          Outlook
        </a>
        <button type="button" className="underline" style={{ color: 'var(--pos-accent)' }} onClick={() => void onAppleOrPhone()}>
          Apple / .ics
        </button>
      </div>
    )
  }

  return (
    <div className="pos-surface p-4">
      <p className="text-sm font-medium">Add to phone / laptop calendar</p>
      <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--pos-muted)' }}>
        Works on <strong>Android</strong>, <strong>iPhone</strong>, and <strong>laptops</strong>. Pick the calendar you
        use — events include a 12-hour reminder before the schedule day.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a className="pos-btn pos-btn-primary" href={googleCalendarUrl(order)} target="_blank" rel="noreferrer">
          Google Calendar
        </a>
        <a className="pos-btn pos-btn-secondary" href={outlookCalendarUrl(order)} target="_blank" rel="noreferrer">
          Outlook
        </a>
        <button type="button" className="pos-btn pos-btn-secondary" onClick={() => void onAppleOrPhone()}>
          Apple / Samsung / .ics
        </button>
      </div>
      <ul className="mt-3 list-disc space-y-1 pl-4 text-[11px]" style={{ color: 'var(--pos-muted)' }}>
        <li>
          <strong>Android:</strong> Google Calendar opens in the app or browser — tap Save.
        </li>
        <li>
          <strong>iPhone:</strong> use Apple / .ics, then Share → Calendar (or open the downloaded file).
        </li>
        <li>
          <strong>Laptop:</strong> Google or Outlook in the browser, or open the .ics in Outlook / Apple Calendar.
        </li>
      </ul>
    </div>
  )
}
