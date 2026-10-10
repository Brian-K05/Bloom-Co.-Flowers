import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../../components/product/ProductCard'
import { Button } from '../../components/ui/Button'
import { BloomImage } from '../../components/ui/BloomImage'
import { useShop } from '../../context/ShopContext'
import { images } from '../../lib/images'
import { benefits, categoryChips, moments, steps } from './shared'

/** Fresh retail: bold stacked hero, chip strip, horizontal moments, featured + grid. */
export function GardenHome() {
  const { products } = useShop()
  const bestsellers = products.filter((product) => product.bestSeller)
  const featured = bestsellers[0]
  const rest = bestsellers.slice(1, 5)

  return (
    <div>
      {/* Full-bleed hero — brand-forward, bottom CTA band */}
      <section className="relative isolate min-h-[88svh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <BloomImage
            src={images.garden}
            alt="Bright garden bouquet in daylight"
            className="h-full w-full"
            imgClassName="object-[center_40%]"
            eager
          />
        </div>
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              'linear-gradient(180deg, rgba(31,42,36,0.15) 0%, rgba(31,42,36,0.25) 45%, rgba(31,42,36,0.82) 100%)',
          }}
          aria-hidden
        />
        <div className="relative z-20 flex min-h-[88svh] flex-col justify-end px-5 pb-10 pt-28 sm:px-8 lg:px-12">
          <p className="text-[12px] font-medium uppercase tracking-[0.4em] text-paper">Bloom &amp; Co.</p>
          <h1 className="mt-3 max-w-3xl font-display text-[3.5rem] font-medium leading-[0.95] text-paper sm:text-6xl lg:text-7xl">
            Fresh flowers.
            <br />
            Easy ordering.
          </h1>
          <p className="mt-4 max-w-lg text-base text-paper/85 sm:text-lg">
            Contemporary arrangements for birthdays, love notes, and everyday brightening — delivered across Metro Manila.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href="/shop" variant="light" size="lg">
              Shop Now
            </Button>
            <Button href="/occasions" variant="secondary" size="lg" className="border-paper/40 text-paper hover:bg-paper hover:text-ink">
              Browse Occasions
            </Button>
          </div>
        </div>
      </section>

      {/* Retail category strip — unique to Garden */}
      <section className="border-b border-line bg-paper">
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-4 lg:justify-center lg:px-8">
          {categoryChips.map((chip) => (
            <Link
              key={chip.label}
              to={chip.href}
              className="shrink-0 border border-line bg-cream px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-ink transition-colors hover:border-sage hover:text-sage"
            >
              {chip.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Why — left headline + stacked list */}
      <section className="grid gap-10 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-12 lg:py-24">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-sage">Why order here</p>
          <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
            Built for quick, beautiful gifting.
          </h2>
        </div>
        <ul className="space-y-0 divide-y divide-line border-y border-line">
          {benefits.map((item, i) => (
            <li key={item.title} className="grid grid-cols-[auto_1fr] gap-5 py-6">
              <span className="font-display text-3xl text-sage/70">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="text-lg font-medium">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Moments — horizontal scroll panels */}
      <section className="bg-cream py-16 lg:py-20">
        <div className="mb-8 flex items-end justify-between px-5 lg:px-12">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-rose">Occasions</p>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl">Shop by moment</h2>
          </div>
          <Link
            to="/occasions"
            className="hidden items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted hover:text-ink sm:inline-flex"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="no-scrollbar flex gap-4 overflow-x-auto px-5 pb-2 lg:px-12">
          {moments.map((moment) => (
            <Link
              key={moment.title}
              to={moment.href}
              className="group relative h-[420px] w-[280px] shrink-0 overflow-hidden sm:h-[480px] sm:w-[320px]"
            >
              <BloomImage
                src={moment.image}
                alt={moment.title}
                className="absolute inset-0 h-full w-full"
                imgClassName="transition duration-500 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-2xl text-paper">{moment.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-paper/75">{moment.body}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured product + compact grid */}
      <section className="px-5 py-16 lg:px-12 lg:py-24">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-rose">Bestsellers</p>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl">What people order</h2>
          </div>
          <Button href="/shop" variant="secondary">
            Shop the collection
          </Button>
        </div>
        {featured ? (
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
            <div className="border-b border-line pb-8 lg:border-b-0 lg:pb-0">
              <ProductCard product={featured} />
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              {rest.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {/* Seasonal zigzag — image right on desktop */}
      <section className="grid bg-blush/40 lg:grid-cols-2">
        <div className="order-2 flex flex-col justify-center px-6 py-14 sm:px-10 lg:order-1 lg:px-14 lg:py-20">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-rose">This season</p>
          <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">Valentine’s picks</h2>
          <p className="mt-4 max-w-md text-muted">
            Reds, blush, and gift boxes ready for February — or anytime you want to say it plainly.
          </p>
          <div className="mt-7">
            <Button href="/shop?occasion=valentines">Shop Valentine’s</Button>
          </div>
        </div>
        <BloomImage
          src={images.ruby}
          alt="Seasonal red blooms"
          className="order-1 min-h-[320px] lg:order-2 lg:min-h-full"
        />
      </section>

      {/* Steps — numbered row with sage markers */}
      <section className="px-5 py-16 lg:px-12 lg:py-24">
        <h2 className="max-w-xl font-display text-4xl sm:text-5xl">Four steps from browse to bouquet</h2>
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li key={step.n} className="border-t-2 border-sage pt-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-sage">{step.n}</p>
              <h3 className="mt-2 text-lg font-medium">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Solid-color closing CTA — no photo overlay */}
      <section className="bg-sage px-5 py-20 text-center text-paper lg:px-12">
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-paper/70">Ready when you are</p>
        <h2 className="mx-auto mt-4 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
          Send flowers today.
        </h2>
        <div className="mt-8">
          <Button href="/shop" variant="light" size="lg">
            Start shopping
          </Button>
        </div>
      </section>
    </div>
  )
}
