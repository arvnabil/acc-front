import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { getProducts } from '../services/productService';
import InvoiceModal from '../components/InvoiceModal';
import ReviewModal from '../components/ReviewModal';

export default function DashboardPage() {
  const { 
    user, 
    logout, 
    redeemPointsForWallet, 
    redeemPointsForVoucher, 
    claimEwalletPoints,
    markOrderItemReviewed,
    saveAddress, 
    deleteAddress, 
    setDefaultAddress 
  } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  // Active Tab state: 'dashboard', 'orders', 'addresses', 'vouchers', 'wishlist', 'points', 'reviews'
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Redeem state feedback
  const [feedback, setFeedback] = useState(null);
  const [wishlistProducts, setWishlistProducts] = useState([]);

  // Invoice Modal State
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Review Modal & Sub-tab State
  const [reviewModalData, setReviewModalData] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewSubTab, setReviewSubTab] = useState('pending'); // 'pending' | 'completed'

  // E-Wallet Claim Form State
  const [ewalletPlatform, setEwalletPlatform] = useState('GoPay');
  const [ewalletPhone, setEwalletPhone] = useState(user?.phone || '0812-3456-7890');
  const [ewalletAccountName, setEwalletAccountName] = useState(user?.name || 'John Doe');
  const [selectedEwalletPackage, setSelectedEwalletPackage] = useState({ points: 500, rupiah: 50000 });

  // Address management state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addrForm, setAddrForm] = useState({
    label: 'Rumah',
    recipientName: '',
    phone: '',
    province: 'DKI Jakarta',
    city: 'Jakarta Selatan',
    address: '',
    postalCode: '',
    isDefault: false
  });

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

  // Address Handlers
  function handleOpenAddAddress() {
    setEditingAddress(null);
    setAddrForm({
      label: 'Rumah',
      recipientName: user?.name || '',
      phone: user?.phone || '',
      province: 'DKI Jakarta',
      city: 'Jakarta Selatan',
      address: '',
      postalCode: '',
      isDefault: (user?.addresses || []).length === 0
    });
    setShowAddressModal(true);
  }

  function handleOpenEditAddress(addr) {
    setEditingAddress(addr);
    setAddrForm({
      label: addr.label || 'Rumah',
      recipientName: addr.recipientName || '',
      phone: addr.phone || '',
      province: addr.province || 'DKI Jakarta',
      city: addr.city || 'Jakarta Selatan',
      address: addr.address || '',
      postalCode: addr.postalCode || '',
      isDefault: !!addr.isDefault
    });
    setShowAddressModal(true);
  }

  function handleSaveAddress(e) {
    e.preventDefault();
    if (!addrForm.recipientName.trim() || !addrForm.phone.trim() || !addrForm.address.trim()) {
      setFeedback({ type: 'error', message: 'Mohon lengkapi nama penerima, nomor telepon, dan alamat lengkap.' });
      return;
    }
    saveAddress({
      ...(editingAddress ? { id: editingAddress.id } : {}),
      ...addrForm
    });
    setShowAddressModal(false);
    setFeedback({
      type: 'success',
      message: editingAddress ? 'Alamat berhasil diperbarui!' : 'Alamat baru berhasil ditambahkan!'
    });
  }

  function handleDeleteAddress(addrId) {
    if (window.confirm('Apakah Anda yakin ingin menghapus alamat ini?')) {
      deleteAddress(addrId);
      setFeedback({ type: 'success', message: 'Alamat berhasil dihapus.' });
    }
  }

  function handleSetDefaultAddress(addrId) {
    setDefaultAddress(addrId);
    setFeedback({ type: 'success', message: 'Alamat utama berhasil diperbarui.' });
  }

  // Invoice Handler
  function handleOpenInvoice(order) {
    setSelectedInvoiceOrder(order);
    setShowInvoiceModal(true);
  }

  // Review Handlers
  function handleOpenReview(product, order) {
    setReviewModalData({ product, order });
    setShowReviewModal(true);
  }

  function handleReviewSubmitted(newReview) {
    const key = `accommerce_reviews_${newReview.productId}`;
    try {
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      localStorage.setItem(key, JSON.stringify([newReview, ...existing]));
    } catch {}

    const itemKey = `${newReview.orderId}_${newReview.productName}`;
    if (markOrderItemReviewed) {
      markOrderItemReviewed(itemKey);
    }

    setMyReviews(prev => [newReview, ...prev]);
    setFeedback({ type: 'success', message: 'Ulasan Anda berhasil dikirim! Bonus +50 Poin ditambahkan ke akun Anda.' });
  }

  // E-Wallet Claim Handler
  function handleClaimEwalletSubmit(e) {
    e.preventDefault();
    if (!ewalletPhone.trim() || !ewalletAccountName.trim()) {
      setFeedback({ type: 'error', message: 'Mohon lengkapi nomor telepon dan nama akun e-wallet.' });
      return;
    }
    if ((user?.points || 0) < selectedEwalletPackage.points) {
      setFeedback({ type: 'error', message: `Poin Anda tidak mencukupi untuk menukar ${selectedEwalletPackage.points} Poin.` });
      return;
    }
    const result = claimEwalletPoints({
      platform: ewalletPlatform,
      phone: ewalletPhone,
      accountName: ewalletAccountName,
      points: selectedEwalletPackage.points,
      rupiah: selectedEwalletPackage.rupiah
    });
    if (result.success) {
      setFeedback({
        type: 'success',
        message: `Berhasil klaim saldo ${ewalletPlatform} Rp ${selectedEwalletPackage.rupiah.toLocaleString('id-ID')} ke ${ewalletPhone}!`
      });
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
              onClick={() => { setActiveTab('addresses'); setFeedback(null); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors text-left ${activeTab === 'addresses' ? 'bg-blue-50 text-primary border-l-4 border-primary font-bold' : 'text-text-secondary hover:bg-surface hover:text-text-primary'}`}
            >
              <span className="material-symbols-outlined text-[20px]">location_on</span>
              Alamat Saya
              {(user.addresses || []).length > 0 && (
                <span className="ml-auto bg-blue-100 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {(user.addresses || []).length}
                </span>
              )}
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
                        <ul className="text-xs space-y-2">
                          {order.items.map((item, idx) => {
                            const itemKey = `${order.id}_${item.name}`;
                            const isReviewed = (user.reviewedOrderItems || []).includes(itemKey) ||
                              myReviews.some(r => r.orderId === order.id && r.productName === item.name);
                            return (
                              <li key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg bg-surface/50 border border-border-subtle">
                                <span className="flex-1 min-w-0 font-medium text-text-primary">• {item.name} ({item.qty}x)</span>
                                <div className="flex items-center gap-3 shrink-0">
                                  <span className="font-semibold text-text-primary">Rp {(item.price * item.qty).toLocaleString('id-ID')}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenReview({ name: item.name, id: `prod-${idx + 1}` }, order)}
                                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
                                      isReviewed
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                                        : 'border-primary text-primary hover:bg-primary hover:text-white shadow-2xs'
                                    }`}
                                  >
                                    <span className="material-symbols-outlined text-[13px]">{isReviewed ? 'check_circle' : 'rate_review'}</span>
                                    {isReviewed ? 'Sudah Diulas' : 'Beri Ulasan (+50 Poin)'}
                                  </button>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border-subtle">
                        <div>
                          <span className="text-xs text-text-secondary block">Total Belanja:</span>
                          <span className="text-base font-bold text-primary">Rp {order.total.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex gap-2 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => handleOpenInvoice(order)}
                            className="text-xs font-bold px-3.5 py-2 border border-gray-300 rounded-lg hover:border-primary hover:text-primary text-text-primary transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer shadow-2xs bg-white"
                          >
                            <span className="material-symbols-outlined text-[16px] text-primary">receipt_long</span>
                            Download Invoice
                          </button>
                          <Link to="/katalog" className="text-xs font-semibold px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors whitespace-nowrap">
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

          {/* TAB: ALAMAT SAYA (SHOPEE STYLE) */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-xl border border-border-subtle p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border-subtle">
                <div>
                  <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                    Alamat Saya
                  </h3>
                  <p className="text-xs text-text-secondary mt-1">
                    Kelola alamat pengiriman Anda untuk kemudahan dan kecepatan saat proses checkout.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddAddress}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Tambah Alamat Baru
                </button>
              </div>

              {(user.addresses || []).length > 0 ? (
                <div className="space-y-4">
                  {(user.addresses || []).map((addr) => (
                    <div
                      key={addr.id}
                      className={`border rounded-xl p-5 transition-colors ${
                        addr.isDefault
                          ? 'border-primary/50 bg-blue-50/20 shadow-xs'
                          : 'border-border-subtle hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-[15px] text-text-primary">
                              {addr.recipientName}
                            </span>
                            <span className="text-xs text-text-secondary font-medium">
                              | {addr.phone}
                            </span>
                            {addr.label && (
                              <span className="bg-gray-100 text-gray-700 text-[11px] font-semibold px-2 py-0.5 rounded border border-gray-200">
                                {addr.label}
                              </span>
                            )}
                            {addr.isDefault && (
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">check_circle</span>
                                Utama
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-text-primary leading-relaxed">
                            {addr.address}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {[addr.city, addr.province, addr.postalCode].filter(Boolean).join(', ')}
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:items-end gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border-subtle">
                          <div className="flex items-center gap-3 text-xs">
                            <button
                              type="button"
                              onClick={() => handleOpenEditAddress(addr)}
                              className="font-semibold text-primary hover:underline flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[15px]">edit</span>
                              Ubah
                            </button>
                            {!addr.isDefault && (
                              <button
                                type="button"
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="font-semibold text-error hover:underline flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-[15px]">delete</span>
                                Hapus
                              </button>
                            )}
                          </div>
                          {!addr.isDefault && (
                            <button
                              type="button"
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="text-xs font-semibold px-3 py-1.5 border border-border-subtle rounded-lg hover:border-primary hover:text-primary transition-colors text-text-secondary"
                            >
                              Atur sebagai Utama
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-text-secondary border-2 border-dashed border-border-subtle rounded-xl">
                  <span className="material-symbols-outlined text-[48px] text-outline mb-2">location_off</span>
                  <p className="font-medium text-sm">Belum ada alamat yang tersimpan.</p>
                  <p className="text-xs text-text-secondary mt-1 mb-4">Tambahkan alamat untuk mempermudah transaksi pengiriman.</p>
                  <button
                    type="button"
                    onClick={handleOpenAddAddress}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    Tambah Alamat Sekarang
                  </button>
                </div>
              )}

              {/* Modal Tambah / Edit Alamat */}
              {showAddressModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                  <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-border-subtle overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-surface">
                      <h4 className="font-bold text-base text-text-primary flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[20px]">
                          {editingAddress ? 'edit_location' : 'add_location'}
                        </span>
                        {editingAddress ? 'Ubah Alamat Pengiriman' : 'Tambah Alamat Baru'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowAddressModal(false)}
                        className="text-text-secondary hover:text-text-primary p-1 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                      </button>
                    </div>

                    <form onSubmit={handleSaveAddress} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                      {/* Label Alamat */}
                      <div>
                        <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
                          Tandai Sebagai
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {['Rumah', 'Kantor', 'Toko', 'Apartemen'].map(tag => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => setAddrForm(f => ({ ...f, label: tag }))}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                addrForm.label === tag
                                  ? 'bg-primary text-white shadow-xs'
                                  : 'bg-surface border border-border-subtle text-text-secondary hover:border-primary/50'
                              }`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Recipient & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                            Nama Penerima *
                          </label>
                          <input
                            type="text"
                            required
                            value={addrForm.recipientName}
                            onChange={e => setAddrForm(f => ({ ...f, recipientName: e.target.value }))}
                            placeholder="Cth: Budi Santoso"
                            className="w-full bg-surface border border-border-subtle rounded-lg px-3.5 py-2 text-xs sm:text-sm text-text-primary focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                            Nomor Telepon *
                          </label>
                          <input
                            type="text"
                            required
                            value={addrForm.phone}
                            onChange={e => setAddrForm(f => ({ ...f, phone: e.target.value }))}
                            placeholder="Cth: 081234567890"
                            className="w-full bg-surface border border-border-subtle rounded-lg px-3.5 py-2 text-xs sm:text-sm text-text-primary focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>

                      {/* Province & City */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                            Provinsi *
                          </label>
                          <select
                            value={addrForm.province}
                            onChange={e => setAddrForm(f => ({ ...f, province: e.target.value }))}
                            className="w-full bg-surface border border-border-subtle rounded-lg px-3.5 py-2 text-xs sm:text-sm text-text-primary focus:outline-none focus:border-primary cursor-pointer"
                          >
                            <option>DKI Jakarta</option>
                            <option>Banten</option>
                            <option>Jawa Barat</option>
                            <option>Jawa Tengah</option>
                            <option>Jawa Timur</option>
                            <option>DI Yogyakarta</option>
                            <option>Bali</option>
                            <option>Sumatera Utara</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                            Kota / Kabupaten *
                          </label>
                          <input
                            type="text"
                            required
                            value={addrForm.city}
                            onChange={e => setAddrForm(f => ({ ...f, city: e.target.value }))}
                            placeholder="Cth: Jakarta Selatan"
                            className="w-full bg-surface border border-border-subtle rounded-lg px-3.5 py-2 text-xs sm:text-sm text-text-primary focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>

                      {/* Full Address */}
                      <div>
                        <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                          Alamat Lengkap *
                        </label>
                        <textarea
                          rows="3"
                          required
                          value={addrForm.address}
                          onChange={e => setAddrForm(f => ({ ...f, address: e.target.value }))}
                          placeholder="Nama jalan, gedung, nomor rumah, RT/RW, kelurahan, kecamatan"
                          className="w-full bg-surface border border-border-subtle rounded-lg p-3 text-xs sm:text-sm text-text-primary focus:outline-none focus:border-primary"
                        />
                      </div>

                      {/* Postal Code */}
                      <div>
                        <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                          Kode Pos
                        </label>
                        <input
                          type="text"
                          value={addrForm.postalCode}
                          onChange={e => setAddrForm(f => ({ ...f, postalCode: e.target.value }))}
                          placeholder="Cth: 12345"
                          className="w-full bg-surface border border-border-subtle rounded-lg px-3.5 py-2 text-xs sm:text-sm text-text-primary focus:outline-none focus:border-primary"
                        />
                      </div>

                      {/* Checkbox Default */}
                      <label className="flex items-center gap-2 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={addrForm.isDefault}
                          onChange={e => setAddrForm(f => ({ ...f, isDefault: e.target.checked }))}
                          className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                        />
                        <span className="text-xs font-medium text-text-primary">
                          Atur sebagai alamat utama
                        </span>
                      </label>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
                        <button
                          type="button"
                          onClick={() => setShowAddressModal(false)}
                          className="px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg transition-colors"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover shadow-sm transition-colors"
                        >
                          Simpan Alamat
                        </button>
                      </div>
                    </form>
                  </div>
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

              {/* Sub-section 1: Order Klaim Saldo E-Wallet & Riwayat Klaim */}
              <div className="bg-white rounded-xl border border-border-subtle p-6 shadow-sm space-y-6">
                <div>
                  <h4 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                    Klaim Saldo E-Wallet dari Poin
                  </h4>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Tukarkan poin loyalty Anda menjadi saldo e-wallet asli. Masukkan nomor HP dan platform e-wallet tujuan penarikan saldo.
                  </p>
                </div>

                {/* Form Order Klaim */}
                <form onSubmit={handleClaimEwalletSubmit} className="p-5 bg-surface/60 rounded-xl border border-border-subtle space-y-4">
                  {/* Step 1: Pilih Platform */}
                  <div>
                    <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                      1. Pilih Platform E-Wallet Tujuan
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {[
                        { name: 'GoPay', color: 'bg-emerald-600 text-white', icon: 'payments' },
                        { name: 'OVO', color: 'bg-purple-700 text-white', icon: 'credit_card' },
                        { name: 'DANA', color: 'bg-sky-500 text-white', icon: 'account_balance_wallet' },
                        { name: 'ShopeePay', color: 'bg-orange-500 text-white', icon: 'shopping_bag' },
                        { name: 'LinkAja', color: 'bg-red-600 text-white', icon: 'send_to_mobile' },
                      ].map((pl) => (
                        <button
                          key={pl.name}
                          type="button"
                          onClick={() => setEwalletPlatform(pl.name)}
                          className={`p-3 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                            ewalletPlatform === pl.name
                              ? `${pl.color} ring-2 ring-primary ring-offset-1 shadow-sm`
                              : 'bg-white border-border-subtle text-text-primary hover:border-primary/50'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[20px]">{pl.icon}</span>
                          <span>{pl.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Nomor HP & Nama Pemilik */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                        2. Nomor HP Akun {ewalletPlatform} *
                      </label>
                      <input
                        type="text"
                        required
                        value={ewalletPhone}
                        onChange={(e) => setEwalletPhone(e.target.value)}
                        placeholder="Cth: 081234567890"
                        className="w-full bg-white border border-border-subtle rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:border-primary font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                        3. Nama Pemilik Akun *
                      </label>
                      <input
                        type="text"
                        required
                        value={ewalletAccountName}
                        onChange={(e) => setEwalletAccountName(e.target.value)}
                        placeholder="Cth: Budi Santoso"
                        className="w-full bg-white border border-border-subtle rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Step 3: Pilih Paket Nominal */}
                  <div>
                    <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                      4. Pilih Nominal Penukaran Poin
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      {[
                        { points: 500, rupiah: 50000, label: '500 Poin' },
                        { points: 1000, rupiah: 100000, label: '1.000 Poin' },
                        { points: 2500, rupiah: 250000, label: '2.500 Poin' },
                        { points: 5000, rupiah: 500000, label: '5.000 Poin' },
                      ].map((pkg) => {
                        const isSelected = selectedEwalletPackage.points === pkg.points;
                        const isAffordable = (user.points || 0) >= pkg.points;
                        return (
                          <div
                            key={pkg.points}
                            onClick={() => setSelectedEwalletPackage(pkg)}
                            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-blue-50/60 border-primary ring-1 ring-primary shadow-xs'
                                : 'bg-white border-border-subtle hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                                {pkg.label}
                              </span>
                              <input
                                type="radio"
                                name="ewallet_package"
                                checked={isSelected}
                                onChange={() => setSelectedEwalletPackage(pkg)}
                                className="accent-primary cursor-pointer"
                              />
                            </div>
                            <div className="text-lg font-extrabold text-text-primary">
                              Rp {pkg.rupiah.toLocaleString('id-ID')}
                            </div>
                            <p className="text-[11px] text-text-secondary mt-0.5">
                              {isAffordable ? 'Poin mencukupi' : 'Poin belum cukup'}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs text-text-secondary">
                      Poin saat ini: <strong className="text-primary font-bold">{(user.points || 0).toLocaleString('id-ID')} Pts</strong> • Biaya penukaran: <strong className="text-amber-700 font-bold">{selectedEwalletPackage.points} Pts</strong>
                    </div>
                    <button
                      type="submit"
                      disabled={(user.points || 0) < selectedEwalletPackage.points}
                      className="px-6 py-2.5 bg-primary hover:bg-primary-hover disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-auto"
                    >
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      Klaim Saldo {ewalletPlatform} Sekarang
                    </button>
                  </div>
                </form>

                {/* Status & Riwayat Klaim Saldo E-Wallet */}
                <div className="pt-2 border-t border-border-subtle">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-bold text-sm text-text-primary flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-600 text-[20px]">history</span>
                      Status & Riwayat Klaim Saldo E-Wallet
                    </h5>
                    <span className="text-xs text-text-secondary">
                      {(user.ewalletClaims || []).length} transaksi
                    </span>
                  </div>

                  {(user.ewalletClaims || []).length > 0 ? (
                    <div className="space-y-3">
                      {(user.ewalletClaims || []).map((cl) => (
                        <div
                          key={cl.id}
                          className="p-4 rounded-xl border border-border-subtle bg-white hover:border-gray-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                        >
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-xs font-mono text-primary bg-blue-50 px-2 py-0.5 rounded">
                                {cl.id}
                              </span>
                              <span className="font-bold text-sm text-text-primary">
                                {cl.platform} • {cl.accountName}
                              </span>
                              <span className="text-xs font-mono text-text-secondary">
                                ({cl.phone})
                              </span>
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <span className="material-symbols-outlined text-[13px]">check_circle</span>
                                {cl.status || 'Berhasil Ditransfer'}
                              </span>
                            </div>
                            <p className="text-[11px] text-text-secondary">
                              Waktu: {cl.date} • No. Ref: <span className="font-mono">{cl.refNumber || 'TRX-8927163'}</span>
                            </p>
                          </div>

                          <div className="sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 flex sm:flex-col justify-between items-baseline sm:items-end">
                            <div className="text-base font-extrabold text-emerald-600">
                              +Rp {(cl.amount || 0).toLocaleString('id-ID')}
                            </div>
                            <div className="text-[11px] font-bold text-amber-700">
                              -{cl.points} Poin
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-text-secondary border-2 border-dashed border-border-subtle rounded-xl">
                      <span className="material-symbols-outlined text-[36px] text-outline mb-1">receipt_long</span>
                      <p className="text-xs font-medium">Belum ada riwayat penukaran e-wallet.</p>
                    </div>
                  )}
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
          {activeTab === 'reviews' && (() => {
            const pendingReviewItems = [];
            (user.orders || []).forEach(order => {
              (order.items || []).forEach((item, itemIdx) => {
                const itemKey = `${order.id}_${item.name}`;
                const isReviewed = (user.reviewedOrderItems || []).includes(itemKey) ||
                  myReviews.some(r => r.orderId === order.id && r.productName === item.name);
                if (!isReviewed) {
                  pendingReviewItems.push({ order, item, itemKey, itemIdx });
                }
              });
            });

            return (
              <div className="bg-white rounded-xl border border-border-subtle p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-border-subtle">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">rate_review</span>
                      Ulasan Produk Saya
                    </h3>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Berikan ulasan dan penilaian untuk setiap produk yang Anda beli untuk membantu pembeli lain dan raih <strong>+50 Poin</strong> per ulasan!
                    </p>
                  </div>

                  {/* Sub-tabs: Menunggu Ulasan vs Riwayat Ulasan */}
                  <div className="flex bg-surface p-1 rounded-xl border border-border-subtle self-start sm:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => setReviewSubTab('pending')}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                        reviewSubTab === 'pending'
                          ? 'bg-primary text-white shadow-2xs'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <span>Menunggu Diulas</span>
                      {pendingReviewItems.length > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                          reviewSubTab === 'pending' ? 'bg-white text-primary' : 'bg-amber-500 text-white'
                        }`}>
                          {pendingReviewItems.length}
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewSubTab('completed')}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                        reviewSubTab === 'completed'
                          ? 'bg-primary text-white shadow-2xs'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <span>Riwayat Ulasan</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                        reviewSubTab === 'completed' ? 'bg-white text-primary' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {myReviews.length}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Sub-tab 1: Menunggu Diulas */}
                {reviewSubTab === 'pending' && (
                  <div>
                    {pendingReviewItems.length > 0 ? (
                      <div className="space-y-3.5">
                        {pendingReviewItems.map(({ order, item, itemKey, itemIdx }) => (
                          <div
                            key={itemKey}
                            className="p-4 rounded-xl border border-border-subtle bg-white hover:border-primary/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs font-mono text-primary bg-blue-50 px-2 py-0.5 rounded">
                                  #{order.id}
                                </span>
                                <span className="text-xs text-text-secondary">{order.date}</span>
                                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                                  {order.status}
                                </span>
                              </div>
                              <h4 className="font-bold text-sm text-text-primary">{item.name}</h4>
                              <p className="text-xs text-text-secondary">
                                Kuantitas: {item.qty}x • Rp {(item.price || 0).toLocaleString('id-ID')}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleOpenReview({ name: item.name, id: `prod-${itemIdx + 1}` }, order)}
                              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer self-start sm:self-auto"
                            >
                              <span className="material-symbols-outlined text-[16px]">rate_review</span>
                              Tulis Ulasan (+50 Poin)
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center text-text-secondary border-2 border-dashed border-border-subtle rounded-xl">
                        <span className="material-symbols-outlined text-[48px] text-emerald-500 mb-2">task_alt</span>
                        <p className="font-bold text-sm text-text-primary">Semua pesanan Anda sudah diulas!</p>
                        <p className="text-xs text-text-secondary mt-1 mb-4">
                          Terima kasih atas ulasan dan masukan Anda. Belanja lagi untuk mengumpulkan lebih banyak poin.
                        </p>
                        <Link
                          to="/katalog"
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                          Belanja Produk Baru
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Sub-tab 2: Riwayat Ulasan */}
                {reviewSubTab === 'completed' && (
                  <div>
                    {myReviews.length > 0 ? (
                      <div className="space-y-4">
                        {myReviews.map((r) => (
                          <div key={r.id} className="border border-border-subtle rounded-xl p-5 bg-white space-y-3 shadow-2xs">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                                  {r.isAnonymous ? '?' : (r.userName?.charAt(0)?.toUpperCase() || 'U')}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm text-text-primary">
                                      {r.isAnonymous ? 'Pengguna Anonim' : r.userName}
                                    </span>
                                    {r.isAnonymous && (
                                      <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded">
                                        Anonim
                                      </span>
                                    )}
                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-200">
                                      ✓ Terverifikasi Pembeli
                                    </span>
                                  </div>
                                  <div className="text-xs text-text-secondary flex items-center gap-2 mt-0.5">
                                    <span>{r.date}</span>
                                    {r.orderId && <span>• #{r.orderId}</span>}
                                    {r.productName && <span>• <strong>{r.productName}</strong></span>}
                                  </div>
                                </div>
                              </div>

                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <span
                                    key={s}
                                    className="material-symbols-outlined text-[16px]"
                                    style={{
                                      color: s <= r.rating ? '#f59e0b' : '#d1d5db',
                                      fontVariationSettings: s <= r.rating ? "'FILL' 1" : "'FILL' 0",
                                    }}
                                  >
                                    star
                                  </span>
                                ))}
                              </div>
                            </div>

                            <p className="text-xs sm:text-sm text-text-primary leading-relaxed pl-12">
                              {r.comment}
                            </p>

                            {/* Images if attached */}
                            {r.images && r.images.length > 0 && (
                              <div className="flex flex-wrap gap-2 pl-12">
                                {r.images.map((img, idx) => (
                                  <img
                                    key={idx}
                                    src={img}
                                    alt={`Foto ${idx}`}
                                    className="w-14 h-14 object-cover rounded-lg border border-border-subtle"
                                  />
                                ))}
                              </div>
                            )}

                            {/* Video if attached */}
                            {r.video && (
                              <div className="pl-12 max-w-xs">
                                <video src={r.video} controls className="w-full max-h-32 rounded-lg bg-black object-contain" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center text-text-secondary border-2 border-dashed border-border-subtle rounded-xl">
                        <span className="material-symbols-outlined text-[48px] text-outline mb-2">rate_review</span>
                        <p className="font-bold text-sm text-text-primary">Belum ada riwayat ulasan.</p>
                        <p className="text-xs text-text-secondary mt-1">
                          Pilih tab "Menunggu Diulas" di atas untuk mulai memberikan ulasan pesanan Anda.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}
        </section>
      </div>

      {/* INVOICE MODAL (FAKTUR PEMBELIAN) */}
      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        order={selectedInvoiceOrder}
        user={user}
      />

      {/* REVIEW MODAL (FORM ULASAN) */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        product={reviewModalData?.product}
        order={reviewModalData?.order}
        user={user}
        onSubmitReview={handleReviewSubmitted}
      />
    </main>
  );
}
