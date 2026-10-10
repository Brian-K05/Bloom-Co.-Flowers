import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useConcept } from '../../concepts/ConceptProvider'
import { useShop } from '../../context/ShopContext'
import { useToast } from '../../context/ToastContext'
import { formatPHP } from '../../lib/format'
import type { Product } from '../../types'
import { BloomImage } from '../ui/BloomImage'

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { conceptId } = useConcept()
  const { addToCart, favorites, toggleFavorite } = useShop()
  const { notify } = useToast()
  const liked = favorites.includes(product.id)

  function handleAdd() {
    const added = addToCart(product.id, 1)
    if (added) notify(`${product.name} added to your cart.`)
    else notify('This arrangement is currently unavailable.')
  }

  function handleFavorite() {
    toggleFavorite(product.id)
    notify(liked ? 'Removed from favorites.' : 'Saved to favorites.')
  }

  const radius = 'var(--radius-card)'
  const shadow = 'var(--shadow-card)'

  if (conceptId === 'bright-playful') {
    return (
      <article className="group flex h-full flex-col bg-paper p-3" style={{ borderRadius: radius, boxShadow: shadow }}>
        <Link to={`/product/${product.id}`} className="block overflow-hidden" style={{ borderRadius: radius }}>
          <div className="relative aspect-square overflow-hidden bg-blush">
            <BloomImage src={product.images[0]} alt={product.name} className="h-full w-full" imgClassName="transition duration-500 group-hover:scale-105" />
            <button type="button" aria-label="Favorite" onClick={(e) => { e.preventDefault(); handleFavorite() }} className="absolute right-3 top-3 rounded-full bg-paper p-2 text-rose">
              <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
            </button>
          </div>
        </Link>
        <div className="mt-3 flex flex-1 flex-col px-1">
          <h3 className="font-display text-xl"><Link to={`/product/${product.id}`}>{product.name}</Link></h3>
          <p className="mt-1 text-sm font-medium text-rose">{formatPHP(product.price)}</p>
          <button type="button" onClick={handleAdd} disabled={!product.available} className="mt-3 rounded-full bg-rose px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-on-accent disabled:opacity-40">
            Add to Cart
          </button>
        </div>
      </article>
    )
  }

  if (conceptId === 'modern-bold' || conceptId === 'dark-luxury' || conceptId === 'artistic-photographic' || conceptId === 'interactive-immersive') {
    return (
      <article className="group cursor-hover">
        <Link to={`/product/${product.id}`} className="block overflow-hidden">
          <div className="relative aspect-[3/4] overflow-hidden bg-image-wash">
            <BloomImage src={product.images[0]} alt={product.name} className="h-full w-full" imgClassName="transition duration-700 group-hover:scale-[1.04] group-hover:opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
              <h3 className="font-display text-2xl leading-none text-photo-fg">{product.name}</h3>
              <p className="text-[12px] tabular-nums text-photo-fg/90">{formatPHP(product.price)}</p>
            </div>
          </div>
        </Link>
        <div className="mt-3 flex items-center justify-between gap-3">
          <button type="button" onClick={handleAdd} disabled={!product.available} className="text-[10px] uppercase tracking-[0.24em] text-rose hover:text-ink disabled:text-muted">
            Add to Cart
          </button>
          <button type="button" aria-label="Favorite" onClick={handleFavorite} className="text-muted hover:text-rose">
            <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </article>
    )
  }

  if (conceptId === 'scandinavian-nature' || conceptId === 'elegant-minimal') {
    return (
      <article className="group transition duration-200 hover:-translate-y-1" style={{ boxShadow: 'none' }}>
        <Link to={`/product/${product.id}`} className="block overflow-hidden">
          <div className="relative aspect-[4/5] overflow-hidden bg-image-wash" style={{ borderRadius: radius }}>
            <BloomImage src={product.images[0]} alt={product.name} className="h-full w-full" imgClassName="transition duration-700 group-hover:scale-[1.03]" />
          </div>
        </Link>
        <div className="pt-4">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-2xl leading-tight"><Link to={`/product/${product.id}`} className="hover:text-rose">{product.name}</Link></h3>
            <p className="text-sm tabular-nums">{formatPHP(product.price)}</p>
          </div>
          <p className="mt-2 line-clamp-2 text-[13px] text-muted">{product.shortDescription}</p>
          <button type="button" onClick={handleAdd} disabled={!product.available} className="mt-4 text-[11px] uppercase tracking-[0.18em] text-rose hover:text-rose-deep disabled:text-muted">
            Add to Cart
          </button>
        </div>
      </article>
    )
  }

  // rustic, romantic, local — paper / soft retail
  return (
    <article className="group border border-line bg-paper p-3" style={{ borderRadius: radius, boxShadow: shadow }}>
      <Link to={`/product/${product.id}`} className="block overflow-hidden" style={{ borderRadius: radius }}>
        <div className="relative aspect-[3/4] overflow-hidden bg-image-wash">
          <BloomImage src={product.images[0]} alt={product.name} className="h-full w-full" imgClassName="transition duration-700 group-hover:scale-[1.03]" />
          {!product.available ? (
            <span className="absolute left-0 top-0 bg-paper/95 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em]">Unavailable</span>
          ) : product.bestSeller ? (
            <span className="absolute left-0 top-0 bg-paper/95 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-rose">Best seller</span>
          ) : null}
        </div>
      </Link>
      <div className="pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-[1.5rem] leading-[1.15]"><Link to={`/product/${product.id}`} className="hover:text-rose">{product.name}</Link></h3>
          <p className="shrink-0 text-sm tabular-nums">{formatPHP(product.price)}</p>
        </div>
        <p className="mt-2 line-clamp-2 text-[13px] text-muted">{product.shortDescription}</p>
        <div className="mt-4 flex items-center gap-4">
          <button type="button" onClick={handleAdd} disabled={!product.available} className="text-[11px] uppercase tracking-[0.18em] text-rose disabled:text-muted">
            Add to Cart
          </button>
          <button type="button" aria-label="Favorite" onClick={handleFavorite} className="text-muted hover:text-rose">
            <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </article>
  )
}
