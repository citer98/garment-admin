import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { userData } from './UserManagement'; // Import user data dari UserManagement

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

    // Cari user di data dari UserManagement.jsx
    const user = userData.find(
      account => account.username === username && account.password === password
    );

    if (user) {
      // Cek status user aktif
      if (user.status !== 'active') {
        setError('Akun tidak aktif. Hubungi administrator.');
        return;
      }

      // Simpan data user ke localStorage (tanpa password untuk keamanan)
      const { password: userPassword, ...userWithoutPassword } = user;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      // Redirect berdasarkan role
      if (user.role === 'Admin') {
        nav('/dashboard');
      } else {
        nav('/joblist');
      }
    } else {
      setError('Username atau password salah');
    }
  };

  // Demo accounts tetap untuk testing
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

  // Filter hanya user yang aktif untuk demo
  const activeDemoAccounts = demoAccounts.filter(account => {
    const user = userData.find(u => u.username === account.username);
    return user && user.status === 'active';
  });

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a, #1e293b, #0f172a)',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '28rem',
        background: 'white',
        borderRadius: '1rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(to right, #1e293b, #334155)',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: 'white'
          }}>GarmentTrackPro v.0.052</h1>
          <p style={{
            color: '#cbd5e1',
            fontSize: '0.875rem',
            marginTop: '0.25rem'
          }}>Sistem Manufaktur Terintegrasi</p>
        </div>

        {/* Form */}
        <div style={{ padding: '2rem' }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Username */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#334155',
                textTransform: 'uppercase',
                marginBottom: '0.5rem'
              }}>
                USERNAME
              </label>
              <input
                type="text"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#334155',
                textTransform: 'uppercase',
                marginBottom: '0.5rem'
              }}>
                PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    paddingRight: '3rem'
                  }}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748b'
                  }}
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              <p style={{
                fontSize: '0.75rem',
                color: '#64748b',
                marginTop: '0.25rem'
              }}>
                Password minimal 6 karakter
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                background: '#fef2f2',
                borderLeft: '4px solid #ef4444',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                animation: 'fadeIn 0.3s ease-in'
              }}>
                <p style={{ color: '#dc2626', fontSize: '0.875rem' }}>{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              style={{
                width: '100%',
                background: 'linear-gradient(to right, #1e40af, #3b82f6)',
                color: 'white',
                fontWeight: 'bold',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'background 0.2s',
                marginTop: '0.5rem'
              }}
              onMouseEnter={(e) => e.target.style.background = 'linear-gradient(to right, #1e3a8a, #2563eb)'}
              onMouseLeave={(e) => e.target.style.background = 'linear-gradient(to right, #1e40af, #3b82f6)'}
            >
              MASUK KE SISTEM
            </button>
          </form>

          {/* Demo Accounts */}
          <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid #e2e8f0' }}>
            <h3 style={{
              textAlign: 'center',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#475569',
              textTransform: 'uppercase',
              marginBottom: '1rem'
            }}>
              Akun Demo Tersedia:
            </h3>
            
            {activeDemoAccounts.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem'
              }}>
                {activeDemoAccounts.map((account, index) => {
                  const user = userData.find(u => u.username === account.username);
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => fillDemoAccount(account)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem',
                        background: 'linear-gradient(to bottom right, #f8fafc, white)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.75rem',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '2.5rem',
                        height: '2.5rem',
                        background: user?.role === 'Admin' 
                          ? 'linear-gradient(to right, #7c3aed, #8b5cf6)' 
                          : 'linear-gradient(to right, #1e293b, #334155)',
                        borderRadius: '9999px',
                        marginBottom: '0.5rem'
                      }}>
                        <span style={{
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.875rem'
                        }}>
                          {account.name.charAt(0)}
                        </span>
                      </div>
                      <span style={{
                        fontWeight: 'bold',
                        color: '#1e293b',
                        fontSize: '0.875rem'
                      }}>{account.name}</span>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        marginTop: '0.25rem'
                      }}>
                        <span style={{
                          fontSize: '0.75rem',
                          color: user?.role === 'Admin' ? '#7c3aed' : '#64748b',
                          fontWeight: user?.role === 'Admin' ? '600' : 'normal'
                        }}>
                          {user?.role || 'Karyawan'}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          color: '#94a3b8'
                        }}>
                          •
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          color: '#64748b'
                        }}>
                          {account.username}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#94a3b8',
                        marginTop: '0.25rem',
                        fontFamily: 'monospace'
                      }}>
                        {account.password.replace(/./g, '•')}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '1.5rem',
                background: '#f8fafc',
                borderRadius: '0.75rem',
                border: '1px dashed #cbd5e1'
              }}>
                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  Tidak ada akun demo aktif. Hubungi administrator.
                </p>
              </div>
            )}

            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: '#f0f9ff',
              borderRadius: '0.75rem',
              border: '1px solid #bae6fd'
            }}>
              <p style={{
                textAlign: 'center',
                fontSize: '0.75rem',
                color: '#0369a1',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1rem' }}>ℹ️</span>
                <span>
                  Password ditambahkan melalui Manajemen Pengguna. Akun nonaktif tidak dapat login.
                </span>
              </p>
            </div>

            <p style={{
              textAlign: 'center',
              fontSize: '0.75rem',
              color: '#94a3b8',
              marginTop: '1.5rem'
            }}>
              Gunakan akun demo di atas untuk mencoba sistem
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
          © 2024 GarmentTrackPro. All rights reserved.
        </p>
        <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.5rem' }}>
          Version 2.0 | Password Security Enabled
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}