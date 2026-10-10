import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { Button } from '../components/ui/Button'
import { BloomImage } from '../components/ui/BloomImage'
import { useShop } from '../context/ShopContext'
import { images } from '../lib/images'

const moments = [
  {
    title: 'Say I Love You',
    body: 'Roses and quiet romantics for the person you want to keep.',
    href: '/shop?occasion=valentines',
    image: images.valentines,
  },
  {
    title: 'Make Their Birthday Special',
    body: 'Bright, gift-ready arrangements that arrive looking like a celebration.',
    href: '/shop?occasion=birthday',
    image: images.birthday,
  },
  {
    title: 'Celebrate an Anniversary',
    body: 'Garden roses and peonies for the milestones that deserve more than a last-minute gesture.',
    href: '/shop?occasion=anniversary',
    image: images.anniversary,
  },
  {
    title: 'Just Because',
    body: 'The most important orders often have no occasion at all.',
    href: '/shop?occasion=just-because',
    image: images.justBecause,
  },
]

const benefits = [
  {
    title: 'Freshly Arranged',
    body: 'Composed the morning it leaves the studio — never waiting days in a cooler.',
  },
  {
    title: 'Easy Ordering',
    body: 'Choose your flowers, add a note, and set delivery or pickup in a few minutes.',
  },
  {
    title: 'Thoughtful Delivery',
    body: 'Timed Metro Manila delivery, with same-day options for selected areas.',
  },
]

const steps = [
  { n: '01', title: 'Choose Your Flowers', body: 'Browse the collection or start with an occasion.' },
  { n: '02', title: 'Add Delivery Details', body: 'Tell us where — and when — it should arrive.' },
  { n: '03', title: 'Choose Payment', body: 'Cash on delivery, or GCash, Maya, or bank transfer.' },
  { n: '04', title: 'Receive Your Order', body: 'We prepare, confirm, and place it in the right hands.' },
]

