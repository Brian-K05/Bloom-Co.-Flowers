import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Menu,
  Package,
  Palette,
  PlusCircle,
  Truck,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, NavLink, Outlet, useLocation } from 'react-router-dom'
import { todayISODate } from '../lib/format'
import { usePosAuth } from './auth/PosAuthContext'
import { usePosTheme } from './PosThemeProvider'
import { usePos } from './store/PosContext'
import { posThemes } from './themes/registry'
import type { PosOrderStatus, PosThemeId } from './types'
import { statusLabel } from './components/StatusBadge'

const links = [
  { to: '/admin', label: 'Dashboard', short: 'Dash', icon: LayoutDashboard, end: true },
  { to: '/admin/orders/new', label: 'New Order', short: 'New', icon: PlusCircle },
  { to: '/admin/orders', label: 'Orders', short: 'Orders', icon: ClipboardList },
  { to: '/admin/calendar', label: 'Calendar', short: 'Cal', icon: CalendarDays },
  { to: '/admin/inventory', label: 'Inventory', short: 'Stock', icon: Package },
  { to: '/admin/preorders', label: 'Pre-orders', short: 'Pre', icon: Truck },
  { to: '/admin/reference', label: 'Reference', short: 'Ref', icon: BookOpen },
  { to: '/admin/concepts', label: 'Concepts', short: 'UI', icon: Palette },
]

const peakStatuses: PosOrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready_out']

export function PosShell() {
  const { user, logout } = usePosAuth()
  const { theme, themeId, setTheme } = usePosTheme()
  const { orders } = usePos()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const today = todayISODate()

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

  const nav = (
    <nav className={`flex flex-col gap-1 p-3 ${isSoft ? 'gap-2 p-4' : ''}`}>
      {links.map((link) => {
        const Icon = link.icon
        return (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-[var(--pos-radius)] px-3 transition ${
                isSoft ? 'min-h-12 py-3 text-[13px]' : 'py-2.5 text-[12px]'
              } font-semibold uppercase tracking-[0.12em] ${
                isActive ? 'bg-[var(--pos-accent)] text-white' : 'opacity-85 hover:opacity-100'
              } ${isRail ? 'lg:justify-center lg:px-2 xl:justify-start xl:px-3' : ''}`
            }
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
          isRail ? 'lg:grid-cols-[72px_1fr] xl:grid-cols-[240px_1fr]' : 'lg:grid-cols-[240px_1fr]'
        }`}
      >
        <aside
          className="hidden lg:flex lg:flex-col"
          style={{ background: 'var(--pos-rail)', color: 'var(--pos-rail-ink)' }}
        >
          <div className={`border-b border-white/10 ${isRail ? 'px-2 py-5 xl:px-5' : 'px-5 py-6'}`}>
            <p className={`text-[10px] uppercase tracking-[0.28em] opacity-70 ${isRail ? 'lg:text-center xl:text-left' : ''}`}>
              Track B POS
            </p>
            <p
              className={`mt-1 font-[family-name:var(--pos-display)] ${isRail ? 'lg:text-center lg:text-lg xl:text-left xl:text-2xl' : 'text-2xl'}`}
            >
              {isRail ? <span className="lg:inline xl:hidden">BD</span> : null}
              <span className={isRail ? 'lg:hidden xl:inline' : ''}>Bloom Desk</span>
            </p>
            <p className={`mt-1 text-xs opacity-70 ${isRail ? 'lg:hidden xl:block' : ''}`}>{theme.name}</p>
          </div>
          {nav}
          <div className={`mt-auto border-t border-white/10 text-xs opacity-80 ${isRail ? 'p-2 xl:p-4' : 'p-4'}`}>
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

        <div className="flex min-w-0 flex-col">
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
                  className="bg-[var(--pos-surface)] px-3 py-2 text-center transition hover:bg-[var(--pos-accent-soft)]"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em]">{statusLabel(item.status)}</p>
                  <p className="mt-0.5 text-xl font-semibold">{item.count}</p>
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
              background: isNight
                ? 'color-mix(in oklab, var(--pos-bg) 88%, transparent)'
                : 'color-mix(in oklab, var(--pos-bg) 90%, white)',
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
                  className="pos-field !py-1.5 text-xs"
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
                className={`pos-btn pos-btn-primary ${isSoft ? '!min-h-11 !px-4' : '!min-h-9 !px-3'}`}
              >
                New order
              </NavLink>
            </div>
          </header>

          <main
            className={`page-enter min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 ${isSplit ? 'max-w-[1400px]' : ''} ${isSoft ? 'sm:px-8' : ''}`}
            key={location.pathname}
          >
            <Outlet />
          </main>
        </div>
      </div>

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
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <p className="font-[family-name:var(--pos-display)] text-xl">Bloom Desk</p>
              <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>
            {nav}
            <div className="mt-auto space-y-3 border-t border-white/10 p-4">
              <label className="block text-xs opacity-80">
                Theme
                <select
                  className="pos-field mt-1 text-ink"
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
