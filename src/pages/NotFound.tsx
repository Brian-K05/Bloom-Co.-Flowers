import { Button } from '../components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="text-[11px] uppercase tracking-[0.28em] text-rose">404</p>
      <h1 className="mt-3 font-display text-5xl">This page isn’t in the garden.</h1>
      <p className="mt-4 text-muted">The address may have changed, or the arrangement has been moved.</p>
      <div className="mt-8">
        <Button href="/">Return home</Button>
      </div>
    </div>
  )
}
