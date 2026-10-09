import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    // Simulate registration
    login({ name, email });
    navigate('/akun');
  }

  return (
    <main className="max-w-[1440px] mx-auto px-gutter lg:px-margin py-space-3xl min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-[500px] bg-card-bg border border-border-subtle rounded-xl p-6 lg:p-8 shadow-sm">
        <h1 className="font-headline-section text-[24px] font-bold text-text-primary mb-2 text-center">Daftar Akun Baru</h1>
        <p className="font-body-md text-[14px] text-text-secondary mb-8 text-center">
          Sudah punya akun? <Link to="/login" className="text-primary font-bold hover:underline">Masuk di sini</Link>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-[13px] font-bold text-text-primary">Nama Lengkap</label>
            <input 
              required 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="John Doe" 
              className="w-full bg-page-background border border-border-subtle rounded-lg px-4 py-3 text-[14px] text-text-primary placeholder:text-outline focus:outline-none focus:border-primary transition-colors" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-[13px] font-bold text-text-primary">Email Perusahaan</label>
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
              placeholder="Minimal 8 karakter" 
              className="w-full bg-page-background border border-border-subtle rounded-lg px-4 py-3 text-[14px] text-text-primary placeholder:text-outline focus:outline-none focus:border-primary transition-colors" 
            />
          </div>

          <p className="text-[12px] text-text-secondary mt-2">
            Dengan mendaftar, Anda menyetujui Syarat dan Ketentuan serta Kebijakan Privasi kami.
          </p>

          <button type="submit" className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-sm text-[15px] font-bold py-3.5 rounded-lg transition-colors mt-2">
            Daftar Sekarang
          </button>
        </form>
      </div>
    </main>
  );
}
