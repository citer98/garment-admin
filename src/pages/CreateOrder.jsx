import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, User, Package, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CreateOrder() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [items, setItems] = useState([{ product: '', qty: 1, price: 0, productName: '' }]);
  const [orderDate, setOrderDate] = useState(today);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function untuk format currency
  const formatCurrency = (value) => {
    const num = Number(value) || 0;
    return num.toLocaleString('id-ID');
  };

  // Data produk
  const products = [
    { id: 1, name: 'Kemeja Pria Slimfit', price: 150000, category: 'Kemeja' },
    { id: 2, name: 'Celana Jeans Denim', price: 250000, category: 'Celana' },
    { id: 3, name: 'Jaket Hoodie', price: 300000, category: 'Jaket' },
    { id: 4, name: 'Kemeja Wanita Formal', price: 180000, category: 'Kemeja' },
    { id: 5, name: 'Blouse Wanita', price: 120000, category: 'Blouse' },
    { id: 6, name: 'Celana Chino', price: 200000, category: 'Celana' },
  ];

  // Simulasi data pelanggan
  useEffect(() => {
    const mockCustomers = [
      { id: 1, name: 'Toko Baju Maju Jaya', address: 'Jl. Sudirman No. 123', phone: '0812-3456-7890' },
      { id: 2, name: 'Butik Modern', address: 'Jl. Thamrin No. 45', phone: '0813-4567-8901' },
      { id: 3, name: 'Konveksi Sejahtera', address: 'Jl. Gatot Subroto No. 67', phone: '0814-5678-9012' },
      { id: 4, name: 'Distro Urban', address: 'Jl. Malioboro No. 89', phone: '0815-6789-0123' },
    ];
    setCustomers(mockCustomers);
  }, []);

  const handleAddItem = () => {
    setItems([...items, { product: '', qty: 1, price: 0, productName: '' }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    
    // Pastikan item di index tersebut ada
    if (!newItems[index]) {
      newItems[index] = { product: '', qty: 1, price: 0, productName: '' };
    }
    
    newItems[index][field] = value;
    
    if (field === 'product' && value) {
      const selectedProduct = products.find(p => p.id === parseInt(value));
      if (selectedProduct) {
        newItems[index].price = selectedProduct.price || 0;
        newItems[index].productName = selectedProduct.name || '';
      }
    } else if (field === 'product' && !value) {
      // Reset jika produk dihapus
      newItems[index].price = 0;
      newItems[index].productName = '';
    }
    
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const itemQty = item.qty || 0;
      const itemPrice = item.price || 0;
      return total + (itemQty * itemPrice);
    }, 0);
  };

  const calculateSubtotal = (qty, price) => {
    const quantity = qty || 0;
    const itemPrice = price || 0;
    return quantity * itemPrice;
  };

  const handleSubmit = async () => {
    // Validasi
    if (!selectedCustomer) {
      alert('Pilih pelanggan terlebih dahulu!');
      return;
    }

    const invalidItems = items.filter(item => {
      return !item.product || !item.product.trim() || 
             !item.qty || item.qty < 1 ||
             !item.price || item.price <= 0;
    });

    if (invalidItems.length > 0) {
      alert('Periksa kembali item pesanan! Pastikan semua item sudah dipilih dengan kuantitas dan harga yang valid.');
      return;
    }

    setIsSubmitting(true);

    const selectedCustomerData = customers.find(c => c.id === parseInt(selectedCustomer));
    
    // Bersihkan dan validasi data items
    const cleanedItems = items.map(item => ({
      product: item.product || '',
      qty: item.qty || 1,
      price: item.price || 0,
      productName: item.productName || '',
      subtotal: (item.qty || 0) * (item.price || 0)
    }));

    // Buat order data dengan struktur yang konsisten dengan Orders.jsx
    const orderData = {
      id: `ORD-${String(Date.now()).slice(-6)}`,
      customerName: selectedCustomerData?.name || 'Pelanggan Tidak Dikenal',
      customerPhone: selectedCustomerData?.phone || '',
      customerAddress: selectedCustomerData?.address || '',
      customerEmail: '',
      orderDate: orderDate,
      dueDate: '',
      items: cleanedItems.length, // Jumlah item (bukan array)
      totalAmount: calculateTotal(),
      status: 'draft',
      notes: '',
      itemsDetail: cleanedItems.map(item => ({
        product: item.productName || '',
        qty: item.qty || 1,
        price: item.price || 0,
        subtotal: (item.qty || 0) * (item.price || 0)
      }))
    };

    // Simulasi API call
    setTimeout(() => {
      console.log('Order submitted:', orderData);
      setIsSubmitting(false);
      
      // Simpan ke localStorage
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = [orderData, ...existingOrders];
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      // Show success message
      alert('✅ Pesanan berhasil disimpan!');
      
      // Redirect ke halaman orders
      navigate('/orders');
    }, 1500);
  };

  const handleCancel = () => {
    if (window.confirm('Batalkan pesanan? Semua data akan hilang.')) {
      navigate('/orders');
    }
  };

  const selectedCustomerData = customers.find(c => c.id === parseInt(selectedCustomer));

  return (
    <div className="max-w-6xl mx-auto">
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
              <h2 className="text-2xl font-bold text-gray-800">Buat Pesanan Baru</h2>
              <p className="text-gray-600">Input data pesanan dari pelanggan</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Customer & Order Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Customer Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3">
                <User size={20} />
              </div>
              <h3 className="font-semibold text-gray-800">Data Pelanggan</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Pelanggan <span className="text-red-500">*</span>
                </label>
                <select 
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  required
                >
                  <option value="">-- Pilih Pelanggan --</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCustomerData && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="font-medium text-blue-800">{selectedCustomerData.name}</p>
                  <p className="text-sm text-blue-600 mt-1">{selectedCustomerData.address}</p>
                  <p className="text-sm text-blue-600">{selectedCustomerData.phone}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    Tanggal Pesanan
                  </div>
                </label>
                <input 
                  type="date" 
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Ringkasan Pesanan</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Jumlah Item:</span>
                <span className="font-medium">{items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Kuantitas:</span>
                <span className="font-medium">
                  {items.reduce((total, item) => total + (item.qty || 0), 0)} pcs
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Harga:</span>
                  <span className="text-lg font-bold text-blue-600">
                    Rp {formatCurrency(calculateTotal())}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg mr-3">
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Item Pesanan</h3>
                  <p className="text-sm text-gray-600">Tambahkan produk yang dipesan</p>
                </div>
              </div>
              
              <button 
                onClick={handleAddItem}
                className="flex items-center bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} className="mr-2" />
                Tambah Item
              </button>
            </div>

            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-3 grid grid-cols-12 gap-4 border-b border-gray-200">
              <div className="col-span-5 text-sm font-semibold text-gray-700">PRODUK</div>
              <div className="col-span-2 text-sm font-semibold text-gray-700">QTY</div>
              <div className="col-span-2 text-sm font-semibold text-gray-700">HARGA SATUAN</div>
              <div className="col-span-2 text-sm font-semibold text-gray-700">SUBTOTAL</div>
              <div className="col-span-1"></div>
            </div>

            {/* Order Items */}
            <div className="divide-y divide-gray-100">
              {items.map((item, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Product Select */}
                    <div className="col-span-5">
                      <select 
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={item.product}
                        onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                        required
                      >
                        <option value="">-- Pilih Produk --</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name} • Rp {formatCurrency(product.price)}
                          </option>
                        ))}
                      </select>
                      {item.productName && (
                        <p className="text-xs text-gray-500 mt-1">{item.productName}</p>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="col-span-2">
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <button 
                          type="button"
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50"
                          onClick={() => handleItemChange(index, 'qty', Math.max(1, (item.qty || 1) - 1))}
                          disabled={(item.qty || 1) <= 1}
                        >
                          −
                        </button>
                        <input 
                          type="number" 
                          min="1"
                          className="w-full p-2 text-center border-x border-gray-300 focus:outline-none"
                          value={item.qty || 1}
                          onChange={(e) => handleItemChange(index, 'qty', parseInt(e.target.value) || 1)}
                        />
                        <button 
                          type="button"
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
                          onClick={() => handleItemChange(index, 'qty', (item.qty || 1) + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-2">
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="font-medium text-gray-800">
                          Rp {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="col-span-2">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="font-bold text-blue-700">
                          Rp {formatCurrency(calculateSubtotal(item.qty, item.price))}
                        </p>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <div className="col-span-1 flex justify-center">
                      {items.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => {
                            const newItems = items.filter((_, i) => i !== index);
                            setItems(newItems);
                          }}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Section */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-gray-600">
                  Total {items.length} item • {items.reduce((total, item) => total + (item.qty || 0), 0)} pcs
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Pembayaran</p>
                  <p className="text-2xl font-bold text-blue-600">
                    Rp {formatCurrency(calculateTotal())}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button 
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Batalkan
              </button>
              
              <button 
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedCustomer || items.some(item => !item.product)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Menyimpan...
                  </>
                ) : (
                  'Simpan & Proses Pesanan'
                )}
              </button>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Tips:</strong> Pastikan semua item sudah benar sebelum menyimpan. 
              Pesanan yang sudah disimpan akan muncul di sistem tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}