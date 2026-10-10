import { Link } from 'react-router-dom'
import { ProductCard } from '../../components/product/ProductCard'
import { Button } from '../../components/ui/Button'
import { BloomImage } from '../../components/ui/BloomImage'
import { useShop } from '../../context/ShopContext'
import { useConcept } from '../ConceptProvider'
import { ConceptUsps } from '../components/ConceptUsps'
import { Reveal } from '../components/Reveal'
import { occasionLinks, usps } from './shared'

export function ElegantMinimalHome() {
  const { concept } = useConcept()
  const { products } = useShop()
  const bestsellers = products.filter((p) => p.bestSeller).slice(0, 6)

  return (
    <div className="bg-ivory text-ink">
      <section className="grid min-h-[min(92svh,820px)] lg:grid-cols-2">
        <Reveal className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted">Petal &amp; Bloom</p>
          <h1 className="mt-4 font-display text-4xl font-medium leading-[1.05] sm:text-5xl lg:text-[3.25rem]">
            {concept.tagline}
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted sm:text-base">
            Quiet arrangements for love, milestones, and the everyday — composed simply, delivered with care across Metro
            Manila.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/shop" variant="secondary" size="lg">
              Shop collection
            </Button>
            <Button href="/about" variant="ghost" size="lg">
              Our story
            </Button>
          </div>
        </Reveal>
        <div className="relative min-h-[320px] lg:min-h-full">
          <BloomImage
            src={concept.heroImage}
            alt="Soft ivory bouquet in glass vase"
            className="absolute inset-0 h-full w-full"
            imgClassName="object-cover"
            eager
          />
        </div>
      </section>

      <section className="border-b border-line/60 bg-paper px-6 py-10 sm:px-10 lg:px-14">
        <ConceptUsps />
      </section>

      <section className="border-y border-line/60 bg-paper px-6 py-14 sm:px-10 lg:px-14">
        <Reveal>
          <p className="text-center text-[11px] uppercase tracking-[0.28em] text-muted">Shop by occasion</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6">
            {occasionLinks.map((item, i) => (
              <Link
                key={item.title}
                to={item.href}
                className="group flex flex-col items-center gap-3"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                <span className="relative h-20 w-20 overflow-hidden rounded-full border border-line bg-cream sm:h-24 sm:w-24">
                  <BloomImage
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full"
                    imgClassName="object-cover transition duration-500 group-hover:scale-105"
                  />
                </span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-ink group-hover:text-sage">{item.title}</span>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-muted">Bestsellers</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl">Arrangements we return to</h2>
            </div>
            <Link to="/shop" className="text-[11px] uppercase tracking-[0.2em] text-muted hover:text-ink">
              View all
            </Link>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Reveal>
      </section>

      <section className="bg-cream px-6 py-16 sm:px-10 lg:px-14 lg:py-20">
        <Reveal className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-sage">The studio</p>
            <h2 className="mt-3 font-display text-3xl leading-snug sm:text-4xl">Flowers, without the noise</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              We compose each order the morning it leaves — fewer stems, better balance, and packaging that feels as
              considered as the note inside.
            </p>
            <Button href="/about" variant="ghost" size="md" className="mt-6">
              Read about us
            </Button>
          </div>
          <ul className="space-y-6 border-t border-line pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            {usps.map((item) => (
              <li key={item.title}>
                <h3 className="text-sm font-medium">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="px-6 py-20 text-center sm:px-10">
        <Reveal>
          <p className="font-display text-2xl text-ink sm:text-3xl">Ready when you are.</p>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">Browse the shop or start with an occasion.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/shop" variant="primary" size="lg">
              Shop now
            </Button>
            <Button href="/occasions" variant="secondary" size="lg">
              Occasions
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
