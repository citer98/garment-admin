// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Building2, Users, Shield, UserCheck } from 'lucide-react';
import { userData } from './UserManagement';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Username dan password harus diisi');
      return;
    }

    const user = userData.find(
      account => account.username === username && account.password === password
    );

    if (user) {
      if (user.status !== 'active') {
        setError('Akun tidak aktif. Hubungi administrator.');
        return;
      }

      const { password: userPassword, ...userWithoutPassword } = user;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      if (user.role === 'Admin') {
        nav('/dashboard');
      } else {
        nav('/joblist');
      }
    } else {
      setError('Username atau password salah');
    }
  };

  const demoAccounts = [
    { username: 'admin', password: 'admin123', name: 'Pak Hartono', role: 'Admin' },
    { username: 'budi', password: 'budi123', name: 'Budi Santoso', role: 'Karyawan' },
    { username: 'siti', password: 'siti123', name: 'Siti Aminah', role: 'Karyawan' }
  ];

  const fillDemoAccount = (demoUser) => {
    setUsername(demoUser.username);
    setPassword(demoUser.password);
    setError('');
  };

  const activeDemoAccounts = demoAccounts.filter(account => {
    const user = userData.find(u => u.username === account.username);
    return user && user.status === 'active';
  });

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* ==================== MAIN CONTENT WITH SCALE TRANSFORM ==================== */}
      <div 
        className="transition-all duration-300"
        style={{
          transform: 'scale(0.85)',
          transformOrigin: 'top left',
          width: '117.65%',
          minHeight: '100vh',
          paddingBottom: '100px'
        }}
      >
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6">
          {/* Login Card */}
          <div className="w-full max-w-md">
            {/* Card */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-6 text-center">
                <div className="flex justify-center mb-3">
                  <div className="bg-white/10 p-3 rounded-full">
                    <Building2 size={32} className="text-white" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-white">GarmentTrackPro</h1>
                <p className="text-slate-300 text-sm mt-1">Sistem Manufaktur Terintegrasi</p>
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-xs text-slate-300">V.0.08.7</span>
                </div>
              </div>

              {/* Form */}
              <div className="px-8 py-6">
                <form onSubmit={handleLogin} className="space-y-5">
                  {/* Username */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                      Username
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      placeholder="Masukkan username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm pr-11"
                        placeholder="Masukkan password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Password minimal 6 karakter</p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg animate-fadeIn">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Login Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-200 text-sm uppercase tracking-wide shadow-md hover:shadow-lg"
                  >
                    Masuk ke Sistem
                  </button>
                </form>

                {/* Demo Accounts */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <div className="text-center mb-4">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Akun Demo
                    </span>
                  </div>
                  
                  {activeDemoAccounts.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                      {activeDemoAccounts.map((account, index) => {
                        const user = userData.find(u => u.username === account.username);
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => fillDemoAccount(account)}
                            className="group p-3 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                          >
                            <div className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                                user?.role === 'Admin' 
                                  ? 'bg-gradient-to-r from-purple-500 to-purple-600' 
                                  : 'bg-gradient-to-r from-slate-600 to-slate-700'
                              }`}>
                                <span className="text-white font-bold text-sm">
                                  {account.name.charAt(0)}
                                </span>
                              </div>
                              <span className="font-medium text-slate-800 text-xs">{account.name}</span>
                              <div className="flex items-center gap-1 mt-1">
                                <span className={`text-xs font-medium ${
                                  user?.role === 'Admin' ? 'text-purple-600' : 'text-slate-500'
                                }`}>
                                  {user?.role || 'Karyawan'}
                                </span>
                                <span className="text-xs text-slate-300">•</span>
                                <span className="text-xs text-slate-400">{account.username}</span>
                              </div>
                              <span className="text-xs text-slate-400 font-mono mt-1">
                                {account.password.replace(/./g, '•')}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <p className="text-slate-500 text-sm">Tidak ada akun demo aktif</p>
                    </div>
                  )}

                  <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 justify-center">
                      <span className="text-blue-500 text-sm">ℹ️</span>
                      <p className="text-xs text-blue-700 text-center">
                        Password ditambahkan melalui Manajemen Pengguna. Akun nonaktif tidak dapat login.
                      </p>
                    </div>
                  </div>

                  <p className="text-center text-xs text-slate-400 mt-4">
                    Gunakan akun demo di atas untuk mencoba sistem
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-slate-400 text-xs">© 2024 GarmentTrackPro. All rights reserved.</p>
              <p className="text-slate-500 text-xs mt-1">Version 2.0 | Password Security Enabled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in;
        }
      `}</style>
    </div>
  );
}