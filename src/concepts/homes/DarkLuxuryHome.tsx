import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../../components/product/ProductCard'
import { Button } from '../../components/ui/Button'
import { BloomImage } from '../../components/ui/BloomImage'
import { useShop } from '../../context/ShopContext'
import { useConcept } from '../ConceptProvider'
import { ConceptUsps } from '../components/ConceptUsps'
import { Reveal } from '../components/Reveal'
import { occasionLinks } from './shared'

export function DarkLuxuryHome() {
  const { concept } = useConcept()
  const { products } = useShop()
  const featured = products.filter((p) => p.bestSeller).slice(0, 3)

  return (
    <div className="bg-ivory text-ink">
      <section className="relative isolate min-h-[92svh] overflow-hidden">
        <BloomImage
          src={concept.heroImage}
          alt="Deep red roses in dramatic light"
          className="absolute inset-0 h-full w-full"
          imgClassName="object-cover opacity-55"
          eager
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ivory via-black/70 to-black/40" aria-hidden />
        <div className="relative z-10 flex min-h-[92svh] flex-col justify-end px-6 pb-16 pt-28 sm:px-10 lg:px-14">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.45em] text-photo-fg/70">Fleur Noir</p>
            <div className="mt-4 h-px w-16 bg-gold" aria-hidden />
            <h1 className="mt-6 max-w-2xl font-display text-4xl leading-[1.05] text-photo-fg sm:text-6xl lg:text-7xl">
              Cinematic blooms after dark
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-photo-fg/80 sm:text-base">
              Velvet roses, muted gold, and arrangements composed for evenings that deserve more than a last-minute
              gesture.
            </p>
            <div className="mt-9">
              <Button href="/shop" variant="light" size="lg">
                Enter the collection
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line px-6 py-12 sm:px-10 lg:px-14">
        <ConceptUsps />
      </section>

      <section className="border-t border-white/10 px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-gold">Featured</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl">The nocturne edit</h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted hover:text-gold"
            >
              Shop all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featured.map((product) => (
              <article
                key={product.id}
                className="group border border-white/15 bg-black/30 p-4 transition hover:border-gold/50"
              >
                <Link to={`/product/${product.id}`} className="block overflow-hidden">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <BloomImage
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full"
                      imgClassName="object-cover transition duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                </Link>
                <div className="mt-4 border-t border-white/10 pt-4">
                  <h3 className="font-display text-xl">
                    <Link to={`/product/${product.id}`} className="hover:text-gold">
                      {product.name}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">{product.shortDescription}</p>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="border-y border-white/10 bg-black/40 px-6 py-16 sm:px-10 lg:px-14">
        <Reveal className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-gold">Gift concierge</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">We help you send the right gesture</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Share the occasion, palette, and delivery window — we suggest stems, wrap, and timing so the arrival feels
              intentional, not improvised.
            </p>
            <Button href="/contact" variant="gold" size="md" className="mt-7">
              Request guidance
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {occasionLinks.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="group relative min-h-[140px] overflow-hidden border border-white/10"
              >
                <BloomImage
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full opacity-70"
                  imgClassName="object-cover transition group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50" />
                <span className="absolute inset-x-0 bottom-0 p-3 text-[10px] uppercase tracking-[0.2em] text-photo-fg">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="px-6 py-16 sm:px-10 lg:px-14">
        <Reveal>
          <h2 className="font-display text-2xl sm:text-3xl">More from the atelier</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {products
              .filter((p) => p.bestSeller)
              .slice(3, 5)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </Reveal>
      </section>

      <section className="border-t border-white/10 px-6 py-20 text-center sm:px-10">
        <Reveal>
          <div className="mx-auto h-px w-12 bg-gold" aria-hidden />
          <h2 className="mt-8 font-display text-3xl sm:text-4xl">Reserve your arrangement</h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted">
            Same-day options where available — choose delivery or studio pickup at checkout.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button href="/shop" variant="primary" size="lg">
              Shop roses &amp; more
            </Button>
            <Button href="/occasions" variant="secondary" size="lg">
              Browse occasions
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
