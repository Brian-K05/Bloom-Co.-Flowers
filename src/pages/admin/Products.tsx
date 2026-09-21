import { useMemo, useState, type FormEvent } from 'react'
import { BloomImage } from '../../components/ui/BloomImage'
import { Button } from '../../components/ui/Button'
import { useShop } from '../../context/ShopContext'
import { useToast } from '../../context/ToastContext'
import { categories, occasions } from '../../data/content'
import { images } from '../../lib/images'
import { categoryLabel, formatPHP } from '../../lib/format'
import type { Category, OccasionSlug, Product } from '../../types'

const emptyForm = {
  name: '',
  shortDescription: '',
  description: '',
  price: 1800,
  category: 'bouquets' as Category,
  occasions: ['just-because'] as OccasionSlug[],
  image: images.garden,
  available: true,
}

export function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, toggleAvailability } = useShop()
  const { notify } = useToast()
  const [editing, setEditing] = useState<Product | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const sorted = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name)),
    [products],
  )

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setCreating(true)
  }

  function openEdit(product: Product) {
    setCreating(false)
    setEditing(product)
    setForm({
      name: product.name,
      shortDescription: product.shortDescription,
      description: product.description,
      price: product.price,
      category: product.category,
      occasions: product.occasions,
      image: product.images[0],
      available: product.available,
    })
  }

  function close() {
    setCreating(false)
    setEditing(null)
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!form.name.trim() || !form.shortDescription.trim() || !form.description.trim()) {
      notify('Please complete the name and descriptions.')
      return
    }
    const payload = {
      name: form.name.trim(),
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      price: Number(form.price) || 0,
      category: form.category,
      occasions: form.occasions.length ? form.occasions : (['just-because'] as OccasionSlug[]),
      images: [form.image, images.white, images.botanical],
      available: form.available,
    }
    if (editing) {
      updateProduct(editing.id, payload)
      notify(`${payload.name} updated.`)
    } else {
      addProduct(payload)
      notify(`${payload.name} added to the catalog.`)
    }
    close()
  }

  function toggleOccasion(slug: OccasionSlug) {
    setForm((current) => ({
      ...current,
      occasions: current.occasions.includes(slug)
        ? current.occasions.filter((item) => item !== slug)
        : [...current.occasions, slug],
    }))
  }

  const panelOpen = creating || Boolean(editing)

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-rose">Catalog</p>
          <h1 className="mt-2 font-display text-5xl">Products</h1>
        </div>
        <Button type="button" onClick={openCreate}>
          Add product
        </Button>
      </div>

      <div className="mt-8 overflow-x-auto border border-line bg-paper">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line text-[11px] uppercase tracking-[0.16em] text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Availability</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((product) => (
              <tr key={product.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <BloomImage src={product.images[0]} alt="" className="h-12 w-12 shrink-0" />
                    <span>{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{categoryLabel(product.category)}</td>
                <td className="px-4 py-3">{formatPHP(product.price)}</td>
                <td className="px-4 py-3">{product.available ? 'Available' : 'Hidden'}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.14em]">
                    <button type="button" className="hover:text-rose" onClick={() => openEdit(product)}>
                      Edit
                    </button>
                    <button type="button" className="hover:text-rose" onClick={() => toggleAvailability(product.id)}>
                      Toggle
                    </button>
                    <button
                      type="button"
                      className="hover:text-rose"
                      onClick={() => {
                        if (window.confirm(`Remove ${product.name} from the demo catalog?`)) {
                          deleteProduct(product.id)
                          notify(`${product.name} removed.`)
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {panelOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-end bg-ink/30 sm:items-stretch">
          <form onSubmit={submit} className="h-[min(100svh,100%)] w-full max-w-lg overflow-y-auto bg-ivory p-6 shadow-2xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-rose">
              {editing ? 'Edit product' : 'Add product'}
            </p>
            <h2 className="mt-2 font-display text-4xl">{editing ? editing.name : 'New arrangement'}</h2>
            <label className="mt-6 block text-[11px] uppercase tracking-[0.16em] text-muted">
              Name
              <input
                className="mt-2 w-full border border-line bg-paper px-3 py-2.5 text-sm tracking-normal text-ink"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label className="mt-4 block text-[11px] uppercase tracking-[0.16em] text-muted">
              Short description
              <input
                className="mt-2 w-full border border-line bg-paper px-3 py-2.5 text-sm tracking-normal text-ink"
                value={form.shortDescription}
                onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              />
            </label>
            <label className="mt-4 block text-[11px] uppercase tracking-[0.16em] text-muted">
              Description
              <textarea
                rows={4}
                className="mt-2 w-full border border-line bg-paper px-3 py-2.5 text-sm tracking-normal text-ink"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </label>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="text-[11px] uppercase tracking-[0.16em] text-muted">
                Price (₱)
                <input
                  type="number"
                  min={0}
                  className="mt-2 w-full border border-line bg-paper px-3 py-2.5 text-sm tracking-normal text-ink"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                />
              </label>
              <label className="text-[11px] uppercase tracking-[0.16em] text-muted">
                Category
                <select
                  className="mt-2 w-full border border-line bg-paper px-3 py-2.5 text-sm tracking-normal text-ink"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                >
                  {categories
                    .filter((item) => item.id !== 'all')
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                </select>
              </label>
            </div>
            <label className="mt-4 block text-[11px] uppercase tracking-[0.16em] text-muted">
              Image URL
              <input
                className="mt-2 w-full border border-line bg-paper px-3 py-2.5 text-sm tracking-normal text-ink"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </label>
            <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-muted">Occasions</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {occasions.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => toggleOccasion(item.slug)}
                  className={`border px-3 py-1 text-xs ${
                    form.occasions.includes(item.slug) ? 'border-ink bg-ink text-cream' : 'border-line'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <label className="mt-5 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm({ ...form, available: e.target.checked })}
              />
              Available for sale
            </label>
            <div className="mt-6 flex gap-3">
              <Button type="submit">{editing ? 'Save changes' : 'Add to catalog'}</Button>
              <Button type="button" variant="secondary" onClick={close}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  )
}
