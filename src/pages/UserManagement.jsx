import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, UserPlus, Filter, XCircle, CheckCircle, X, Eye, EyeOff } from 'lucide-react';
import { DataTable } from '../components/ui/DataTable';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';

// Simpan data users di luar component agar bisa diakses oleh EditUser.jsx
export const userData = [
  { 
    id: 1, 
    name: 'Pak Hartono', 
    username: 'admin', 
    password: 'admin123', // Tambahkan password
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
    password: 'budi123', // Tambahkan password
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
    password: 'siti123', // Tambahkan password
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
    password: 'joko123', // Tambahkan password
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
    password: 'desi123', // Tambahkan password
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
    password: '' // Tambahkan field password
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
    userData.push(userToAdd); // Tambah ke data global
    
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
    
    alert('Pengguna berhasil ditambahkan!');
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h2>
          <p className="text-gray-600">Kelola akses dan data karyawan</p>
        </div>
        
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
            <Filter size={18} className="mr-2" />
            Filter
          </button>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            <UserPlus size={18} className="mr-2" />
            Tambah User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600">Total Pengguna</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{users.length}</p>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600">Aktif</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {users.filter(u => u.status === 'active').length}
          </p>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600">Karyawan</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {users.filter(u => u.role === 'Karyawan').length}
          </p>
        </div>
      </div>

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

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Pengguna"
        message={`Apakah Anda yakin ingin menghapus pengguna "${selectedUser?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        type="danger"
      />

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Tambah Pengguna Baru</h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-3"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-3"
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded-lg p-3"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full border border-gray-300 rounded-lg p-3 pr-10"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      required
                      placeholder="Minimal 6 karakter"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Password akan digunakan untuk login</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No. Telepon
                  </label>
                  <input
                    type="tel"
                    className="w-full border border-gray-300 rounded-lg p-3"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3"
                    value={newUser.address}
                    onChange={(e) => setNewUser({...newUser, address: e.target.value})}
                    rows="2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-3"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Departemen
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-3"
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

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleAddUser}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    disabled={!newUser.name || !newUser.username || !newUser.email || !newUser.password}
                  >
                    Tambah Pengguna
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}