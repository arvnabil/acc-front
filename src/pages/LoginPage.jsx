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
      showToast({ title: 'Login berhasil! Selamat datang 👋', type: 'success' });
      navigate(from, { replace: true });
      setLoading(false);
    }, 1200);
  }

  function handleGoogleLogin() {
    setGoogleLoading(true);
    setTimeout(() => {
      login({ name: 'Demo Google User', email: 'demo.google@gmail.com', memberTier: 'MEMBER GOLD' });
      showToast({ title: 'Login dengan Google berhasil! 🎉', type: 'success' });
      navigate(from, { replace: true });
      setGoogleLoading(false);
    }, 1400);
  }

  return (
    <div className="min-h-screen flex items-stretch">
      {/* ════════════════════════════════════════
          LEFT PANEL — Solid Accommerce Blue
      ════════════════════════════════════════ */}
      <div className="hidden lg:flex flex-col relative w-[45%] bg-[#082f49] p-10 justify-between">
        {/* Top Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-xl">
            <img src="/accommerce-blue.png" alt="Logo" className="h-8 w-auto object-contain" />
          </div>
          <div>
            <div className="text-white font-bold text-lg leading-tight tracking-wide">ACCOMMERCE</div>
            <div className="text-sky-200/70 text-[11px] font-semibold tracking-wider">B2B PROCUREMENT PORTAL</div>
          </div>
        </div>

        {/* Center UI Card (Glassmorphism) */}
        <div className="mx-auto w-full max-w-[420px]">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                </div>
                <span className="text-sky-100 text-[10px] font-bold tracking-widest ml-2 uppercase">Ekosistem Pengadaan IT</span>
              </div>
              <span className="bg-[#0369a1] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Online</span>
            </div>

            <div className="flex flex-col gap-3">
              {/* Item 1 */}
              <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-4 flex items-center justify-between border border-white/5">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-amber-400 text-[20px]">storefront</span>
                  <span className="text-white text-sm font-semibold">Harga Khusus Reseller</span>
                </div>
                <span className="bg-white/10 text-sky-100 text-[10px] font-bold px-2 py-1 rounded">Eksklusif</span>
              </div>
              {/* Item 2 */}
              <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-4 flex items-center justify-between border border-white/5">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-blue-400 text-[20px]">inventory_2</span>
                  <span className="text-white text-sm font-semibold">Produk Sewa & Lisensi</span>
                </div>
                <span className="bg-white/10 text-sky-100 text-[10px] font-bold px-2 py-1 rounded">Hardware & Cloud</span>
              </div>
              {/* Item 3 */}
              <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-4 flex items-center justify-between border border-white/5">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-400 text-[20px]">receipt_long</span>
                  <span className="text-white text-sm font-semibold">Sistem PO & Invoice</span>
                </div>
                <span className="bg-white/10 text-sky-100 text-[10px] font-bold px-2 py-1 rounded">Terintegrasi</span>
              </div>
            </div>
          </div>
          
          <p className="text-sky-100/70 text-sm mt-8 leading-relaxed font-medium">
            Platform pengadaan B2B untuk produk IT, Audio Visual, Hardware, dan Lisensi Software dengan sistem harga bertingkat untuk kelancaran bisnis Anda.
          </p>
        </div>

        {/* Bottom Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10 text-[12px] text-sky-100/50 font-medium">
          <span>&copy; PT. Accommerce Teknologi Indonesia</span>
          <div className="flex gap-4">
            <a href="#/" className="hover:text-white transition-colors">Panduan</a>
            <a href="#/" className="hover:text-white transition-colors">Bantuan</a>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          RIGHT PANEL — Login Form
      ════════════════════════════════════════ */}
      <div className="flex-1 bg-white flex flex-col justify-center px-6 py-12 items-center">
        <div className="w-full max-w-[400px]">
          {/* Mobile Logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <img src="/accommerce-blue.png" alt="Accommerce" className="h-10 w-auto" />
          </div>

          <h1 className="text-[24px] font-bold text-slate-800 mb-1">Selamat Datang Kembali</h1>
          <p className="text-[14px] text-slate-500 mb-8">Masuk ke portal Accommerce untuk mengelola belanja B2B Anda.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold text-slate-600 tracking-wide uppercase">Alamat Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">mail</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nama@perusahaan.com"
                  className="w-full bg-[#f0f9ff] border-2 border-[#e0f2fe] rounded-xl pl-12 pr-4 py-3.5 text-[14px] text-slate-800 focus:outline-none focus:border-[#0284c7] focus:bg-white transition-colors placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-bold text-slate-600 tracking-wide uppercase">Kata Sandi</label>
                <a href="#/" className="text-[12px] font-bold text-[#0284c7] hover:underline">Lupa Kata Sandi?</a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#f0f9ff] border-2 border-[#e0f2fe] rounded-xl pl-12 pr-12 py-3.5 text-[14px] text-slate-800 focus:outline-none focus:border-[#0284c7] focus:bg-white transition-colors placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-[14px] py-4 rounded-xl mt-2 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Memproses...</>
              ) : (
                'Masuk Ke Sistem'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-[12px] font-medium text-slate-400">Atau masuk dengan</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
            className="w-full bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-[14px] py-3.5 rounded-xl transition-all flex items-center justify-center gap-3"
          >
            {googleLoading ? (
              <span className="w-5 h-5 border-2 border-slate-300 border-t-[#0284c7] rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Lanjutkan dengan Google
          </button>

          <p className="text-center text-[13px] text-slate-500 mt-8">
            Belum punya akun? <Link to="/register" className="font-bold text-[#0284c7] hover:underline">Daftar sekarang</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
