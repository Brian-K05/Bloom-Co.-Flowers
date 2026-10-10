import type { ShopCatalog } from './useShopCatalog'

const underline =
  'mt-2 w-full border-0 border-b border-line bg-transparent px-0 py-2.5 text-sm text-ink focus:border-ink'
const solid =
  'mt-2 w-full rounded-md border border-line bg-paper px-3 py-2.5 text-sm text-ink focus:border-ink'
const pill =
  'mt-2 w-full rounded-full border border-line bg-paper px-4 py-2.5 text-sm text-ink focus:border-rose'

type Props = {
  catalog: ShopCatalog
  variant?: 'underline' | 'solid' | 'pill'
  showSearch?: boolean
  className?: string
}

export function FilterControls({
  catalog,
  variant = 'underline',
  showSearch = true,
  className = '',
}: Props) {
  const field = variant === 'pill' ? pill : variant === 'solid' ? solid : underline
  const {
    query,
    category,
    occasion,
    sort,
    categories,
    occasions,
    setSort,
    updateQueryParam,
  } = catalog

  return (
    <div className={className}>
      {showSearch ? (
        <label className="block text-[11px] uppercase tracking-[0.16em] text-muted">
          Search
          <input
            value={query}
            onChange={(event) => updateQueryParam('q', event.target.value)}
            placeholder="Search arrangements"
            className={field}
          />
        </label>
      ) : null}
      <label className="block text-[11px] uppercase tracking-[0.16em] text-muted">
        Category
        <select
          value={category}
          onChange={(event) => updateQueryParam('category', event.target.value)}
          className={field}
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
          className={field}
        >
          {occasions.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-[11px] uppercase tracking-[0.16em] text-muted">
        Sort
        <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} className={field}>
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="name">Name</option>
        </select>
      </label>
    </div>
  )
}

export function PriceMeter({ catalog }: { catalog: ShopCatalog }) {
  const { maxPrice, priceCeiling, setMaxPrice, filtered } = catalog
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
      <label className="flex min-w-0 flex-1 flex-col gap-2 text-sm text-muted sm:flex-row sm:items-center sm:gap-3">
        <span className="shrink-0">Up to ₱{maxPrice.toLocaleString('en-PH')}</span>
        <input
          type="range"
          min={1450}
          max={priceCeiling}
          step={50}
          value={maxPrice}
          onChange={(event) => setMaxPrice(Number(event.target.value))}
          className="w-full max-w-full accent-rose sm:w-44"
        />
      </label>
      <p className="text-sm text-muted">{filtered.length} arrangements</p>
    </div>
  )
}
