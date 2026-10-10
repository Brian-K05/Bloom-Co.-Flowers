import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  DEFAULT_CONCEPT,
  getConcept,
  isConceptId,
  type ConceptId,
  type ConceptMeta,
} from './registry'

const STORAGE_KEY = 'bloomco.concept'

type ConceptContextValue = {
  conceptId: ConceptId
  concept: ConceptMeta
  setConcept: (id: ConceptId) => void
}

const ConceptContext = createContext<ConceptContextValue | null>(null)

function readInitial(): ConceptId {
  const fromQuery = new URLSearchParams(window.location.search).get('concept')
  if (isConceptId(fromQuery)) return fromQuery
  const path = window.location.pathname
  const match = conceptsSlugFromPath(path)
  if (match) return match
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isConceptId(stored)) return stored
  } catch {
    /* ignore */
  }
  return DEFAULT_CONCEPT
}

function conceptsSlugFromPath(path: string): ConceptId | null {
  const part = path.split('/').filter(Boolean)
  if (part[0] !== 'concepts' || !part[1]) return null
  const found = getConcept(part[1])
  return found.slug === part[1] || found.id === part[1] ? found.id : null
}

export function ConceptProvider({ children }: { children: ReactNode }) {
  const [conceptId, setConceptId] = useState<ConceptId>(() => readInitial())

  useEffect(() => {
    document.documentElement.dataset.concept = conceptId
    try {
      localStorage.setItem(STORAGE_KEY, conceptId)
    } catch {
      /* ignore */
    }
  }, [conceptId])

  const setConcept = (id: ConceptId) => setConceptId(id)

  const value = useMemo(
    () => ({ conceptId, concept: getConcept(conceptId), setConcept }),
    [conceptId],
  )

  return <ConceptContext.Provider value={value}>{children}</ConceptContext.Provider>
}

export function useConcept() {
  const ctx = useContext(ConceptContext)
  if (!ctx) throw new Error('useConcept must be used within ConceptProvider')
  return ctx
}
