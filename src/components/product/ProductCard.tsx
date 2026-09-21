import { Link } from 'react-router-dom'
import { useShop } from '../../context/ShopContext'
import { useToast } from '../../context/ToastContext'
import { formatPHP } from '../../lib/format'
import type { Product } from '../../types'
import { BloomImage } from '../ui/BloomImage'

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useShop()
  const { notify } = useToast()

  function handleAdd() {
    const added = addToCart(product.id, 1)
    if (added) {
      notify(`${product.name} added to your cart.`)
    } else {
      notify('This arrangement is currently unavailable.')
    }
  }

  return (
    <article className="group">
      <Link to={`/product/${product.id}`} className="block overflow-hidden">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#eee6da]">
          <BloomImage
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full"
            imgClassName="transition duration-700 ease-out group-hover:scale-[1.03]"
          />
          {!product.available ? (
            <span className="absolute left-0 top-0 bg-paper/95 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-ink">
              Unavailable
            </span>
          ) : product.bestSeller ? (
            <span className="absolute left-0 top-0 bg-paper/95 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-rose">
              Best seller
            </span>
          ) : null}
        </div>
      </Link>
      <div className="pt-5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-[1.65rem] leading-[1.15]">
            <Link to={`/product/${product.id}`} className="transition-colors hover:text-rose">
              {product.name}
            </Link>
          </h3>
          <p className="shrink-0 text-sm tabular-nums text-ink/90">{formatPHP(product.price)}</p>
        </div>
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">{product.shortDescription}</p>
        <div className="mt-4 flex items-center gap-5">
          <button
            type="button"
            onClick={handleAdd}
            disabled={!product.available}
            className="text-[11px] uppercase tracking-[0.18em] text-rose transition-colors hover:text-rose-deep disabled:cursor-not-allowed disabled:text-muted"
          >
            Add to Cart
          </button>
          <Link
            to={`/product/${product.id}`}
            className="text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  )
}
