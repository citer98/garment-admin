import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Download, Filter, Search, Package, Trash2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { formatCurrency, formatDate, safeString, safeNumber } from '../utils/formatters';
import { syncOrderWithJobs } from '../utils/jobOrderSync';

// Tambahkan fungsi untuk sync jobs
const syncJobsForOrder = (orderId) => {
  const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  const order = savedOrders.find(o => o.id === orderId);
  
  if (order && order.status !== 'draft' && order.status !== 'cancelled') {
    syncOrderWithJobs(order);
  }
};

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Status options
  const statusOptions = [
    { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
    { value: 'processing', label: 'Diproses', color: 'bg-blue-100 text-blue-800' },
    { value: 'production', label: 'Produksi', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'completed', label: 'Selesai', color: 'bg-green-100 text-green-800' },
    { value: 'delivered', label: 'Terkirim', color: 'bg-purple-100 text-purple-800' },
    { value: 'cancelled', label: 'Dibatalkan', color: 'bg-red-100 text-red-800' },
  ];

  // Load orders from localStorage
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    try {
      // Coba ambil dari localStorage dulu
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      
      // Validasi setiap order
      const validatedOrders = savedOrders.map(order => {
        return {
          id: safeString(order.id),
          customerName: safeString(order.customerName),
          orderDate: safeString(order.orderDate),
          items: safeNumber(order.items),
          totalAmount: safeNumber(order.totalAmount),
          status: safeString(order.status),
          itemsDetail: Array.isArray(order.itemsDetail) ? order.itemsDetail : [],
          customerPhone: safeString(order.customerPhone),
          customerAddress: safeString(order.customerAddress),
          customerEmail: safeString(order.customerEmail),
          dueDate: safeString(order.dueDate),
          notes: safeString(order.notes)
        };
      });
      
      // Jika tidak ada di localStorage, gunakan data mock
      if (validatedOrders.length === 0) {
        const mockOrders = [
          {
            id: 'ORD-001',
            customerName: 'Toko Baju Maju Jaya',
            orderDate: '2024-01-15',
            items: 3,
            totalAmount: 850000,
            status: 'completed',
            itemsDetail: [
              { product: 'Kemeja Pria Slimfit', qty: 2, price: 150000 },
              { product: 'Celana Jeans Denim', qty: 1, price: 250000 }
            ]
          },
          {
            id: 'ORD-002',
            customerName: 'Butik Modern',
            orderDate: '2024-01-16',
            items: 5,
            totalAmount: 1200000,
            status: 'production',
            itemsDetail: [
              { product: 'Blouse Wanita', qty: 3, price: 120000 },
              { product: 'Kemeja Wanita Formal', qty: 2, price: 180000 }
            ]
          },
          {
            id: 'ORD-003',
            customerName: 'Konveksi Sejahtera',
            orderDate: '2024-01-17',
            items: 2,
            totalAmount: 600000,
            status: 'processing',
            itemsDetail: [
              { product: 'Jaket Hoodie', qty: 2, price: 300000 }
            ]
          },
          {
            id: 'ORD-004',
            customerName: 'Distro Urban',
            orderDate: '2024-01-18',
            items: 4,
            totalAmount: 950000,
            status: 'draft',
            itemsDetail: [
              { product: 'Celana Chino', qty: 2, price: 200000 },
              { product: 'Kemeja Pria Slimfit', qty: 2, price: 150000 }
            ]
          },
        ];
        setOrders(mockOrders);
        localStorage.setItem('orders', JSON.stringify(mockOrders));
        
        // Generate jobs untuk orders yang sudah ada
        mockOrders.forEach(order => {
          syncJobsForOrder(order.id);
        });
      } else {
        setOrders(validatedOrders);
        
        // Generate jobs untuk orders yang sudah ada
        validatedOrders.forEach(order => {
          syncJobsForOrder(order.id);
        });
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const orderId = safeString(order.id).toLowerCase();
    const customerName = safeString(order.customerName).toLowerCase();
    const query = searchQuery.toLowerCase();
    
    const matchesSearch = orderId.includes(query) || customerName.includes(query);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewOrder = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const handleEditOrder = (orderId) => {
    navigate(`/orders/edit/${orderId}`);
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus pesanan ${orderId}?`)) {
      const updatedOrders = orders.filter(order => order.id !== orderId);
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      // Hapus jobs terkait
      const availableJobs = JSON.parse(localStorage.getItem('availableJobs') || '[]');
      const filteredJobs = availableJobs.filter(job => job.order_id !== orderId);
      localStorage.setItem('availableJobs', JSON.stringify(filteredJobs));
      
      alert('Pesanan berhasil dihapus!');
    }
  };

  const handleCreateNew = () => {
    navigate('/orders/create');
  };

  const handleDownloadInvoice = (orderId) => {
    alert(`Download invoice ${orderId}`);
  };

  // Hitung statistik
  const totalOrders = orders.length;
  const inProcessOrders = orders.filter(o => ['processing', 'production'].includes(safeString(o.status))).length;
  const completedOrders = orders.filter(o => safeString(o.status) === 'completed').length;
  const totalOrderValue = orders.reduce((sum, order) => sum + safeNumber(order.totalAmount), 0);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Daftar Pesanan</h2>
            <p className="text-gray-600">Kelola semua pesanan pelanggan</p>
          </div>
          <button 
            onClick={handleCreateNew}
            className="flex items-center bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Pesanan Baru
          </button>
        </div>
      </div>

      {/* Filter dan Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari berdasarkan ID pesanan atau nama pelanggan..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div>
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Semua Status</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-sm text-gray-600 mb-1">Total Pesanan</p>
          <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-sm text-gray-600 mb-1">Dalam Proses</p>
          <p className="text-2xl font-bold text-blue-600">{inProcessOrders}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-sm text-gray-600 mb-1">Selesai</p>
          <p className="text-2xl font-bold text-green-600">{completedOrders}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-sm text-gray-600 mb-1">Nilai Total Pesanan</p>
          <p className="text-2xl font-bold text-purple-600">
            Rp {formatCurrency(totalOrderValue)}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID Pesanan</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Pelanggan</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Jumlah Item</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const status = statusOptions.find(s => s.value === order.status);
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.customerName}</p>
                        <p className="text-sm text-gray-500">{order.items} item</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(order.orderDate)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {order.items} item
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Rp {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status?.color || 'bg-gray-100 text-gray-800'}`}>
                        {status?.label || order.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewOrder(order.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleEditOrder(order.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDownloadInvoice(order.id)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package className="text-gray-400" size={40} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada pesanan ditemukan</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'all' 
                ? 'Coba ubah filter atau kata kunci pencarian' 
                : 'Mulai dengan membuat pesanan baru'}
            </p>
            <button 
              onClick={handleCreateNew}
              className="inline-flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} className="mr-2" />
              Buat Pesanan Pertama
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Menampilkan <span className="font-semibold">{filteredOrders.length}</span> dari{' '}
            <span className="font-semibold">{totalOrders}</span> pesanan
          </p>
          <Link 
            to="/joblist"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ↗ Lihat Pekerjaan Terkait
          </Link>
        </div>
      </div>
    </div>
  );
}