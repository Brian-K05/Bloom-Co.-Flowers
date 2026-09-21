import type { Product } from '../../types'
import { ProductCard } from './ProductCard'

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="border-y border-line py-20 text-center">
        <p className="font-display text-3xl">Nothing matches those filters</p>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Try another occasion, category, or clear the search to see the full collection.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
