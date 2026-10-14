import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { clearStorage, readStorage, writeStorage } from '../../lib/storage'
import type { PosRole, PosUser } from '../types'

const KEY = 'bloomco.pos.session'

const USERS: Array<PosUser & { password: string }> = [
  { username: 'owner', password: 'demo123', role: 'owner', displayName: 'Shop Owner' },
  { username: 'staff', password: 'demo123', role: 'staff', displayName: 'Ana (staff)' },
]

type Ctx = {
  user: PosUser | null
  login: (username: string, password: string) => boolean
  logout: () => void
  isOwner: boolean
}

const PosAuthContext = createContext<Ctx | null>(null)

export function PosAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PosUser | null>(() => readStorage<PosUser | null>(KEY, null))

  const login = (username: string, password: string) => {
    const found = USERS.find(
      (u) => u.username === username.trim().toLowerCase() && u.password === password,
    )
    if (!found) return false
    const session: PosUser = {
      username: found.username,
      role: found.role as PosRole,
      displayName: found.displayName,
    }
    setUser(session)
    writeStorage(KEY, session)
    return true
  }

  const logout = () => {
    setUser(null)
    clearStorage([KEY])
  }

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isOwner: user?.role === 'owner',
    }),
    [user],
  )

  return <PosAuthContext.Provider value={value}>{children}</PosAuthContext.Provider>
}

export function usePosAuth() {
  const ctx = useContext(PosAuthContext)
  if (!ctx) throw new Error('usePosAuth must be used within PosAuthProvider')
  return ctx
}
