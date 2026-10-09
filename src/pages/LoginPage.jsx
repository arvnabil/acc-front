import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/akun';

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login({ name: 'Pengguna Demo', email });
      showToast('Login berhasil! Selamat datang 👋', 'success');
      navigate(from, { replace: true });
      setLoading(false);
    }, 1200);
  }

  function handleGoogleLogin() {
    setGoogleLoading(true);
    setTimeout(() => {
      login({ name: 'Demo Google User', email: 'demo.google@gmail.com', memberTier: 'MEMBER GOLD' });
      showToast('Login dengan Google berhasil! 🎉', 'success');
      navigate(from, { replace: true });
      setGoogleLoading(false);
    }, 1400);
  }

  return (
    <>
      {/* Keyframe animations injected via style tag */}
      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes floatY2 {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-10px) rotate(12deg); }
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
          50%       { opacity: 0.8; }
        }
        .animate-float { animation: floatY 4s ease-in-out infinite; }
        .animate-float2 { animation: floatY2 5s ease-in-out infinite 0.8s; }
        .animate-float3 { animation: floatY 6s ease-in-out infinite 1.6s; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-shimmer { animation: shimmer 3s ease-in-out infinite; }

        /* Particle dots */
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(0,229,255,0.7);
          animation: drift 5s ease-in-out infinite;
        }
        .particle:nth-child(1)  { left: 10%; top: 70%; animation-delay: 0s; }
        .particle:nth-child(2)  { left: 25%; top: 80%; animation-delay: 0.8s; }
        .particle:nth-child(3)  { left: 55%; top: 85%; animation-delay: 1.5s; }
        .particle:nth-child(4)  { left: 75%; top: 65%; animation-delay: 2.1s; }
        .particle:nth-child(5)  { left: 40%; top: 75%; animation-delay: 3s; }
        .particle:nth-child(6)  { left: 85%; top: 78%; animation-delay: 0.4s; }
      `}</style>

      <div className="min-h-screen flex items-stretch overflow-hidden">
        {/* ═══════════════════════════════════════════
            LEFT PANEL — Illustration + Branding
        ═══════════════════════════════════════════ */}
        <div
          className="hidden lg:flex flex-col relative overflow-hidden"
          style={{
            width: '52%',
            background: 'linear-gradient(145deg, #020b18 0%, #0a2040 30%, #0d5c6e 65%, #0f9488 100%)',
          }}
        >
          {/* Radial glow overlays */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 40% 60%, rgba(0,229,255,0.12) 0%, transparent 65%)',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 75% 20%, rgba(20,184,166,0.15) 0%, transparent 55%)',
            }}
          />

          {/* Spinning large ring (decorative) */}
          <div
            className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full border border-cyan-400/10 animate-spin-slow pointer-events-none"
          />
          <div
            className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full border border-teal-400/10 animate-spin-slow pointer-events-none"
            style={{ animationDirection: 'reverse', animationDuration: '30s' }}
          />

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            <span className="particle" />
            <span className="particle" />
            <span className="particle" />
            <span className="particle" />
            <span className="particle" />
            <span className="particle" />
          </div>

          {/* Top logo */}
          <div className="relative z-10 p-10 pt-12">
            <Link to="/">
              <img
                src="/accommerce-white.png"
                alt="Accommerce.id"
                className="h-9 w-auto object-contain"
                onError={e => { e.target.src = '/accommerce-blue.png'; e.target.style.filter = 'brightness(0) invert(1)'; }}
              />
            </Link>
          </div>

          {/* Center illustration with float animation */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 -mt-6">
            {/* Pulsing ring behind image */}
            <div className="relative flex items-center justify-center mb-6">
              <div
                className="absolute w-72 h-72 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)',
                  animation: 'pulse-ring 3s ease-out infinite',
                }}
              />
              <div
                className="absolute w-56 h-56 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%)',
                  animation: 'pulse-ring 3s ease-out infinite 1s',
                }}
              />
              <img
                src="/login-illustration.jpg"
                alt="IT & AV Solutions"
                className="animate-float relative z-10 w-full max-w-[400px] object-contain rounded-2xl"
                style={{
                  filter: 'drop-shadow(0 20px 50px rgba(0,229,255,0.25)) drop-shadow(0 0 80px rgba(20,184,166,0.15))',
                }}
              />
            </div>

            {/* Text */}
            <div className="text-center max-w-[320px]">
              <h2 className="text-white text-2xl font-bold mb-3 leading-tight tracking-tight">
                Solusi IT & Audio Visual<br />
                <span style={{ color: '#00e5ff' }}>untuk Bisnis Anda</span>
              </h2>
              <p className="text-white/60 text-sm leading-relaxed">
                Ribuan produk enterprise dari brand terpercaya dunia. Harga reseller, garansi resmi, pengiriman cepat.
              </p>
            </div>

            {/* Animated feature pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {[
                { icon: 'verified', label: 'Garansi Resmi' },
                { icon: 'inventory_2', label: 'Produk Original' },
                { icon: 'local_shipping', label: 'Pengiriman Cepat' },
                { icon: 'headset_mic', label: 'Support 24 Jam' },
              ].map((f, i) => (
                <span
                  key={f.label}
                  className="animate-shimmer flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border"
                  style={{
                    color: '#00e5ff',
                    borderColor: 'rgba(0,229,255,0.3)',
                    background: 'rgba(0,229,255,0.08)',
                    animationDelay: `${i * 0.4}s`,
                  }}
                >
                  <span className="material-symbols-outlined text-[13px]">{f.icon}</span>
                  {f.label}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom testimonial */}
          <div className="relative z-10 p-10 pb-12">
            <div
              className="rounded-xl p-4 border"
              style={{ background: 'rgba(0,229,255,0.06)', borderColor: 'rgba(0,229,255,0.2)' }}
            >
              <p className="text-white/70 text-sm italic leading-relaxed mb-2">
                "Platform terpercaya untuk kebutuhan IT & AV perusahaan kami sejak 2022."
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #00e5ff, #14b8a6)' }}
                >
                  A
                </div>
                <span className="text-white/50 text-xs">Tim Procurement · PT. Solusi Digital</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            RIGHT PANEL — Login Form
        ═══════════════════════════════════════════ */}
        <div
          className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative"
          style={{
            background: 'linear-gradient(160deg, #f0fafa 0%, #e8f4f8 50%, #f5f0ff 100%)',
          }}
        >
          {/* Subtle bg accent */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-20 blur-3xl"
              style={{ background: '#0d9488' }}
            />
            <div
              className="absolute -bottom-24 -left-16 w-64 h-64 rounded-full opacity-15 blur-3xl"
              style={{ background: '#7c3aed' }}
            />
          </div>

          <div className="w-full max-w-[400px] relative z-10">
            {/* Mobile logo */}
            <div className="flex justify-center mb-8 lg:hidden">
              <Link to="/">
                <img src="/accommerce-blue.png" alt="Accommerce.id" className="h-9 w-auto object-contain" />
              </Link>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                Selamat Datang Kembali 👋
              </h1>
              <p className="text-sm text-gray-500">
                Masuk untuk melanjutkan belanja enterprise Anda
              </p>
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mb-4 shadow-sm"
              style={{ borderColor: '#e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
            >
              {googleLoading ? (
                <span className="w-5 h-5 border-2 border-gray-300 border-t-teal-500 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              <span>{googleLoading ? 'Memproses...' : 'Lanjutkan dengan Google'}</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium px-1">atau dengan email</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 tracking-wide uppercase">Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-gray-400 pointer-events-none">
                    mail
                  </span>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="nama@perusahaan.com"
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 tracking-wide uppercase">Kata Sandi</label>
                  <a href="#/" className="text-xs font-medium" style={{ color: '#0d9488' }}>Lupa kata sandi?</a>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-gray-400 pointer-events-none">
                    lock
                  </span>
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-11 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full relative overflow-hidden py-3.5 px-4 rounded-xl text-sm font-bold text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                style={{
                  background: 'linear-gradient(135deg, #0f9488 0%, #0d7377 50%, #0a5c6e 100%)',
                  boxShadow: '0 4px 20px rgba(13, 115, 119, 0.45)',
                }}
              >
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">login</span>
                      Masuk Sekarang
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Register */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Belum punya akun?{' '}
              <Link to="/register" className="font-bold hover:underline" style={{ color: '#0d9488' }}>
                Daftar gratis
              </Link>
            </p>

            {/* Security badge */}
            <div className="flex items-center justify-center gap-2 mt-8 text-xs text-gray-400">
              <span className="material-symbols-outlined text-[14px] text-green-500">shield</span>
              <span>Koneksi aman dengan enkripsi SSL 256-bit</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
