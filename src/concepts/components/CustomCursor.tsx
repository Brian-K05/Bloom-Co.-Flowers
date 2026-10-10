import { useEffect, useState } from 'react'
import { useConcept } from '../ConceptProvider'

export function CustomCursor() {
  const { concept } = useConcept()
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [hovering, setHovering] = useState(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setEnabled(fine && !reduce)
  }, [])

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-custom-cursor')
    const onMove = (event: MouseEvent) => {
      setPos({ x: event.clientX, y: event.clientY })
      const target = event.target as HTMLElement | null
      const interactive = Boolean(
        target?.closest('a, button, [role="button"], input, textarea, select, .cursor-hover'),
      )
      setHovering(interactive)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('mousemove', onMove)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      className={`concept-cursor concept-cursor--${concept.cursor} ${hovering ? 'is-hover' : ''}`}
      style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
      aria-hidden
    >
      <span className="concept-cursor__dot" />
      <span className="concept-cursor__ring" />
      {hovering && concept.cursorLabel ? (
        <span className="concept-cursor__label">{concept.cursorLabel}</span>
      ) : null}
    </div>
  )
}
