import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { getProducts } from '../services/productService';

export default function DashboardPage() {
  const { user, logout, redeemPointsForWallet, redeemPointsForVoucher } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  // Active Tab state: 'dashboard', 'orders', 'vouchers', 'wishlist', 'points', 'reviews'
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Redeem state feedback
  const [feedback, setFeedback] = useState(null);
  const [wishlistProducts, setWishlistProducts] = useState([]);

  // All reviews from localStorage across all products
  const [myReviews, setMyReviews] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      getProducts({ per_page: 50 }).then(res => {
        const filtered = (res.data || []).filter(p => 
          wishlist.includes(`prod-${p.id}`) || 
          wishlist.includes(p.id) ||
          wishlist.includes(p.sku)
        );
        setWishlistProducts(filtered);
      });
      // Load all reviews from localStorage
      const allReviews = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('accommerce_reviews_')) {
          try {
            const items = JSON.parse(localStorage.getItem(key) || '[]');
            const userItems = items
              .filter(r => r.userEmail === user.email)
              .map(r => ({ ...r, productKey: key.replace('accommerce_reviews_', '') }));
            allReviews.push(...userItems);
          } catch {}
        }
      }
      setMyReviews(allReviews);
    }
  }, [user, navigate, wishlist]);

  if (!user) return null;

  function handleLogout() {
    logout();
    navigate('/');
  }

  // Point redemption actions
  function handleRedeemWallet(points, rupiah) {
    if ((user.points || 0) < points) {
      setFeedback({ type: 'error', message: 'Poin Anda tidak mencukupi untuk penukaran ini.' });
      return;
    }
    const success = redeemPointsForWallet(points, rupiah);
    if (success) {
      setFeedback({ type: 'success', message: `Berhasil menukar ${points} Poin menjadi saldo E-Wallet Rp ${rupiah.toLocaleString('id-ID')}!` });
    }
  }

  function handleRedeemVoucher(points, voucher) {
    if ((user.points || 0) < points) {
      setFeedback({ type: 'error', message: 'Poin Anda tidak mencukupi untuk voucher ini.' });
      return;
    }
    const success = redeemPointsForVoucher(points, voucher);
    if (success) {
      setFeedback({ type: 'success', message: `Berhasil menukar ${points} Poin dengan ${voucher.title}!` });
    }
  }

  const activeVouchersCount = user.vouchers ? user.vouchers.length : 3;
  const pendingOrdersCount = (user.orders || []).filter(o => o.status === 'Dalam Pengiriman' || o.status === 'Diproses').length;
  const pendingReviewsCount = user.reviewsPending ?? 12;

  return (
    <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 min-h-[75vh]">
      {/* Top Banner Card matching user design */}
      <div className="w-full bg-[#0a3875] text-white rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 z-10">
          <div className="inline-block bg-[#164e9a] text-white text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded">
            {user.memberTier || 'MEMBER PLATINUM'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{user.name || 'John Doe'}</h1>
          <p className="text-blue-100 text-[13px] sm:text-[14px]">
            Member sejak {user.memberSince || '2024'} <span className="mx-1">|</span> {user.email || 'johndoe@email.com'}
          </p>
        </div>

        {/* Balance & Points Info */}
        <div className="z-10 flex flex-wrap items-center gap-6 md:text-right">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
            <span className="text-[12px] font-medium text-blue-200 block">Poin Reward</span>
            <div className="flex items-center gap-1.5 justify-end">
              <span className="material-symbols-outlined text-amber-300 text-[20px]">stars</span>
              <span className="text-2xl font-bold text-amber-300">{(user.points || 0).toLocaleString('id-ID')}</span>
              <span className="text-xs text-blue-200">pts</span>
            </div>
          </div>

          <div>
            <span className="text-[12px] font-medium text-blue-200 block">Saldo E-Wallet</span>
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Rp {(user.walletBalance ?? 1500000).toLocaleString('id-ID')}
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Notification Feedback */}
      {feedback && (
        <div className={`mb-6 p-4 rounded-xl flex items-center justify-between transition-all ${feedback.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">{feedback.type === 'success' ? 'check_circle' : 'error'}</span>
            <span className="text-sm font-medium">{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-xs font-semibold underline ml-4">Tutup</button>
        </div>
      )}

      {/* Main Grid: Sidebar Menu + Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Sidebar Menu */}
        <aside className="lg:col-span-1 bg-white rounded-xl border border-border-subtle p-3 shadow-sm">
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => { setActiveTab('dashboard'); setFeedback(null); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors text-left ${activeTab === 'dashboard' ? 'bg-blue-50 text-primary border-l-4 border-primary font-bold' : 'text-text-primary hover:bg-surface'}`}
            >
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              Dashboard Akun
            </button>

            <button
              onClick={() => { setActiveTab('orders'); setFeedback(null); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors text-left ${activeTab === 'orders' ? 'bg-blue-50 text-primary border-l-4 border-primary font-bold' : 'text-text-secondary hover:bg-surface hover:text-text-primary'}`}
            >
              <span className="material-symbols-outlined text-[20px]">local_mall</span>
              Riwayat Pesanan
            </button>

            <button
              onClick={() => { setActiveTab('points'); setFeedback(null); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors text-left ${activeTab === 'points' ? 'bg-blue-50 text-primary border-l-4 border-primary font-bold' : 'text-text-secondary hover:bg-surface hover:text-text-primary'}`}
            >
              <span className="material-symbols-outlined text-[20px] text-amber-500">stars</span>
              Tukar Poin & Reward
            </button>

            <button
              onClick={() => { setActiveTab('vouchers'); setFeedback(null); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors text-left ${activeTab === 'vouchers' ? 'bg-blue-50 text-primary border-l-4 border-primary font-bold' : 'text-text-secondary hover:bg-surface hover:text-text-primary'}`}
            >
              <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
              Voucher & Promo
            </button>

            <button
              onClick={() => { setActiveTab('wishlist'); setFeedback(null); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors text-left ${activeTab === 'wishlist' ? 'bg-blue-50 text-primary border-l-4 border-primary font-bold' : 'text-text-secondary hover:bg-surface hover:text-text-primary'}`}
            >
              <span className="material-symbols-outlined text-[20px]">favorite</span>
              Wishlist Produk
            </button>

            <button
              onClick={() => { setActiveTab('reviews'); setFeedback(null); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors text-left ${activeTab === 'reviews' ? 'bg-blue-50 text-primary border-l-4 border-primary font-bold' : 'text-text-secondary hover:bg-surface hover:text-text-primary'}`}
            >
              <span className="material-symbols-outlined text-[20px]">rate_review</span>
              Ulasan Saya
              {(user.reviewsPending || 0) > 0 && (
                <span className="ml-auto bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {user.reviewsPending}
                </span>
              )}
            </button>

            <div className="my-2 border-t border-border-subtle" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-error hover:bg-red-50 transition-colors text-left"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Keluar Akun
            </button>
          </nav>
        </aside>

        {/* Right Content Area */}
        <section className="lg:col-span-3 space-y-6">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <>
              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div 
                  onClick={() => setActiveTab('orders')}
                  className="bg-white rounded-xl border border-border-subtle p-5 shadow-sm hover:border-primary/50 transition-all cursor-pointer"
                >
                  <span className="text-[13px] text-text-secondary block font-medium">Pesanan Diproses</span>
                  <div className="text-2xl font-bold text-text-primary mt-1">
                    {pendingOrdersCount} Paket
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('vouchers')}
                  className="bg-white rounded-xl border border-border-subtle p-5 shadow-sm hover:border-primary/50 transition-all cursor-pointer"
                >
                  <span className="text-[13px] text-text-secondary block font-medium">Voucher Aktif</span>
                  <div className="text-2xl font-bold text-text-primary mt-1">
                    {activeVouchersCount} Kupon
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('orders')}
                  className="bg-white rounded-xl border border-border-subtle p-5 shadow-sm hover:border-primary/50 transition-all cursor-pointer"
                >
                  <span className="text-[13px] text-text-secondary block font-medium">Ulasan Belum Ditulis</span>
                  <div className="text-2xl font-bold text-text-primary mt-1">
                    {pendingReviewsCount} Ulasan
                  </div>
                </div>
              </div>

              {/* Point Banner in Dashboard */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[28px]">stars</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary text-[15px]">Tukar Poin Anda Menjadi Saldo & Diskon</h4>
                    <p className="text-[13px] text-text-secondary">Anda memiliki <strong className="text-amber-700">{(user.points || 0).toLocaleString('id-ID')} Poin</strong> yang siap ditukarkan!</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('points')}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap shadow-sm"
                >
                  Tukar Poin Sekarang
                </button>
              </div>

              {/* Pesanan Terakhir section matching screenshot */}
              <div className="bg-white rounded-xl border border-border-subtle p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[16px] font-bold text-text-primary">Pesanan Terakhir</h3>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Lihat Semua
                  </button>
                </div>

                {(user.orders || []).length > 0 ? (
                  <div className="space-y-4">
                    {(user.orders || []).slice(0, 2).map((order) => (
                      <div key={order.id} className="bg-blue-50/60 rounded-xl p-5 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">{order.id}</div>
                          <h4 className="font-bold text-[15px] text-text-primary">{order.title}</h4>
                          <p className="text-xs text-text-secondary mt-1">
                            {order.date} • <span className="font-semibold text-text-primary">Rp {order.total.toLocaleString('id-ID')}</span>
                          </p>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                          <span className={`text-xs font-semibold px-3 py-1.5 rounded-md ${
                            order.status === 'Dalam Pengiriman' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-text-secondary border-2 border-dashed border-border-subtle rounded-lg">
                    <span className="material-symbols-outlined text-[48px] text-outline mb-2">inbox</span>
                    <p>Belum ada riwayat pesanan.</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 2: RIWAYAT PESANAN */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl border border-border-subtle p-6 shadow-sm">
              <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">local_mall</span>
                Riwayat Pesanan & Transaksi
              </h3>

              {(user.orders || []).length > 0 ? (
                <div className="space-y-4">
                  {(user.orders || []).map((order) => (
                    <div key={order.id} className="border border-border-subtle rounded-xl p-5 hover:border-primary/40 transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border-subtle text-xs text-text-secondary">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-primary text-sm">{order.id}</span>
                          <span>{order.date}</span>
                        </div>
                        <span className={`font-semibold px-2.5 py-1 rounded-md ${
                          order.status === 'Dalam Pengiriman' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="py-3">
                        <h4 className="font-bold text-[15px] text-text-primary mb-2">{order.title}</h4>
                        <ul className="text-xs text-text-secondary space-y-1">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between">
                              <span>• {item.name} ({item.qty}x)</span>
                              <span className="font-medium text-text-primary">Rp {(item.price * item.qty).toLocaleString('id-ID')}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
                        <div>
                          <span className="text-xs text-text-secondary block">Total Belanja:</span>
                          <span className="text-base font-bold text-primary">Rp {order.total.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-xs font-semibold px-3 py-1.5 border border-border-subtle rounded-lg hover:bg-surface text-text-primary transition-colors">
                            Rincian Faktur
                          </button>
                          <Link to="/katalog" className="text-xs font-semibold px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
                            Beli Lagi
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-text-secondary">
                  <span className="material-symbols-outlined text-[48px] text-outline mb-2">inbox</span>
                  <p>Belum ada riwayat pesanan yang ditemukan.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TUKAR POIN & REWARD (FEATURE BARU) */}
          {activeTab === 'points' && (
            <div className="space-y-6">
              {/* Point Status Header */}
              <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-amber-100 text-xs uppercase tracking-wider font-semibold">Accommerce Loyalty Points</span>
                  <h3 className="text-3xl font-extrabold mt-1">{(user.points || 0).toLocaleString('id-ID')} Poin</h3>
                  <p className="text-amber-100 text-xs mt-1">1 Poin = Rp 100 nilai konversi e-wallet atau voucher promo</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 text-xs text-amber-50 max-w-xs">
                  Dapatkan 100 Poin untuk setiap transaksi kelipatan Rp 1.000.000 di Accommerce.id.
                </div>
              </div>

              {/* Sub-section 1: Tukar Poin ke Saldo E-Wallet */}
              <div className="bg-white rounded-xl border border-border-subtle p-6 shadow-sm">
                <div className="mb-4">
                  <h4 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                    Tukar Poin Jadi Saldo E-Wallet
                  </h4>
                  <p className="text-xs text-text-secondary mt-0.5">Saldo langsung bertambah ke Saldo E-Wallet Anda dan dapat digunakan langsung untuk belanja.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Option 1 */}
                  <div className="border border-border-subtle rounded-xl p-4 flex flex-col justify-between hover:border-primary/50 transition-colors">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-text-secondary">E-Wallet 50rb</span>
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">500 Pts</span>
                      </div>
                      <div className="text-xl font-bold text-text-primary mb-1">Rp 50.000</div>
                      <p className="text-[11px] text-text-secondary">Tambah saldo instan Rp 50.000 ke akun</p>
                    </div>
                    <button
                      onClick={() => handleRedeemWallet(500, 50000)}
                      disabled={(user.points || 0) < 500}
                      className="mt-4 w-full bg-primary hover:bg-primary-hover disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                    >
                      {(user.points || 0) >= 500 ? 'Tukar 500 Poin' : 'Poin Kurang'}
                    </button>
                  </div>

                  {/* Option 2 */}
                  <div className="border border-border-subtle rounded-xl p-4 flex flex-col justify-between hover:border-primary/50 transition-colors">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-text-secondary">E-Wallet 100rb</span>
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">1.000 Pts</span>
                      </div>
                      <div className="text-xl font-bold text-text-primary mb-1">Rp 100.000</div>
                      <p className="text-[11px] text-text-secondary">Tambah saldo instan Rp 100.000 ke akun</p>
                    </div>
                    <button
                      onClick={() => handleRedeemWallet(1000, 100000)}
                      disabled={(user.points || 0) < 1000}
                      className="mt-4 w-full bg-primary hover:bg-primary-hover disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                    >
                      {(user.points || 0) >= 1000 ? 'Tukar 1.000 Poin' : 'Poin Kurang'}
                    </button>
                  </div>

                  {/* Option 3 */}
                  <div className="border border-border-subtle rounded-xl p-4 flex flex-col justify-between hover:border-primary/50 transition-colors">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-text-secondary">E-Wallet 250rb</span>
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">2.500 Pts</span>
                      </div>
                      <div className="text-xl font-bold text-text-primary mb-1">Rp 250.000</div>
                      <p className="text-[11px] text-text-secondary">Tambah saldo instan Rp 250.000 ke akun</p>
                    </div>
                    <button
                      onClick={() => handleRedeemWallet(2500, 250000)}
                      disabled={(user.points || 0) < 2500}
                      className="mt-4 w-full bg-primary hover:bg-primary-hover disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                    >
                      {(user.points || 0) >= 2500 ? 'Tukar 2.500 Poin' : 'Poin Kurang'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sub-section 2: Tukar Poin ke Voucher Potongan */}
              <div className="bg-white rounded-xl border border-border-subtle p-6 shadow-sm">
                <div className="mb-4">
                  <h4 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-600">confirmation_number</span>
                    Tukar Poin Jadi Voucher Potongan Diskon
                  </h4>
                  <p className="text-xs text-text-secondary mt-0.5">Voucher akan langsung masuk ke daftar Voucher Aktif Anda.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Voucher 1 */}
                  <div className="border border-border-subtle rounded-xl p-4 bg-orange-50/40 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded">VOUCHER 75K</span>
                        <span className="text-xs font-bold text-amber-700">600 Pts</span>
                      </div>
                      <h5 className="font-bold text-text-primary text-sm">Potongan Rp 75.000 Khusus IT Solutions</h5>
                      <p className="text-xs text-text-secondary mt-1">Min. belanja Rp 750.000 • Berlaku 30 Hari</p>
                    </div>
                    <button
                      onClick={() => handleRedeemVoucher(600, {
                        id: `VCH-${Date.now()}`,
                        code: `IT75K-${Math.floor(1000 + Math.random() * 9000)}`,
                        title: 'Voucher Potongan Rp 75.000 IT Solution',
                        minOrder: 750000,
                        discount: 75000,
                        expiry: '30 Hari ke depan'
                      })}
                      disabled={(user.points || 0) < 600}
                      className="mt-4 w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                    >
                      {(user.points || 0) >= 600 ? 'Tukar 600 Poin' : 'Poin Kurang'}
                    </button>
                  </div>

                  {/* Voucher 2 */}
                  <div className="border border-border-subtle rounded-xl p-4 bg-blue-50/40 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-primary bg-blue-100 px-2 py-0.5 rounded">VOUCHER 150K</span>
                        <span className="text-xs font-bold text-amber-700">1.200 Pts</span>
                      </div>
                      <h5 className="font-bold text-text-primary text-sm">Diskon Rp 150.000 Paket Video Conference</h5>
                      <p className="text-xs text-text-secondary mt-1">Min. belanja Rp 1.500.000 • Berlaku 30 Hari</p>
                    </div>
                    <button
                      onClick={() => handleRedeemVoucher(1200, {
                        id: `VCH-${Date.now()}`,
                        code: `VC150K-${Math.floor(1000 + Math.random() * 9000)}`,
                        title: 'Diskon Rp 150.000 Video Conference',
                        minOrder: 1500000,
                        discount: 150000,
                        expiry: '30 Hari ke depan'
                      })}
                      disabled={(user.points || 0) < 1200}
                      className="mt-4 w-full bg-primary hover:bg-primary-hover disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                    >
                      {(user.points || 0) >= 1200 ? 'Tukar 1.200 Poin' : 'Poin Kurang'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VOUCHER & PROMO */}
          {activeTab === 'vouchers' && (
            <div className="bg-white rounded-xl border border-border-subtle p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">confirmation_number</span>
                    Voucher & Kupon Saya
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">Gunakan kupon saat checkout untuk mendapatkan potongan harga.</p>
                </div>
                <button
                  onClick={() => setActiveTab('points')}
                  className="text-xs font-bold text-primary bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  + Dapatkan Kupon via Poin
                </button>
              </div>

              {(user.vouchers || []).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(user.vouchers || []).map((v) => (
                    <div key={v.id} className="border-2 border-dashed border-primary/30 bg-blue-50/30 rounded-xl p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono font-bold text-xs bg-primary text-white px-2 py-0.5 rounded tracking-wide">{v.code}</span>
                          <span className="text-[11px] text-text-secondary">Hingga: {v.expiry}</span>
                        </div>
                        <h4 className="font-bold text-sm text-text-primary">{v.title}</h4>
                        <p className="text-xs text-text-secondary mt-1">
                          Min. Transaksi Rp {v.minOrder.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-600">Hemat Rp {v.discount.toLocaleString('id-ID')}</span>
                        <Link to="/katalog" className="text-xs font-semibold text-primary hover:underline">
                          Pakai Sekarang
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-text-secondary">
                  <span className="material-symbols-outlined text-[48px] text-outline mb-2">confirmation_number</span>
                  <p>Belum ada voucher aktif saat ini.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: WISHLIST PRODUK */}
          {activeTab === 'wishlist' && (
            <div className="bg-white rounded-xl border border-border-subtle p-6 shadow-sm">
              <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">favorite</span>
                Wishlist Produk Disimpan
              </h3>

              {wishlistProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {wishlistProducts.map((product) => {
                    const price = product.sale_price || product.regular_price;
                    const img = (product.images?.[0] || '').split(',')[0].trim();
                    return (
                      <div key={product.id} className="border border-border-subtle rounded-xl p-3 flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div>
                          <div className="w-full h-36 bg-surface rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                            {img ? (
                              <img src={img} alt={product.name} className="w-full h-full object-contain p-2" />
                            ) : (
                              <span className="material-symbols-outlined text-outline text-[40px]">image</span>
                            )}
                          </div>
                          <span className="text-[10px] uppercase font-bold text-primary tracking-wider">{product.sku || 'IT SOLUTION'}</span>
                          <h4 className="font-semibold text-xs text-text-primary line-clamp-2 mt-1 leading-snug">{product.name}</h4>
                          <div className="mt-2 text-sm font-bold text-text-primary">
                            Rp {price ? price.toLocaleString('id-ID') : 'Hubungi Sales'}
                          </div>
                        </div>
                        <div className="mt-4 pt-2 border-t border-border-subtle flex gap-2">
                          <Link 
                            to={`/produk/${product.slug}`}
                            className="flex-1 text-center bg-primary hover:bg-primary-hover text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                          >
                            Lihat Produk
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-text-secondary">
                  <span className="material-symbols-outlined text-[48px] text-outline mb-2">favorite_border</span>
                  <p>Belum ada produk favorit di wishlist Anda.</p>
                  <Link to="/katalog" className="mt-4 inline-block text-xs font-semibold text-primary underline">
                    Eksplor Katalog Produk
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: ULASAN SAYA */}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-xl border border-border-subtle p-6 shadow-sm">
              <h3 className="text-lg font-bold text-text-primary mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">rate_review</span>
                Ulasan Saya
              </h3>
              <p className="text-xs text-text-secondary mb-6">
                Ulasan produk yang pernah Anda tulis.
                {(user.reviewsPending || 0) > 0 && (
                  <span className="ml-2 bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded">
                    {user.reviewsPending} produk menunggu ulasan Anda
                  </span>
                )}
              </p>

              {myReviews.length > 0 ? (
                <div className="space-y-4">
                  {myReviews.map(r => (
                    <div key={r.id} className="border border-border-subtle rounded-xl p-4 flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold flex-shrink-0">
                        {r.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex">
                            {[1,2,3,4,5].map(s => (
                              <span key={s} className="material-symbols-outlined text-[15px]"
                                style={{ color: s <= r.rating ? '#f59e0b' : '#d1d5db', fontVariationSettings: s <= r.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                            ))}
                          </div>
                          <span className="text-xs text-text-secondary">{r.date}</span>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed">{r.comment}</p>
                        <Link to={`/produk/`} className="mt-2 inline-block text-xs text-primary hover:underline">
                          Lihat Produk
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-text-secondary">
                  <span className="material-symbols-outlined text-[48px] text-outline mb-2">rate_review</span>
                  <p>Anda belum menulis ulasan produk apapun.</p>
                  <Link to="/katalog" className="mt-4 inline-block text-xs font-semibold text-primary underline">
                    Belanja & Ulas Produk
                  </Link>
                </div>
              )}

              {/* Pending reviews reminder */}
              {(user.reviewsPending || 0) > 0 && (
                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <span className="material-symbols-outlined text-amber-600 flex-shrink-0">info</span>
                  <div>
                    <p className="text-sm font-semibold text-amber-800">
                      Ada {user.reviewsPending} pesanan yang belum Anda ulas.
                    </p>
                    <p className="text-xs text-amber-700 mt-0.5">
                      Kunjungi halaman detail produk yang sudah Anda beli untuk menulis ulasan dan mendapatkan Poin Reward.
                    </p>
                    <Link to="/katalog" className="mt-2 inline-block text-xs font-bold text-amber-700 underline">
                      Lihat Riwayat Pembelian →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
