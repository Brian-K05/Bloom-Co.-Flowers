import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  Flower2,
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

type ShellLink = {
  to: string
  label: string
  icon: typeof LayoutDashboard
  end?: boolean
  primary?: boolean
  badge?: 'today'
}

const workspaceLinks: ShellLink[] = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList, badge: 'today' },
  { to: '/admin/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/admin/inventory', label: 'Inventory', icon: Package },
  { to: '/admin/prep', label: 'Flower Tally', icon: Flower2 },
  { to: '/admin/concepts', label: 'Concepts', icon: Palette },
]

const extraLinks: ShellLink[] = [
  { to: '/admin/orders/new', label: 'New Order', icon: PlusCircle, primary: true },
  { to: '/admin/preorders', label: 'Pre-Orders', icon: Truck },
  { to: '/admin/reference', label: 'Flower Reference', icon: BookOpen },
]

const peakStatuses: PosOrderStatus[] = ['not_paid', 'paid', 'partial']

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

  const todayOrders = useMemo(
    () => orders.filter((o) => o.scheduleDate === today && o.status !== 'cancelled'),
    [orders, today],
  )
  const todayCount = todayOrders.length
  const todayCounts = useMemo(
    () =>
      peakStatuses.map((status) => ({
        status,
        count: todayOrders.filter((o) => o.status === status).length,
      })),
    [todayOrders],
  )

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
  const isSplit = theme.layout === 'split'
  const divider = lightRail ? 'border-[var(--pos-line)]' : 'border-white/10'

  const renderLinks = (items: ShellLink[]) =>
    items.map((link) => {
      const Icon = link.icon
      return (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) => {
            const active =
              link.to === '/admin/orders'
                ? isActive && !location.pathname.startsWith('/admin/orders/new')
                : isActive
            return [
              'flex items-center gap-3 rounded-2xl px-3 font-semibold transition',
              isSoft ? 'min-h-12 py-3 text-[13px]' : 'min-h-10 py-2.5 text-[13px]',
              active
                ? 'bg-[var(--pos-accent)] text-[var(--pos-accent-ink)]'
                : link.primary
                  ? 'text-[var(--pos-accent-ink)] hover:bg-[var(--pos-accent-soft)]'
                  : 'opacity-80 hover:bg-[var(--pos-accent-soft)] hover:opacity-100',
            ].join(' ')
          }}
          title={link.label}
        >
          <Icon size={isSoft ? 20 : 18} />
          <span className="flex-1">{link.label}</span>
          {link.badge === 'today' ? (
            <span
              aria-hidden="true"
              className="rounded-full px-2 py-0.5 text-[11px] font-bold"
              style={{ background: '#1e3a2f', color: '#fff' }}
            >
              {todayCount}
            </span>
          ) : null}
        </NavLink>
      )
    })

  const nav = (
    <nav className={`flex flex-col gap-1 p-3 ${isSoft ? 'gap-2 p-4' : ''}`}>
      <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.2em] opacity-50">Workspace</p>
      {renderLinks(workspaceLinks)}
      <p className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.2em] opacity-50">Desk</p>
      {renderLinks(extraLinks)}
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
        className="mx-auto grid min-h-svh lg:grid-cols-[248px_1fr]"
      >
        <aside
          className={`pos-rail-border sticky top-0 hidden h-svh self-start overflow-y-auto lg:flex lg:flex-col ${lightRail ? 'border-r' : ''}`}
          style={{
            background: 'var(--pos-rail)',
            color: 'var(--pos-rail-ink)',
            borderColor: 'var(--pos-line)',
          }}
        >
          <div className={`border-b ${divider} px-5 py-6`}>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1e3a2f] text-white">
                <Flower2 size={22} />
              </span>
              <div>
                <p className="font-[family-name:var(--pos-display)] text-lg font-semibold">Bloom Desk</p>
                <p className="text-[10px] uppercase tracking-[0.18em] opacity-60">Order management</p>
              </div>
            </div>
          </div>
          {nav}
          <div className={`mt-auto space-y-3 border-t ${divider} p-4 text-xs`}>
            <div
              className="rounded-2xl border px-4 py-3"
              style={{ borderColor: 'var(--pos-line)', background: 'color-mix(in oklab, white 55%, transparent)' }}
              data-testid="pos-today-card"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] opacity-60">Today</p>
                <span className="h-2 w-2 rounded-full bg-[#e08a4a]" />
              </div>
              <p className="mt-1 text-3xl font-semibold">{todayCount}</p>
              <p className="opacity-70">Orders scheduled</p>
            </div>
            <p className="opacity-80">{user.displayName}</p>
            <button type="button" onClick={logout} className="underline underline-offset-2">
              Log out
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
