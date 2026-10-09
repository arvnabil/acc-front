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

  // Redirect back to intended page after login
  const from = location.state?.from || '/akun';

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    // Simulate async login
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
      login({
        name: 'Demo Google User',
        email: 'demo.google@gmail.com',
        memberTier: 'MEMBER GOLD',
      });
      showToast('Login dengan Google berhasil! 🎉', 'success');
      navigate(from, { replace: true });
      setGoogleLoading(false);
    }, 1400);
  }

  return (
    <div className="min-h-screen bg-page-background flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #1a56db, transparent)' }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-5 blur-3xl"
          style={{ background: 'radial-gradient(ellipse, #0ea5e9, transparent)' }}
        />
      </div>

      <div className="w-full max-w-[440px] relative z-10">
        {/* Card */}
        <div
          className="rounded-2xl p-8 shadow-2xl border border-white/10"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link to="/">
              <img
                src="/accommerce-blue.png"
                alt="Accommerce.id"
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text-primary mb-2 tracking-tight">
              Selamat Datang Kembali
            </h1>
            <p className="text-sm text-text-secondary">
              Masuk untuk melanjutkan belanja Anda
            </p>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-border-subtle bg-white/5 hover:bg-white/10 text-text-primary text-sm font-semibold transition-all duration-200 hover:border-primary/40 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mb-4 group"
          >
            {googleLoading ? (
              <span className="w-5 h-5 border-2 border-text-secondary border-t-primary rounded-full animate-spin" />
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
            <div className="flex-1 h-px bg-border-subtle" />
            <span className="text-xs text-text-secondary font-medium px-1">atau masuk dengan email</span>
            <div className="flex-1 h-px bg-border-subtle" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-primary tracking-wide uppercase">
                Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">
                  mail
                </span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nama@perusahaan.com"
                  className="w-full bg-white/5 border border-border-subtle rounded-xl pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-outline focus:outline-none focus:border-primary focus:bg-white/8 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-text-primary tracking-wide uppercase">
                  Kata Sandi
                </label>
                <a href="#/" className="text-xs text-primary hover:underline font-medium">
                  Lupa kata sandi?
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">
                  lock
                </span>
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-border-subtle rounded-xl pl-10 pr-11 py-3 text-sm text-text-primary placeholder:text-outline focus:outline-none focus:border-primary focus:bg-white/8 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-text-primary transition-colors"
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
                background: loading
                  ? 'linear-gradient(135deg, #1a56db, #7c3aed)'
                  : 'linear-gradient(135deg, #1a56db 0%, #2563eb 50%, #7c3aed 100%)',
                boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)',
              }}
            >
              <span
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200"
                style={{ background: 'linear-gradient(135deg, #1e40af, #6d28d9)' }}
              />
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

          {/* Register link */}
          <p className="text-center text-sm text-text-secondary mt-6">
            Belum punya akun?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">
              Daftar gratis
            </Link>
          </p>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 mt-5 text-xs text-text-secondary">
          <span className="material-symbols-outlined text-[14px] text-green-400">shield</span>
          <span>Koneksi aman dengan enkripsi SSL 256-bit</span>
        </div>
      </div>
    </div>
  );
}
