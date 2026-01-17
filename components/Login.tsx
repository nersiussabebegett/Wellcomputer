
import React, { useState } from 'react';
import { User, Role } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  availableUsers: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, availableUsers }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showGooglePicker, setShowGooglePicker] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const user = availableUsers.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (user) {
        onLogin(user);
      } else {
        setError('Email atau password salah. Silakan coba lagi.');
        setIsLoading(false);
      }
    }, 800);
  };

  const handleGoogleSelect = (user: User) => {
    setIsLoading(true);
    setShowGooglePicker(false);
    
    // Simulasi delay autentikasi Google
    setTimeout(() => {
      onLogin(user);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>

      <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-[0_25px_70px_rgba(0,0,0,0.4)] relative z-10 border border-slate-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl mb-6 shadow-2xl shadow-blue-500/30 transform rotate-3">
            <span className="text-3xl text-white font-bold">W</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Well Computer</h1>
          <p className="text-slate-400 mt-2 font-bold text-xs uppercase tracking-[0.2em]">Smart Sales Portal</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-shake">
            <span className="text-lg">⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Perusahaan</label>
            <input
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 bg-slate-50/50 outline-none transition-all placeholder:text-slate-300 text-sm font-medium"
              placeholder="user@wellcomputer.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 bg-slate-50/50 outline-none transition-all placeholder:text-slate-300 text-sm font-medium"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 text-sm uppercase tracking-widest"
          >
            {isLoading ? 'Autentikasi...' : 'Masuk ke Dashboard'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest"><span className="bg-white px-4 text-slate-400">Atau gunakan</span></div>
        </div>

        {/* Google Login Button */}
        <button
          onClick={() => setShowGooglePicker(true)}
          disabled={isLoading}
          className="w-full bg-white border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="text-sm">Masuk dengan Akun Google</span>
        </button>
      </div>

      {/* Google Account Picker Simulation Modal */}
      {showGooglePicker && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-8 border-b border-slate-100 flex flex-col items-center">
              <svg width="32" height="32" viewBox="0 0 24 24" className="mb-4">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <h2 className="text-xl font-bold text-slate-800">Pilih Akun</h2>
              <p className="text-sm text-slate-500 mt-1">untuk melanjutkan ke Well Computer</p>
            </div>
            
            <div className="max-h-[350px] overflow-y-auto">
              {availableUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleGoogleSelect(u)}
                  className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600 uppercase">
                    {u.name.charAt(0)}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{u.name}</p>
                    <p className="text-xs text-slate-400 truncate">{u.email}</p>
                  </div>
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-tighter bg-blue-50 px-2 py-0.5 rounded">
                    {u.role}
                  </span>
                </button>
              ))}
            </div>

            <div className="p-6 bg-slate-50 flex justify-center">
              <button 
                onClick={() => setShowGooglePicker(false)}
                className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Gunakan akun lain
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Loading Overlay (Google Auth Simulation) */}
      {isLoading && (
        <div className="fixed inset-0 z-[300] bg-white flex flex-col items-center justify-center animate-fade-in">
          <div className="flex gap-2 mb-6">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce [animation-delay:0.15s]"></div>
          </div>
          <p className="text-sm font-bold text-slate-500 animate-pulse uppercase tracking-widest">Menyambungkan ke Akun Google...</p>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default Login;
