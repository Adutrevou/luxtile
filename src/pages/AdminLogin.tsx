import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import luxtileLogo from '@/assets/luxtile-logo.png';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/admin', { replace: true });
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = signIn(email, password);
    if (success) {
      navigate('/admin', { replace: true });
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-10">
          <img src={luxtileLogo} alt="Luxtile" className="h-10 w-auto brightness-0 invert" />
        </div>
        <div className="border border-white/10 p-8 md:p-10">
          <h1 className="font-display text-2xl text-white mb-1">Admin Panel</h1>
          <p className="text-white/50 text-sm mb-8">Sign in to manage products</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-white/60 text-xs tracking-[0.15em] uppercase block mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 text-white py-3 outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="text-white/60 text-xs tracking-[0.15em] uppercase block mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 text-white py-3 outline-none focus:border-accent transition-colors"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-accent text-accent-foreground py-4 text-sm tracking-[0.15em] uppercase font-medium mt-4 hover:tracking-[0.19em] transition-all"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
