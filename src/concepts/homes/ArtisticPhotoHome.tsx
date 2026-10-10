import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { BloomImage } from '../../components/ui/BloomImage'
import { useShop } from '../../context/ShopContext'
import { formatPHP } from '../../lib/format'
import { images } from '../../lib/images'
import { useConcept } from '../ConceptProvider'
import { ConceptUsps } from '../components/ConceptUsps'
import { Reveal } from '../components/Reveal'
import { occasionLinks } from './shared'

const masonryOccasions = [
  { ...occasionLinks[0], span: 'lg:col-span-2 lg:row-span-2', minH: 'min-h-[320px] lg:min-h-[520px]' },
  { ...occasionLinks[1], span: 'lg:col-span-1', minH: 'min-h-[240px] lg:min-h-[250px]' },
  { ...occasionLinks[2], span: 'lg:col-span-1', minH: 'min-h-[280px] lg:min-h-[250px]' },
  { ...occasionLinks[3], span: 'lg:col-span-2', minH: 'min-h-[220px] lg:min-h-[240px]' },
]

/** FLORA — macro hero, masonry occasions, horizontal bestseller gallery, sparse captions. */
export function ArtisticPhotoHome() {
  const { concept } = useConcept()
  const { products } = useShop()
  const bestsellers = products.filter((p) => p.bestSeller).slice(0, 8)

  return (
    <div className="bg-ivory text-ink">
      {/* Full-bleed macro hero */}
      <section className="relative isolate min-h-[92svh] overflow-hidden">
        <BloomImage
          src={concept.heroImage}
          alt="Macro floral detail"
          className="absolute inset-0 h-full w-full"
          imgClassName="object-cover object-center scale-105"
          eager
        />
        <div className="absolute inset-0 bg-black/35" aria-hidden />
        <div className="relative z-10 flex min-h-[92svh] flex-col justify-end px-6 pb-14 pt-28 sm:px-10 lg:px-16 lg:pb-20">
          <p className="text-[10px] uppercase tracking-[0.45em] text-photo-fg/80">{concept.brand}</p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-light leading-[0.95] text-photo-fg sm:text-6xl md:text-7xl lg:text-8xl">
            {concept.tagline}
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-photo-fg/80">{concept.description}</p>
        </div>
      </section>

      <section className="border-b border-line px-6 py-10 sm:px-10 lg:px-16">
        <ConceptUsps />
      </section>

      {/* Caption block */}
      <section className="border-b border-line px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <Reveal>
          <p className="max-w-3xl text-xs uppercase tracking-[0.35em] text-muted">Exhibition 01 — Living color</p>
          <p className="mt-8 max-w-2xl font-display text-2xl font-light leading-snug text-ink sm:text-3xl lg:text-4xl">
            Each arrangement is photographed like a still life — texture, shadow, and petal edge preserved.
          </p>
        </Reveal>
      </section>

      {/* Masonry occasion grid */}
      <section className="px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <Reveal>
          <h2 className="text-[10px] uppercase tracking-[0.4em] text-muted">Occasions</h2>
        </Reveal>
        <div className="mt-10 grid auto-rows-fr gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {masonryOccasions.map((item, i) => (
            <Reveal key={item.title} delayMs={i * 50} className={item.span}>
              <Link to={item.href} className={`group relative block overflow-hidden ${item.minH} ${item.span}`}>
                <BloomImage
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full"
                  imgClassName="transition duration-[1.2s] group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-black/40 transition group-hover:bg-black/25" />
                <div className="absolute inset-x-0 bottom-0 p-5 lg:p-7">
                  <p className="text-[9px] uppercase tracking-[0.35em] text-photo-fg/70">Series</p>
                  <h3 className="mt-1 font-display text-2xl font-light text-photo-fg lg:text-3xl">{item.title}</h3>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Horizontal bestseller gallery */}
      <section className="border-t border-line py-16 lg:py-24">
        <div className="mb-8 flex items-baseline justify-between gap-4 px-6 sm:px-10 lg:px-16">
          <h2 className="font-display text-3xl font-light text-ink sm:text-4xl">Bestsellers</h2>
          <Link to="/shop" className="text-[10px] uppercase tracking-[0.3em] text-muted hover:text-ink">
            Full catalog
          </Link>
        </div>
        <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 sm:px-10 lg:px-16">
          {bestsellers.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group w-[72vw] shrink-0 snap-start sm:w-[280px] lg:w-[320px]"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-image-wash">
                <BloomImage
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full"
                  imgClassName="transition duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-4 border-t border-line pt-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted">{formatPHP(product.price)}</p>
                <h3 className="mt-1 font-display text-xl font-light text-ink">{product.name}</h3>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">{product.shortDescription}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Second caption + sparse CTA */}
      <section className="grid border-t border-line lg:grid-cols-2">
        <div className="relative min-h-[360px] lg:min-h-[480px]">
          <BloomImage
            src={images.botanical}
            alt="Botanical study"
            className="absolute inset-0 h-full w-full"
            imgClassName="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center bg-cream px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.35em] text-muted">Studio note</p>
            <p className="mt-6 font-display text-2xl font-light leading-snug text-ink sm:text-3xl">
              We compose in natural light, then deliver — so what you see is what arrives.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Browse by occasion or explore the full shop. No urgency — just clarity.
            </p>
            <div className="mt-10">
              <Button href="/shop" variant="light" size="md">
                Enter shop
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
