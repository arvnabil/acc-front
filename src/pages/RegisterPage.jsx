import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!agreed) {
      showToast({ title: 'Harap setujui syarat & ketentuan terlebih dahulu.', type: 'error' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login({ name, email });
      showToast({ title: 'Akun berhasil dibuat! Selamat bergabung 🎉', type: 'success' });
      navigate('/akun');
      setLoading(false);
    }, 1300);
  }

  function handleGoogleRegister() {
    setGoogleLoading(true);
    setTimeout(() => {
      login({ name: 'Demo Google User', email: 'demo.google@gmail.com', memberTier: 'MEMBER GOLD' });
      showToast({ title: 'Daftar dengan Google berhasil! 🎉', type: 'success' });
      navigate('/akun');
      setGoogleLoading(false);
    }, 1400);
  }

  return (
    <>
      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.85); opacity: 0.6; }
          70% { transform: scale(1.15); opacity: 0; }
          100% { transform: scale(1.15); opacity: 0; }
        }
        @keyframes drift {
          0%   { transform: translateX(0) translateY(0); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateX(40px) translateY(-60px); opacity: 0; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 0.9; }
        }
        .reg-float { animation: floatY 4.5s ease-in-out infinite; }
        .reg-spin  { animation: spin-slow 22s linear infinite; }
        .reg-shim  { animation: shimmer 3s ease-in-out infinite; }
        .reg-particle {
          position: absolute;
          width: 4px; height: 4px;
          border-radius: 50%;
          background: rgba(59,130,246,0.7);
          animation: drift 5.5s ease-in-out infinite;
        }
        .reg-particle:nth-child(1) { left: 12%; top: 72%; animation-delay: 0s; }
        .reg-particle:nth-child(2) { left: 28%; top: 82%; animation-delay: 0.9s; }
        .reg-particle:nth-child(3) { left: 58%; top: 86%; animation-delay: 1.6s; }
        .reg-particle:nth-child(4) { left: 78%; top: 68%; animation-delay: 2.2s; }
        .reg-particle:nth-child(5) { left: 44%; top: 77%; animation-delay: 3.1s; }
        .reg-particle:nth-child(6) { left: 88%; top: 80%; animation-delay: 0.5s; }
      `}</style>

      <div className="min-h-screen flex items-stretch overflow-hidden">

        {/* LEFT PANEL */}
        <div
          className="hidden lg:flex flex-col relative overflow-hidden"
          style={{
            width: '48%',
            background: 'linear-gradient(145deg, #030712 0%, #1e3a8a 40%, #4338ca 100%)',
          }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 40% 60%, rgba(59,130,246,0.12) 0%, transparent 65%)' }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 75% 20%, rgba(124,58,237,0.15) 0%, transparent 55%)' }} />

          <div className="reg-spin absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full border border-blue-400/10 pointer-events-none" />
          <div className="reg-spin absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full border border-purple-400/10 pointer-events-none"
            style={{ animationDirection: 'reverse', animationDuration: '30s' }} />

          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => <span key={i} className="reg-particle" />)}
          </div>

          <div className="relative z-10 p-10 pt-12">
            <Link to="/">
              <img
                src="/accommerce-white.png" alt="Accommerce.id"
                className="h-9 w-auto object-contain"
                onError={e => { e.target.src = '/accommerce-blue.png'; e.target.style.filter = 'brightness(0) invert(1)'; }}
              />
            </Link>
          </div>

          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 -mt-4">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute w-72 h-72 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', animation: 'pulse-ring 3s ease-out infinite' }} />
              <div className="absolute w-56 h-56 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', animation: 'pulse-ring 3s ease-out infinite 1s' }} />
              <img
                src="/login-illustration.jpg"
                alt="IT & AV Solutions"
                className="reg-float relative z-10 w-full max-w-[380px] object-contain rounded-2xl"
                style={{ filter: 'drop-shadow(0 20px 50px rgba(59,130,246,0.25)) drop-shadow(0 0 80px rgba(124,58,237,0.15))' }}
              />
            </div>

            <div className="text-center max-w-[300px]">
              <h2 className="text-white text-xl font-bold mb-3 leading-tight tracking-tight">
                Bergabung dengan<br />
                <span style={{ color: '#60a5fa' }}>Komunitas IT Enterprise</span>
              </h2>
              <p className="text-white/60 text-sm leading-relaxed">
                Akses harga reseller eksklusif dan ribuan produk IT & AV terpercaya.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {[
                { icon: 'storefront',     label: 'Harga Reseller' },
                { icon: 'verified',       label: 'Garansi Resmi' },
                { icon: 'receipt_long',   label: 'Invoice Otomatis' },
                { icon: 'support_agent',  label: 'Dedicated CS' },
              ].map((f, i) => (
                <span key={f.label} className="reg-shim flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border"
                  style={{ color: '#60a5fa', borderColor: 'rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.08)', animationDelay: `${i * 0.4}s` }}>
                  <span className="material-symbols-outlined text-[13px]">{f.icon}</span>
                  {f.label}
                </span>
              ))}
            </div>
          </div>

          <div className="relative z-10 p-8 pb-12">
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: '5.000+', label: 'Produk' },
                { value: '200+', label: 'Brand' },
                { value: '10.000+', label: 'Pelanggan' },
              ].map(s => (
                <div key={s.label} className="text-center rounded-xl p-3 border"
                  style={{ background: 'rgba(59,130,246,0.06)', borderColor: 'rgba(59,130,246,0.15)' }}>
                  <div className="font-bold text-lg leading-tight" style={{ color: '#60a5fa' }}>{s.value}</div>
                  <div className="text-white/50 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          className="flex-1 flex flex-col items-center justify-center px-6 py-10 relative overflow-y-auto"
          style={{ background: 'linear-gradient(160deg, #f8fafc 0%, #f1f5f9 50%, #eff6ff 100%)' }}
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-[0.08] blur-3xl" style={{ background: '#3b82f6' }} />
            <div className="absolute -bottom-24 -left-16 w-64 h-64 rounded-full opacity-[0.08] blur-3xl" style={{ background: '#8b5cf6' }} />
          </div>

          <div className="w-full max-w-[420px] relative z-10">
            <div className="flex justify-center mb-7 lg:hidden">
              <Link to="/"><img src="/accommerce-blue.png" alt="Accommerce.id" className="h-9 w-auto object-contain" /></Link>
            </div>

            <div className="mb-7">
              <h1 className="text-2xl font-bold text-gray-900 mb-1.5 tracking-tight">
                Buat Akun Baru ✨
              </h1>
              <p className="text-sm text-gray-500">
                Daftar gratis dan nikmati akses ke ribuan produk enterprise
              </p>
            </div>

            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={googleLoading || loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mb-4 shadow-sm"
              style={{ borderColor: '#e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
            >
              {googleLoading ? (
                <span className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              <span>{googleLoading ? 'Memproses...' : 'Daftar dengan Google'}</span>
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium px-1">atau daftar dengan email</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 tracking-wide uppercase">Nama Lengkap</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[17px] text-gray-400 pointer-events-none">person</span>
                  <input
                    required type="text" value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Nama lengkap"
                    className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 tracking-wide uppercase">Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-gray-400 pointer-events-none">mail</span>
                  <input
                    required type="email" value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 tracking-wide uppercase">Kata Sandi</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-gray-400 pointer-events-none">lock</span>
                  <input
                    required type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-11 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
                <div className="flex gap-1 mt-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                      style={{
                        background: password.length > i * 2
                          ? (password.length >= 8 ? '#16a34a' : '#f59e0b')
                          : '#e5e7eb'
                      }} />
                  ))}
                </div>
                <span className="text-[11px] text-gray-400">
                  {password.length === 0 ? 'Minimal 8 karakter' : password.length < 8 ? 'Kata sandi terlalu pendek' : 'Kata sandi kuat ✓'}
                </span>
              </div>

              <label className="flex items-start gap-3 cursor-pointer group mt-2">
                <div className="relative mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${agreed ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white group-hover:border-blue-500'}`}>
                    {agreed && <span className="material-symbols-outlined text-white text-[14px] font-bold">check</span>}
                  </div>
                </div>
                <span className="text-xs text-gray-500 leading-relaxed">
                  Dengan mendaftar, saya menyetujui{' '}
                  <a href="#/" className="font-semibold" style={{ color: '#2563eb' }}>Syarat & Ketentuan</a>{' '}
                  dan{' '}
                  <a href="#/" className="font-semibold" style={{ color: '#2563eb' }}>Kebijakan Privasi</a>{' '}
                  Accommerce.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading || googleLoading || !agreed}
                className="w-full relative overflow-hidden py-3.5 px-4 rounded-xl text-sm font-bold text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                style={{
                  background: 'linear-gradient(135deg, #1a56db 0%, #2563eb 50%, #7c3aed 100%)',
                  boxShadow: '0 4px 20px rgba(37, 99, 235, 0.45)',
                }}
              >
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Membuat akun...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">person_add</span>
                      Daftar Sekarang
                    </>
                  )}
                </span>
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Sudah punya akun?{' '}
              <Link to="/login" className="font-bold hover:underline" style={{ color: '#2563eb' }}>
                Masuk di sini
              </Link>
            </p>

            <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-400">
              <span className="material-symbols-outlined text-[14px] text-green-500">shield</span>
              <span>Data Anda aman & terenkripsi SSL 256-bit</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
