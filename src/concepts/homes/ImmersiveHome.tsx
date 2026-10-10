import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../../components/product/ProductCard'
import { Button } from '../../components/ui/Button'
import { BloomImage } from '../../components/ui/BloomImage'
import { useShop } from '../../context/ShopContext'
import type { OccasionSlug } from '../../types'
import { useConcept } from '../ConceptProvider'
import { ConceptUsps } from '../components/ConceptUsps'
import { Reveal } from '../components/Reveal'
import { moodFilters } from './shared'

type MoodId = (typeof moodFilters)[number]['id']

/** NOVA BLOOMS — dark hero, mood filter on real occasion data, layered cards, discovery. */
export function ImmersiveHome() {
  const { concept } = useConcept()
  const { products } = useShop()
  const [moodId, setMoodId] = useState<MoodId>('romantic')

  const activeMood = moodFilters.find((m) => m.id === moodId) ?? moodFilters[0]
  const occasion = activeMood.occasion as OccasionSlug

  const filteredBestsellers = useMemo(
    () => products.filter((p) => p.bestSeller && p.occasions.includes(occasion)).slice(0, 6),
    [products, occasion],
  )

  const discoveryPicks = useMemo(
    () => products.filter((p) => p.occasions.includes(occasion) && p.available).slice(0, 3),
    [products, occasion],
  )

  const fallbackGrid = useMemo(
    () => (filteredBestsellers.length > 0 ? filteredBestsellers : products.filter((p) => p.bestSeller).slice(0, 6)),
    [filteredBestsellers, products],
  )

  return (
    <div className="bg-ivory text-ink">
      {/* Dark immersive hero */}
      <section className="relative isolate min-h-[85svh] overflow-hidden">
        <BloomImage
          src={concept.heroImage}
          alt="Neon-lit futuristic bouquet"
          className="absolute inset-0 h-full w-full"
          imgClassName="object-cover opacity-80"
          eager
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#070b16]/70 via-[#1a1540]/45 to-ivory"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-x-0 top-1/3 h-40 bg-gradient-to-r from-rose/20 via-accent/25 to-transparent blur-3xl" aria-hidden />
        <div className="relative z-10 flex min-h-[85svh] flex-col items-center justify-center px-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-accent drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]">
            {concept.brand}
          </p>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-medium leading-tight text-photo-fg sm:text-6xl lg:text-7xl">
            {concept.tagline}
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-photo-fg/85">{concept.description}</p>
        </div>
      </section>
      <section className="relative z-20 px-6 pt-4 sm:px-10 lg:px-16">
        <ConceptUsps className="mb-2" />
      </section>

      {/* Interactive mood selector */}
      <section className="relative z-20 px-6 pb-4 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl rounded-sm border border-accent/30 bg-paper/80 p-4 shadow-[0_0_40px_rgba(34,211,238,0.12)] backdrop-blur-md sm:p-8">
          <p className="text-center text-[10px] uppercase tracking-[0.35em] text-muted">Set your mood</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Mood filter">
            {moodFilters.map((mood) => {
              const selected = mood.id === moodId
              return (
                <button
                  key={mood.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setMoodId(mood.id)}
                  className={`min-h-11 min-w-[44%] px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition sm:min-w-0 sm:px-5 sm:tracking-[0.22em] ${
                    selected
                      ? 'bg-accent text-on-accent'
                      : 'border border-line text-muted hover:border-accent hover:text-ink'
                  }`}
                >
                  {mood.label}
                </button>
              )
            })}
          </div>
          <p className="mt-4 text-center text-xs text-muted">
            Showing bestsellers for a <span className="text-accent">{activeMood.label.toLowerCase()}</span>{' '}
            moment — filtered by occasion in our catalog.
          </p>
        </div>
      </section>

      {/* Mood recommendations */}
      <section className="px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <Reveal>
          <h2 className="font-display text-2xl text-ink sm:text-3xl">Recommended for you</h2>
          <p className="mt-2 text-sm text-muted">Mood: {activeMood.label}</p>
        </Reveal>
        <ul className="mt-10 space-y-4">
          {fallbackGrid.slice(0, 3).map((product, i) => (
            <Reveal key={product.id} delayMs={i * 80}>
              <li>
                <Link
                  to={`/product/${product.id}`}
                  className="group flex gap-4 rounded-sm border border-line bg-paper p-4 shadow-[0_0_24px_rgba(34,211,238,0.08)] transition hover:border-accent"
                >
                  <div className="h-24 w-24 shrink-0 overflow-hidden">
                    <BloomImage src={product.images[0]} alt={product.name} className="h-full w-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg text-ink group-hover:text-accent">{product.name}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted">{product.shortDescription}</p>
                  </div>
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {fallbackGrid.map((product, i) => (
            <Reveal key={`grid-${product.id}`} delayMs={i * 50}>
              <div className="border border-line bg-paper p-2">
                <ProductCard product={product} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Discovery panel */}
      <section className="border-t border-line px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.35em] text-accent">Discovery</p>
            <h2 className="mt-4 font-display text-3xl text-ink">Explore more for this mood</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              These picks share the same occasion tag — switch moods anytime to see a different slice of the shop.
            </p>
            <div className="mt-8">
              <Button href={`/shop?occasion=${occasion}`} variant="light" size="md">
                Shop {activeMood.label.toLowerCase()} flowers
              </Button>
            </div>
          </Reveal>
          <ul className="space-y-4">
            {discoveryPicks.map((product, i) => (
              <Reveal key={product.id} delayMs={i * 60}>
                <li>
                  <Link
                    to={`/product/${product.id}`}
                    className="group flex items-center gap-4 border border-line bg-paper p-4 transition hover:border-accent"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden">
                      <BloomImage src={product.images[0]} alt={product.name} className="h-full w-full" />
                    </div>
                    <div>
                      <p className="font-medium text-ink group-hover:text-accent">{product.name}</p>
                      <p className="text-xs text-muted">{product.shortDescription}</p>
                    </div>
                  </Link>
                </li>
              </Reveal>
            ))}
            {discoveryPicks.length === 0 ? (
              <li className="text-sm text-muted">No additional items for this mood — try another selector above.</li>
            ) : null}
          </ul>
        </div>
      </section>
    </div>
  )
}
