import { useState, type FormEvent } from 'react'
import { formatPHP } from '../../lib/format'
import { images } from '../../lib/images'
import { useToast } from '../../context/ToastContext'
import { usePos } from '../store/PosContext'
import type { PosProduct } from '../types'

const CATEGORIES = ['Roses', 'Bouquets', 'Boxes', 'Imported', 'Seasonal', 'Other']

const IMAGE_PRESETS = [
  { label: 'Red roses', url: images.redRoses },
  { label: 'Blush', url: images.blush },
  { label: 'White', url: images.white },
  { label: 'Pastel', url: images.pastel },
  { label: 'Birthday', url: images.birthday },
  { label: 'Botanical', url: images.botanical },
  { label: 'Love & grace', url: images.loveGrace },
  { label: 'Box', url: images.box },
]

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48)
}

function closestImagePreset(url: string) {
  return IMAGE_PRESETS.some((p) => p.url === url) ? url : IMAGE_PRESETS[0].url
}

type EditorMode = { kind: 'create' } | { kind: 'edit'; product: PosProduct }

export function PosInventoryPage() {
  const { products, restockProduct, updateProductStock, upsertProduct, deleteProduct } = usePos()
  const { notify } = useToast()
  const [draftQty, setDraftQty] = useState<Record<string, string>>({})
  const [restockQty, setRestockQty] = useState<Record<string, string>>({})
  const [editor, setEditor] = useState<EditorMode | null>(null)
  const [saving, setSaving] = useState(false)

  function openCreate() {
    setEditor((prev) => (prev?.kind === 'create' ? null : { kind: 'create' }))
  }

  function openEdit(product: PosProduct) {
    setEditor({ kind: 'edit', product })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function closeEditor() {
    setEditor(null)
  }

  async function handleSaveProduct(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!editor) return
    const form = e.currentTarget
    const fd = new FormData(form)
    const name = String(fd.get('name') || '').trim()
    const price = Number(fd.get('price'))
    const stockQty = Number(fd.get('stockQty'))
    const category = String(fd.get('category') || 'Bouquets')
    const image = String(fd.get('image') || IMAGE_PRESETS[0].url)
    const isImported = fd.get('isImported') === 'on'

    if (!name) {
      notify('Enter a product name')
      return
    }
    if (!Number.isFinite(price) || price < 0) {
      notify('Enter a valid price')
      return
    }
    if (!Number.isFinite(stockQty) || stockQty < 0) {
      notify('Enter a valid stock quantity')
      return
    }

    let id: string
    if (editor.kind === 'edit') {
      id = editor.product.id
    } else {
      id = slugify(name) || `product-${Date.now()}`
      if (products.some((p) => p.id === id)) {
        id = `${id}-${Date.now().toString(36)}`
      }
    }

    const product: PosProduct = {
      id,
      name,
      price,
      category,
      stockQty,
      available: stockQty > 0,
      image: image || IMAGE_PRESETS[0].url,
      isImported: isImported || category === 'Imported',
    }

    setSaving(true)
    try {
      await upsertProduct(product)
      setEditor(null)
      notify(editor.kind === 'edit' ? `Updated ${name}` : `Added ${name}`)
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : 'Could not save product')
    } finally {
      setSaving(false)
    }
  }

  const editing = editor?.kind === 'edit' ? editor.product : null

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl">Inventory</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--pos-muted)' }}>
            Full product CRUD — create, edit details, adjust stock, or remove. Confirm on an order deducts stock.
          </p>
        </div>
        <button
          type="button"
          className="pos-btn pos-btn-primary"
          data-testid="pos-add-product"
          onClick={openCreate}
        >
          {editor?.kind === 'create' ? 'Cancel' : '+ Add product'}
        </button>
      </div>

      {editor ? (
        <form
          key={editing ? `edit-${editing.id}` : 'create'}
          className="pos-surface mt-6 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3"
          onSubmit={(e) => void handleSaveProduct(e)}
          data-testid="pos-product-form"
        >
          <p className="text-sm font-medium sm:col-span-2 lg:col-span-3">
            {editing ? `Edit product · ${editing.id}` : 'New product'}
          </p>
          <label className="pos-label sm:col-span-2 lg:col-span-1">
            Name
            <input
              name="name"
              className="pos-field mt-1"
              required
              defaultValue={editing?.name ?? ''}
              placeholder="e.g. Garden Peony Wrap"
            />
          </label>
          <label className="pos-label">
            Price (₱)
            <input
              name="price"
              type="number"
              min={0}
              step={50}
              className="pos-field mt-1"
              required
              defaultValue={editing?.price ?? 0}
            />
          </label>
          <label className="pos-label">
            Stock qty
            <input
              name="stockQty"
              type="number"
              min={0}
              className="pos-field mt-1"
              required
              defaultValue={editing?.stockQty ?? 0}
            />
          </label>
          <label className="pos-label">
            Category
            <select
              name="category"
              className="pos-field mt-1"
              defaultValue={
                editing && CATEGORIES.includes(editing.category) ? editing.category : 'Bouquets'
              }
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="pos-label sm:col-span-2">
            Photo
            <select
              name="image"
              className="pos-field mt-1"
              defaultValue={closestImagePreset(editing?.image ?? IMAGE_PRESETS[0].url)}
            >
              {IMAGE_PRESETS.map((img) => (
                <option key={img.url} value={img.url}>
                  {img.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm sm:col-span-2 lg:col-span-3" style={{ color: 'var(--pos-ink)' }}>
            <input type="checkbox" name="isImported" defaultChecked={Boolean(editing?.isImported)} />
            Imported / pre-order stock (supplier lead time)
          </label>
          <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-3">
            <button type="submit" className="pos-btn pos-btn-primary" disabled={saving} data-testid="pos-product-save">
              {saving ? 'Saving…' : editing ? 'Update product' : 'Create product'}
            </button>
            <button type="button" className="pos-btn pos-btn-secondary" onClick={closeEditor} disabled={saving}>
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => {
          const soldOut = product.stockQty <= 0
          const isEditingThis = editing?.id === product.id
          return (
            <article
              key={product.id}
              className="pos-surface overflow-hidden"
              data-testid={`pos-product-card-${product.id}`}
              style={isEditingThis ? { outline: '2px solid var(--pos-accent)' } : undefined}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-semibold leading-tight">{product.name}</h2>
                    <p className="mt-1 text-sm" style={{ color: 'var(--pos-muted)' }}>
                      {formatPHP(product.price)} · {product.category}
                      {product.isImported ? ' · Imported' : ''}
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
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="pos-btn pos-btn-secondary"
                      data-testid={`pos-edit-product-${product.id}`}
                      onClick={() => openEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="pos-btn pos-btn-secondary"
                      style={{ color: 'var(--pos-danger)', borderColor: 'color-mix(in srgb, var(--pos-danger) 35%, var(--pos-line))' }}
                      data-testid={`pos-delete-product-${product.id}`}
                      onClick={() => {
                        if (!window.confirm(`Delete “${product.name}” from inventory?`)) return
                        void deleteProduct(product.id)
                          .then(() => {
                            if (editing?.id === product.id) setEditor(null)
                            notify(`Deleted ${product.name}`)
                          })
                          .catch((err: unknown) =>
                            notify(err instanceof Error ? err.message : 'Could not delete product'),
                          )
                      }}
                    >
                      Delete
                    </button>
                  </div>

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
                          void updateProductStock(product.id, qty)
                            .then(() => notify(`Stock set for ${product.name}`))
                            .catch((err: unknown) =>
                              notify(err instanceof Error ? err.message : 'Could not save stock'),
                            )
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
                          void restockProduct(product.id, qty)
                            .then(() => {
                              setRestockQty((prev) => ({ ...prev, [product.id]: '' }))
                              notify(`Restocked ${product.name}`)
                            })
                            .catch((err: unknown) =>
                              notify(err instanceof Error ? err.message : 'Could not restock'),
                            )
                        }}
                      >
                        Restock
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
