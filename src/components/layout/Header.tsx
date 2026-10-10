import { Search, ShoppingBag, User, X } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useShop } from '../../context/ShopContext'
import { formatPHP } from '../../lib/format'

const links = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/occasions', label: 'Occasions' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export function Header() {
  const { cartCount, products } = useShop()
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setOpen(false)
    setSearchOpen(false)
    setQuery('')
  }, [location.pathname])

  useEffect(() => {
    const locked = open || searchOpen
    document.body.style.overflow = locked ? 'hidden' : ''
    document.documentElement.style.overflow = locked ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [open, searchOpen])

  const results = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) return []
    return products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(value) ||
          product.shortDescription.toLowerCase().includes(value),
      )
      .slice(0, 6)
  }, [products, query])

  function submitSearch(event: FormEvent) {
    event.preventDefault()
    const value = query.trim()
    if (!value) return
    navigate(`/shop?q=${encodeURIComponent(value)}`)
    setSearchOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line/80 bg-ivory/92 backdrop-blur-md">
        <p className="hidden border-b border-line/60 px-4 py-2 text-center text-[11px] tracking-[0.12em] text-muted sm:block">
          Same-day delivery for selected Metro Manila areas
        </p>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <button
            type="button"
            className="flex flex-col gap-1.5 lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <span className="block h-px w-6 bg-ink" />
            <span className="block h-px w-4 bg-ink" />
          </button>

          <Link to="/" className="text-center">
            <span className="block font-display text-[28px] leading-none tracking-[0.12em] sm:text-[32px]">
              Bloom & Co.
            </span>
            <span className="mt-1 hidden text-[10px] uppercase tracking-[0.32em] text-muted sm:block">
              Flowers for Every Moment
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `text-[11px] uppercase tracking-[0.22em] ${isActive ? 'text-rose' : 'text-ink hover:text-rose'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <button type="button" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <Search size={18} />
            </button>
            <Link to="/account" aria-label="Account">
              <User size={18} />
            </Link>
            <Link to="/cart" aria-label="Cart" className="relative">
              <ShoppingBag size={18} />
              {cartCount > 0 ? (
                <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center bg-rose px-1 text-[10px] text-cream">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          </div>
        </div>
      </header>

      {open
        ? createPortal(
            <div
              className="mobile-overlay mobile-overlay--nav"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
            >
              <div className="flex items-center justify-between border-b border-line bg-ivory px-5 py-4">
                <span className="font-display text-2xl tracking-[0.12em]">Bloom & Co.</span>
                <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
                  <X />
                </button>
              </div>
              <nav className="flex flex-1 flex-col gap-5 overflow-y-auto bg-ivory px-6 py-10">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `font-display text-4xl ${isActive ? 'text-rose' : 'text-ink'}`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                <div className="mt-6 space-y-4 border-t border-line pt-6">
                  <Link
                    to="/account"
                    className="block text-[12px] uppercase tracking-[0.22em] text-muted"
                  >
                    Account
                  </Link>
                  <Link
                    to="/orders"
                    className="block text-[12px] uppercase tracking-[0.22em] text-muted"
                  >
                    Orders
                  </Link>
                  <Link
                    to="/cart"
                    className="block text-[12px] uppercase tracking-[0.22em] text-muted"
                  >
                    Cart{cartCount > 0 ? ` (${cartCount})` : ''}
                  </Link>
                  <Link
                    to="/preview-themes"
                    className="block text-[12px] uppercase tracking-[0.22em] text-muted"
                  >
                    Design themes
                  </Link>
                </div>
              </nav>
            </div>,
            document.body,
          )
        : null}

      {searchOpen
        ? createPortal(
            <div
              className="mobile-overlay mobile-overlay--search"
              role="dialog"
              aria-modal="true"
              aria-label="Search"
            >
              <div className="mx-auto max-w-2xl px-5 py-8">
                <div className="mb-8 flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-rose">
                    Search the atelier
                  </p>
                  <button
                    type="button"
                    aria-label="Close search"
                    onClick={() => setSearchOpen(false)}
                  >
                    <X />
                  </button>
                </div>
                <form onSubmit={submitSearch}>
                  <input
                    autoFocus
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search roses, boxes, birthdays..."
                    className="w-full border-b border-ink bg-transparent py-3 font-display text-3xl text-ink outline-none placeholder:text-ink/30"
                  />
                </form>
                <div className="mt-8 space-y-4">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="flex items-center justify-between gap-4 border-b border-line py-3"
                    >
                      <div>
                        <p className="font-display text-2xl">{product.name}</p>
                        <p className="text-sm text-muted">{product.shortDescription}</p>
                      </div>
                      <p className="text-sm">{formatPHP(product.price)}</p>
                    </Link>
                  ))}
                  {query && !results.length ? (
                    <p className="text-muted">No arrangements found for “{query}”.</p>
                  ) : null}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
