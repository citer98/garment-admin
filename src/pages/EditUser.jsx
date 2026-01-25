import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Eye, 
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'profile', 'security'
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    address: '',
    role: 'Karyawan',
    department: 'Potong',
    status: 'active',
    password: '',
    notes: ''
  });

  // Mock data untuk user
  const userData = [
    {
      id: 1,
      name: 'Budi Santoso',
      username: 'budi.santoso',
      email: 'budi@konveksi.com',
      phone: '081234567890',
      address: 'Jl. Sudirman No. 123, Jakarta',
      role: 'Supervisor',
      department: 'Jahit',
      status: 'active',
      joinDate: '2023-01-15',
      password: 'password123'
    },
    {
      id: 2,
      name: 'Siti Aminah',
      username: 'siti.aminah',
      email: 'siti@konveksi.com',
      phone: '081345678901',
      address: 'Jl. Thamrin No. 45, Jakarta',
      role: 'Karyawan',
      department: 'Finishing',
      status: 'active',
      joinDate: '2023-02-20',
      password: 'password123'
    },
    {
      id: 3,
      name: 'Joko Anwar',
      username: 'joko.anwar',
      email: 'joko@konveksi.com',
      phone: '081456789012',
      address: 'Jl. Gatot Subroto No. 67, Jakarta',
      role: 'Manager',
      department: 'QC',
      status: 'active',
      joinDate: '2023-03-10',
      password: 'password123'
    },
    {
      id: 4,
      name: 'Rina Wijaya',
      username: 'rina.wijaya',
      email: 'rina@konveksi.com',
      phone: '081567890123',
      address: 'Jl. Malioboro No. 89, Yogyakarta',
      role: 'Karyawan',
      department: 'Potong',
      status: 'inactive',
      joinDate: '2023-04-05',
      password: 'password123'
    }
  ];

  // Deteksi ukuran layar
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
          password: '',
          notes: ''
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
        const updatedUser = {
          ...userData[userIndex],
          ...formData
        };
        
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
          <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 md:mt-4 text-sm md:text-base text-gray-600">Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8 md:py-12">
        <h2 className="text-lg md:text-xl font-semibold text-gray-700">Pengguna tidak ditemukan</h2>
        <Link 
          to="/users" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-3 md:mt-4 text-sm md:text-base"
        >
          <ArrowLeft size={18} className="mr-2" />
          Kembali ke Manajemen Pengguna
        </Link>
      </div>
    );
  }

  // Mobile Tabs Component
  const MobileTabs = () => (
    <div className="mb-4 md:hidden">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 py-3 text-center text-sm font-medium border-b-2 ${
            activeTab === 'info'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center justify-center">
            <User size={16} className="mr-1.5" />
            <span>Informasi</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-3 text-center text-sm font-medium border-b-2 ${
            activeTab === 'profile'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center justify-center">
            <Briefcase size={16} className="mr-1.5" />
            <span>Profil</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex-1 py-3 text-center text-sm font-medium border-b-2 ${
            activeTab === 'security'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center justify-center">
            <Shield size={16} className="mr-1.5" />
            <span>Keamanan</span>
          </div>
        </button>
      </div>
    </div>
  );

  // Mobile User Info Card
  const MobileUserInfoCard = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <span className="font-bold text-blue-600 text-lg">
            {user.name.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 text-base">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.role}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 p-2 rounded-lg">
          <p className="text-xs text-gray-600">ID Pengguna</p>
          <p className="font-semibold text-gray-800 text-sm">{user.id}</p>
        </div>
        <div className="bg-gray-50 p-2 rounded-lg">
          <p className="text-xs text-gray-600">Status</p>
          <div className={`flex items-center ${formData.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
            {formData.status === 'active' ? (
              <CheckCircle size={14} className="mr-1" />
            ) : (
              <XCircle size={14} className="mr-1" />
            )}
            <span className="text-xs font-semibold">{formData.status === 'active' ? 'Aktif' : 'Nonaktif'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
      <div className="mb-4 md:mb-8">
        <Link 
          to="/users" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-3 md:mb-4 text-sm md:text-base"
        >
          <ArrowLeft size={isMobile ? 16 : 20} className="mr-2" />
          Kembali ke Manajemen Pengguna
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Edit Pengguna</h1>
            <p className="text-xs md:text-sm text-gray-600 mt-1">
              Edit informasi untuk <span className="font-semibold">{user.name}</span>
            </p>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className={`flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm ${
              formData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {formData.status === 'active' ? (
                <CheckCircle size={isMobile ? 14 : 18} className="mr-1.5" />
              ) : (
                <XCircle size={isMobile ? 14 : 18} className="mr-1.5" />
              )}
              <span className="font-medium">
                {formData.status === 'active' ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tabs */}
      {isMobile && <MobileTabs />}

      {/* Mobile User Info */}
      {isMobile && <MobileUserInfoCard />}

      <form onSubmit={handleSubmit}>
        {isMobile ? (
          /* Mobile View: Tab Content */
          <div className="space-y-4">
            {/* Tab 1: Informasi Pribadi */}
            {(activeTab === 'info' || !isMobile) && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center mb-4">
                  <User size={20} className="text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-800">Informasi Pribadi</h2>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Username *
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      No. Telepon
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Alamat
                    </label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Informasi Profil */}
            {(activeTab === 'profile' || !isMobile) && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center mb-4">
                  <Briefcase size={20} className="text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-800">Informasi Profil</h2>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      <option value="Karyawan">Karyawan</option>
                      <option value="Supervisor">Supervisor</option>
                      <option value="Manager">Manager</option>
                      <option value="Admin">Administrator</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Departemen
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
                  
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Status Akun</p>
                        <p className="text-xs text-gray-500">
                          {formData.status === 'active' 
                            ? 'Akun dapat mengakses sistem' 
                            : 'Akun tidak dapat mengakses sistem'
                          }
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={toggleStatus}
                        className={`relative inline-flex h-5 w-10 items-center rounded-full ${
                          formData.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                        } transition-colors`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            formData.status === 'active' ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Keamanan */}
            {(activeTab === 'security' || !isMobile) && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center mb-4">
                  <Shield size={20} className="text-purple-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-800">Keamanan</h2>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Kosongkan jika tidak ingin mengubah"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Minimal 6 karakter. Kosongkan jika tidak ingin mengubah.</p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800">
                      💡 Password harus mengandung minimal 6 karakter termasuk huruf dan angka.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons untuk Mobile */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Simpan Perubahan
                    </>
                  )}
                </button>
                
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => navigate('/users')}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
                  >
                    Batalkan
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleDeleteUser}
                    className="flex-1 px-4 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition text-sm flex items-center justify-center"
                  >
                    <Trash2 size={16} className="mr-1.5" />
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Desktop View: 3 Column Layout */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
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
        )}
      </form>
    </div>
  );
}