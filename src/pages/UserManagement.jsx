// src/pages/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, UserPlus, Filter, XCircle, CheckCircle, X, Eye, EyeOff, Users, Shield, UserCheck } from 'lucide-react';
import { DataTable } from '../components/ui/DataTable';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';

// Simpan data users di luar component agar bisa diakses oleh EditUser.jsx
export const userData = [
  { 
    id: 1, 
    name: 'Pak Hartono', 
    username: 'admin', 
    password: 'admin123',
    role: 'Admin', 
    department: 'Management', 
    status: 'active',
    joinDate: '2023-01-15',
    email: 'hartono@garment.com',
    phone: '+62 812-3456-7890',
    address: 'Jl. Industri No. 123, Jakarta'
  },
  { 
    id: 2, 
    name: 'Budi Santoso', 
    username: 'budi', 
    password: 'budi123',
    role: 'Karyawan', 
    department: 'Potong', 
    status: 'active',
    joinDate: '2023-03-20',
    email: 'budi@garment.com',
    phone: '+62 813-4567-8901',
    address: 'Jl. Pahlawan No. 45, Bandung'
  },
  { 
    id: 3, 
    name: 'Siti Aminah', 
    username: 'siti', 
    password: 'siti123',
    role: 'Karyawan', 
    department: 'Jahit', 
    status: 'active',
    joinDate: '2023-02-10',
    email: 'siti@garment.com',
    phone: '+62 814-5678-9012',
    address: 'Jl. Gajah Mada No. 67, Surabaya'
  },
  { 
    id: 4, 
    name: 'Joko Anwar', 
    username: 'joko', 
    password: 'joko123',
    role: 'Karyawan', 
    department: 'Finishing', 
    status: 'inactive',
    joinDate: '2023-04-05',
    email: 'joko@garment.com',
    phone: '+62 815-6789-0123',
    address: 'Jl. Sudirman No. 89, Semarang'
  },
  { 
    id: 5, 
    name: 'Desi Ratnasari', 
    username: 'desi', 
    password: 'desi123',
    role: 'Karyawan', 
    department: 'Packing', 
    status: 'active',
    joinDate: '2023-05-15',
    email: 'desi@garment.com',
    phone: '+62 816-7890-1234',
    address: 'Jl. Merdeka No. 12, Yogyakarta'
  },
];

