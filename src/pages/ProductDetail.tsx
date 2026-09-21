import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { BloomImage } from '../components/ui/BloomImage'
import { Button } from '../components/ui/Button'
import { QuantitySelector } from '../components/ui/QuantitySelector'
import { useShop } from '../context/ShopContext'
import { useToast } from '../context/ToastContext'
import { occasions } from '../data/content'
import { formatPHP } from '../lib/format'

export function ProductDetailPage() {
  const { id } = useParams()
  const { getProduct, products, addToCart } = useShop()
  const { notify } = useToast()
  const product = getProduct(id ?? '')
  const [active, setActive] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')

  useEffect(() => {
    setActive(0)
    setQuantity(1)
    setMessage('')
  }, [id])

  const related = useMemo(() => {
    if (!product) return []
    return products
      .filter(
        (item) =>
          item.id !== product.id &&
          (item.category === product.category || item.occasions.some((o) => product.occasions.includes(o))),
      )
      .slice(0, 3)
  }, [product, products])

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="font-display text-4xl">Arrangement not found</h1>
        <p className="mt-3 text-muted">This piece may have been removed from the demo catalog.</p>
        <div className="mt-8">
          <Button href="/shop">Return to shop</Button>
        </div>
      </div>
    )
  }

  function handleAdd() {
    if (!product) return
    const added = addToCart(product.id, quantity, message.trim() || undefined)
    if (added) notify(`${product.name} added to your cart.`)
    else notify('This arrangement is currently unavailable.')
  }

  const occasionLabels = occasions
    .filter((item) => product.occasions.includes(item.slug))
    .map((item) => item.label)

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-16">
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted">
        <Link to="/shop" className="hover:text-rose">
          Shop
        </Link>
        <span className="mx-2 text-line">/</span>
        <span className="text-ink/70">{product.name}</span>
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16 xl:gap-20">
        <div>
          <BloomImage
            src={product.images[active] ?? product.images[0]}
            alt={product.name}
            className="aspect-[3/4] w-full"
            eager
          />
          <div className="mt-3 grid grid-cols-3 gap-2.5">
            {product.images.map((image, index) => (
              <button
                key={image + index}
                type="button"
                onClick={() => setActive(index)}
                className={`overflow-hidden border transition-colors ${active === index ? 'border-ink' : 'border-transparent opacity-80 hover:opacity-100'}`}
              >
                <BloomImage src={image} alt="" className="aspect-square" />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:pt-2">
          <p className="text-[11px] uppercase tracking-[0.24em] text-rose">
            {product.available ? 'Available' : 'Currently unavailable'}
          </p>
          <h1 className="mt-3 font-display text-4xl leading-[1.05] sm:text-5xl">{product.name}</h1>
          <p className="mt-4 text-xl tabular-nums sm:text-2xl">{formatPHP(product.price)}</p>
          <p className="mt-6 max-w-md leading-relaxed text-muted">{product.description}</p>
          {occasionLabels.length ? (
            <p className="mt-5 text-[13px] text-muted">
              Suited for {occasionLabels.join(', ').toLowerCase()}
            </p>
          ) : null}

          <div className="mt-10 border-t border-line pt-8">
            <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-muted">Quantity</p>
            <QuantitySelector value={quantity} onChange={setQuantity} />
          </div>

          <label className="mt-7 block text-[11px] uppercase tracking-[0.18em] text-muted">
            Personalized message
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={4}
              placeholder="A short note to accompany the flowers"
              className="mt-2 w-full border border-line bg-paper px-3 py-3 text-sm tracking-normal text-ink focus:border-ink"
            />
            <span className="mt-2 block text-xs tracking-normal text-muted">
              Optional — we’ll include this with the arrangement.
            </span>
          </label>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button type="button" size="lg" onClick={handleAdd} disabled={!product.available}>
              Add to Cart
            </Button>
            <Button href="/cart" variant="secondary" size="lg">
              View Cart
            </Button>
          </div>
        </div>
      </div>

      {related.length ? (
        <section className="mt-24 border-t border-line pt-16">
          <h2 className="font-display text-3xl sm:text-4xl">You may also like</h2>
          <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
