import { Link } from 'react-router-dom'
import { usePosTheme } from '../PosThemeProvider'
import { posThemes } from '../themes/registry'
import type { PosThemeId } from '../types'

const swatches: Record<PosThemeId, string[]> = {
  'counter-clear': ['#F7F8F5', '#A7BFA3', '#2E3A2F'],
  'peak-board': ['#000000', '#FFFFFF', '#FF6B6B'],
  'bloom-ledger': ['#FFF8F6', '#E89BA7', '#6B4F4F'],
  'night-shift': ['#1A1A1A', '#0FF3C7', '#E6E7E8'],
  'studio-grid': ['#F6F7F3', '#7C8F68', '#1B1B1B'],
}

export function PosConceptsPage() {
  const { themeId, setTheme, theme } = usePosTheme()

  return (
    <div>
      <div>
        <h1 className="text-3xl">POS concepts</h1>
        <p className="mt-1 max-w-2xl text-sm" style={{ color: 'var(--pos-muted)' }}>
          Five switchable Bloom Desk shells from the UI Concepts Board. Same Track B features — flip live for the
          owner walkthrough. Default: <strong>Counter Clear</strong>.
        </p>
      </div>

      <p className="mt-4 text-sm">
        Active: <span className="font-semibold">{theme.name}</span> · {theme.pitch}
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {posThemes.map((item) => {
          const active = item.id === themeId
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTheme(item.id as PosThemeId)}
              className="pos-surface p-5 text-left transition hover:-translate-y-0.5"
              style={active ? { outline: '2px solid var(--pos-accent)' } : undefined}
              data-testid={`pos-concept-${item.id}`}
            >
              <p className="text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--pos-muted)' }}>
                {item.number} · {item.mood}
              </p>
              <h2 className="mt-2 text-2xl">{item.name}</h2>
              <div className="mt-3 flex gap-2">
                {swatches[item.id].map((hex) => (
                  <span
                    key={hex}
                    className="h-7 w-7 rounded-full border"
                    style={{ background: hex, borderColor: 'var(--pos-line)' }}
                    title={hex}
                  />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--pos-muted)' }}>
                {item.description}
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--pos-accent)' }}>
                Layout: {item.layout}
              </p>
              {active ? (
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide">Selected</p>
              ) : (
                <p className="mt-3 text-xs" style={{ color: 'var(--pos-muted)' }}>
                  Click to apply
                </p>
              )}
            </button>
          )
        })}
      </div>

      <div className="pos-surface mt-8 p-5">
        <h2 className="text-xl">Presenter path</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed">
          <li>
            Login <Link to="/admin/login" className="underline">/admin/login</Link> —{' '}
            <code className="pos-mono">owner</code> / <code className="pos-mono">demo123</code>
          </li>
          <li>Start on Counter Clear dashboard — greeting, today table, low stock, reminders</li>
          <li>Encode a Messenger order → Confirm → stock deducts</li>
          <li>Flip to Peak Board for kanban war room</li>
          <li>Show Bloom Ledger on phone width, Night Shift week strip, Studio Grid split New Order</li>
        </ol>
        <p className="mt-4 text-sm" style={{ color: 'var(--pos-muted)' }}>
          Tip: Encode from Messenger? Select <strong>Messenger</strong> as the source. Cancel restores stock if already
          deducted.
        </p>
      </div>
    </div>
  )
}
