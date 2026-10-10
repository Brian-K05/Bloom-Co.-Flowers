import { Search, ShoppingBag, User, X } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useShop } from '../../context/ShopContext'
import { formatPHP } from '../../lib/format'
import { useConcept } from '../ConceptProvider'
import type { ConceptId } from '../registry'

const links = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/occasions', label: 'Occasions' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/concepts', label: 'Concepts' },
]

type Chrome = {
  bar: string
  brand: string
  tagline: string
  nav: string
  navActive: string
  icon: string
  banner?: string
  bannerText?: string
  layout: 'standard' | 'centered' | 'split-bold' | 'minimal' | 'glass'
}

const chromeByConcept: Record<ConceptId, Chrome> = {
  'elegant-minimal': {
    bar: 'border-b border-line/60 bg-ivory/95 backdrop-blur-md',
    brand: 'font-display text-[26px] tracking-[0.1em]',
    tagline: 'hidden',
    nav: 'text-[11px] uppercase tracking-[0.22em] text-ink hover:text-rose',
    navActive: 'text-rose',
    icon: 'text-ink',
    layout: 'centered',
  },
  'dark-luxury': {
    bar: 'border-b border-white/10 bg-ink/95 text-paper backdrop-blur-md',
    brand: 'font-display text-[24px] tracking-[0.12em] text-paper',
    tagline: 'mt-1 hidden text-[10px] uppercase tracking-[0.22em] text-gold sm:block',
    nav: 'text-[11px] uppercase tracking-[0.22em] text-paper/70 hover:text-gold',
    navActive: 'text-gold',
    icon: 'text-paper',
    banner: 'border-b border-white/10 bg-black text-gold/90',
    bannerText: 'Evening delivery windows available in selected Metro Manila areas',
    layout: 'standard',
  },
  'bright-playful': {
    bar: 'border-b border-rose/20 bg-cream/95 backdrop-blur-md',
    brand: 'font-display text-[28px] font-bold tracking-tight text-rose',
    tagline: 'mt-0.5 hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-muted sm:block',
    nav: 'rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink hover:bg-rose/10',
    navActive: 'bg-rose text-on-accent hover:bg-rose',
    icon: 'text-ink',
    layout: 'standard',
  },
  'rustic-warm': {
    bar: 'border-b border-[#d9cbb8] bg-[#f3ebe1]/95 backdrop-blur-md',
    brand: 'font-display text-[26px] italic tracking-[0.04em]',
    tagline: 'mt-1 hidden text-[10px] uppercase tracking-[0.18em] text-[#7a6a55] sm:block',
    nav: 'text-[12px] text-[#5c4e3c] hover:text-ink',
    navActive: 'text-ink underline underline-offset-4',
    icon: 'text-ink',
    layout: 'centered',
  },
  'modern-bold': {
    bar: 'border-b-4 border-ink bg-paper',
    brand: 'font-display text-[28px] font-bold uppercase tracking-tighter',
    tagline: 'hidden',
    nav: 'text-[11px] font-bold uppercase tracking-[0.18em] text-ink hover:text-rose',
    navActive: 'text-rose',
    icon: 'text-ink',
    layout: 'split-bold',
  },
  'romantic-editorial': {
    bar: 'border-b border-rose/20 bg-[#fbf7f4]/95 backdrop-blur-md',
    brand: 'font-display text-[26px] italic tracking-[0.06em]',
    tagline: 'mt-1 hidden text-[10px] uppercase tracking-[0.2em] text-rose/80 sm:block',
    nav: 'text-[11px] uppercase tracking-[0.2em] text-muted hover:text-rose',
    navActive: 'text-rose',
    icon: 'text-ink',
    layout: 'standard',
  },
  'artistic-photographic': {
    bar: 'border-b border-white/10 bg-[#11160f]/90 text-paper backdrop-blur-md',
    brand: 'font-display text-[22px] tracking-[0.28em] text-paper',
    tagline: 'hidden',
    nav: 'text-[10px] uppercase tracking-[0.28em] text-paper/60 hover:text-paper',
    navActive: 'text-paper',
    icon: 'text-paper',
    layout: 'minimal',
  },
  'scandinavian-nature': {
    bar: 'border-b border-line bg-paper/95 backdrop-blur-md',
    brand: 'font-display text-[22px] tracking-[0.2em]',
    tagline: 'mt-1 hidden text-[10px] uppercase tracking-[0.2em] text-sage sm:block',
    nav: 'text-[11px] uppercase tracking-[0.2em] text-muted hover:text-ink',
    navActive: 'text-ink',
    icon: 'text-ink',
    layout: 'standard',
  },
  'interactive-immersive': {
    bar: 'border-b border-accent/20 bg-[#070b16]/85 text-paper backdrop-blur-xl',
    brand: 'font-display text-[20px] tracking-[0.3em] text-accent',
    tagline: 'hidden',
    nav: 'text-[10px] uppercase tracking-[0.28em] text-paper/70 hover:text-accent',
    navActive: 'text-accent',
    icon: 'text-paper',
    banner: 'border-b border-accent/20 bg-[#0c1224] text-accent/90',
    bannerText: 'Mood filters live — set your vibe in shop',
    layout: 'glass',
  },
  'local-boutique': {
    bar: 'border-b border-[#e0d4c4] bg-[#f7f1e8]/95 backdrop-blur-md',
    brand: 'font-display text-[24px] tracking-[0.04em]',
    tagline: 'mt-1 hidden text-[10px] uppercase tracking-[0.16em] text-[#2f5d3a] sm:block',
    nav: 'text-[12px] text-muted hover:text-[#2f5d3a]',
    navActive: 'font-semibold text-[#2f5d3a]',
    icon: 'text-ink',
    banner: 'bg-[#2f5d3a] text-[#f7f1e8]',
    bannerText: 'Same-day delivery for selected Metro Manila areas · PHP pricing',
    layout: 'standard',
  },
}

