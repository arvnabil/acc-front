import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    // Simulate login
    login({ name: 'Pengguna Demo', email });
    navigate('/akun');
  }

  return (
    <main className="max-w-[1440px] mx-auto px-gutter lg:px-margin py-space-3xl min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-[400px] bg-card-bg border border-border-subtle rounded-xl p-6 lg:p-8 shadow-sm">
        <div className="flex justify-center mb-5">
          <Link to="/">
            <img 
              src="/accommerce-blue.png" 
              alt="Accommerce.id" 
              className="h-9 w-auto object-contain"
            />
          </Link>
        </div>
        <h1 className="font-headline-section text-[22px] font-bold text-text-primary mb-2 text-center">Masuk ke Akun</h1>
        <p className="font-body-md text-[14px] text-text-secondary mb-8 text-center">
          Belum punya akun? <Link to="/register" className="text-primary font-bold hover:underline">Daftar sekarang</Link>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-[13px] font-bold text-text-primary">Email Anda</label>
            <input 
              required 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="nama@perusahaan.com" 
              className="w-full bg-page-background border border-border-subtle rounded-lg px-4 py-3 text-[14px] text-text-primary placeholder:text-outline focus:outline-none focus:border-primary transition-colors" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-[13px] font-bold text-text-primary">Kata Sandi</label>
            <input 
              required 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full bg-page-background border border-border-subtle rounded-lg px-4 py-3 text-[14px] text-text-primary placeholder:text-outline focus:outline-none focus:border-primary transition-colors" 
            />
            <div className="text-right mt-1">
              <a href="#/" className="text-[12px] text-primary hover:underline">Lupa kata sandi?</a>
            </div>
          </div>

          <button type="submit" className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-sm text-[15px] font-bold py-3.5 rounded-lg transition-colors mt-2">
            Masuk
          </button>
        </form>
      </div>
    </main>
  );
}
