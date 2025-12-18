import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, User, Mail, Phone, MapPin, Briefcase, Shield, CheckCircle, XCircle, Trash2, Eye, EyeOff } from 'lucide-react';
import { userData } from './UserManagement';

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    address: '',
    role: 'Karyawan',
    department: 'Potong',
    status: 'active',
    password: '' // Tambahkan field password
  });

  useEffect(() => {
    setTimeout(() => {
      const foundUser = userData.find(u => u.id === parseInt(id));
      
      if (foundUser) {
        setUser(foundUser);
        setFormData({
          name: foundUser.name || '',
          username: foundUser.username || '',
          email: foundUser.email || '',
          phone: foundUser.phone || '',
          address: foundUser.address || '',
          role: foundUser.role || 'Karyawan',
          department: foundUser.department || 'Potong',
          status: foundUser.status || 'active',
          password: foundUser.password || '' // Load password
        });
      } else {
        navigate('/users');
      }
      setLoading(false);
    }, 300);
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi password jika diisi (minimal 6 karakter)
    if (formData.password && formData.password.length < 6) {
      alert('Password minimal 6 karakter!');
      return;
    }

    setSaving(true);
    
    setTimeout(() => {
      const userIndex = userData.findIndex(u => u.id === parseInt(id));
      if (userIndex !== -1) {
        // Jika password tidak diubah, pertahankan password lama
        const updatedUser = {
          ...userData[userIndex],
          ...formData
        };
        
        // Jika password kosong, gunakan password lama
        if (!formData.password) {
          updatedUser.password = userData[userIndex].password;
        }
        
        userData[userIndex] = updatedUser;
      }
      
      alert('Data pengguna berhasil diperbarui!');
      navigate('/users');
      setSaving(false);
    }, 800);
  };

  const toggleStatus = () => {
    setFormData(prev => ({
      ...prev,
      status: prev.status === 'active' ? 'inactive' : 'active'
    }));
  };

  const handleDeleteUser = () => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus pengguna ${user?.name}?`)) {
      const userIndex = userData.findIndex(u => u.id === parseInt(id));
      if (userIndex !== -1) {
        userData.splice(userIndex, 1);
        alert('Pengguna berhasil dihapus!');
        navigate('/users');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700">Pengguna tidak ditemukan</h2>
        <Link 
          to="/users" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Kembali ke Manajemen Pengguna
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <Link 
          to="/users" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Kembali ke Manajemen Pengguna
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Pengguna</h1>
            <p className="text-gray-600 mt-2">
              Edit informasi untuk <span className="font-semibold">{user.name}</span>
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`flex items-center px-4 py-2 rounded-full ${formData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {formData.status === 'active' ? (
                <CheckCircle size={18} className="mr-2" />
              ) : (
                <XCircle size={18} className="mr-2" />
              )}
              <span className="font-medium">
                {formData.status === 'active' ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <User size={24} className="text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">Informasi Pribadi</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No. Telepon
                  </label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Kosongkan jika tidak ingin mengubah password"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Minimal 6 karakter. Kosongkan jika tidak ingin mengubah password.</p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat
                  </label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-4 text-gray-400" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Shield size={24} className="text-purple-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">Informasi Tambahan</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">ID Pengguna</p>
                  <p className="font-semibold text-gray-800 mt-1">{user.id}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Tanggal Bergabung</p>
                  <p className="font-semibold text-gray-800 mt-1">
                    {new Date(user.joinDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                
                <div className="md:col-span-2">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      💡 Perubahan akan langsung tersimpan ke dalam sistem prototype.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Briefcase size={24} className="text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">Informasi Profil</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  >
                    <option value="Karyawan">Karyawan</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departemen
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  >
                    <option value="Potong">Potong</option>
                    <option value="Jahit">Jahit</option>
                    <option value="Finishing">Finishing</option>
                    <option value="Packing">Packing</option>
                    <option value="QC">Quality Control</option>
                    <option value="Management">Management</option>
                    <option value="HRD">HRD</option>
                    <option value="Finance">Keuangan</option>
                  </select>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Status Akun</p>
                      <p className="text-sm text-gray-500">
                        {formData.status === 'active' 
                          ? 'Akun dapat mengakses sistem' 
                          : 'Akun tidak dapat mengakses sistem'
                        }
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={toggleStatus}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        formData.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                      } transition-colors`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Aksi</h3>
                <button
                  type="button"
                  onClick={handleDeleteUser}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Hapus Pengguna"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save size={20} className="mr-2" />
                      Simpan Perubahan
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/users')}
                  className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Batalkan
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
              <h3 className="font-semibold text-blue-800 mb-4">Preview Perubahan</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="font-bold text-blue-600">
                      {formData.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">{formData.name}</p>
                    <p className="text-xs text-blue-700">{formData.role}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white/50 p-2 rounded">
                    <p className="text-blue-600">Departemen</p>
                    <p className="font-medium">{formData.department}</p>
                  </div>
                  <div className="bg-white/50 p-2 rounded">
                    <p className="text-blue-600">Status</p>
                    <p className={`font-medium ${formData.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                      {formData.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}