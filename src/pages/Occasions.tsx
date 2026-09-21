import { Link } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { BloomImage } from '../components/ui/BloomImage'
import { Button } from '../components/ui/Button'
import { useShop } from '../context/ShopContext'
import { occasions } from '../data/content'

export function OccasionsPage() {
  const { products } = useShop()

  return (
    <div>
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <p className="text-[11px] uppercase tracking-[0.28em] text-rose">Collections</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] sm:text-6xl">
          Arrangements for the days you remember — and the ones you don’t plan.
        </h1>
        <p className="mt-5 max-w-lg text-muted">
          Seven starting points from the studio. Every bouquet can still be made personal.
        </p>
      </section>

      {occasions.map((occasion, index) => {
        const related = products.filter((product) => product.occasions.includes(occasion.slug)).slice(0, 3)
        const reverse = index % 2 === 1
        return (
          <section key={occasion.slug} className="border-t border-line">
            <div className={`grid lg:grid-cols-2 ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <BloomImage
                src={occasion.image}
                alt={occasion.label}
                className="min-h-[320px] sm:min-h-[400px] lg:min-h-[560px]"
              />
              <div className="flex flex-col justify-center px-6 py-14 sm:px-12 lg:px-16">
                <p className="text-[11px] uppercase tracking-[0.28em] text-rose">{occasion.eyebrow}</p>
                <h2 className="mt-3 font-display text-4xl sm:text-5xl">{occasion.label}</h2>
                <p className="mt-5 max-w-md leading-relaxed text-muted">{occasion.description}</p>
                <div className="mt-8">
                  <Button href={`/shop?occasion=${occasion.slug}`}>Shop {occasion.label}</Button>
                </div>
              </div>
            </div>
            {related.length ? (
              <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:pb-16">
                <div className="mb-8 flex items-end justify-between gap-4">
                  <h3 className="font-display text-2xl sm:text-3xl">From this collection</h3>
                  <Link
                    to={`/shop?occasion=${occasion.slug}`}
                    className="text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink"
                  >
                    View all
                  </Link>
                </div>
                <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        )
      })}
    </div>
  )
}
