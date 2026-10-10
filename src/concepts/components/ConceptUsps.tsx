import { Flower2, HeartHandshake, Sparkles, Truck } from 'lucide-react'
import { useConcept } from '../ConceptProvider'
import { usps } from '../homes/shared'
import type { ConceptId } from '../registry'

const icons = [Sparkles, Flower2, Truck, HeartHandshake]

const wrapByConcept: Record<ConceptId, string> = {
  'elegant-minimal': 'border border-line bg-paper text-sage',
  'dark-luxury': 'border border-gold/40 bg-paper text-gold',
  'bright-playful': 'rounded-2xl bg-blush text-rose shadow-[0_8px_24px_rgba(240,106,138,0.2)]',
  'rustic-warm': 'border border-line bg-cream text-sage rotate-[-1deg]',
  'modern-bold': 'border-2 border-ink bg-ink text-rose',
  'romantic-editorial': 'rounded-full bg-blush text-rose',
  'artistic-photographic': 'border border-line bg-paper text-gold',
  'scandinavian-nature': 'border border-line bg-paper text-sage',
  'interactive-immersive':
    'rounded-xl border border-accent/40 bg-paper/70 text-accent shadow-[0_0_24px_rgba(34,211,238,0.2)] backdrop-blur-md',
  'local-boutique': 'rounded-xl bg-blush text-sage',
}

type ConceptUspsProps = {
  className?: string
  layout?: 'row' | 'grid'
}

export function ConceptUsps({ className = '', layout = 'grid' }: ConceptUspsProps) {
  const { conceptId } = useConcept()
  const wrap = wrapByConcept[conceptId]
  const items = usps.slice(0, 3)

  return (
    <div
      className={`${
        layout === 'row' ? 'flex flex-wrap justify-center gap-4' : 'grid gap-4 sm:grid-cols-3'
      } ${className}`}
    >
      {items.map((item, index) => {
        const Icon = icons[index] ?? Sparkles
        return (
          <div key={item.title} className="flex items-start gap-3 sm:flex-col sm:items-center sm:text-center">
            <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center ${wrap}`}>
              <Icon size={20} strokeWidth={conceptId === 'bright-playful' ? 2.4 : 1.5} />
            </span>
            <div>
              <p className="text-sm font-medium text-ink">{item.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{item.body}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
