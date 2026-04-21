import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Download, Filter, Search, Package, Trash2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { formatCurrency, formatDate, safeString, safeNumber } from '../utils/formatters';
import { syncOrderWithJobs } from '../utils/jobOrderSync';

// Tambahkan fungsi untuk sync jobs
const syncJobsForOrder = (orderId) => {
  const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  const order = savedOrders.find(o => o.id === orderId);
  
  if (order && order.status !== 'cancelled') {
    syncOrderWithJobs(order);
  }
};

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // ==================== STATE UNTUK ZOOM/SCALE ====================
  const [zoomLevel, setZoomLevel] = useState(0.8); // Default 80%
  const [showZoomControls, setShowZoomControls] = useState(false);
  
  // Status options - DISEDERHANAKAN (tanpa Draft, tanpa Diproses, tanpa Produksi)
  const statusOptions = [
    { value: 'cutting', label: '✂️ Potong', color: 'bg-amber-100 text-amber-800' },
    { value: 'sewing', label: '🧵 Jahit', color: 'bg-orange-100 text-orange-800' },
    { value: 'finishing', label: '✨ Finishing', color: 'bg-lime-100 text-lime-800' },
    { value: 'packing', label: '📦 Pengemasan', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'qc', label: '✅ QC', color: 'bg-teal-100 text-teal-800' },
    { value: 'completed', label: '🎉 Selesai', color: 'bg-green-100 text-green-800' },
    { value: 'delivered', label: '🚚 Terkirim', color: 'bg-purple-100 text-purple-800' },
    { value: 'cancelled', label: '❌ Dibatalkan', color: 'bg-red-100 text-red-800' },
  ];

  // Load orders from localStorage
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    try {
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      
      const validatedOrders = savedOrders.map(order => {
        // Mapping status lama ke status baru
        let mappedStatus = order.status;
        if (mappedStatus === 'draft' || mappedStatus === 'processing' || mappedStatus === 'production') {
          mappedStatus = 'cutting';
        }
        
        return {
          id: safeString(order.id),
          customerName: safeString(order.customerName),
          orderDate: safeString(order.orderDate),
          items: safeNumber(order.items),
          totalAmount: safeNumber(order.totalAmount),
          status: mappedStatus,
          itemsDetail: Array.isArray(order.itemsDetail) ? order.itemsDetail : [],
          customerPhone: safeString(order.customerPhone),
          customerAddress: safeString(order.customerAddress),
          customerEmail: safeString(order.customerEmail),
          dueDate: safeString(order.dueDate),
          notes: safeString(order.notes)
        };
      });
      
      if (validatedOrders.length === 0) {
        const mockOrders = [
          {
            id: 'ORD-001',
            customerName: 'Toko Baju Maju Jaya',
            orderDate: '2024-01-15',
            items: 3,
            totalAmount: 850000,
            status: 'completed',
            dueDate: '2024-01-20',
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
            status: 'cutting',
            dueDate: '2024-01-25',
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
            status: 'sewing',
            dueDate: '2024-01-22',
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
            status: 'delivered',
            dueDate: '2024-01-19',
            itemsDetail: [
              { product: 'Celana Chino', qty: 2, price: 200000 },
              { product: 'Kemeja Pria Slimfit', qty: 2, price: 150000 }
            ]
          },
        ];
        setOrders(mockOrders);
        localStorage.setItem('orders', JSON.stringify(mockOrders));
        
        mockOrders.forEach(order => {
          syncJobsForOrder(order.id);
        });
      } else {
        setOrders(validatedOrders);
        
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

  // ==================== FUNGSI UNTUK ZOOM ====================
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.05, 1.2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.05, 0.5));
  };

  const handleZoomReset = () => {
    setZoomLevel(0.8);
  };

  // Hitung statistik
  const totalOrders = orders.length;
  const inProcessOrders = orders.filter(o => ['cutting', 'sewing', 'finishing', 'packing', 'qc'].includes(safeString(o.status))).length;
  const completedOrders = orders.filter(o => ['completed', 'delivered'].includes(safeString(o.status))).length;
  const totalOrderValue = orders.reduce((sum, order) => sum + safeNumber(order.totalAmount), 0);

  return (
    <div className="relative">
      {/* ==================== ZOOM CONTROLS - FLOATING BUTTON ==================== */}
      {/* Zoom controls are commented out as requested */}

      {/* ==================== MAIN CONTENT WITH SCALE TRANSFORM ==================== */}
      <div 
        className="transition-all duration-300"
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'top left',
          width: `${100 / zoomLevel}%`,
        }}
      >
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
                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} className="mr-2" />
                Buat Pesanan Baru
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

          {/* Orders Table - UPDATED WITH NEW STYLES */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/80 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                  <tr>
                    {/* ID PESANAN - Tengah */}
                    <th className="px-6 py-4 whitespace-nowrap text-center cursor-pointer hover:bg-gray-100/50 transition-colors group">
                      ID PESANAN
                    </th>
                    {/* PELANGGAN - Tengah */}
                    <th className="px-6 py-4 whitespace-nowrap text-center cursor-pointer hover:bg-gray-100/50 transition-colors group">
                      PELANGGAN
                    </th>
                    {/* PRODUK - Tengah */}
                    <th className="px-6 py-4 whitespace-nowrap text-center cursor-pointer hover:bg-gray-100/50 transition-colors group">
                      PRODUK
                    </th>
                    {/* TANGGAL - Tengah */}
                    <th className="px-6 py-4 whitespace-nowrap text-center cursor-pointer hover:bg-gray-100/50 transition-colors group">
                      TANGGAL
                    </th>
                    {/* DEADLINE - Tengah */}
                    <th className="px-6 py-4 whitespace-nowrap text-center cursor-pointer hover:bg-gray-100/50 transition-colors group">
                      DEADLINE
                    </th>
                    {/* TOTAL HARGA - Kanan */}
                    <th className="px-6 py-4 whitespace-nowrap text-right cursor-pointer hover:bg-gray-100/50 transition-colors group">
                      TOTAL HARGA
                    </th>
                    {/* STATUS - Tengah */}
                    <th className="px-6 py-4 whitespace-nowrap text-center cursor-pointer hover:bg-gray-100/50 transition-colors group">
                      STATUS
                    </th>
                    {/* AKSI - Tengah */}
                    <th className="px-6 py-4 whitespace-nowrap text-center cursor-pointer hover:bg-gray-100/50 transition-colors group">
                      AKSI
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/80">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => {
                      const status = statusOptions.find(s => s.value === order.status) || statusOptions[0];
                      // Tentukan deadline text
                      let deadlineText = '';
                      let isOverdue = false;
                      if (order.dueDate) {
                        const today = new Date().toISOString().split('T')[0];
                        if (order.dueDate < today) {
                          deadlineText = 'Terlambat';
                          isOverdue = true;
                        } else {
                          const dueDateObj = new Date(order.dueDate);
                          const todayObj = new Date();
                          const diffDays = Math.ceil((dueDateObj - todayObj) / (1000 * 60 * 60 * 24));
                          deadlineText = `${diffDays} hari`;
                        }
                      }
                      
                      return (
                        <tr key={order.id} className="hover:bg-blue-50/50 transition-colors duration-200 group">
                          {/* ID PESANAN - Tengah */}
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="font-mono text-sm font-medium text-gray-800">{order.id}</span>
                          </td>
                          {/* PELANGGAN - Kiri */}
                          <td className="px-6 py-4 whitespace-nowrap text-left">
                            <p className="font-medium text-gray-800">{order.customerName}</p>
                            <p className="text-xs text-gray-500">{order.items} item</p>
                          </td>
                          {/* PRODUK - Kiri */}
                          <td className="px-6 py-4 whitespace-nowrap text-left">
                            <p className="text-sm text-gray-700 truncate max-w-[200px]">
                              {order.itemsDetail?.[0]?.productName || order.itemsDetail?.[0]?.product || '-'}
                            </p>
                            {order.itemsDetail?.length > 1 && (
                              <p className="text-xs text-gray-400">+{order.itemsDetail.length - 1} produk lainnya</p>
                            )}
                          </td>
                          {/* TANGGAL - Tengah */}
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-sm text-gray-600">{formatDate(order.orderDate)}</span>
                          </td>
                          {/* DEADLINE - Tengah */}
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {order.dueDate ? (
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${isOverdue ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                                {isOverdue ? '⚠️ ' : ''}{deadlineText}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">-</span>
                            )}
                          </td>
                          {/* TOTAL HARGA - Kanan */}
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="font-semibold text-gray-900">Rp {formatCurrency(order.totalAmount)}</span>
                          </td>
                          {/* STATUS - Tengah */}
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                              {status.label}
                            </span>
                          </td>
                          {/* AKSI - Tengah */}
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex justify-center gap-2">
                              <button 
                                onClick={() => handleViewOrder(order.id)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Lihat Detail"
                              >
                                <Eye size={16} />
                              </button>
                              <button 
                                onClick={() => handleEditOrder(order.id)}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteOrder(order.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Hapus"
                              >
                                <Trash2 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDownloadInvoice(order.id)}
                                className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                title="Download"
                              >
                                <Download size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Package className="text-gray-300 mb-3" size={48} />
                          <p className="text-gray-500 font-medium">Tidak ada pesanan ditemukan</p>
                          <p className="text-sm text-gray-400 mt-1">
                            {searchQuery || statusFilter !== 'all' 
                              ? 'Coba ubah filter atau kata kunci pencarian' 
                              : 'Mulai dengan membuat pesanan baru'}
                          </p>
                          <button 
                            onClick={handleCreateNew}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            Buat Pesanan Pertama
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Menampilkan <span className="font-semibold">{filteredOrders.length}</span> dari{' '}
                <span className="font-semibold">{totalOrders}</span> pesanan
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}