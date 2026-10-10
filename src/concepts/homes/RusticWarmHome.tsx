import { Link } from 'react-router-dom'
import { ProductCard } from '../../components/product/ProductCard'
import { Button } from '../../components/ui/Button'
import { BloomImage } from '../../components/ui/BloomImage'
import { useShop } from '../../context/ShopContext'
import { images } from '../../lib/images'
import { useConcept } from '../ConceptProvider'
import { ConceptUsps } from '../components/ConceptUsps'
import { Reveal } from '../components/Reveal'
import { occasionLinks } from './shared'

const categories = [
  { title: 'Garden picks', href: '/shop?category=bouquets', image: images.garden },
  { title: 'Wild stems', href: '/shop?category=roses', image: images.botanical },
  { title: 'Gift boxes', href: '/shop?category=boxes', image: images.box },
  { title: 'Seasonal', href: '/shop', image: images.studio },
]

const processSteps = [
  { n: '01', title: 'Choose stems', body: 'Start with an occasion or wander the seasonal table.' },
  { n: '02', title: 'We compose', body: 'Hand-tied in the studio the morning your order goes out.' },
  { n: '03', title: 'Deliver with care', body: 'Metro Manila timing notes at checkout — pickup welcome too.' },
]

export function RusticWarmHome() {
  const { concept } = useConcept()
  const { products } = useShop()
  const featured = products.filter((p) => p.bestSeller).slice(0, 3)

  return (
    <div className="bg-[#f5f0e8] text-ink [background-image:radial-gradient(rgba(107,115,72,0.06)_1px,transparent_1px)] [background-size:18px_18px]">
      <section className="px-6 py-20 text-center sm:px-10 lg:px-14 lg:py-28">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.3em] text-sage">Willow &amp; Fern</p>
          <h1 className="mx-auto mt-4 max-w-2xl font-display text-4xl leading-snug sm:text-5xl lg:text-6xl">
            Handcrafted flowers, rooted in place
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
            Parchment-wrapped bouquets and studio-grown character — for neighbors, family tables, and slow Sundays.
          </p>
          <div className="mx-auto mt-10 max-w-3xl overflow-hidden border border-[#d4c9b8] bg-paper p-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6)]">
            <BloomImage
              src={concept.heroImage}
              alt="Handcrafted blooms in ceramic vase"
              className="aspect-[16/10] w-full"
              imgClassName="object-cover"
              eager
            />
          </div>
          <div className="mx-auto mt-10 max-w-3xl">
            <ConceptUsps />
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/shop" variant="primary" size="lg">
              Shop the market
            </Button>
            <Button href="/about" variant="secondary" size="lg">
              Meet the florists
            </Button>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-[#d4c9b8] px-6 py-14 sm:px-10 lg:px-14">
        <Reveal>
          <h2 className="text-center font-display text-3xl">From our table</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.title}
                to={cat.href}
                className="group border border-[#c4b5a0] bg-paper p-3 shadow-[2px_3px_0_#c4b5a0]"
              >
                <div className="overflow-hidden border border-[#e8dfd0]">
                  <BloomImage
                    src={cat.image}
                    alt={cat.title}
                    className="aspect-square w-full"
                    imgClassName="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-3 text-center text-sm font-medium">{cat.title}</p>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
        <Reveal className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-sage">Our story</p>
            <h2 className="mt-3 font-display text-3xl leading-snug sm:text-4xl">Small studio, honest stems</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              We favor texture over perfection — olive branches, garden roses, and wraps that look like they were folded
              on a kitchen table. Every order is composed here, not pulled from a warehouse shelf.
            </p>
            <Link to="/about" className="mt-5 inline-block text-sm font-medium text-sage underline-offset-4 hover:underline">
              Read the full story
            </Link>
          </div>
          <ol className="space-y-6">
            {processSteps.map((step) => (
              <li key={step.n} className="flex gap-5 border-b border-[#d4c9b8] pb-6">
                <span className="font-display text-2xl text-sage/80">{step.n}</span>
                <div>
                  <h3 className="font-medium">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section className="bg-paper px-6 py-14 sm:px-10 lg:px-14">
        <Reveal>
          <h2 className="font-display text-3xl">Studio favorites</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Reveal>
      </section>

      <section className="px-6 py-12 sm:px-10 lg:px-14">
        <Reveal className="flex flex-wrap justify-center gap-4">
          {occasionLinks.map((o) => (
            <Link
              key={o.title}
              to={o.href}
              className="border border-[#c4b5a0] bg-[#f5f0e8] px-4 py-2 text-[11px] uppercase tracking-[0.18em] hover:bg-sage hover:text-paper"
            >
              {o.title}
            </Link>
          ))}
        </Reveal>
      </section>

      <section className="border-t border-[#d4c9b8] bg-sage px-6 py-16 text-center text-paper sm:px-10">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-4xl">Order for pickup or delivery</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-paper/85">Earthy wraps, handwritten cards, and clear timing at checkout.</p>
          <Button href="/shop" variant="light" size="lg" className="mt-8">
            Start your order
          </Button>
        </Reveal>
      </section>
    </div>
  )
}
