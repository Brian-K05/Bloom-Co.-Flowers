import { Check } from 'lucide-react'
import { orderStatusLabel, paymentStatusLabel } from '../../lib/format'
import type { Order } from '../../types'

type Step = {
  key: string
  label: string
  done: boolean
  current: boolean
}

export function OrderTimeline({ order }: { order: Order }) {
  const sequence = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'completed'] as const
  const statusIndex = sequence.indexOf(order.orderStatus === 'cancelled' ? 'pending' : order.orderStatus)
  const placed = true
  const paymentDone = ['submitted', 'verified', 'rejected'].includes(order.paymentStatus)
  const confirmed = statusIndex >= 1
  const preparing = statusIndex >= 2
  const out = statusIndex >= 3
  const completed = order.orderStatus === 'completed'

  const steps: Step[] = [
    { key: 'placed', label: 'Order Placed', done: placed, current: !paymentDone && !confirmed },
    {
      key: 'payment',
      label: `Payment ${paymentStatusLabel(order.paymentStatus)}`,
      done: paymentDone || order.paymentStatus === 'verified',
      current: paymentDone && !confirmed && order.paymentStatus !== 'verified' ? true : order.paymentStatus === 'submitted' && !confirmed,
    },
    { key: 'confirmed', label: 'Order Confirmed', done: confirmed, current: order.orderStatus === 'confirmed' },
    { key: 'preparing', label: 'Preparing', done: preparing, current: order.orderStatus === 'preparing' },
    {
      key: 'out',
      label: orderStatusLabel('out_for_delivery', order.fulfillment),
      done: out,
      current: order.orderStatus === 'out_for_delivery',
    },
    { key: 'completed', label: 'Completed', done: completed, current: completed },
  ]

  if (order.orderStatus === 'cancelled') {
    return (
      <div className="border border-line bg-paper px-6 py-5">
        <p className="text-[11px] uppercase tracking-[0.22em] text-rose">Order cancelled</p>
        <p className="mt-2 text-sm text-muted">This order was cancelled and will not be fulfilled.</p>
      </div>
    )
  }

  return (
    <ol className="space-y-0">
      {steps.map((step, index) => (
        <li key={step.key} className="flex gap-4">
          <div className="flex flex-col items-center">
            <span
              className={`grid h-8 w-8 place-items-center border ${
                step.done
                  ? 'border-sage bg-sage text-cream'
                  : step.current
                    ? 'border-rose bg-rose text-cream'
                    : 'border-line bg-paper text-muted'
              }`}
            >
              {step.done ? <Check size={14} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
            </span>
            {index < steps.length - 1 ? <span className="h-8 w-px bg-line" /> : null}
          </div>
          <div className="pb-6 pt-1">
            <p className={`text-sm ${step.current ? 'text-rose' : step.done ? 'text-ink' : 'text-muted'}`}>
              {step.label}
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}