export function HomePage() {
  const { products } = useShop()
  const bestsellers = products.filter((product) => product.bestSeller).slice(0, 6)

  return (
    <div>
      {/* Editorial full-bleed hero — image + copy in one layer */}
      <section className="relative isolate min-h-[92svh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <BloomImage
            src={images.hero}
            alt="Hand-tied peach and cream bouquet"
            className="h-full w-full"
            imgClassName="object-[center_35%]"
            eager
          />
        </div>
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              'linear-gradient(90deg, rgba(42,39,36,0.78) 0%, rgba(42,39,36,0.5) 40%, rgba(42,39,36,0.18) 70%, rgba(42,39,36,0.05) 100%)',
          }}
          aria-hidden
        />
        <div className="relative z-20 flex min-h-[92svh] items-end px-5 pb-16 pt-28 sm:px-10 sm:pb-20 lg:items-center lg:px-16 lg:pb-24">
          <div className="max-w-xl" style={{ color: '#fffcf8' }}>
            <p className="text-[11px] uppercase tracking-[0.34em]" style={{ color: '#d4c0a1' }}>
              Bloom &amp; Co.
            </p>
            <h1 className="mt-4 font-display text-[3.25rem] font-medium leading-[0.92] sm:text-6xl lg:text-7xl">
              Flowers for Every Moment
            </h1>
            <p
              className="mt-5 max-w-md text-base leading-relaxed sm:text-lg"
              style={{ color: 'rgba(255,252,248,0.82)' }}
            >
              Thoughtfully arranged blooms for birthdays, anniversaries, celebrations, and the moments that matter most.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="/shop" variant="light" size="lg">
                Shop Flowers
              </Button>
              <Link
                to="/occasions"
                className="text-[11px] uppercase tracking-[0.22em] underline-offset-4 hover:underline"
                style={{ color: 'rgba(255,252,248,0.9)' }}
              >
                Explore Occasions
              </Link>
            </div>
            <p className="mt-8 text-sm" style={{ color: 'rgba(255,252,248,0.65)' }}>
              Same-day delivery available for selected areas in Metro Manila.
            </p>
          </div>
        </div>
      </section>

      {/* Brand introduction */}
      <section className="border-b border-line px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] uppercase tracking-[0.28em] text-rose">The atelier</p>
          <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
            Made for the moments that matter.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Bloom & Co. is a boutique floral studio arranging flowers for birthdays, anniversaries, celebrations, and
            everyday gestures — composed with care, wrapped with intention, and ready to send online.
          </p>
        </div>
      </section>

      {/* Shop by Moment */}
      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-rose">Start with feeling</p>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl">Shop by Moment</h2>
            </div>
            <Link
              to="/occasions"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted hover:text-ink"
            >
              All occasions <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {moments.map((moment) => (
              <Link
                key={moment.title}
                to={moment.href}
                className="group relative min-h-[340px] overflow-hidden sm:min-h-[400px]"
              >
                <BloomImage
                  src={moment.image}
                  alt={moment.title}
                  className="absolute inset-0 h-full w-full"
                  imgClassName="transition duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <h3 className="font-display text-3xl text-cream sm:text-4xl">{moment.title}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-cream/75">{moment.body}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-gold-soft">
                    Shop this moment <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="bg-cream px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-rose">From the studio</p>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl">Loved by Customers</h2>
              <p className="mt-3 max-w-md text-muted">
                Arrangements we wrap most often — familiar favorites, finished with care.
              </p>
            </div>
            <Button href="/shop" variant="ghost" className="self-start sm:self-auto">
              Shop all
            </Button>
          </div>
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal */}
      <section className="grid lg:grid-cols-2">
        <BloomImage
          src={images.ruby}
          alt="Deep red seasonal blooms"
          className="min-h-[380px] lg:min-h-[560px]"
        />
        <div className="flex flex-col justify-center bg-blush/70 px-6 py-16 sm:px-12 lg:px-16">
          <p className="text-[11px] uppercase tracking-[0.28em] text-rose">Seasonal</p>
          <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">Valentine’s Collection</h2>
          <p className="mt-5 max-w-md leading-relaxed text-muted">
            Classic reds, blush romantics, and flower boxes composed for February — and for the people you don’t wait for
            a holiday to celebrate.
          </p>
          <div className="mt-8">
            <Button href="/shop?occasion=valentines">Explore Valentine’s Flowers</Button>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-[11px] uppercase tracking-[0.28em] text-rose">Why Bloom & Co.</p>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl">Ordering, made considered</h2>
          <div className="mt-14 grid gap-10 border-t border-line pt-10 sm:grid-cols-3 sm:gap-8">
            {benefits.map((item) => (
              <div key={item.title} className="px-2">
                <h3 className="font-display text-2xl">{item.title}</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-line bg-cream px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.28em] text-rose">How it works</p>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl">From the cart to the door</h2>
          </div>
          <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, index) => (
              <li key={step.n} className="relative text-center lg:text-left">
                {index < steps.length - 1 ? (
                  <span className="pointer-events-none absolute left-[calc(50%+28px)] top-4 hidden h-px w-[calc(100%-40px)] bg-line lg:block" />
                ) : null}
                <p className="font-display text-2xl text-gold">{step.n}</p>
                <h3 className="mt-3 font-display text-xl sm:text-2xl">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-[220px] text-sm leading-relaxed text-muted lg:mx-0">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative min-h-[440px] sm:min-h-[520px]">
        <BloomImage src={images.cta} alt="Soft peony bloom" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-ink/50" />
        <div className="relative flex min-h-[440px] flex-col items-center justify-center px-6 text-center text-cream sm:min-h-[520px]">
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold-soft">Send something beautiful</p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
            A note, a bouquet, a moment remembered.
          </h2>
          <div className="mt-8">
            <Button href="/shop" variant="light">
              Shop the Collection
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
