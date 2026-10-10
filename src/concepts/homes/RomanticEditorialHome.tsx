import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../../components/product/ProductCard'
import { Button } from '../../components/ui/Button'
import { BloomImage } from '../../components/ui/BloomImage'
import { useShop } from '../../context/ShopContext'
import { useConcept } from '../ConceptProvider'
import { ConceptUsps } from '../components/ConceptUsps'
import { Reveal } from '../components/Reveal'
import { occasionLinks } from './shared'

const occasionStories = [
  {
    title: 'For the one you adore',
    body: 'Velvet roses and whisper-soft petals — a love letter you can hold.',
    href: '/shop?occasion=valentines',
  },
  {
    title: 'Celebrate their day',
    body: 'Bright stems and joyful color, arranged to match their smile.',
    href: '/shop?occasion=birthday',
  },
  {
    title: 'Years together',
    body: 'Understated elegance for anniversaries that deserve a pause.',
    href: '/shop?occasion=anniversary',
  },
]

/** Le Fleur — blush split hero, occasion stories, soft grid, newsletter CTA. */
export function RomanticEditorialHome() {
  const { concept } = useConcept()
  const { products } = useShop()
  const bestsellers = products.filter((p) => p.bestSeller).slice(0, 6)
  const [email, setEmail] = useState('')

  function handleNewsletter(e: React.FormEvent) {
    e.preventDefault()
    setEmail('')
  }

  return (
    <div className="bg-[#fdf6f2]">
      {/* Split hero — peach panel + lifestyle photo */}
      <section className="grid min-h-[88svh] lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-rose/80">{concept.brand}</p>
          <h1 className="mt-5 font-display text-[2.75rem] font-normal italic leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
            Flowers that feel
            <br />
            like a love story
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
            {concept.tagline}. Soft palettes, hand-tied stems, and moments worth remembering — composed with care in
            Metro Manila.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/shop" variant="primary" size="lg">
              Shop the collection
            </Button>
            <Button href="/occasions" variant="secondary" size="lg">
              Browse occasions
            </Button>
          </div>
        </div>
        <div className="relative min-h-[50svh] lg:min-h-0">
          <BloomImage
            src={concept.heroImage}
            alt="Woman in a soft romantic setting with flowers"
            className="absolute inset-0 h-full w-full"
            imgClassName="object-cover object-center"
            eager
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#fdf6f2] via-transparent to-transparent lg:w-24"
            aria-hidden
          />
        </div>
      </section>

      <section className="border-t border-rose/15 px-6 py-10 sm:px-10 lg:px-14">
        <ConceptUsps />
      </section>

      {/* Occasion storytelling panels */}
      <section className="border-t border-rose/15 px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
        <Reveal>
          <p className="text-center text-[11px] uppercase tracking-[0.28em] text-muted">Every chapter</p>
          <h2 className="mt-3 text-center font-display text-3xl italic text-ink sm:text-4xl">Occasions, told softly</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {occasionStories.map((story, i) => (
            <Reveal key={story.title} delayMs={i * 80}>
              <Link
                to={story.href}
                className="group block rounded-sm border border-rose/20 bg-paper/60 p-8 transition hover:border-rose/40 hover:bg-paper"
              >
                <span className="font-display text-5xl italic text-rose/30">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-4 font-display text-2xl italic text-ink group-hover:text-rose">{story.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{story.body}</p>
                <span className="mt-5 inline-block text-[11px] uppercase tracking-[0.2em] text-rose">Discover →</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Visual occasion strip */}
      <section className="px-6 pb-8 sm:px-10 lg:px-14">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {occasionLinks.map((item) => (
            <Link key={item.title} to={item.href} className="group relative aspect-[4/5] overflow-hidden">
              <BloomImage
                src={item.image}
                alt={item.title}
                className="absolute inset-0 h-full w-full"
                imgClassName="transition duration-700 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              <p className="absolute inset-x-0 bottom-0 p-4 font-display text-lg italic text-paper">{item.title}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Soft product grid */}
      <section className="border-t border-rose/15 bg-paper/40 px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-muted">Curated for you</p>
              <h2 className="mt-2 font-display text-3xl italic text-ink sm:text-4xl">Beloved arrangements</h2>
            </div>
            <Link to="/shop" className="text-[11px] uppercase tracking-[0.2em] text-rose hover:underline">
              View all
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {bestsellers.map((product, i) => (
            <Reveal key={product.id} delayMs={i * 60}>
              <div className="rounded-sm bg-[#fdf6f2] p-3">
                <ProductCard product={product} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="mx-6 mb-16 border border-rose/25 bg-gradient-to-br from-[#fce8e0] to-[#fdf6f2] px-8 py-14 sm:mx-10 lg:mx-14 lg:px-16 lg:py-20">
        <Reveal>
          <div className="mx-auto max-w-xl text-center">
            <p className="font-display text-2xl italic text-ink sm:text-3xl">Notes from the atelier</p>
            <p className="mt-3 text-sm text-muted">
              Seasonal inspiration and gentle reminders — no spam, just blooms.
            </p>
            <form onSubmit={handleNewsletter} className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="min-h-12 flex-1 border border-rose/30 bg-paper/80 px-4 text-sm text-ink placeholder:text-muted focus:border-rose focus:outline-none sm:max-w-xs"
                aria-label="Email for newsletter"
              />
              <Button type="submit" variant="primary" size="lg">
                Join the list
              </Button>
            </form>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
