import { Link } from 'react-router-dom'
import { ProductCard } from '../../components/product/ProductCard'
import { ProductGrid } from '../../components/product/ProductGrid'
import { BloomImage } from '../../components/ui/BloomImage'
import { formatPHP } from '../../lib/format'
import { useConcept } from '../ConceptProvider'
import { FilterControls, PriceMeter } from './FilterControls'
import { useShopCatalog, type ShopCatalog } from './useShopCatalog'

function Empty({ catalog }: { catalog: ShopCatalog }) {
  if (catalog.filtered.length) return null
  return (
    <div className="border-y border-line py-16 text-center">
      <p className="font-display text-3xl">Nothing matches those filters</p>
      <p className="mx-auto mt-3 max-w-md text-muted">
        Try another occasion, category, or clear the search to see the full collection.
      </p>
    </div>
  )
}

/** Centered editorial catalog — generous whitespace, 2-up large cards */
function ElegantMinimalShop({ catalog }: { catalog: ShopCatalog }) {
  return (
    <div className="bg-ivory">
      <section className="mx-auto max-w-3xl px-5 pb-10 pt-14 text-center sm:px-6 sm:pt-20 lg:pt-28">
        <p className="text-[11px] uppercase tracking-[0.32em] text-muted">The collection</p>
        <h1 className="mt-4 font-display text-4xl leading-[1.05] sm:text-5xl md:text-6xl">Quiet blooms</h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted">
          A calm edit of roses, bouquets, and boxes — priced in Philippine pesos.
        </p>
      </section>
      <div className="mx-auto max-w-4xl border-y border-line/70 px-6 py-8">
        <FilterControls catalog={catalog} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" />
        <div className="mt-6">
          <PriceMeter catalog={catalog} />
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-6 py-16 lg:py-24">
        <div className="grid gap-x-12 gap-y-20 md:grid-cols-2">
          {catalog.filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <Empty catalog={catalog} />
      </div>
    </div>
  )
}

/** Dark boutique — sticky left rail filters, tall product column */
function DarkLuxuryShop({ catalog }: { catalog: ShopCatalog }) {
  const featured = catalog.filtered[0]
  const rest = catalog.filtered.slice(1)

  return (
    <div className="min-h-svh bg-[#0c0b0a] text-ink">
      <div className="border-b border-white/10 px-5 py-10 sm:px-6 sm:py-14 lg:px-12">
        <p className="text-[11px] uppercase tracking-[0.35em] text-gold">Atelier edit</p>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl md:text-6xl">Shop the night</h1>
      </div>
      <div className="grid lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-white/10 px-5 py-8 sm:px-6 lg:sticky lg:top-24 lg:h-fit lg:border-b-0 lg:border-r lg:border-white/10 lg:px-8 lg:py-12">
          <FilterControls
            catalog={catalog}
            variant="solid"
            className="grid gap-5 [&_label]:text-ink/60 [&_input]:border-white/20 [&_input]:bg-transparent [&_input]:text-ink [&_select]:border-white/20 [&_select]:bg-[#141211] [&_select]:text-ink"
          />
          <div className="mt-6 text-ink/70">
            <PriceMeter catalog={catalog} />
          </div>
        </aside>
        <div className="px-5 py-8 sm:px-6 sm:py-10 lg:px-12 lg:py-14">
          {featured ? (
            <Link to={`/product/${featured.id}`} className="group grid gap-6 border border-white/10 bg-black/40 p-4 lg:grid-cols-2 lg:p-6">
              <div className="aspect-[4/5] max-h-[420px] overflow-hidden sm:max-h-none">
                <BloomImage src={featured.images[0]} alt={featured.name} className="h-full w-full" imgClassName="object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="flex flex-col justify-end pb-2 sm:pb-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Featured</p>
                <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">{featured.name}</h2>
                <p className="mt-3 text-sm text-ink/70">{featured.shortDescription}</p>
                <p className="mt-6 text-lg text-gold">{formatPHP(featured.price)}</p>
              </div>
            </Link>
          ) : null}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-3">
            {rest.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Empty catalog={catalog} />
        </div>
      </div>
    </div>
  )
}

/** Chip filters + rounded playful grid */
function BrightPlayfulShop({ catalog }: { catalog: ShopCatalog }) {
  return (
    <div className="bg-cream">
      <section className="px-5 pb-8 pt-16 sm:px-8">
        <div className="rounded-[2rem] bg-gradient-to-br from-rose/20 via-paper to-gold/20 px-6 py-12 text-center sm:px-10">
          <h1 className="font-display text-4xl font-bold leading-none text-ink sm:text-5xl md:text-6xl">Shop the joy</h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted">Tap a vibe, find a bloom, send a smile.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {catalog.categories.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => catalog.updateQueryParam('category', item.id)}
                className={`rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition ${
                  catalog.category === item.id
                    ? 'bg-rose text-on-accent'
                    : 'bg-paper text-ink shadow-sm hover:bg-blush'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-5 pb-6 sm:px-8">
        <FilterControls catalog={catalog} variant="pill" showSearch className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" />
        <div className="mt-5">
          <PriceMeter catalog={catalog} />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <Empty catalog={catalog} />
      </div>
    </div>
  )
}

/** Warm storyboard — banner + handmade list/grid hybrid */
function RusticWarmShop({ catalog }: { catalog: ShopCatalog }) {
  return (
    <div className="bg-[#f3ebe1]">
      <section className="border-b border-[#d9cbb8] px-6 py-16 text-center lg:py-20">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#7a6a55]">From the workbench</p>
        <h1 className="mt-3 font-display text-5xl text-ink">Handcrafted stems</h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted">
          Arranged like they were made for a kitchen table — warm light, real ribbons, clear PHP pricing.
        </p>
      </section>
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[220px_1fr] lg:py-16">
        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <p className="font-display text-2xl italic text-ink">Filter softly</p>
          <FilterControls catalog={catalog} variant="solid" showSearch className="grid gap-4" />
          <PriceMeter catalog={catalog} />
        </aside>
        <div className="space-y-8">
          {catalog.filtered.map((product, index) =>
            index % 3 === 0 ? (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="grid items-center gap-6 border border-[#d9cbb8] bg-[#faf6f0] p-4 sm:grid-cols-[1.1fr_1fr]"
              >
                <div className="aspect-[5/4] overflow-hidden">
                  <BloomImage src={product.images[0]} alt={product.name} className="h-full w-full" />
                </div>
                <div>
                  <h2 className="font-display text-3xl">{product.name}</h2>
                  <p className="mt-2 text-sm text-muted">{product.shortDescription}</p>
                  <p className="mt-4 text-base">{formatPHP(product.price)}</p>
                </div>
              </Link>
            ) : (
              <div key={product.id} className="border border-[#d9cbb8] bg-[#faf6f0] p-3">
                <ProductCard product={product} />
              </div>
            ),
          )}
          <Empty catalog={catalog} />
        </div>
      </div>
    </div>
  )
}

/** Fashion lookbook — huge type, dense contrast grid */
function ModernBoldShop({ catalog }: { catalog: ShopCatalog }) {
  return (
    <div className="bg-paper text-ink">
      <section className="border-b-4 border-ink px-4 py-10 sm:px-8">
        <h1 className="font-display text-[22vw] font-bold uppercase leading-[0.8] tracking-tighter sm:text-[12vw] lg:text-[8rem]">
          Shop
        </h1>
        <div className="mt-6 flex flex-wrap gap-2">
          {catalog.occasions.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => catalog.updateQueryParam('occasion', item.id)}
              className={`border-2 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] ${
                catalog.occasion === item.id
                  ? 'border-rose bg-rose text-on-accent'
                  : 'border-ink hover:bg-ink hover:text-paper'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>
      <div className="grid gap-0 border-b-4 border-ink lg:grid-cols-[1fr_320px]">
        <div className="px-4 py-8 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {catalog.filtered.map((product) => (
              <div key={product.id} className="border-2 border-ink p-2">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <Empty catalog={catalog} />
        </div>
        <aside className="border-t-4 border-ink bg-ink px-5 py-8 text-paper sm:px-6 lg:border-l-4 lg:border-t-0">
          <FilterControls
            catalog={catalog}
            variant="solid"
            className="grid gap-5 [&_label]:text-paper/70 [&_input]:border-white/30 [&_input]:bg-transparent [&_input]:text-paper [&_select]:border-white/30 [&_select]:bg-transparent [&_select]:text-paper"
          />
          <div className="mt-6 text-paper/80">
            <PriceMeter catalog={catalog} />
          </div>
        </aside>
      </div>
    </div>
  )
}

/** Magazine — hero pick + thin text filters + soft grid */
function RomanticEditorialShop({ catalog }: { catalog: ShopCatalog }) {
  const lead = catalog.filtered[0]
  const rest = catalog.filtered.slice(1)

  return (
    <div className="bg-[#fbf7f4]">
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-24">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-rose">Le Fleur edit</p>
          <h1 className="mt-4 font-display text-4xl italic leading-[1.05] text-ink sm:text-5xl md:text-6xl">
            Soft stories in bloom
          </h1>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {catalog.categories.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => catalog.updateQueryParam('category', item.id)}
                className={`underline-offset-4 ${
                  catalog.category === item.id ? 'text-rose underline' : 'text-muted hover:text-ink'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        {lead ? (
          <Link to={`/product/${lead.id}`} className="group relative block overflow-hidden">
            <div className="aspect-[4/5]">
              <BloomImage src={lead.images[0]} alt={lead.name} className="h-full w-full" imgClassName="object-cover transition duration-700 group-hover:scale-[1.03]" />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-5 text-photo-fg">
              <p className="font-display text-3xl italic">{lead.name}</p>
              <p className="mt-1 text-sm">{formatPHP(lead.price)}</p>
            </div>
          </Link>
        ) : null}
      </section>
      <div className="border-y border-line/80 px-6 py-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <FilterControls catalog={catalog} showSearch className="grid flex-1 gap-4 sm:grid-cols-3 lg:grid-cols-4" />
          <PriceMeter catalog={catalog} />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="columns-1 gap-8 sm:columns-2 lg:columns-3">
          {rest.map((product) => (
            <div key={product.id} className="mb-8 break-inside-avoid">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <Empty catalog={catalog} />
      </div>
    </div>
  )
}

/** Gallery wall — image-first masonry, minimal chrome */
function ArtisticPhotoShop({ catalog }: { catalog: ShopCatalog }) {
  return (
    <div className="bg-[#11160f] text-ink">
      <div className="flex flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:flex-row lg:items-start lg:px-8">
        <aside className="lg:sticky lg:top-28 lg:w-56 lg:shrink-0">
          <p className="text-[10px] uppercase tracking-[0.4em] text-sage">Gallery</p>
          <h1 className="mt-3 font-display text-3xl leading-none sm:text-4xl">FLORA</h1>
          <p className="mt-3 text-xs text-ink/60">{catalog.filtered.length} works</p>
          <div className="mt-6 sm:mt-8">
            <FilterControls
              catalog={catalog}
              variant="underline"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 [&_label]:text-ink/50 [&_input]:border-white/20 [&_input]:text-ink [&_select]:border-white/20 [&_select]:bg-transparent [&_select]:text-ink"
            />
          </div>
          <div className="mt-6 text-ink/60">
            <PriceMeter catalog={catalog} />
          </div>
        </aside>
        <div className="grid min-w-0 flex-1 grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
          {catalog.filtered.map((product, index) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className={`group relative overflow-hidden ${index % 5 === 0 ? 'col-span-2 aspect-[16/10]' : 'aspect-[3/4]'}`}
            >
              <BloomImage
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full"
                imgClassName="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent md:opacity-0 md:transition md:group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3 md:translate-y-2 md:opacity-0 md:transition md:group-hover:translate-y-0 md:group-hover:opacity-100">
                <p className="font-display text-sm text-photo-fg sm:text-lg">{product.name}</p>
                <p className="text-[11px] text-photo-fg/80 sm:text-xs">{formatPHP(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-5 pb-16 sm:px-6">
        <Empty catalog={catalog} />
      </div>
    </div>
  )
}

/** Calm utility — left filters, airy 3-col, thin rules */
function ScandinavianShop({ catalog }: { catalog: ShopCatalog }) {
  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <div className="max-w-xl border-b border-line pb-10">
          <p className="text-[11px] uppercase tracking-[0.28em] text-sage">Collection</p>
          <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">Clear choices</h1>
          <p className="mt-4 text-sm text-muted">Simple filters. Honest prices. Daylight stems.</p>
        </div>
        <div className="mt-12 grid gap-12 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-8 lg:border-r lg:border-line lg:pr-10">
            <FilterControls catalog={catalog} className="grid gap-5" />
            <PriceMeter catalog={catalog} />
          </aside>
          <div>
            <ProductGrid products={catalog.filtered} />
          </div>
        </div>
      </div>
    </div>
  )
}

/** Futuristic discovery — glass controls + horizontal spotlight + grid */
function ImmersiveShop({ catalog }: { catalog: ShopCatalog }) {
  const spotlight = catalog.filtered.slice(0, 5)

  return (
    <div className="bg-[#070b16] text-ink">
      <section className="px-5 pb-8 pt-12 sm:px-6 sm:pt-16 lg:px-12">
        <p className="text-[10px] uppercase tracking-[0.28em] text-accent sm:tracking-[0.45em]">NOVA BLOOMS</p>
        <h1 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl">Discover your bouquet</h1>
        <div className="mt-8 rounded-sm border border-accent/30 bg-white/5 p-4 backdrop-blur-md sm:p-6">
          <FilterControls
            catalog={catalog}
            variant="solid"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 [&_label]:text-ink/50 [&_input]:border-accent/30 [&_input]:bg-transparent [&_input]:text-ink [&_select]:border-accent/30 [&_select]:bg-[#0c1224] [&_select]:text-ink"
          />
          <div className="mt-5 text-ink/70">
            <PriceMeter catalog={catalog} />
          </div>
        </div>
      </section>
      <section className="px-5 pb-6 sm:px-6 lg:px-12">
        <p className="text-[10px] uppercase tracking-[0.3em] text-accent/80">Spotlight</p>
        <div className="no-scrollbar mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
          {spotlight.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="w-[70vw] max-w-64 shrink-0 snap-start border border-white/10 bg-white/5 p-3 transition hover:border-accent sm:w-64"
            >
              <div className="aspect-square overflow-hidden">
                <BloomImage src={product.images[0]} alt={product.name} className="h-full w-full" />
              </div>
              <p className="mt-3 font-medium">{product.name}</p>
              <p className="text-xs text-accent">{formatPHP(product.price)}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="px-5 pb-16 sm:px-6 sm:pb-20 lg:px-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.filtered.map((product) => (
            <div key={product.id} className="border border-white/10 bg-white/[0.03] p-2">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <Empty catalog={catalog} />
      </section>
    </div>
  )
}

/** Local boutique — delivery notice, friendly chips, price-forward rows */
function LocalBoutiqueShop({ catalog }: { catalog: ShopCatalog }) {
  return (
    <div className="bg-[#f7f1e8]">
      <div className="bg-[#2f5d3a] px-4 py-3 text-center text-[11px] leading-snug text-[#f7f1e8] sm:px-5 sm:text-[12px]">
        Metro Manila delivery notes shown at checkout · Prices in PHP
      </div>
      <section className="px-5 py-12 sm:px-8 lg:px-12">
        <h1 className="font-display text-4xl text-ink sm:text-5xl">Fresh from our studio</h1>
        <p className="mt-3 max-w-xl text-sm text-muted">
          Real arrangements from Sariwa Blooms — pick a category and we&apos;ll help you send something lovely today.
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          {catalog.categories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => catalog.updateQueryParam('category', item.id)}
              className={`rounded-lg px-4 py-2 text-sm ${
                catalog.category === item.id
                  ? 'bg-[#2f5d3a] text-[#f7f1e8]'
                  : 'bg-paper text-ink shadow-sm hover:bg-[#e8dfd2]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>
      <div className="border-y border-[#e0d4c4] bg-paper/70 px-5 py-6 sm:px-8 lg:px-12">
        <FilterControls catalog={catalog} variant="solid" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" />
        <div className="mt-4">
          <PriceMeter catalog={catalog} />
        </div>
      </div>
      <div className="mx-auto max-w-5xl space-y-4 px-5 py-12 sm:px-8">
        {catalog.filtered.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="flex gap-3 rounded-xl border border-[#e0d4c4] bg-paper p-3 transition hover:border-[#2f5d3a] sm:gap-6 sm:p-4"
          >
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg sm:h-32 sm:w-32">
              <BloomImage src={product.images[0]} alt={product.name} className="h-full w-full" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-2">
                <h2 className="font-display text-xl leading-tight sm:text-2xl">{product.name}</h2>
                <p className="text-base font-semibold text-[#2f5d3a] sm:text-lg">{formatPHP(product.price)}</p>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-muted">{product.shortDescription}</p>
            </div>
          </Link>
        ))}
        <Empty catalog={catalog} />
      </div>
    </div>
  )
}

export function ConceptShopPage() {
  const { conceptId } = useConcept()
  const catalog = useShopCatalog()

  switch (conceptId) {
    case 'elegant-minimal':
      return <ElegantMinimalShop catalog={catalog} />
    case 'dark-luxury':
      return <DarkLuxuryShop catalog={catalog} />
    case 'bright-playful':
      return <BrightPlayfulShop catalog={catalog} />
    case 'rustic-warm':
      return <RusticWarmShop catalog={catalog} />
    case 'modern-bold':
      return <ModernBoldShop catalog={catalog} />
    case 'romantic-editorial':
      return <RomanticEditorialShop catalog={catalog} />
    case 'artistic-photographic':
      return <ArtisticPhotoShop catalog={catalog} />
    case 'scandinavian-nature':
      return <ScandinavianShop catalog={catalog} />
    case 'interactive-immersive':
      return <ImmersiveShop catalog={catalog} />
    case 'local-boutique':
      return <LocalBoutiqueShop catalog={catalog} />
    default:
      return <ElegantMinimalShop catalog={catalog} />
  }
}
