import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './components/layout/AdminLayout'
import { Layout } from './components/layout/Layout'
import { ToastViewport } from './components/ui/ToastViewport'
import { ShopProvider } from './context/ShopContext'
import { ToastProvider } from './context/ToastContext'
import { AboutPage } from './pages/About'
import { AccountPage } from './pages/Account'
import { CartPage } from './pages/Cart'
import { CheckoutPage } from './pages/Checkout'
import { ContactPage } from './pages/Contact'
import { HomePage } from './pages/Home'
import { NotFoundPage } from './pages/NotFound'
import { OccasionsPage } from './pages/Occasions'
import { OrderDetailPage } from './pages/OrderDetail'
import { OrdersPage } from './pages/Orders'
import { OrderSuccessPage } from './pages/OrderSuccess'
import { ProductDetailPage } from './pages/ProductDetail'
import { ShopPage } from './pages/Shop'
import { ThemePreviewPage } from './pages/ThemePreview'
import { AdminDashboardPage } from './pages/admin/Dashboard'
import { AdminOrdersPage } from './pages/admin/Orders'
import { AdminProductsPage } from './pages/admin/Products'
import { ThemeProvider } from './themes/ThemeProvider'

export default function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <ShopProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/occasions" element={<OccasionsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:id" element={<OrderDetailPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/preview-themes" element={<ThemePreviewPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
            <ToastViewport />
          </BrowserRouter>
        </ShopProvider>
      </ThemeProvider>
    </ToastProvider>
  )
}
