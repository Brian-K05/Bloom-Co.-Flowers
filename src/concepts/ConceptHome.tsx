import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useConcept } from './ConceptProvider'
import { getConcept, isConceptId, isConceptSlug, type ConceptId } from './registry'
import { ArtisticPhotoHome } from './homes/ArtisticPhotoHome'
import { BrightPlayfulHome } from './homes/BrightPlayfulHome'
import { DarkLuxuryHome } from './homes/DarkLuxuryHome'
import { ElegantMinimalHome } from './homes/ElegantMinimalHome'
import { ImmersiveHome } from './homes/ImmersiveHome'
import { LocalBoutiqueHome } from './homes/LocalBoutiqueHome'
import { ModernBoldHome } from './homes/ModernBoldHome'
import { RomanticEditorialHome } from './homes/RomanticEditorialHome'
import { RusticWarmHome } from './homes/RusticWarmHome'
import { ScandinavianHome } from './homes/ScandinavianHome'

const homes = {
  'elegant-minimal': ElegantMinimalHome,
  'dark-luxury': DarkLuxuryHome,
  'bright-playful': BrightPlayfulHome,
  'rustic-warm': RusticWarmHome,
  'modern-bold': ModernBoldHome,
  'romantic-editorial': RomanticEditorialHome,
  'artistic-photographic': ArtisticPhotoHome,
  'scandinavian-nature': ScandinavianHome,
  'interactive-immersive': ImmersiveHome,
  'local-boutique': LocalBoutiqueHome,
} as const

export function ConceptHomeById() {
  const { conceptId } = useConcept()
  const Home = homes[conceptId]
  return <Home />
}

export function ConceptRoutePage() {
  const { slug } = useParams()
  const { setConcept } = useConcept()
  const meta = slug && (isConceptSlug(slug) || isConceptId(slug)) ? getConcept(slug) : null

  useEffect(() => {
    if (meta) setConcept(meta.id as ConceptId)
  }, [meta, setConcept])

  if (!meta) return <Navigate to="/concepts" replace />

  const Home = homes[meta.id]
  return <Home />
}
