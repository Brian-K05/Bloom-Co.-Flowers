import { Navigate, Route, Routes } from 'react-router-dom'
import { PosAuthProvider } from './auth/PosAuthContext'
import { PosShell } from './PosShell'
import { PosThemeProvider } from './PosThemeProvider'
import { PosCalendarPage } from './pages/Calendar'
import { PosConceptsPage } from './pages/Concepts'
import { PosDashboardPage } from './pages/Dashboard'
import { PosInventoryPage } from './pages/Inventory'
import { PosLoginPage } from './pages/Login'
import { PosNewOrderPage } from './pages/NewOrder'
import { PosOrderDetailPage } from './pages/OrderDetail'
import { PosOrdersPage } from './pages/Orders'
import { PosPrepPage } from './pages/Prep'
import { PosPreordersPage } from './pages/Preorders'
import { PosReferencePage } from './pages/Reference'
import { PosProvider } from './store/PosContext'

export function AdminRoot() {
  return (
    <PosAuthProvider>
      <PosThemeProvider>
        <PosProvider>
          <Routes>
            <Route path="login" element={<PosLoginPage />} />
            <Route element={<PosShell />}>
              <Route index element={<PosDashboardPage />} />
              <Route path="orders/new" element={<PosNewOrderPage />} />
              <Route path="orders/:id" element={<PosOrderDetailPage />} />
              <Route path="orders" element={<PosOrdersPage />} />
              <Route path="calendar" element={<PosCalendarPage />} />
              <Route path="prep" element={<PosPrepPage />} />
              <Route path="inventory" element={<PosInventoryPage />} />
              <Route path="preorders" element={<PosPreordersPage />} />
              <Route path="reference" element={<PosReferencePage />} />
              <Route path="concepts" element={<PosConceptsPage />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
          </Routes>
        </PosProvider>
      </PosThemeProvider>
    </PosAuthProvider>
  )
}
