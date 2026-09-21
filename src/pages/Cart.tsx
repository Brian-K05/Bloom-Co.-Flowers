import { Link } from 'react-router-dom'
import { BloomImage } from '../components/ui/BloomImage'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { QuantitySelector } from '../components/ui/QuantitySelector'
import { useShop } from '../context/ShopContext'
import { formatPHP } from '../lib/format'

export function CartPage() {
  const { cartDetailed, cartSubtotal, updateCartQuantity, removeFromCart } = useShop()

  if (!cartDetailed.length) {
    return (
      <EmptyState
        eyebrow="The cart"
        title="Your cart is waiting for something beautiful."
        body="Roses, garden bouquets, and flower boxes — ready to be wrapped and sent."
        actionLabel="Explore Flowers"
        actionHref="/shop"
      />
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <p className="text-[11px] uppercase tracking-[0.28em] text-rose">Your selection</p>
      <h1 className="mt-2 font-display text-5xl">Your cart</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
        <ul className="divide-y divide-line border-y border-line">
          {cartDetailed.map((item) => (
            <li key={item.productId} className="grid gap-4 py-6 sm:grid-cols-[110px_1fr]">
              <Link to={`/product/${item.productId}`}>
                <BloomImage src={item.product.images[0]} alt={item.product.name} className="aspect-square" />
              </Link>
              <div className="flex flex-col justify-between gap-3 sm:flex-row">
                <div>
                  <Link to={`/product/${item.productId}`} className="font-display text-2xl hover:text-rose">
                    {item.product.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted">{formatPHP(item.product.price)} each</p>
                  {item.message ? (
                    <p className="mt-2 max-w-sm text-sm italic text-muted">“{item.message}”</p>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    className="mt-3 text-[11px] uppercase tracking-[0.16em] text-muted hover:text-rose"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end">
                  <QuantitySelector
                    value={item.quantity}
                    min={0}
                    onChange={(value) => updateCartQuantity(item.productId, value)}
                  />
                  <p className="text-sm">{formatPHP(item.lineTotal)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit border border-line bg-paper p-6">
          <h2 className="font-display text-3xl">Summary</h2>
          <div className="mt-6 flex justify-between text-sm">
            <span className="text-muted">Subtotal</span>
            <span>{formatPHP(cartSubtotal)}</span>
          </div>
          <div className="mt-3 flex justify-between text-sm">
            <span className="text-muted">Delivery</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="mt-6 flex justify-between border-t border-line pt-4">
            <span>Total</span>
            <span>{formatPHP(cartSubtotal)}</span>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <Button href="/checkout">Proceed to Checkout</Button>
            <Button href="/shop" variant="secondary">
              Continue Shopping
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}
