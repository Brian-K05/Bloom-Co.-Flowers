import { Link } from 'react-router-dom'
import { ProductCard } from '../../components/product/ProductCard'
import { Button } from '../../components/ui/Button'
import { BloomImage } from '../../components/ui/BloomImage'
import { useShop } from '../../context/ShopContext'
import { useConcept } from '../ConceptProvider'
import { ConceptUsps } from '../components/ConceptUsps'
import { Reveal } from '../components/Reveal'

const flowerCategories = [
  { label: 'Roses', href: '/shop?category=roses', note: 'Classic stems' },
  { label: 'Bouquets', href: '/shop?category=bouquets', note: 'Hand-tied' },
  { label: 'Boxes', href: '/shop?category=boxes', note: 'Gift-ready' },
]

/** VERDANT — daylight hero, thin dividers, category row, calm grid, soft sustainability note. */
export function ScandinavianHome() {
  const { concept } = useConcept()
  const { products } = useShop()
  const featured = products.filter((p) => p.available).slice(0, 6)

  return (
    <div className="bg-paper">
      {/* Bright daylight hero */}
      <section className="px-6 pt-16 pb-20 sm:px-10 lg:px-16 lg:pt-24 lg:pb-32">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-sage">{concept.brand}</p>
          <h1 className="mt-6 max-w-2xl font-display text-4xl font-medium leading-[1.08] text-ink sm:text-5xl lg:text-6xl">
            {concept.tagline}
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted">{concept.description}</p>
          <div className="mt-10">
            <Button href="/shop" variant="primary" size="lg">
              Shop flowers
            </Button>
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-6xl overflow-hidden">
          <BloomImage
            src={concept.heroImage}
            alt="Bright bouquet in daylight by a window"
            className="aspect-[21/9] w-full"
            imgClassName="object-cover object-center"
            eager
          />
        </div>
        <div className="mx-auto mt-12 max-w-6xl">
          <ConceptUsps />
        </div>
      </section>

      <hr className="mx-6 border-line sm:mx-10 lg:mx-16" />

      {/* Flower-type category row */}
      <section className="px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <Reveal>
          <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted">Shop by type</h2>
        </Reveal>
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {flowerCategories.map((cat, i) => (
            <Reveal key={cat.label} delayMs={i * 40}>
              <li>
                <Link
                  to={cat.href}
                  className="group flex items-center justify-between gap-4 py-6 transition hover:bg-cream/50 sm:py-8"
                >
                  <div>
                    <span className="font-display text-2xl text-ink group-hover:text-sage sm:text-3xl">{cat.label}</span>
                    <span className="ml-4 text-sm text-muted">{cat.note}</span>
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-sage opacity-0 transition group-hover:opacity-100">
                    View →
                  </span>
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      <hr className="mx-6 border-line sm:mx-10 lg:mx-16" />

      {/* Clean product grid */}
      <section className="px-6 py-16 sm:px-10 lg:px-16 lg:py-28">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="font-display text-3xl text-ink sm:text-4xl">Available now</h2>
            <Link to="/shop" className="text-[11px] uppercase tracking-[0.2em] text-sage hover:underline">
              See all
            </Link>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product, i) => (
            <Reveal key={product.id} delayMs={i * 50}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Sustainability — soft wording, no claims */}
      <section className="mx-6 mb-8 border border-line bg-cream/40 px-8 py-14 sm:mx-10 lg:mx-16 lg:px-12 lg:py-20">
        <Reveal>
          <h2 className="font-display text-2xl text-ink sm:text-3xl">Thoughtful choices</h2>
          <div className="mt-8 max-w-2xl space-y-4 text-sm leading-relaxed text-muted">
            <p>
              We aim to source thoughtfully and reduce waste where we can — reusing packaging when possible and
              composting studio trimmings locally.
            </p>
            <p>
              Arrangements vary with season and availability; we will always note substitutions clearly before
              dispatch when needed.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Calm footer CTA */}
      <section className="border-t border-line px-6 py-20 text-center sm:px-10 lg:px-16 lg:py-28">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted">Need help choosing?</p>
          <p className="mx-auto mt-4 max-w-md font-display text-2xl text-ink sm:text-3xl">
            Simple flowers, clearly priced.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/shop" variant="secondary" size="lg">
              Browse shop
            </Button>
            <Button href="/contact" variant="ghost" size="lg">
              Contact us
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
