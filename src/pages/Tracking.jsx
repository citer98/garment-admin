import React, { useState } from 'react';

export default function Tracking() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Simulasi data pesanan
  const mockOrders = [
    {
      id: 'ORD-001',
      customer_name: 'Toko Baju Maju Jaya',
      date: '2024-01-15',
      items: [
        {
          id: 1,
          product_name: 'Kemeja Pria Slimfit',
          qty: 10,
          current_status: 'jahit',
          current_employee: 'Budi Santoso',
          history: [
            { date: '2024-01-15 08:00', status: 'potong', employee: 'Joko Anwar' },
            { date: '2024-01-15 10:30', status: 'jahit', employee: 'Budi Santoso' },
          ]
        },
        {
          id: 2,
          product_name: 'Celana Jeans Denim',
          qty: 5,
          current_status: 'potong',
          current_employee: 'Joko Anwar',
          history: [
            { date: '2024-01-15 09:00', status: 'potong', employee: 'Joko Anwar' },
          ]
        }
      ]
    },
    {
      id: 'ORD-002',
      customer_name: 'Butik Modern',
      date: '2024-01-14',
      items: [
        {
          id: 1,
          product_name: 'Jaket Hoodie',
          qty: 20,
          current_status: 'finishing',
          current_employee: 'Siti Aminah',
          history: [
            { date: '2024-01-14 08:00', status: 'potong', employee: 'Joko Anwar' },
            { date: '2024-01-14 11:00', status: 'jahit', employee: 'Budi Santoso' },
            { date: '2024-01-15 08:30', status: 'finishing', employee: 'Siti Aminah' },
          ]
        }
      ]
    }
  ];

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    
    // Simulasi API call delay
    setTimeout(() => {
      const results = mockOrders.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setSearchResults(results.length > 0 ? results : null);
      setLoading(false);
    }, 500);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'potong': return 'bg-yellow-100 text-yellow-800';
      case 'jahit': return 'bg-blue-100 text-blue-800';
      case 'finishing': return 'bg-purple-100 text-purple-800';
      case 'packing': return 'bg-green-100 text-green-800';
      case 'selesai': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'potong': return 'Di Potong';
      case 'jahit': return 'Di Jahit';
      case 'finishing': return 'Di Finishing';
      case 'packing': return 'Di Packing';
      case 'selesai': return 'Selesai';
      default: return status;
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-8">Pelacakan Pesanan Real-Time</h2>
      
      <div className="mb-8">
        <label htmlFor="order-number" className="block text-sm font-medium text-gray-700 mb-2">
          Cari berdasarkan ID Pesanan (cth: ORD-001) atau Nama Pelanggan
        </label>
        <div className="flex space-x-2">
          <input 
            id="order-number"
            className="flex-1 border p-3 rounded-lg" 
            placeholder="Masukkan Nomor Pesanan atau Nama Pelanggan..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            disabled={loading || !searchTerm.trim()}
          >
            {loading ? 'Mencari...' : 'Cari'}
          </button>
        </div>
      </div>
      
      {/* Hasil Pencarian */}
      {searchResults ? (
        <div className="space-y-6">
          {searchResults.map(order => (
            <div key={order.id} className="border rounded-lg overflow-hidden">
              {/* Header Pesanan */}
              <div className="bg-gray-50 p-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">{order.id}</h3>
                    <p className="text-gray-600">{order.customer_name}</p>
                    <p className="text-sm text-gray-500">Tanggal: {order.date}</p>
                  </div>
                  <div className="text-right">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {order.items.length} Item
                    </span>
                  </div>
                </div>
              </div>

              {/* Detail Item */}
              <div className="p-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="mb-6 last:mb-0 p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{item.product_name}</h4>
                        <p className="text-gray-600">Jumlah: {item.qty} pcs</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(item.current_status)}`}>
                          {getStatusLabel(item.current_status)}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">Ditangani: {item.current_employee}</p>
                      </div>
                    </div>

                    {/* Timeline Riwayat */}
                    <div className="mt-4">
                      <h5 className="font-medium text-gray-700 mb-2">Riwayat Pengerjaan:</h5>
                      <div className="space-y-2">
                        {item.history.map((log, logIdx) => (
                          <div key={logIdx} className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(log.status)} border-2 border-white`}></div>
                            <div className="ml-3">
                              <p className="text-sm">
                                <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(log.status)}`}>
                                  {getStatusLabel(log.status)}
                                </span>
                                <span className="ml-2 text-gray-600">{log.date}</span>
                              </p>
                              <p className="text-xs text-gray-500">Oleh: {log.employee}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : searchResults === null && searchTerm ? (
        <div className="text-center py-10">
          <div className="text-gray-400 mb-2">📭</div>
          <p className="text-gray-500">Tidak ditemukan pesanan dengan kata kunci "{searchTerm}"</p>
        </div>
      ) : (
        <div className="mt-10 p-10 bg-gray-50 border border-dashed rounded-lg text-center text-gray-500">
          <div className="text-3xl mb-4">🔍</div>
          <p className="text-lg mb-2">Mulai Lacak Pesanan Anda</p>
          <p className="text-sm">Masukkan ID Pesanan atau Nama Pelanggan di atas</p>
        </div>
      )}
    </div>
  );
}