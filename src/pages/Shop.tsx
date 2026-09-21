import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductGrid } from '../components/product/ProductGrid'
import { useShop } from '../context/ShopContext'
import { categories, shopOccasions } from '../data/content'
import type { Category, OccasionSlug } from '../types'

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name'

const fieldClass =
  'mt-2 w-full border-0 border-b border-line bg-transparent px-0 py-2.5 text-sm tracking-normal text-ink focus:border-ink'

export function ShopPage() {
  const { products } = useShop()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const rawCategory = params.get('category') ?? 'all'
  const rawOccasion = params.get('occasion') ?? 'all'
  const category = (categories.some((item) => item.id === rawCategory) ? rawCategory : 'all') as Category | 'all'
  const occasion = (
    shopOccasions.some((item) => item.id === rawOccasion) ? rawOccasion : 'all'
  ) as OccasionSlug | 'all'
  const [sort, setSort] = useState<SortKey>('featured')
  const priceCeiling = Math.max(...products.map((product) => product.price), 2500)
  const [maxPrice, setMaxPrice] = useState(priceCeiling)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const next = products.filter((product) => {
      if (category !== 'all' && product.category !== category) return false
      if (occasion !== 'all' && !product.occasions.includes(occasion)) return false
      if (product.price > maxPrice) return false
      if (q && !`${product.name} ${product.shortDescription} ${product.description}`.toLowerCase().includes(q)) {
        return false
      }
      return true
    })
    const sorted = [...next]
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price)
    if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name))
    return sorted
  }, [category, maxPrice, occasion, products, query, sort])

  function updateQueryParam(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (!value || value === 'all') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="max-w-2xl">
        <p className="text-[11px] uppercase tracking-[0.28em] text-rose">The collection</p>
        <h1 className="mt-3 font-display text-5xl leading-tight sm:text-6xl">Find Something Beautiful</h1>
        <p className="mt-4 text-muted">
          Roses, garden bouquets, and flower boxes from the studio — priced in Philippine pesos.
        </p>
      </div>

      <div className="mt-12 grid gap-6 border-y border-line py-6 lg:grid-cols-[1.4fr_repeat(3,minmax(0,0.7fr))] lg:items-end lg:gap-8">
        <label className="block text-[11px] uppercase tracking-[0.16em] text-muted">
          Search
          <input
            value={query}
            onChange={(event) => updateQueryParam('q', event.target.value)}
            placeholder="Search arrangements"
            className={fieldClass}
          />
        </label>
        <label className="block text-[11px] uppercase tracking-[0.16em] text-muted">
          Category
          <select
            value={category}
            onChange={(event) => updateQueryParam('category', event.target.value)}
            className={fieldClass}
          >
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-[11px] uppercase tracking-[0.16em] text-muted">
          Occasion
          <select
            value={occasion}
            onChange={(event) => updateQueryParam('occasion', event.target.value)}
            className={fieldClass}
          >
            {shopOccasions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-[11px] uppercase tracking-[0.16em] text-muted">
          Sort
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
            className={fieldClass}
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <label className="flex items-center gap-3 text-sm text-muted">
          Up to ₱{maxPrice.toLocaleString('en-PH')}
          <input
            type="range"
            min={1450}
            max={priceCeiling}
            step={50}
            value={maxPrice}
            onChange={(event) => setMaxPrice(Number(event.target.value))}
            className="w-36 accent-rose sm:w-44"
          />
        </label>
        <p className="text-sm text-muted">{filtered.length} arrangements</p>
      </div>

      <div className="mt-12">
        <ProductGrid products={filtered} />
      </div>
    </div>
  )
}
