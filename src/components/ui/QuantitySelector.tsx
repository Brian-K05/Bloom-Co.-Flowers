import { Minus, Plus } from 'lucide-react'

type QuantitySelectorProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function QuantitySelector({ value, onChange, min = 1, max = 12 }: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center border border-line bg-paper">
      <button
        type="button"
        aria-label="Decrease quantity"
        className="grid h-11 w-11 place-items-center text-ink/70 hover:text-ink"
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus size={14} />
      </button>
      <span className="w-8 text-center text-sm tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        className="grid h-11 w-11 place-items-center text-ink/70 hover:text-ink"
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Plus size={14} />
      </button>
    </div>
  )
}
