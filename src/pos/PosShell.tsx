import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Menu,
  Package,
  Palette,
  Plus,
  PlusCircle,
  Truck,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, NavLink, Outlet, useLocation } from 'react-router-dom'
import { todayISODate } from '../lib/format'
import { usePosAuth } from './auth/PosAuthContext'
import { statusLabel } from './components/StatusBadge'
import { usePosTheme } from './PosThemeProvider'
import { usePos } from './store/PosContext'
import { posThemes } from './themes/registry'
import type { PosOrderStatus, PosThemeId } from './types'

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/orders/new', label: 'New Order', icon: PlusCircle, primary: true },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { to: '/admin/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/admin/inventory', label: 'Inventory', icon: Package },
  { to: '/admin/preorders', label: 'Pre-Orders', icon: Truck },
  { to: '/admin/reference', label: 'Flower Reference', icon: BookOpen },
  { to: '/admin/concepts', label: 'Concepts', icon: Palette },
]

const peakStatuses: PosOrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready_out']

export function PosShell() {
  const { user, logout } = usePosAuth()
  const { theme, themeId, setTheme } = usePosTheme()
  const { orders, products, loading, error, backend, refresh, ready } = usePos()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const today = todayISODate()
  const onNewOrder = location.pathname.startsWith('/admin/orders/new')
  const lightRail = themeId === 'counter-clear' || themeId === 'bloom-ledger' || themeId === 'studio-grid'

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    setOpen(false)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  const todayCounts = useMemo(() => {
    const todays = orders.filter((o) => o.scheduleDate === today && o.status !== 'cancelled')
    return peakStatuses.map((status) => ({
      status,
      count: todays.filter((o) => o.status === status).length,
    }))
  }, [orders, today])

  const weekStrip = useMemo(() => {
    const start = new Date()
    const day = start.getDay()
    const diff = day === 0 ? -6 : 1 - day
    start.setDate(start.getDate() + diff)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      const offset = d.getTimezoneOffset()
      const iso = new Date(d.getTime() - offset * 60_000).toISOString().slice(0, 10)
      const count = orders.filter((o) => o.scheduleDate === iso && o.status !== 'cancelled').length
      return { iso, label: d.toLocaleDateString('en-PH', { weekday: 'short' }), day: d.getDate(), count }
    })
  }, [orders])

  if (!user) return <Navigate to="/admin/login" replace />

  const isNight = themeId === 'night-shift'
  const isPeak = themeId === 'peak-board'
  const isSoft = themeId === 'bloom-ledger'
  const isRail = theme.layout === 'rail'
  const isSplit = theme.layout === 'split'
  const divider = lightRail ? 'border-[var(--pos-line)]' : 'border-white/10'

  const nav = (
    <nav className={`flex flex-col gap-1 p-3 ${isSoft ? 'gap-2 p-4' : ''}`}>
      {links.map((link) => {
        const Icon = link.icon
        return (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => {
              const active = isActive
              return [
                'flex items-center gap-3 rounded-[var(--pos-radius)] px-3 font-semibold transition',
                isSoft ? 'min-h-12 py-3 text-[13px]' : 'min-h-10 py-2.5 text-[12px]',
                isRail ? 'lg:justify-center lg:px-2 xl:justify-start xl:px-3' : '',
                active
                  ? 'bg-[var(--pos-accent)] text-[var(--pos-accent-ink)]'
                  : link.primary
                    ? 'text-[var(--pos-accent)] hover:bg-[var(--pos-accent-soft)]'
                    : 'opacity-80 hover:opacity-100',
              ].join(' ')
            }}
            title={link.label}
          >
            <Icon size={isSoft ? 20 : 18} />
            <span className={isRail ? 'lg:hidden xl:inline' : ''}>{link.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )

  return (
    <div
      className={[
        'pos-app',
        isPeak ? 'pos-peak' : '',
        isSoft ? 'pos-soft' : '',
        isNight ? 'pos-night' : '',
        isSplit ? 'pos-split' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-testid="pos-shell"
      data-layout={theme.layout}
    >
      <div
        className={`mx-auto grid min-h-svh ${
          isRail ? 'lg:grid-cols-[72px_1fr] xl:grid-cols-[240px_1fr]' : 'lg:grid-cols-[248px_1fr]'
        }`}
      >
        <aside
          className={`pos-rail-border sticky top-0 hidden h-svh self-start overflow-y-auto lg:flex lg:flex-col ${lightRail ? 'border-r' : ''}`}
          style={{
            background: 'var(--pos-rail)',
            color: 'var(--pos-rail-ink)',
            borderColor: 'var(--pos-line)',
          }}
        >
          <div className={`border-b ${divider} ${isRail ? 'px-2 py-5 xl:px-5' : 'px-5 py-6'}`}>
            <p
              className={`text-[10px] uppercase tracking-[0.24em] opacity-70 ${isRail ? 'lg:text-center xl:text-left' : ''}`}
            >
              Track B POS
            </p>
            <p
              className={`mt-1 font-[family-name:var(--pos-display)] font-semibold ${
                isRail ? 'lg:text-center lg:text-lg xl:text-left xl:text-2xl' : 'text-2xl'
              }`}
            >
              {isRail ? <span className="lg:inline xl:hidden">BD</span> : null}
              <span className={isRail ? 'lg:hidden xl:inline' : ''}>Bloom Desk</span>
            </p>
            <p className={`mt-1 text-xs opacity-70 ${isRail ? 'lg:hidden xl:block' : ''}`}>{theme.name}</p>
          </div>
          {nav}
          <div className={`mt-auto border-t ${divider} text-xs opacity-80 ${isRail ? 'p-2 xl:p-4' : 'p-4'}`}>
            <p className={isRail ? 'lg:hidden xl:block' : ''}>{user.displayName}</p>
            <button
              type="button"
              onClick={logout}
              className={`mt-2 underline underline-offset-2 ${isRail ? 'lg:w-full lg:text-center xl:text-left' : ''}`}
            >
              {isRail ? <span className="lg:inline xl:hidden">Out</span> : null}
              <span className={isRail ? 'lg:hidden xl:inline' : ''}>Log out</span>
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col pb-20 sm:pb-0">
          {isPeak ? (
            <div
              className="grid grid-cols-2 gap-px border-b sm:grid-cols-4"
              style={{ borderColor: 'var(--pos-line)', background: 'var(--pos-line)' }}
              data-testid="peak-status-strip"
            >
              {todayCounts.map((item) => (
                <Link
                  key={item.status}
                  to="/admin/orders"
                  className="bg-[var(--pos-surface)] px-3 py-2.5 text-center transition hover:bg-[var(--pos-accent-soft)]"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em]">{statusLabel(item.status)}</p>
                  <p className="mt-0.5 text-xl font-semibold" style={{ color: 'var(--pos-accent)' }}>
                    {item.count}
                  </p>
                </Link>
              ))}
            </div>
          ) : null}

          {isNight ? (
            <div
              className="flex gap-2 overflow-x-auto border-b px-3 py-2"
              style={{ borderColor: 'var(--pos-line)' }}
              data-testid="night-week-strip"
            >
              {weekStrip.map((d) => (
                <Link
                  key={d.iso}
                  to="/admin/calendar"
                  className="min-w-[4.5rem] rounded-[var(--pos-radius)] border px-2 py-1.5 text-center"
                  style={{
                    borderColor: d.iso === today ? 'var(--pos-accent)' : 'var(--pos-line)',
                    background: d.iso === today ? 'var(--pos-accent-soft)' : 'transparent',
                  }}
                >
                  <p className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--pos-muted)' }}>
                    {d.label}
                  </p>
                  <p className="pos-mono text-sm font-semibold">{d.day}</p>
                  <p className="text-[10px]" style={{ color: 'var(--pos-accent)' }}>
                    {d.count}
                  </p>
                </Link>
              ))}
            </div>
          ) : null}

          <header
            className="sticky top-0 z-40 border-b px-4 py-3 backdrop-blur"
            style={{
              borderColor: 'var(--pos-line)',
              background: isNight || isPeak
                ? 'color-mix(in oklab, var(--pos-bg) 88%, transparent)'
                : 'color-mix(in oklab, var(--pos-bg) 92%, white)',
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                className="lg:hidden"
                aria-label="Open menu"
                onClick={() => setOpen(true)}
                data-testid="pos-mobile-menu"
              >
                <Menu size={22} />
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold lg:hidden">Bloom Desk · {theme.name}</p>
                <p className="hidden text-xs lg:block" style={{ color: 'var(--pos-muted)' }}>
                  Messenger orders encoded here · Meta automation is Phase 2
                </p>
              </div>
              <label className="hidden items-center gap-2 text-xs sm:flex" style={{ color: 'var(--pos-muted)' }}>
                Theme
                <select
                  className="pos-field !min-h-0 !py-1.5 text-xs"
                  value={themeId}
                  onChange={(e) => setTheme(e.target.value as PosThemeId)}
                  aria-label="POS theme"
                  data-testid="pos-theme-select"
                >
                  {posThemes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.number} {t.name}
                    </option>
                  ))}
                </select>
              </label>
              <NavLink
                to="/admin/orders/new"
                className={`pos-btn pos-btn-primary hidden sm:inline-flex ${isSoft ? '!min-h-11 !px-4' : '!min-h-9 !px-3'}`}
              >
                + New order
              </NavLink>
            </div>
          </header>

          <main
            className={`page-enter min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 ${isSplit ? 'max-w-[1400px]' : ''} ${isSoft ? 'sm:px-8' : ''}`}
            key={location.pathname}
          >
            {loading && !ready ? (
              <p className="mb-4 text-sm" style={{ color: 'var(--pos-muted)' }}>
                Loading POS data…
              </p>
            ) : null}
            {error ? (
              <div
                className="pos-surface mb-4 flex flex-wrap items-center justify-between gap-3 p-4 text-sm"
                style={{ borderColor: 'var(--pos-danger)' }}
              >
                <p>
                  Could not load database: {error}. Check Supabase keys / bootstrap SQL, or use local demo mode.
                </p>
                <button type="button" className="pos-btn pos-btn-secondary" onClick={() => void refresh()}>
                  Retry
                </button>
              </div>
            ) : null}
            <p className="mb-4 text-[11px] uppercase tracking-[0.14em]" style={{ color: 'var(--pos-muted)' }}>
              Data: {backend === 'supabase' ? 'Supabase (seeded catalog)' : 'localStorage fallback — set VITE_SUPABASE_* for live DB'}
            </p>
            {backend === 'supabase' && ready && !loading && products.length === 0 ? (
              <div
                className="pos-surface mb-4 p-4 text-sm"
                style={{ borderColor: 'var(--pos-danger)' }}
              >
                Database is connected but has no products. Run{' '}
                <code className="pos-mono text-xs">supabase/migrate_shop_options.sql</code> (or full{' '}
                <code className="pos-mono text-xs">bootstrap.sql</code>), then use <strong>Reset demo</strong> on the
                dashboard.
              </div>
            ) : null}
            <Outlet />
          </main>
        </div>
      </div>

      {!onNewOrder && isMobile ? (
        <Link
          to="/admin/orders/new"
          className="pos-btn pos-btn-primary pos-fab"
          aria-label="New order"
          data-testid="pos-fab-new-order"
        >
          <Plus size={18} />
          New order
        </Link>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="POS menu">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute inset-y-0 left-0 flex w-[min(86vw,300px)] flex-col animate-[posDrawer_180ms_ease]"
            style={{ background: 'var(--pos-rail)', color: 'var(--pos-rail-ink)' }}
            data-testid="pos-mobile-drawer"
          >
            <div className={`flex items-center justify-between border-b px-4 py-4 ${divider}`}>
              <p className="font-[family-name:var(--pos-display)] text-xl font-semibold">Bloom Desk</p>
              <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>
            {nav}
            <div className={`mt-auto space-y-3 border-t p-4 ${divider}`}>
              <label className="block text-xs opacity-80">
                Theme
                <select
                  className="pos-field mt-1"
                  value={themeId}
                  onChange={(e) => setTheme(e.target.value as PosThemeId)}
                  data-testid="pos-theme-select-mobile"
                >
                  {posThemes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.number} {t.name}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" onClick={logout} className="text-sm underline">
                Log out ({user.displayName})
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
