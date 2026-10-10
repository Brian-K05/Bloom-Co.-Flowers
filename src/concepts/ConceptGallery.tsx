import { ArrowUpRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { BloomImage } from '../components/ui/BloomImage'
import { Button } from '../components/ui/Button'
import { useConcept } from './ConceptProvider'
import { concepts, type ConceptId } from './registry'

export function ConceptGalleryPage() {
  const { conceptId, setConcept } = useConcept()
  const navigate = useNavigate()

  return (
    <div className="bg-ivory">
      <section className="border-b border-line px-5 py-16 lg:px-10 lg:py-24">
        <p className="text-[11px] uppercase tracking-[0.32em] text-rose">Design showcase</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
          10 flower shop concepts
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Each direction is a full interactive homepage with its own layout, typography, motion, and shopping chrome —
          same catalog and cart underneath. Open a concept to explore the live site in that design system.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/" variant="primary">
            View active home
          </Button>
          <Button href="/shop" variant="secondary">
            Open shop
          </Button>
        </div>
      </section>

      <section className="px-5 py-12 lg:px-10 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {concepts.map((item) => {
            const active = conceptId === item.id
            return (
              <article
                key={item.id}
                className={`overflow-hidden border bg-paper transition-colors ${
                  active ? 'border-rose' : 'border-line'
                }`}
              >
                <Link
                  to={item.route}
                  onClick={() => setConcept(item.id as ConceptId)}
                  className="group block"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-image-wash">
                    <BloomImage
                      src={item.previewImage}
                      alt={`${item.name} preview`}
                      className="h-full w-full"
                      imgClassName="transition duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-photo-fg/70">
                        {item.number} · {item.mood}
                      </p>
                      <h2 className="mt-2 font-display text-3xl text-photo-fg">{item.brand}</h2>
                      <p className="mt-1 text-sm text-photo-fg/75">{item.name}</p>
                    </div>
                  </div>
                </Link>
                <div className="p-5">
                  <p className="text-sm leading-relaxed text-muted">{item.description}</p>
                  <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-muted">
                    Fonts · {item.fonts}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button
                      href={item.route}
                      size="sm"
                      onClick={() => setConcept(item.id as ConceptId)}
                    >
                      Open homepage
                    </Button>
                    <button
                      type="button"
                      onClick={() => {
                        setConcept(item.id as ConceptId)
                        navigate('/')
                      }}
                      className={`inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.16em] ${
                        active ? 'text-rose' : 'text-muted hover:text-ink'
                      }`}
                    >
                      {active ? 'Active on site' : 'Use on all pages'} <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
