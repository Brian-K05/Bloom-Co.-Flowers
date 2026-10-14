import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { usePosAuth } from '../auth/PosAuthContext'

export function PosLoginPage() {
  const { user, login } = usePosAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('owner')
  const [password, setPassword] = useState('demo123')
  const [error, setError] = useState('')

  if (user) return <Navigate to="/admin" replace />

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const ok = login(username, password)
    if (!ok) {
      setError('Invalid demo credentials')
      return
    }
    navigate('/admin')
  }

  return (
    <div className="pos-app grid min-h-svh place-items-center px-5">
      <form onSubmit={onSubmit} className="pos-surface w-full max-w-md p-8 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.28em]" style={{ color: 'var(--pos-muted)' }}>
          Track B POS
        </p>
        <h1 className="mt-2 text-3xl">Shop desk login</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--pos-muted)' }}>
          Demo: <span className="pos-mono">owner</span> or <span className="pos-mono">staff</span> /{' '}
          <span className="pos-mono">demo123</span>
        </p>
        <label className="pos-label mt-8">
          Username
          <input
            className="pos-field mt-1"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </label>
        <label className="pos-label mt-4">
          Password
          <input
            type="password"
            className="pos-field mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        {error ? (
          <p className="mt-3 text-sm" style={{ color: 'var(--pos-danger)' }}>
            {error}
          </p>
        ) : null}
        <button type="submit" className="pos-btn pos-btn-primary mt-6 w-full">
          Enter POS
        </button>
      </form>
    </div>
  )
}
