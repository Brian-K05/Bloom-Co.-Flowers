import { useState } from 'react'
import { formatPHP } from '../../lib/format'
import { useToast } from '../../context/ToastContext'
import { usePos } from '../store/PosContext'

export function PosInventoryPage() {
  const { products, restockProduct, updateProductStock } = usePos()
  const { notify } = useToast()
  const [draftQty, setDraftQty] = useState<Record<string, string>>({})
  const [restockQty, setRestockQty] = useState<Record<string, string>>({})

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl">Inventory</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--pos-muted)' }}>
            Stock qty, sold-out flag, and restock. Confirm on an order deducts stock.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => {
          const soldOut = product.stockQty <= 0
          return (
            <article key={product.id} className="pos-surface overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-semibold leading-tight">{product.name}</h2>
                    <p className="mt-1 text-sm" style={{ color: 'var(--pos-muted)' }}>
                      {formatPHP(product.price)} · {product.category}
                    </p>
                  </div>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                    style={{
                      background: soldOut ? 'color-mix(in srgb, var(--pos-danger) 18%, transparent)' : 'var(--pos-accent-soft)',
                      color: soldOut ? 'var(--pos-danger)' : 'var(--pos-accent)',
                    }}
                  >
                    {soldOut ? 'Sold out' : `${product.stockQty} in stock`}
                  </span>
                </div>

                <div className="mt-4 grid gap-2">
                  <label className="pos-label">
                    Set stock
                    <div className="mt-1 flex gap-2">
                      <input
                        type="number"
                        min={0}
                        className="pos-field"
                        value={draftQty[product.id] ?? String(product.stockQty)}
                        onChange={(e) => setDraftQty((prev) => ({ ...prev, [product.id]: e.target.value }))}
                      />
                      <button
                        type="button"
                        className="pos-btn pos-btn-secondary"
                        onClick={() => {
                          const qty = Number(draftQty[product.id] ?? product.stockQty)
                          if (!Number.isFinite(qty) || qty < 0) {
                            notify('Enter a valid stock quantity')
                            return
                          }
                          updateProductStock(product.id, qty)
                          notify(`Stock set for ${product.name}`)
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </label>
                  <label className="pos-label">
                    Restock +
                    <div className="mt-1 flex gap-2">
                      <input
                        type="number"
                        min={1}
                        className="pos-field"
                        placeholder="Qty"
                        value={restockQty[product.id] ?? ''}
                        onChange={(e) => setRestockQty((prev) => ({ ...prev, [product.id]: e.target.value }))}
                      />
                      <button
                        type="button"
                        className="pos-btn pos-btn-primary"
                        onClick={() => {
                          const qty = Number(restockQty[product.id])
                          if (!Number.isFinite(qty) || qty < 1) {
                            notify('Enter restock quantity')
                            return
                          }
                          restockProduct(product.id, qty)
                          setRestockQty((prev) => ({ ...prev, [product.id]: '' }))
                          notify(`Restocked ${product.name}`)
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </label>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
