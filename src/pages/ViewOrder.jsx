import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Package, 
  CheckCircle, 
  Printer, 
  Download,
  Truck,
  FileText,
  Clock,
  AlertCircle
} from 'lucide-react';

export default function ViewOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Status options
  const statusOptions = {
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800', icon: <FileText size={16} /> },
    processing: { label: 'Diproses', color: 'bg-blue-100 text-blue-800', icon: <Clock size={16} /> },
    production: { label: 'Produksi', color: 'bg-yellow-100 text-yellow-800', icon: <Package size={16} /> },
    completed: { label: 'Selesai', color: 'bg-green-100 text-green-800', icon: <CheckCircle size={16} /> },
    delivered: { label: 'Terkirim', color: 'bg-purple-100 text-purple-800', icon: <Truck size={16} /> },
    cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-800', icon: <AlertCircle size={16} /> },
  };

  // Timeline data
  const timelineSteps = [
    { status: 'draft', label: 'Draft', description: 'Pesanan dibuat', date: '2024-01-15 09:30' },
    { status: 'processing', label: 'Diproses', description: 'Verifikasi pembayaran', date: '2024-01-15 10:15' },
    { status: 'production', label: 'Produksi', description: 'Sedang diproduksi', date: '2024-01-16 08:00' },
    { status: 'completed', label: 'Selesai', description: 'Produksi selesai', date: '2024-01-18 16:30' },
    { status: 'delivered', label: 'Terkirim', description: 'Pesanan dikirim', date: '2024-01-19 10:00' },
  ];

  useEffect(() => {
    // Simulasi loading data
    setTimeout(() => {
      // Cari order dari localStorage
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const foundOrder = savedOrders.find(o => o.id === id) || 
        // Fallback ke data mock jika tidak ditemukan
        {
          id: id,
          customerName: 'Toko Baju Maju Jaya',
          customerAddress: 'Jl. Sudirman No. 123, Jakarta',
          customerPhone: '0812-3456-7890',
          customerEmail: 'toko@majujaya.com',
          orderDate: '2024-01-15',
          dueDate: '2024-01-25',
          items: 3,
          totalAmount: 850000,
          status: 'completed',
          notes: 'Pesanan khusus dengan tambahan logo di bagian dada',
          itemsDetail: [
            { product: 'Kemeja Pria Slimfit', qty: 2, price: 150000, subtotal: 300000 },
            { product: 'Celana Jeans Denim', qty: 1, price: 250000, subtotal: 250000 },
            { product: 'Jaket Hoodie', qty: 1, price: 300000, subtotal: 300000 }
          ]
        };
      
      setOrder(foundOrder);
      setLoading(false);
    }, 500);
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert(`Download invoice ${id}`);
  };

  const handleEdit = () => {
    navigate(`/orders/edit/${id}`);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data pesanan...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-6xl mx-auto py-8">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pesanan Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">Pesanan dengan ID {id} tidak ditemukan dalam sistem.</p>
          <button 
            onClick={() => navigate('/orders')}
            className="inline-flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            Kembali ke Daftar Pesanan
          </button>
        </div>
      </div>
    );
  }

  const status = statusOptions[order.status] || statusOptions.draft;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/orders')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-800">Detail Pesanan</h2>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                  {status.icon}
                  {status.label}
                </span>
              </div>
              <p className="text-gray-600">ID: {order.id}</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={handleEdit}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Edit Pesanan
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              <Printer size={18} className="mr-2" />
              Print
            </button>
            <button 
              onClick={handleDownload}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Download size={18} className="mr-2" />
              Download Invoice
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3">
                <User size={20} />
              </div>
              <h3 className="font-semibold text-gray-800">Informasi Pelanggan</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Nama Pelanggan</p>
                <p className="font-medium text-gray-900">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Telepon</p>
                <p className="font-medium text-gray-900">{order.customerPhone || '0812-3456-7890'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 mb-1">Alamat</p>
                <p className="font-medium text-gray-900">{order.customerAddress || 'Jl. Sudirman No. 123, Jakarta'}</p>
              </div>
              {order.customerEmail && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-medium text-gray-900">{order.customerEmail}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Items Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg mr-3">
                <Package size={20} />
              </div>
              <h3 className="font-semibold text-gray-800">Item Pesanan</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">PRODUK</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">QTY</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">HARGA SATUAN</th>
                    <th className="px6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">SUBTOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.itemsDetail?.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{item.product}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.qty} pcs
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        Rp {item.price.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        Rp {(item.qty * item.price).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Section */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-gray-600">
                  Total {order.items} item • {order.itemsDetail?.reduce((total, item) => total + item.qty, 0)} pcs
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Pembayaran</p>
                  <p className="text-2xl font-bold text-blue-600">
                    Rp {order.totalAmount.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Card */}
          {order.notes && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Catatan Pesanan</h3>
              <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                <p className="text-gray-800">{order.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Timeline & Info */}
        <div className="space-y-6">
          {/* Order Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-6">Status Timeline</h3>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              {/* Timeline Steps */}
              <div className="space-y-8 relative">
                {timelineSteps.map((step, index) => {
                  const isCompleted = timelineSteps.findIndex(s => s.status === order.status) >= index;
                  const isCurrent = step.status === order.status;
                  
                  return (
                    <div key={step.status} className="flex items-start">
                      <div className="relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted ? 'bg-blue-600' : 'bg-gray-200'}`}>
                          {isCompleted ? (
                            <CheckCircle size={16} className="text-white" />
                          ) : (
                            <div className={`w-3 h-3 rounded-full ${isCurrent ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                              {step.label}
                            </p>
                            <p className={`text-sm ${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                              {step.description}
                            </p>
                          </div>
                          {isCurrent && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Saat Ini
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{step.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-6">Detail Pesanan</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar size={18} className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Tanggal Pesanan</p>
                  <p className="font-medium text-gray-900">
                    {new Date(order.orderDate).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              {order.dueDate && (
                <div className="flex items-center">
                  <Clock size={18} className="text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Tanggal Jatuh Tempo</p>
                    <p className="font-medium text-gray-900">
                      {new Date(order.dueDate).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
              )}
              
              <div>
                <p className="text-sm text-gray-600 mb-1">ID Pesanan</p>
                <p className="font-medium text-gray-900 font-mono">{order.id}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Status Terakhir</p>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                    {status.icon}
                    {status.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-6">Informasi Pembayaran</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Diskon:</span>
                <span className="font-medium text-green-600">Rp 0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pajak (10%):</span>
                <span className="font-medium">Rp {(order.totalAmount * 0.1).toLocaleString('id-ID')}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-semibold">Total:</span>
                  <span className="text-xl font-bold text-blue-600">
                    Rp {(order.totalAmount * 1.1).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
              
              <div className="pt-4">
                <p className="text-sm text-gray-600 mb-2">Status Pembayaran</p>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="font-medium text-green-700">Lunas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}