import { BloomImage } from '../components/ui/BloomImage'
import { Button } from '../components/ui/Button'
import { brand } from '../data/catalog'
import { images } from '../lib/images'

export function AboutPage() {
  return (
    <div>
      <section className="grid lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-16">
          <p className="text-[11px] uppercase tracking-[0.28em] text-rose">The atelier</p>
          <h1 className="mt-3 font-display text-5xl leading-tight sm:text-6xl">A quiet studio for generous flowers.</h1>
          <p className="mt-6 max-w-md text-muted">
            Bloom & Co. is a fictional Makati floral studio created to show how a boutique flower shop can take orders
            online — without losing the feeling of walking up to the counter.
          </p>
        </div>
        <BloomImage src={images.about} alt="Pastel garden roses" className="min-h-[420px]" eager />
      </section>

      <section className="mx-auto max-w-5xl px-5 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl">How we work</h2>
            <p className="mt-5 leading-relaxed text-muted">
              Arrangements are composed the morning they leave. We buy as if we were filling a house, not a warehouse:
              fewer stems, better ones, wrapped so they still look considered when they arrive.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              This website is a client demonstration by Salora Tech Solutions. Names, prices, photographs, and payment
              details are for exhibition only.
            </p>
          </div>
          <div className="border border-line bg-paper p-8">
            <p className="text-[11px] uppercase tracking-[0.22em] text-rose">Visit</p>
            <p className="mt-4 font-display text-3xl">{brand.address}</p>
            <div className="mt-6 space-y-1 text-sm text-muted">
              {brand.hours.map((item) => (
                <p key={item.days}>
                  {item.days}: {item.time}
                </p>
              ))}
            </div>
            <p className="mt-6 text-sm">{brand.phone}</p>
            <p className="text-sm">{brand.email}</p>
            <div className="mt-8">
              <Button href="/contact">Get in touch</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-2">
        <BloomImage src={images.studio} alt="Wrapped bouquet in the studio" className="min-h-[380px]" />
        <div className="flex flex-col justify-center bg-cream px-6 py-16 sm:px-12">
          <h2 className="font-display text-4xl">What this prototype shows</h2>
          <ul className="mt-6 space-y-3 text-muted">
            <li>A public shop with search, filters, and product pages</li>
            <li>A working cart, checkout, and manual payment flow</li>
            <li>Order confirmation, tracking, and a downloadable summary</li>
            <li>A studio admin for products and order status</li>
          </ul>
          <div className="mt-8">
            <Button href="/shop" variant="secondary">
              Browse the collection
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
