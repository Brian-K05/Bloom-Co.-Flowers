import { Check } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { useTheme } from '../themes/ThemeProvider'
import { themes, type ThemeId } from '../themes/types'

export function ThemePreviewPage() {
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20">
      <p className="text-[11px] uppercase tracking-[0.28em] text-rose">Client preview</p>
      <h1 className="mt-3 font-display text-5xl leading-tight sm:text-6xl">Choose your look</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Three complete design directions for the same flower-shop ordering system. Pick the feeling that fits your brand —
        features stay identical.
      </p>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {themes.map((item) => {
          const active = theme === item.id
          return (
            <article
              key={item.id}
              className={`overflow-hidden border transition-colors ${
                active ? 'border-rose' : 'border-line'
              } bg-paper`}
            >
              <div className="aspect-[16/10] overflow-hidden bg-[#eee6da]">
                <img
                  src={item.mockup}
                  alt={`${item.name} homepage mockup`}
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-3xl">{item.name}</h2>
                    <p className="mt-1 text-sm text-muted">{item.tagline}</p>
                  </div>
                  {active ? (
                    <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.16em] text-rose">
                      <Check size={14} /> Active
                    </span>
                  ) : null}
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button
                    type="button"
                    size="sm"
                    variant={active ? 'secondary' : 'primary'}
                    onClick={() => setTheme(item.id as ThemeId)}
                  >
                    {active ? 'Selected' : 'Use this theme'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTheme(item.id as ThemeId)
                      navigate('/')
                    }}
                  >
                    Preview site
                  </Button>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <p className="mt-10 text-sm text-muted">
        You can also switch themes anytime from the footer, or open{' '}
        <Link to="/preview-themes" className="underline underline-offset-4">
          /preview-themes
        </Link>
        .
      </p>
    </div>
  )
}
