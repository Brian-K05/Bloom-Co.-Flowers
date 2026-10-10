import { Link } from 'react-router-dom'
import { ProductCard } from '../../components/product/ProductCard'
import { Button } from '../../components/ui/Button'
import { BloomImage } from '../../components/ui/BloomImage'
import { useShop } from '../../context/ShopContext'
import { useConcept } from '../ConceptProvider'
import { ConceptUsps } from '../components/ConceptUsps'
import { Reveal } from '../components/Reveal'
import { occasionLinks } from './shared'

export function ModernBoldHome() {
  const { concept } = useConcept()
  const { products } = useShop()
  const grid = products.filter((p) => p.bestSeller).slice(0, 6)

  return (
    <div className="bg-paper text-ink">
      <section className="relative overflow-hidden px-4 pb-16 pt-24 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute right-0 top-20 h-40 w-40 bg-rose/30 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute left-10 top-40 h-24 w-24 bg-gold/40 blur-2xl" aria-hidden />
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <Reveal className="relative z-20 lg:col-span-7 lg:pb-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-rose">PETAL</p>
            <h1 className="mt-2 font-display text-[15vw] font-bold uppercase leading-[0.85] tracking-tighter sm:text-[10vw] lg:text-[7rem]">
              BLOOM
              <span className="block text-rose">HARD</span>
            </h1>
            <p className="mt-6 max-w-sm text-sm font-medium uppercase tracking-wide text-muted">
              Fashion-forward florals — same-day where available.
            </p>
            <Button href="/shop" variant="primary" size="lg" className="mt-8 bg-rose border-rose hover:bg-rose-deep">
              Shop now
            </Button>
          </Reveal>
          <div className="relative z-10 lg:col-span-5 lg:-ml-16 lg:mt-12">
            <BloomImage
              src={concept.heroImage}
              alt="Bold saturated florals on black"
              className="aspect-[3/4] w-full max-lg:max-h-[420px] border-4 border-ink"
              imgClassName="object-cover"
              eager
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-paper via-transparent to-transparent lg:hidden"
              aria-hidden
            />
          </div>
        </div>
      </section>
      <section className="border-y-2 border-ink px-4 py-8 sm:px-8">
        <ConceptUsps layout="row" />
      </section>

      <section className="border-y-2 border-ink px-4 py-10 sm:px-8 lg:px-12">
        <Reveal>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.4em]">Occasions</h2>
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-4 lg:gap-3">
            {occasionLinks.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="group relative min-h-[160px] overflow-hidden border-2 border-ink bg-ink sm:min-h-[200px]"
              >
                <BloomImage
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full opacity-80"
                  imgClassName="object-cover transition group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 bg-rose px-2 py-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-on-accent">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: 'Roses', href: '/shop?category=roses' },
              { label: 'Bouquets', href: '/shop?category=bouquets' },
              { label: 'Boxes', href: '/shop?category=boxes' },
              { label: 'All', href: '/shop' },
            ].map((chip) => (
              <Link
                key={chip.label}
                to={chip.href}
                className="border-2 border-ink py-3 text-center text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-ink hover:text-paper"
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="px-4 py-14 sm:px-8 lg:px-12">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="font-display text-4xl font-bold uppercase sm:text-5xl">The drop</h2>
            <Link to="/shop" className="text-[11px] font-bold uppercase tracking-[0.3em] text-rose hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-6">
            {grid.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Reveal>
      </section>

      <section className="mx-4 mb-16 border-4 border-rose bg-cream px-6 py-12 text-ink sm:mx-8 lg:mx-12">
        <Reveal className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-rose">Limited run</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-none text-ink sm:text-5xl">
              Electric pink edit — live now
            </h2>
            <p className="mt-4 max-w-md text-sm text-muted">
              High-contrast stems and wrap options built for photos that pop. When they&apos;re gone, they&apos;re gone.
            </p>
          </div>
          <Button href="/shop?occasion=valentines" variant="primary" size="lg" className="shrink-0">
            Grab yours
          </Button>
        </Reveal>
      </section>

      <section className="border-t-2 border-ink px-4 py-12 text-center sm:px-8">
        <Reveal>
          <Button href="/occasions" variant="secondary" size="lg" className="border-2 border-ink font-bold">
            Explore occasions
          </Button>
        </Reveal>
      </section>
    </div>
  )
}
