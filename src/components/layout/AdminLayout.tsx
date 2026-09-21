import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/', label: 'View store' },
]

export function AdminLayout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  return (
    <div className="min-h-svh bg-ivory">
      <header className="border-b border-line bg-cream">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-rose">Studio desk</p>
            <p className="font-display text-3xl tracking-[0.08em]">Bloom & Co.</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `text-[11px] uppercase tracking-[0.2em] ${
                    isActive && link.to.startsWith('/admin') ? 'text-rose' : 'text-ink hover:text-rose'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="page-enter mx-auto max-w-7xl px-5 py-10 lg:px-8" key={location.pathname}>
        <Outlet />
      </main>
    </div>
  )
}