export default function UserManagement() {
  const [users, setUsers] = useState(userData);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    address: '',
    role: 'Karyawan',
    department: 'Potong',
    status: 'active',
    password: ''
  });

  const columns = [
    { 
      key: 'name', 
      label: 'NAMA', 
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="font-bold text-blue-600 text-sm">
              {value.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      )
    },
    { 
      key: 'username', 
      label: 'USERNAME', 
      sortable: true 
    },
    { 
      key: 'role', 
      label: 'ROLE', 
      sortable: true,
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          value === 'Admin' 
            ? 'bg-purple-100 text-purple-800' 
            : value === 'Manager'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-blue-100 text-blue-800'
        }`}>
          {value}
        </span>
      )
    },
    { 
      key: 'department', 
      label: 'DEPARTEMEN', 
      sortable: true 
    },
    { 
      key: 'status', 
      label: 'STATUS', 
      sortable: true,
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          value === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value === 'active' ? 'Aktif' : 'Nonaktif'}
        </span>
      )
    },
    { 
      key: 'joinDate', 
      label: 'TGL GABUNG', 
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString('id-ID')
    },
    { 
      key: 'actions', 
      label: 'AKSI',
      render: (_, row) => (
        <div className="flex items-center space-x-3">
          <Link
            to={`/users/edit/${row.id}`}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="Edit Pengguna"
          >
            <Edit2 size={18} />
          </Link>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Hapus Pengguna"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={() => toggleStatus(row.id)}
            className={`p-2 rounded-lg transition ${
              row.status === 'active' 
                ? 'text-yellow-600 hover:bg-yellow-50' 
                : 'text-green-600 hover:bg-green-50'
            }`}
            title={row.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
          >
            {row.status === 'active' ? <XCircle size={18} /> : <CheckCircle size={18} />}
          </button>
        </div>
      )
    },
  ];

  const handleDelete = (id) => {
    setSelectedUser(users.find(user => user.id === id));
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    const updatedUsers = users.filter(user => user.id !== selectedUser.id);
    setUsers(updatedUsers);
    
    // Update global data
    const userIndex = userData.findIndex(u => u.id === selectedUser.id);
    if (userIndex !== -1) {
      userData.splice(userIndex, 1);
    }
    
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleAddUser = () => {
    // Validasi password
    if (!newUser.password || newUser.password.length < 6) {
      alert('Password minimal 6 karakter!');
      return;
    }

    // Validasi username unik
    const usernameExists = users.some(user => user.username === newUser.username);
    if (usernameExists) {
      alert('Username sudah digunakan! Silakan gunakan username lain.');
      return;
    }

    const newId = Math.max(...users.map(u => u.id), 0) + 1;
    const userToAdd = { 
      id: newId, 
      ...newUser,
      joinDate: new Date().toISOString().split('T')[0]
    };
    
    setUsers([...users, userToAdd]);
    userData.push(userToAdd);
    
    // Reset form
    setNewUser({
      name: '',
      username: '',
      email: '',
      phone: '',
      address: '',
      role: 'Karyawan',
      department: 'Potong',
      status: 'active',
      password: ''
    });
    setShowPassword(false);
    setIsAddModalOpen(false);
    
    alert('✅ Pengguna berhasil ditambahkan!');
  };

  const toggleStatus = (id) => {
    const updatedUsers = users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    );
    setUsers(updatedUsers);
    
    // Update global data
    const userIndex = userData.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      userData[userIndex].status = userData[userIndex].status === 'active' ? 'inactive' : 'active';
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const inactiveUsers = users.filter(u => u.status === 'inactive').length;
  const adminCount = users.filter(u => u.role === 'Admin').length;
  const employeeCount = users.filter(u => u.role === 'Karyawan').length;

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h2>
              <p className="text-gray-600">Kelola akses dan data karyawan</p>
            </div>
            
            <div className="flex space-x-3">
              <button className="flex items-center px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                <Filter size={18} className="mr-2" />
                Filter
              </button>
              
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <UserPlus size={18} className="mr-2" />
                Tambah User
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users size={20} className="text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-3">{totalUsers}</p>
              <p className="text-xs text-gray-500">Total Pengguna</p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-green-100 rounded-lg">
                  <UserCheck size={20} className="text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-3">{activeUsers}</p>
              <p className="text-xs text-gray-500">Aktif</p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle size={20} className="text-red-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-red-600 mt-3">{inactiveUsers}</p>
              <p className="text-xs text-gray-500">Nonaktif</p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield size={20} className="text-purple-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-purple-600 mt-3">{adminCount}</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users size={20} className="text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-3">{employeeCount}</p>
              <p className="text-xs text-gray-500">Karyawan</p>
            </div>
          </div>

          {/* Data Table */}
          <DataTable
            columns={columns}
            data={users}
            pageSize={8}
            searchable={true}
            downloadable={true}
          />

          <div className="mt-4 text-sm text-gray-600">
            💡 Klik pada kolom header untuk mengurutkan data. Gunakan icon aksi untuk mengelola pengguna.
          </div>

          {/* Confirmation Modal */}
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDelete}
            title="Hapus Pengguna"
            message={`Apakah Anda yakin ingin menghapus pengguna "${selectedUser?.name}"? Tindakan ini tidak dapat dibatalkan.`}
            confirmText="Hapus"
            type="danger"
          />

          {/* ==================== MODAL TAMBAH PENGGUNA (DENGAN BACKGROUND PUTIH/BLUR) ==================== */}
          {isAddModalOpen && (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white sticky top-0 z-10">
                  <div className="flex items-center gap-2">
                    <UserPlus size={22} className="text-blue-600" />
                    <h3 className="font-bold text-xl text-gray-800">Tambah Pengguna Baru</h3>
                  </div>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      placeholder="Contoh: Ahmad Budi"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Username *
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={newUser.username}
                      onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                      placeholder="Contoh: ahmad.budi"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Username akan digunakan untuk login</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      placeholder="contoh@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        required
                        placeholder="Minimal 6 karakter"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Password akan digunakan untuk login</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      No. Telepon
                    </label>
                    <input
                      type="tel"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                      placeholder="08123456789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Alamat
                    </label>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y"
                      value={newUser.address}
                      onChange={(e) => setNewUser({...newUser, address: e.target.value})}
                      rows="2"
                      placeholder="Jl. Contoh No. 123, Kota"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Role
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={newUser.role}
                        onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                      >
                        <option value="Karyawan">Karyawan</option>
                        <option value="Supervisor">Supervisor</option>
                        <option value="Manager">Manager</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Departemen
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={newUser.department}
                        onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                      >
                        <option value="Potong">Potong</option>
                        <option value="Jahit">Jahit</option>
                        <option value="Finishing">Finishing</option>
                        <option value="Packing">Packing</option>
                        <option value="QC">Quality Control</option>
                        <option value="Management">Management</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl sticky bottom-0">
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleAddUser}
                    disabled={!newUser.name || !newUser.username || !newUser.email || !newUser.password}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    Tambah Pengguna
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}