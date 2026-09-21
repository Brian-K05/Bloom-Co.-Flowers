import { Button } from './Button'
import type { ReactNode } from 'react'

type EmptyStateProps = {
  eyebrow?: string
  title: string
  body?: string
  actionLabel?: string
  actionHref?: string
  icon?: ReactNode
}

export function EmptyState({ eyebrow, title, body, actionLabel, actionHref, icon }: EmptyStateProps) {
  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center">
      {icon ? <div className="mb-6 flex justify-center text-rose/70">{icon}</div> : null}
      {eyebrow ? (
        <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-rose">{eyebrow}</p>
      ) : null}
      <h2 className="font-display text-4xl font-medium leading-tight text-ink sm:text-[2.75rem]">{title}</h2>
      {body ? <p className="mt-4 text-muted">{body}</p> : null}
      {actionLabel && actionHref ? (
        <div className="mt-8">
          <Button href={actionHref}>{actionLabel}</Button>
        </div>
      ) : null}
    </div>
  )
}
