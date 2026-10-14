import { Link } from 'react-router-dom'
import { usePosTheme } from '../PosThemeProvider'
import { posThemes } from '../themes/registry'
import type { PosThemeId } from '../types'

export function PosConceptsPage() {
  const { themeId, setTheme, theme } = usePosTheme()

  return (
    <div>
      <div>
        <h1 className="text-3xl">POS concepts</h1>
        <p className="mt-1 max-w-2xl text-sm" style={{ color: 'var(--pos-muted)' }}>
          Five switchable admin shells for the same Track B features. Default for presentation:{' '}
          <strong>Counter Clear</strong>. Flip live during walkthrough — orders and stock stay intact.
        </p>
      </div>

      <p className="mt-4 text-sm">
        Active: <span className="font-semibold">{theme.name}</span> ({theme.number})
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
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--pos-muted)' }}>
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
            Login at <Link to="/admin/login" className="underline">/admin/login</Link> — owner / staff, password{' '}
            <code className="pos-mono">demo123</code>
          </li>
          <li>
            Encode a Messenger order on <Link to="/admin/orders/new" className="underline">New order</Link>
          </li>
          <li>Confirm → watch inventory deduct</li>
          <li>Show Calendar + Pre-orders on a peak date filter</li>
          <li>Switch all five concepts here without losing demo data</li>
        </ol>
        <p className="mt-4 text-sm" style={{ color: 'var(--pos-muted)' }}>
          Meta Messenger automation and AI bot are Phase 2 (Track A) on the same data model — not in this demo.
        </p>
      </div>
    </div>
  )
}
