import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { clearStorage, readStorage, writeStorage } from '../lib/storage'
import { getPosTheme, type PosThemeMeta } from './themes/registry'
import type { PosThemeId } from './types'

const KEY = 'bloomco.pos.theme'

type Ctx = {
  themeId: PosThemeId
  theme: PosThemeMeta
  setTheme: (id: PosThemeId) => void
}

const PosThemeContext = createContext<Ctx | null>(null)

export function PosThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<PosThemeId>(() => {
    const stored = readStorage<string | null>(KEY, null)
    return getPosTheme(stored).id
  })

  useEffect(() => {
    document.documentElement.dataset.posTheme = themeId
    writeStorage(KEY, themeId)
    return () => {
      delete document.documentElement.dataset.posTheme
    }
  }, [themeId])

  const value = useMemo(
    () => ({
      themeId,
      theme: getPosTheme(themeId),
      setTheme: (id: PosThemeId) => setThemeId(id),
    }),
    [themeId],
  )

  return <PosThemeContext.Provider value={value}>{children}</PosThemeContext.Provider>
}

export function usePosTheme() {
  const ctx = useContext(PosThemeContext)
  if (!ctx) throw new Error('usePosTheme must be used within PosThemeProvider')
  return ctx
}

export function clearPosThemeStorage() {
  clearStorage([KEY])
}
