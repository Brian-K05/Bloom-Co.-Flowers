import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../../components/product/ProductCard'
import { Button } from '../../components/ui/Button'
import { BloomImage } from '../../components/ui/BloomImage'
import { useShop } from '../../context/ShopContext'
import { images } from '../../lib/images'
import { moments, steps } from './shared'

/** Dramatic editorial: oversized type, asymmetric gallery, sparse vertical rhythm. */
export function NoirHome() {
  const { products } = useShop()
  const bestsellers = products.filter((product) => product.bestSeller).slice(0, 5)
  const [lead, ...gallery] = moments

  return (
    <div className="bg-ivory">
      {/* Fashion hero — centered oversized brand */}
      <section className="relative isolate min-h-[100svh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <BloomImage
            src={images.ruby}
            alt="Moody dark rose arrangement"
            className="h-full w-full"
            imgClassName="object-cover object-center opacity-70"
            eager
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/55 to-black/85" aria-hidden />
        <div className="relative z-20 flex min-h-[100svh] flex-col items-center justify-center px-5 text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-rose">Est. atelier</p>
          <h1 className="mt-6 font-display text-[18vw] font-medium leading-[0.85] tracking-[-0.03em] text-paper sm:text-[12vw] lg:text-[9rem]">
            Bloom
          </h1>
          <p className="mt-2 font-display text-2xl italic text-paper/70 sm:text-3xl">&amp; Co.</p>
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-paper/65">
            Flowers for Every Moment — composed like editorial stills, wrapped for the night they arrive.
          </p>
          <div className="mt-10">
            <Button href="/shop" variant="light" size="lg">
              Enter the collection
            </Button>
          </div>
        </div>
      </section>

      {/* Thin manifesto strip */}
      <section className="border-b border-line px-5 py-14 text-center lg:px-8">
        <p className="mx-auto max-w-2xl font-display text-2xl leading-snug text-ink sm:text-3xl">
          Sparse. Considered. Sent with intention.
        </p>
      </section>

      {/* Asymmetric moments magazine */}
      <section className="px-5 py-16 lg:px-10 lg:py-24">
        <div className="mb-10 flex items-baseline justify-between gap-4">
          <h2 className="font-display text-4xl sm:text-5xl">Moments</h2>
          <Link
            to="/occasions"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-muted hover:text-rose"
          >
            Index <ArrowRight size={12} />
          </Link>
        </div>
        {lead ? (
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-5">
            <Link to={lead.href} className="group relative min-h-[480px] overflow-hidden lg:col-span-7 lg:min-h-[640px]">
              <BloomImage
                src={lead.image}
                alt={lead.title}
                className="absolute inset-0 h-full w-full"
                imgClassName="transition duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 lg:p-10">
                <p className="text-[10px] uppercase tracking-[0.3em] text-rose">Featured</p>
                <h3 className="mt-2 font-display text-4xl text-paper lg:text-5xl">{lead.title}</h3>
                <p className="mt-3 max-w-md text-sm text-paper/70">{lead.body}</p>
              </div>
            </Link>
            <div className="flex flex-col gap-5 lg:col-span-5">
              {gallery.map((moment, index) => (
                <Link
                  key={moment.title}
                  to={moment.href}
                  className={`group relative overflow-hidden ${
                    index === 0 ? 'min-h-[280px] flex-1' : 'min-h-[200px] flex-1'
                  }`}
                >
                  <BloomImage
                    src={moment.image}
                    alt={moment.title}
                    className="absolute inset-0 h-full w-full"
                    imgClassName="transition duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-black/45 transition group-hover:bg-black/35" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-display text-2xl text-paper sm:text-3xl">{moment.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {/* Gallery product strip */}
      <section className="border-y border-line py-16 lg:py-20">
        <div className="mb-10 px-5 lg:px-10">
          <p className="text-[10px] uppercase tracking-[0.35em] text-rose">Selection</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">From the darkroom</h2>
        </div>
        <div className="no-scrollbar flex gap-6 overflow-x-auto px-5 pb-2 lg:gap-8 lg:px-10">
          {bestsellers.map((product) => (
            <div key={product.id} className="w-[260px] shrink-0 sm:w-[300px]">
              <ProductCard product={product} />
            </div>
          ))}
          <Link
            to="/shop"
            className="flex w-[200px] shrink-0 flex-col items-start justify-end border border-line p-6 transition-colors hover:border-rose"
          >
            <span className="font-display text-3xl">View all</span>
            <span className="mt-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-muted">
              Collection <ArrowRight size={12} />
            </span>
          </Link>
        </div>
      </section>

      {/* Full-bleed seasonal with type overlay */}
      <section className="relative min-h-[70svh] overflow-hidden">
        <BloomImage
          src={images.cta}
          alt="Soft bloom in low light"
          className="absolute inset-0 h-full w-full"
          imgClassName="opacity-60"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative flex min-h-[70svh] flex-col justify-end px-5 py-16 lg:px-16 lg:py-24">
          <p className="text-[10px] uppercase tracking-[0.4em] text-rose">Season</p>
          <h2 className="mt-4 max-w-xl font-display text-5xl leading-[0.95] text-paper sm:text-6xl lg:text-7xl">
            Valentine’s
            <br />
            Collection
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-paper/65">
            Deep reds and cream accents — arrangements that photograph like stills and arrive like a promise.
          </p>
          <div className="mt-8">
            <Button href="/shop?occasion=valentines" variant="light">
              View season
            </Button>
          </div>
        </div>
      </section>

      {/* Vertical timeline steps */}
      <section className="px-5 py-20 lg:px-16 lg:py-28">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-rose">Process</p>
            <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
              How an order moves.
            </h2>
          </div>
          <ol className="relative space-y-0 border-l border-line pl-8">
            {steps.map((step) => (
              <li key={step.n} className="relative pb-10 last:pb-0">
                <span className="absolute -left-[37px] top-1 h-2.5 w-2.5 rounded-full bg-rose" />
                <p className="text-[10px] uppercase tracking-[0.28em] text-muted">{step.n}</p>
                <h3 className="mt-2 font-display text-2xl">{step.title}</h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Minimal text close */}
      <section className="border-t border-line px-5 py-24 text-center lg:py-32">
        <h2 className="font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
          A bouquet.
          <br />
          A note.
          <br />
          <span className="italic text-rose">Remembered.</span>
        </h2>
        <div className="mt-10">
          <Button href="/shop" variant="secondary" size="lg">
            Shop Flowers
          </Button>
        </div>
      </section>
    </div>
  )
}
