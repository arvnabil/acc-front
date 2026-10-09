/**
 * src/App.jsx
 * Semua rute di satu file (sesuai PRD).
 */
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import CategoryMenuPage from './pages/CategoryMenuPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import WishlistPage from './pages/WishlistPage';
import SearchPage from './pages/SearchPage';
import RfqPage from './pages/RfqPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LacakPesananPage from './pages/LacakPesananPage';
import BantuanPage from './pages/BantuanPage';
import PwaBadge from './components/PwaBadge';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60dvh] text-text-secondary px-4">
      <span className="material-symbols-outlined text-[72px] mb-4 text-outline">error</span>
      <h2 className="font-title-card text-[20px] font-bold text-text-primary mb-2">Halaman tidak ditemukan</h2>
      <a href="#/" className="bg-primary text-on-primary font-label-sm text-label-sm px-8 py-3 rounded-lg mt-4 inline-block">
        Kembali ke Beranda
      </a>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <PwaBadge />
          <Router>
            <ToastProvider>
              <Routes>
          {/* Pages tanpa layout (full-screen) */}
          <Route path="/cari" element={<SearchPage />} />
          <Route path="/kategori" element={<CategoryMenuPage />} />

          {/* Pages dengan layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/katalog" element={<CatalogPage />} />
            <Route path="/produk/:slug" element={<ProductDetailPage />} />
            <Route path="/keranjang" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/minta-penawaran" element={<RfqPage />} />
            <Route path="/lacak-pesanan" element={<LacakPesananPage />} />
            <Route path="/bantuan" element={<BantuanPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/akun" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
            </ToastProvider>
      </Router>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
