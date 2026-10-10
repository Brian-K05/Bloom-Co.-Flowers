import { Link } from 'react-router-dom'
import { ProductCard } from '../../components/product/ProductCard'
import { Button } from '../../components/ui/Button'
import { BloomImage } from '../../components/ui/BloomImage'
import { useShop } from '../../context/ShopContext'
import { useToast } from '../../context/ToastContext'
import { useConcept } from '../ConceptProvider'
import { ConceptUsps } from '../components/ConceptUsps'
import { Reveal } from '../components/Reveal'
import { moodFilters } from './shared'

const categoryPills = [
  { label: 'Roses', href: '/shop?category=roses', ring: 'border-rose' },
  { label: 'Bouquets', href: '/shop?category=bouquets', ring: 'border-sage' },
  { label: 'Boxes', href: '/shop?category=boxes', ring: 'border-gold' },
  { label: 'Birthday', href: '/shop?occasion=birthday', ring: 'border-[#f4a261]' },
  { label: 'Love', href: '/shop?occasion=valentines', ring: 'border-rose-deep' },
]

export function BrightPlayfulHome() {
  const { concept } = useConcept()
  const { products } = useShop()
  const { notify } = useToast()
  const picks = products.filter((p) => p.bestSeller).slice(0, 4)

  function handleNewsletter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    notify('Thanks — this demo signup is just for show.')
  }

  return (
    <div className="bg-cream text-ink">
      <section className="relative overflow-hidden px-6 pb-12 pt-24 sm:px-10 lg:px-14">
        <div className="absolute -right-20 top-10 h-64 w-64 rounded-full bg-rose/15 blur-3xl" aria-hidden />
        <div className="absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-sage/20 blur-3xl" aria-hidden />
        <Reveal className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-rose">Bloomy</p>
            <h1 className="mt-3 font-display text-4xl font-medium leading-tight sm:text-5xl lg:text-6xl">
              Happy flowers,
              <br />
              easy gifting
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base">
              Pastel petals, cheerful packaging, and occasions that feel like a party — ordered in minutes.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/shop" variant="primary" size="lg" className="rounded-full">
                Shop the joy
              </Button>
              <Button href="/occasions" variant="secondary" size="lg" className="rounded-full">
                Pick an occasion
              </Button>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] border-4 border-paper shadow-[0_20px_50px_rgba(240,106,138,0.25)]">
            <BloomImage
              src={concept.heroImage}
              alt="Smiling woman holding a bright bouquet"
              className="aspect-[3/4] w-full max-h-[520px]"
              imgClassName="object-cover object-top"
              eager
            />
            <div className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-gold/50 blur-2xl" aria-hidden />
          </div>
        </Reveal>
      </section>

      <section className="px-6 pb-4 sm:px-10 lg:px-14">
        <ConceptUsps layout="row" className="mb-8" />
        <Reveal>
          <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
            {categoryPills.map((pill) => (
              <Link
                key={pill.label}
                to={pill.href}
                className={`shrink-0 rounded-full border-2 bg-paper px-5 py-2.5 text-[12px] font-medium uppercase tracking-wide transition hover:-translate-y-0.5 ${pill.ring}`}
              >
                {pill.label}
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="px-6 py-14 sm:px-10 lg:px-14">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-4xl">Customer favorites</h2>
          <p className="mt-2 text-sm text-muted">Rounded, colorful, ready to gift.</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {picks.map((product) => (
              <div key={product.id} className="overflow-hidden rounded-3xl border-2 border-line/80 bg-paper p-3 shadow-sm">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="mx-6 mb-14 overflow-hidden rounded-3xl bg-rose text-on-accent sm:mx-10 lg:mx-14">
        <Reveal className="grid items-center gap-6 px-8 py-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-on-accent/80">This week</p>
            <h2 className="mt-2 font-display text-3xl text-on-accent sm:text-4xl">
              Birthday bundles ship with a free note card
            </h2>
            <p className="mt-3 text-sm text-on-accent/90">Add your message at checkout — we handwrite every one.</p>
          </div>
          <div className="flex justify-start lg:justify-end">
            <Button href="/shop?occasion=birthday" variant="light" size="lg" className="rounded-full">
              Shop birthday
            </Button>
          </div>
        </Reveal>
      </section>

      <section className="border-t border-line bg-paper px-6 py-16 sm:px-10 lg:px-14">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted">Stay in the loop</p>
          <h2 className="mt-2 font-display text-3xl">Get cheerful drops in your inbox</h2>
          <p className="mt-3 text-sm text-muted">New stems, seasonal wraps — no spam, just blooms.</p>
          <form onSubmit={handleNewsletter} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <input
              type="email"
              name="email"
              required
              placeholder="you@email.com"
              className="min-h-12 flex-1 rounded-full border border-line bg-cream px-5 text-sm outline-none focus:border-rose"
            />
            <Button type="submit" variant="primary" size="lg" className="rounded-full sm:shrink-0">
              Join the list
            </Button>
          </form>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {moodFilters.map((m) => (
              <Link
                key={m.id}
                to={`/shop?occasion=${m.occasion}`}
                className="rounded-full bg-cream px-4 py-1.5 text-[11px] uppercase tracking-wide text-muted hover:text-rose"
              >
                {m.label}
              </Link>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  )
}