function NavLinks({ chrome, endHome = true }: { chrome: Chrome; endHome?: boolean }) {
  return (
    <>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={endHome && link.to === '/'}
          className={({ isActive }) => `${chrome.nav} ${isActive ? chrome.navActive : ''}`}
        >
          {link.label}
        </NavLink>
      ))}
    </>
  )
}

export function ConceptHeader() {
  const { concept, conceptId } = useConcept()
  const chrome = chromeByConcept[conceptId]
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

  const actions = (
    <div className={`flex items-center gap-3 sm:gap-4 ${chrome.icon}`}>
      <button type="button" aria-label="Search" onClick={() => setSearchOpen(true)}>
        <Search size={18} />
      </button>
      <Link to="/account" aria-label="Account">
        <User size={18} />
      </Link>
      <Link to="/cart" aria-label="Cart" className="relative">
        <ShoppingBag size={18} />
        {cartCount > 0 ? (
          <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center bg-rose px-1 text-[10px] text-on-accent">
            {cartCount}
          </span>
        ) : null}
      </Link>
    </div>
  )

  const menuButton = (
    <button
      type="button"
      className={`flex flex-col gap-1.5 lg:hidden ${chrome.icon}`}
      aria-label="Open menu"
      aria-expanded={open}
      onClick={() => setOpen(true)}
    >
      <span className="block h-px w-6 bg-current" />
      <span className="block h-px w-4 bg-current" />
    </button>
  )

  const brandBlock = (
    <Link to="/" className="text-center">
      <span className={`block leading-none ${chrome.brand}`}>{concept.brand}</span>
      {chrome.tagline !== 'hidden' ? (
        <span className={`max-w-[220px] truncate ${chrome.tagline}`}>{concept.tagline}</span>
      ) : null}
    </Link>
  )

  let shell: ReactNode
  if (chrome.layout === 'centered') {
    shell = (
      <div className="mx-auto max-w-7xl px-5 py-4 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {menuButton}
          <div className="flex-1 lg:text-center">{brandBlock}</div>
          {actions}
        </div>
        <nav className="mt-4 hidden items-center justify-center gap-8 lg:flex">
          <NavLinks chrome={chrome} />
        </nav>
      </div>
    )
  } else if (chrome.layout === 'split-bold') {
    shell = (
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
        {menuButton}
        {brandBlock}
        <nav className="hidden items-center gap-6 lg:flex">
          <NavLinks chrome={chrome} />
        </nav>
        {actions}
      </div>
    )
  } else if (chrome.layout === 'minimal') {
    shell = (
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        {menuButton}
        {brandBlock}
        <nav className="hidden items-center gap-6 lg:flex">
          <NavLinks chrome={chrome} />
        </nav>
        {actions}
      </div>
    )
  } else {
    shell = (
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        {menuButton}
        {brandBlock}
        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
          <NavLinks chrome={chrome} />
        </nav>
        {actions}
      </div>
    )
  }

  return (
    <>
      <header className={`sticky top-0 z-50 ${chrome.bar}`}>
        {chrome.banner ? (
          <p className={`hidden px-4 py-2 text-center text-[11px] tracking-[0.12em] sm:block ${chrome.banner}`}>
            {chrome.bannerText}
          </p>
        ) : null}
        {shell}
      </header>

      {open
        ? createPortal(
            <div className="mobile-overlay mobile-overlay--nav" role="dialog" aria-modal="true" aria-label="Menu">
              <div className="flex items-center justify-between border-b border-line bg-ivory px-5 py-4 text-ink">
                <span className="font-display text-2xl tracking-[0.08em]">{concept.brand}</span>
                <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
                  <X />
                </button>
              </div>
              <nav className="flex flex-1 flex-col gap-5 overflow-y-auto bg-ivory px-6 py-10 text-ink">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) => `font-display text-4xl ${isActive ? 'text-rose' : 'text-ink'}`}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>,
            document.body,
          )
        : null}

      {searchOpen
        ? createPortal(
            <div className="mobile-overlay mobile-overlay--search" role="dialog" aria-modal="true" aria-label="Search">
              <div className="mx-auto max-w-2xl px-5 py-8">
                <div className="mb-8 flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-rose">Search</p>
                  <button type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}>
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
