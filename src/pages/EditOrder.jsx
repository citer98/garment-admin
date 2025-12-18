import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Calendar, 
  User, 
  Package, 
  Save,
  AlertCircle
} from 'lucide-react';

export default function EditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    customerEmail: '',
    orderDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: 'draft',
    notes: '',
    items: [{ product: '', qty: 1, price: 0, productName: '' }]
  });

  // Data produk
  const products = [
    { id: 1, name: 'Kemeja Pria Slimfit', price: 150000, category: 'Kemeja' },
    { id: 2, name: 'Celana Jeans Denim', price: 250000, category: 'Celana' },
    { id: 3, name: 'Jaket Hoodie', price: 300000, category: 'Jaket' },
    { id: 4, name: 'Kemeja Wanita Formal', price: 180000, category: 'Kemeja' },
    { id: 5, name: 'Blouse Wanita', price: 120000, category: 'Blouse' },
    { id: 6, name: 'Celana Chino', price: 200000, category: 'Celana' },
  ];

  // Status options
  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'processing', label: 'Diproses' },
    { value: 'production', label: 'Produksi' },
    { value: 'completed', label: 'Selesai' },
    { value: 'delivered', label: 'Terkirim' },
    { value: 'cancelled', label: 'Dibatalkan' },
  ];

  useEffect(() => {
    // Load order data
    setTimeout(() => {
      // Cari order dari localStorage
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const foundOrder = savedOrders.find(o => o.id === id);
      
      if (foundOrder) {
        setFormData({
          customerName: foundOrder.customerName || '',
          customerPhone: foundOrder.customerPhone || '0812-3456-7890',
          customerAddress: foundOrder.customerAddress || 'Jl. Sudirman No. 123, Jakarta',
          customerEmail: foundOrder.customerEmail || '',
          orderDate: foundOrder.orderDate || new Date().toISOString().split('T')[0],
          dueDate: foundOrder.dueDate || '',
          status: foundOrder.status || 'draft',
          notes: foundOrder.notes || '',
          items: foundOrder.itemsDetail?.map(item => ({
            product: products.find(p => p.name === item.product)?.id?.toString() || '',
            qty: item.qty,
            price: item.price,
            productName: item.product
          })) || [{ product: '', qty: 1, price: 0, productName: '' }]
        });
      }
      
      setLoading(false);
    }, 500);
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { product: '', qty: 1, price: 0, productName: '' }]
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    
    if (field === 'product' && value) {
      const selectedProduct = products.find(p => p.id === parseInt(value));
      if (selectedProduct) {
        newItems[index].price = selectedProduct.price;
        newItems[index].productName = selectedProduct.name;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const handleRemoveItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        items: newItems
      }));
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => total + (item.qty * item.price), 0);
  };

  const calculateSubtotal = (qty, price) => qty * price;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi
    if (!formData.customerName.trim()) {
      alert('Nama pelanggan harus diisi!');
      return;
    }

    if (formData.items.some(item => !item.product || item.qty < 1)) {
      alert('Periksa kembali item pesanan!');
      return;
    }

    setIsSubmitting(true);

    const updatedOrder = {
      id: id,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerAddress: formData.customerAddress,
      customerEmail: formData.customerEmail,
      orderDate: formData.orderDate,
      dueDate: formData.dueDate,
      items: formData.items.length,
      totalAmount: calculateTotal(),
      status: formData.status,
      notes: formData.notes,
      itemsDetail: formData.items.map(item => ({
        product: item.productName,
        qty: item.qty,
        price: item.price,
        subtotal: item.qty * item.price
      }))
    };

    // Simulasi API call
    setTimeout(() => {
      // Update di localStorage
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = savedOrders.map(order => 
        order.id === id ? updatedOrder : order
      );
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      setIsSubmitting(false);
      
      // Show success message
      alert('✅ Pesanan berhasil diperbarui!');
      
      // Redirect ke view page
      navigate(`/orders/${id}`);
    }, 1500);
  };

  const handleCancel = () => {
    if (window.confirm('Batalkan perubahan? Semua perubahan yang belum disimpan akan hilang.')) {
      navigate(`/orders/${id}`);
    }
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

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(`/orders/${id}`)}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Edit Pesanan</h2>
              <p className="text-gray-600">ID: {id}</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
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
                    Nama Pelanggan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telepon
                  </label>
                  <input
                    type="text"
                    name="customerPhone"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat
                  </label>
                  <textarea
                    name="customerAddress"
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.customerAddress}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2" />
                        Tanggal Pesanan
                      </div>
                    </label>
                    <input 
                      type="date" 
                      name="orderDate"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.orderDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Jatuh Tempo
                    </label>
                    <input 
                      type="date" 
                      name="dueDate"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Pesanan
                  </label>
                  <select 
                    name="status"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan
                  </label>
                  <textarea
                    name="notes"
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Catatan tambahan untuk pesanan ini..."
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
                  <span className="font-medium">{formData.items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Kuantitas:</span>
                  <span className="font-medium">
                    {formData.items.reduce((total, item) => total + item.qty, 0)} pcs
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Harga:</span>
                    <span className="text-lg font-bold text-blue-600">
                      Rp {calculateTotal().toLocaleString('id-ID')}
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
                    <p className="text-sm text-gray-600">Edit produk yang dipesan</p>
                  </div>
                </div>
                
                <button 
                  type="button"
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
                {formData.items.map((item, index) => (
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
                              {product.name} • Rp {product.price.toLocaleString('id-ID')}
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
                            onClick={() => handleItemChange(index, 'qty', Math.max(1, item.qty - 1))}
                            disabled={item.qty <= 1}
                          >
                            −
                          </button>
                          <input 
                            type="number" 
                            min="1"
                            className="w-full p-2 text-center border-x border-gray-300 focus:outline-none"
                            value={item.qty}
                            onChange={(e) => handleItemChange(index, 'qty', parseInt(e.target.value) || 1)}
                          />
                          <button 
                            type="button"
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
                            onClick={() => handleItemChange(index, 'qty', item.qty + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2">
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="font-medium text-gray-800">
                            Rp {item.price.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="col-span-2">
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <p className="font-bold text-blue-700">
                            Rp {calculateSubtotal(item.qty, item.price).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <div className="col-span-1 flex justify-center">
                        {formData.items.length > 1 && (
                          <button 
                            type="button"
                            onClick={() => handleRemoveItem(index)}
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
                    Total {formData.items.length} item • {formData.items.reduce((total, item) => total + item.qty, 0)} pcs
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Pembayaran</p>
                    <p className="text-2xl font-bold text-blue-600">
                      Rp {calculateTotal().toLocaleString('id-ID')}
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
                  type="submit"
                  disabled={isSubmitting || !formData.customerName.trim() || formData.items.some(item => !item.product)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Simpan Perubahan
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Tips:</strong> Pastikan semua perubahan sudah benar sebelum menyimpan. 
                Perubahan akan langsung diterapkan pada sistem tracking.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}