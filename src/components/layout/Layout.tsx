import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { CustomCursor } from '../../concepts/components/CustomCursor'
import { Footer } from './Footer'
import { Header } from './Header'

export function Layout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  return (
    <div className="flex min-h-svh flex-col bg-ivory">
      <CustomCursor />
      <Header />
      <main className="page-enter flex-1" key={location.pathname}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
