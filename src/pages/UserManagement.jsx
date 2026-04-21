// src/pages/UserManagement.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, UserPlus, Filter, XCircle, CheckCircle, X, Eye, EyeOff, Users, Shield, UserCheck, Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
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

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

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

  const exportToCSV = () => {
    const headers = ['Nama', 'Username', 'Email', 'Role', 'Departemen', 'Status', 'Tanggal Bergabung'];
    const csvData = users.map(user => [
      user.name,
      user.username,
      user.email,
      user.role,
      user.department,
      user.status === 'active' ? 'Aktif' : 'Nonaktif',
      new Date(user.joinDate).toLocaleDateString('id-ID')
    ]);
    
    const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const inactiveUsers = users.filter(u => u.status === 'inactive').length;
  const adminCount = users.filter(u => u.role === 'Admin').length;
  const employeeCount = users.filter(u => u.role === 'Karyawan').length;

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronUp size={14} className="opacity-30" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp size={14} className="text-blue-600" />
      : <ChevronDown size={14} className="text-blue-600" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* ==================== MAIN CONTENT WITH SCALE 85% ==================== */}
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h2>
              <p className="text-gray-600 mt-1">Kelola akses dan data karyawan</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={exportToCSV}
                className="flex items-center px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                <Download size={18} className="mr-2" />
                Ekspor CSV
              </button>
              
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                <UserPlus size={18} className="mr-2" />
                Tambah User
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users size={18} className="text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-2">{totalUsers}</p>
              <p className="text-xs text-gray-500">Total Pengguna</p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle size={18} className="text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-2">{activeUsers}</p>
              <p className="text-xs text-gray-500">Aktif</p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle size={18} className="text-red-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-red-600 mt-2">{inactiveUsers}</p>
              <p className="text-xs text-gray-500">Nonaktif</p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield size={18} className="text-purple-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-purple-600 mt-2">{adminCount}</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <UserCheck size={18} className="text-cyan-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-cyan-600 mt-2">{employeeCount}</p>
              <p className="text-xs text-gray-500">Karyawan</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama, username, email, atau departemen..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="text-sm text-gray-500 flex items-center">
                Menampilkan {sortedUsers.length} dari {users.length} pengguna
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition" onClick={() => handleSort('name')}>
                      <div className="flex items-center justify-center gap-1">
                        NAMA {getSortIcon('name')}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition" onClick={() => handleSort('username')}>
                      <div className="flex items-center justify-center gap-1">
                        USERNAME {getSortIcon('username')}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition" onClick={() => handleSort('role')}>
                      <div className="flex items-center justify-center gap-1">
                        ROLE {getSortIcon('role')}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition" onClick={() => handleSort('department')}>
                      <div className="flex items-center justify-center gap-1">
                        DEPARTEMEN {getSortIcon('department')}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition" onClick={() => handleSort('status')}>
                      <div className="flex items-center justify-center gap-1">
                        STATUS {getSortIcon('status')}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition" onClick={() => handleSort('joinDate')}>
                      <div className="flex items-center justify-center gap-1">
                        TGL GABUNG {getSortIcon('joinDate')}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      AKSI
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                        {/* Kolom NAMA - Sejajar ke kiri */}
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3 shadow-sm flex-shrink-0">
                              <span className="font-bold text-white text-sm uppercase">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        {/* USERNAME - Tengah */}
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm font-mono text-gray-700">{user.username}</span>
                        </td>
                        {/* ROLE - Tengah */}
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'Admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : user.role === 'Manager'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role === 'Admin' && <Shield size={10} className="mr-1" />}
                            {user.role}
                          </span>
                        </td>
                        {/* DEPARTEMEN - Tengah */}
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm text-gray-700">{user.department}</span>
                        </td>
                        {/* STATUS - Tengah */}
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status === 'active' ? (
                              <><CheckCircle size={10} className="mr-1" /> Aktif</>
                            ) : (
                              <><XCircle size={10} className="mr-1" /> Nonaktif</>
                            )}
                          </span>
                        </td>
                        {/* TGL GABUNG - Tengah */}
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm text-gray-600">
                            {new Date(user.joinDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </td>
                        {/* AKSI - Tengah */}
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              to={`/users/edit/${user.id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit Pengguna"
                            >
                              <Edit2 size={16} />
                            </Link>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Hapus Pengguna"
                            >
                              <Trash2 size={16} />
                            </button>
                            <button
                              onClick={() => toggleStatus(user.id)}
                              className={`p-2 rounded-lg transition ${
                                user.status === 'active' 
                                  ? 'text-yellow-600 hover:bg-yellow-50' 
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                              title={user.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                            >
                              {user.status === 'active' ? <XCircle size={16} /> : <CheckCircle size={16} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Users size={48} className="text-gray-300 mb-3" />
                          <p className="text-gray-500 font-medium">Tidak ada pengguna ditemukan</p>
                          <p className="text-sm text-gray-400 mt-1">Coba ubah kata kunci pencarian</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {sortedUsers.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-sm text-gray-600">
                  Menampilkan {indexOfFirstItem + 1} sampai {Math.min(indexOfLastItem, sortedUsers.length)} dari {sortedUsers.length} data
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="flex gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      if (pageNum > 0 && pageNum <= totalPages) {
                        return (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                      return null;
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-800">
              💡 <span className="font-medium">Tips:</span> Klik pada kolom header untuk mengurutkan data. 
              Gunakan fitur pencarian untuk menemukan pengguna dengan cepat. 
              Status pengguna dapat diubah dengan tombol aksi.
            </p>
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

          {/* ==================== MODAL TAMBAH PENGGUNA ==================== */}
          {isAddModalOpen && (
            <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-start justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col border border-gray-200 mt-8 md:mt-12">
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

// Helper components for sorting icons
const ChevronDown = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const ChevronUp = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);