import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useShop } from '../../context/ShopContext'
import { categories, shopOccasions } from '../../data/content'
import type { Category, OccasionSlug, Product } from '../../types'

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name'

export type ShopCatalog = {
  products: Product[]
  filtered: Product[]
  query: string
  category: Category | 'all'
  occasion: OccasionSlug | 'all'
  sort: SortKey
  maxPrice: number
  priceCeiling: number
  categories: typeof categories
  occasions: typeof shopOccasions
  setSort: (value: SortKey) => void
  setMaxPrice: (value: number) => void
  updateQueryParam: (key: string, value: string) => void
}

export function useShopCatalog(): ShopCatalog {
  const { products } = useShop()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const rawCategory = params.get('category') ?? 'all'
  const rawOccasion = params.get('occasion') ?? 'all'
  const category = (categories.some((item) => item.id === rawCategory) ? rawCategory : 'all') as
    | Category
    | 'all'
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

  return {
    products,
    filtered,
    query,
    category,
    occasion,
    sort,
    maxPrice,
    priceCeiling,
    categories,
    occasions: shopOccasions,
    setSort,
    setMaxPrice,
    updateQueryParam,
  }
}
