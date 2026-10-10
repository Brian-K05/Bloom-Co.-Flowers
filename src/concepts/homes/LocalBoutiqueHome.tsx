import { Link } from 'react-router-dom'
import { ProductCard } from '../../components/product/ProductCard'
import { Button } from '../../components/ui/Button'
import { BloomImage } from '../../components/ui/BloomImage'
import { brand } from '../../data/catalog'
import { useShop } from '../../context/ShopContext'
import { images } from '../../lib/images'
import { useConcept } from '../ConceptProvider'
import { ConceptUsps } from '../components/ConceptUsps'
import { Reveal } from '../components/Reveal'
import { usps } from './shared'

const localOccasions = [
  { label: 'Birthday', href: '/shop?occasion=birthday', image: images.birthday },
  { label: 'Anniversary', href: '/shop?occasion=anniversary', image: images.anniversary },
  { label: 'Valentine’s', href: '/shop?occasion=valentines', image: images.valentines },
  { label: 'Just Because', href: '/shop?occasion=just-because', image: images.justBecause },
  { label: 'Graduation', href: '/shop?occasion=graduation', image: images.graduation },
]

/** Sariwa Blooms — warm hero, local occasions, PHP cards, delivery note, florist story. */
export function LocalBoutiqueHome() {
  const { concept } = useConcept()
  const { products } = useShop()
  const picks = products.filter((p) => p.available && p.bestSeller).slice(0, 4)
  const more = products.filter((p) => p.available).slice(0, 8)

  return (
    <div className="bg-cream">
      {/* Warm lifestyle hero */}
      <section className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[50svh] lg:min-h-[75svh]">
            <BloomImage
              src={concept.heroImage}
              alt="Filipina florist arranging flowers in a warm studio"
              className="absolute inset-0 h-full w-full"
              imgClassName="object-cover object-top"
              eager
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cream via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-cream/90" />
          </div>
          <div className="flex flex-col justify-center px-6 py-14 sm:px-10 lg:px-14 lg:py-20">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-sage">{concept.brand}</p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-ink sm:text-5xl">{concept.tagline}</h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
              Mabuhay — welcome to our studio. Fresh arrangements for every Filipino celebration, priced clearly in
              pesos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/shop" variant="primary" size="lg">
                Order flowers
              </Button>
              <Button href="/about" variant="secondary" size="lg">
                Our story
              </Button>
            </div>
            <div className="mt-10">
              <ConceptUsps />
            </div>
          </div>
        </div>
      </section>

      {/* Local occasion categories */}
      <section className="border-y border-line bg-paper px-6 py-14 sm:px-10 lg:px-14 lg:py-20">
        <Reveal>
          <h2 className="font-display text-2xl text-ink sm:text-3xl">Ano ang okasyon?</h2>
          <p className="mt-2 text-sm text-muted">Pick a moment — we will show arrangements that fit.</p>
        </Reveal>
        <div className="no-scrollbar mt-10 flex gap-4 overflow-x-auto pb-2">
          {localOccasions.map((occ, i) => (
            <Reveal key={occ.label} delayMs={i * 50} className="shrink-0">
              <Link to={occ.href} className="group block w-[140px] sm:w-[160px]">
                <div className="relative aspect-square overflow-hidden rounded-sm border border-line">
                  <BloomImage
                    src={occ.image}
                    alt={occ.label}
                    className="h-full w-full"
                    imgClassName="transition group-hover:scale-[1.05]"
                  />
                </div>
                <p className="mt-3 text-center text-sm font-medium text-ink group-hover:text-sage">{occ.label}</p>
              </Link>
            </Reveal>
          ))}
          <Reveal delayMs={250} className="shrink-0 self-center">
            <Link
              to="/occasions"
              className="flex h-[140px] w-[140px] items-center justify-center rounded-sm border border-dashed border-line text-center text-[11px] uppercase tracking-[0.16em] text-muted hover:border-sage hover:text-sage sm:h-[160px] sm:w-[160px]"
            >
              All occasions
            </Link>
          </Reveal>
        </div>
      </section>

      {/* PHP product grid via ProductCard */}
      <section className="px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl text-ink">Customer favorites</h2>
              <p className="mt-2 text-sm text-muted">Prices in PHP — add to cart anytime.</p>
            </div>
            <Link to="/shop" className="text-[11px] uppercase tracking-[0.2em] text-sage hover:underline">
              Full shop
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {(picks.length ? picks : more.slice(0, 4)).map((product, i) => (
            <Reveal key={product.id} delayMs={i * 60}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Delivery info — brand same-day note style */}
      <section className="mx-6 border border-line bg-paper px-8 py-12 sm:mx-10 lg:mx-14 lg:px-12 lg:py-16">
        <Reveal>
          <h2 className="font-display text-2xl text-ink">Delivery &amp; pickup</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{brand.sameDayNote}.</p>
          <p className="mt-3 text-sm text-muted">
            Studio: {brand.address}. Hours: {brand.hours[0].days} {brand.hours[0].time}.
          </p>
          <ul className="mt-8 grid gap-6 sm:grid-cols-3">
            {usps.map((item) => (
              <li key={item.title}>
                <p className="text-sm font-medium text-ink">{item.title}</p>
                <p className="mt-1 text-sm text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Florist story */}
      <section className="grid gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-14 lg:py-24">
        <Reveal>
          <BloomImage
            src={images.studio}
            alt="Hands arranging a bouquet"
            className="aspect-[4/3] w-full"
            imgClassName="object-cover"
          />
        </Reveal>
        <Reveal delayMs={80}>
          <p className="text-[11px] uppercase tracking-[0.28em] text-sage">From our florists</p>
          <h2 className="mt-3 font-display text-3xl text-ink">Small studio, big heart</h2>
          <p className="mt-5 text-sm leading-relaxed text-muted">
            {concept.brand} started as a neighborhood counter — same-day bundles for last-minute gifts and carefully
            planned installs for milestones. We still wrap every stem by hand and write your message on a card you can
            keep.
          </p>
          <p className="mt-4 text-sm text-muted">
            Questions? {brand.phone} · {brand.email}
          </p>
        </Reveal>
      </section>

      {/* Welcoming CTA */}
      <section className="border-t border-line bg-sage/10 px-6 py-16 text-center sm:px-10 lg:px-14 lg:py-24">
        <Reveal>
          <h2 className="font-display text-3xl text-ink sm:text-4xl">Handa na ang bulaklak mo</h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted">
            Browse the shop or tell us the occasion — we are happy to help you choose.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/shop" variant="primary" size="lg">
              Shop now
            </Button>
            <Button href="/contact" variant="secondary" size="lg">
              Message us
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
