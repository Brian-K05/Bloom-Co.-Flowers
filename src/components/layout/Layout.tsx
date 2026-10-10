import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useConcept } from '../../concepts/ConceptProvider'
import { CustomCursor } from '../../concepts/components/CustomCursor'
import { Footer } from './Footer'
import { Header } from './Header'
import type { ConceptId } from '../../concepts/registry'

const shellBg: Record<ConceptId, string> = {
  'elegant-minimal': 'bg-ivory',
  'dark-luxury': 'bg-ink',
  'bright-playful': 'bg-cream',
  'rustic-warm': 'bg-[#f3ebe1]',
  'modern-bold': 'bg-paper',
  'romantic-editorial': 'bg-[#fbf7f4]',
  'artistic-photographic': 'bg-[#11160f]',
  'scandinavian-nature': 'bg-paper',
  'interactive-immersive': 'bg-[#070b16]',
  'local-boutique': 'bg-[#f7f1e8]',
}

export function Layout() {
  const location = useLocation()
  const { conceptId } = useConcept()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  return (
    <div className={`flex min-h-svh flex-col ${shellBg[conceptId]}`}>
      <CustomCursor />
      <Header />
      <main className="page-enter flex-1" key={location.pathname}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
