import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, User, Package, ArrowLeft, MessageSquare, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { syncOrderWithJobs } from '../utils/jobOrderSync';

export default function CreateOrder() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [items, setItems] = useState([{ 
    product: '', 
    qty: 1, 
    price: 0, 
    productName: '',
    notes: []
  }]);
  const [orderDate, setOrderDate] = useState(today);
  const [orderStatus, setOrderStatus] = useState('draft');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State untuk Notes Modal
  const [notesModal, setNotesModal] = useState({
    isOpen: false,
    itemIndex: null,
    currentNote: '',
    notes: []
  });

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

  // Status options
  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'processing', label: 'Diproses' },
    { value: 'production', label: 'Produksi' },
    { value: 'completed', label: 'Selesai' },
    { value: 'delivered', label: 'Terkirim' },
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
    setItems([...items, { 
      product: '', 
      qty: 1, 
      price: 0, 
      productName: '',
      notes: []
    }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    
    if (!newItems[index]) {
      newItems[index] = { product: '', qty: 1, price: 0, productName: '', notes: [] };
    }
    
    newItems[index][field] = value;
    
    if (field === 'product' && value) {
      const selectedProduct = products.find(p => p.id === parseInt(value));
      if (selectedProduct) {
        newItems[index].price = selectedProduct.price || 0;
        newItems[index].productName = selectedProduct.name || '';
      }
    } else if (field === 'product' && !value) {
      newItems[index].price = 0;
      newItems[index].productName = '';
    }
    
    setItems(newItems);
  };

  // Fungsi untuk Notes Modal
  const openNotesModal = (index) => {
    setNotesModal({
      isOpen: true,
      itemIndex: index,
      currentNote: '',
      notes: items[index]?.notes || []
    });
  };

  const closeNotesModal = () => {
    setNotesModal({
      isOpen: false,
      itemIndex: null,
      currentNote: '',
      notes: []
    });
  };

  const addNote = () => {
    if (!notesModal.currentNote.trim()) return;

    const newNote = {
      id: Date.now(),
      text: notesModal.currentNote,
      timestamp: new Date().toISOString(),
      author: 'Admin',
      type: 'general'
    };

    const updatedNotes = [...notesModal.notes, newNote];
    
    // Update notes modal state
    setNotesModal(prev => ({
      ...prev,
      notes: updatedNotes,
      currentNote: ''
    }));

    // Update notes in items
    const newItems = [...items];
    if (newItems[notesModal.itemIndex]) {
      newItems[notesModal.itemIndex].notes = updatedNotes;
      setItems(newItems);
    }
  };

  const removeNote = (noteId) => {
    const updatedNotes = notesModal.notes.filter(note => note.id !== noteId);
    
    setNotesModal(prev => ({
      ...prev,
      notes: updatedNotes
    }));

    // Update notes in items
    const newItems = [...items];
    if (newItems[notesModal.itemIndex]) {
      newItems[notesModal.itemIndex].notes = updatedNotes;
      setItems(newItems);
    }
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
      notes: item.notes || [],
      subtotal: (item.qty || 0) * (item.price || 0)
    }));

    // Buat order data
    const orderData = {
      id: `ORD-${String(Date.now()).slice(-6)}`,
      customerName: selectedCustomerData?.name || 'Pelanggan Tidak Dikenal',
      customerPhone: selectedCustomerData?.phone || '',
      customerAddress: selectedCustomerData?.address || '',
      customerEmail: '',
      orderDate: orderDate,
      dueDate: '',
      items: cleanedItems.length,
      totalAmount: calculateTotal(),
      status: orderStatus,
      notes: '',
      itemsDetail: cleanedItems.map(item => ({
        product: item.productName || '',
        qty: item.qty || 1,
        price: item.price || 0,
        notes: item.notes || [],
        subtotal: (item.qty || 0) * (item.price || 0)
      })),
      timeline: [],
      priority: 'sedang',
      created_at: new Date().toISOString()
    };

    // Simulasi API call
    setTimeout(() => {
      console.log('Order submitted:', orderData);
      
      // Simpan ke localStorage
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = [orderData, ...existingOrders];
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      // Generate jobs untuk order ini jika status bukan draft
      if (orderData.status !== 'draft' && orderData.status !== 'cancelled') {
        syncOrderWithJobs(orderData);
        console.log('✅ Jobs generated for order:', orderData.id);
      }
      
      setIsSubmitting(false);
      
      // Show success message
      alert(`✅ Pesanan ${orderData.id} berhasil disimpan! ${orderData.status !== 'draft' ? 'Jobs telah digenerate.' : ''}`);
      
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
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Awal
                  </label>
                  <select 
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {orderStatus !== 'draft' ? '✅ Jobs akan otomatis digenerate' : '⚠️ Jobs tidak digenerate untuk draft'}
                  </p>
                </div>
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

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
              <p className="text-xs text-yellow-700">
                💡 <strong>Info:</strong> Jika status diproses atau produksi, sistem akan otomatis membuat jobs untuk setiap departemen.
              </p>
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
              <div className="col-span-4 text-sm font-semibold text-gray-700">PRODUK</div>
              <div className="col-span-2 text-sm font-semibold text-gray-700">QTY</div>
              <div className="col-span-2 text-sm font-semibold text-gray-700">HARGA</div>
              <div className="col-span-2 text-sm font-semibold text-gray-700">SUBTOTAL</div>
              <div className="col-span-2 text-sm font-semibold text-gray-700 text-center">CATATAN</div>
            </div>

            {/* Order Items */}
            <div className="divide-y divide-gray-100">
              {items.map((item, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Product Select */}
                    <div className="col-span-4">
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

                    {/* Notes Button */}
                    <div className="col-span-2 flex justify-center space-x-2">
                      <button
                        type="button"
                        onClick={() => openNotesModal(index)}
                        className={`p-2 rounded-lg transition-colors flex items-center ${
                          item.notes?.length > 0 
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title="Kelola catatan item"
                      >
                        <MessageSquare size={18} />
                        {item.notes?.length > 0 && (
                          <span className="ml-1 text-xs font-semibold">
                            {item.notes.length}
                          </span>
                        )}
                      </button>
                      
                      {items.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => {
                            const newItems = items.filter((_, i) => i !== index);
                            setItems(newItems);
                          }}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Notes Preview */}
                  {item.notes?.length > 0 && (
                    <div className="mt-3 pl-4 border-l-2 border-yellow-400">
                      <div className="flex items-center text-sm text-gray-600">
                        <MessageSquare size={14} className="mr-1" />
                        <span className="font-medium mr-2">Catatan:</span>
                        <span className="text-gray-500">
                          {item.notes.length} catatan ditambahkan
                        </span>
                        <button
                          onClick={() => openNotesModal(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800 text-xs flex items-center"
                        >
                          <Eye size={12} className="mr-1" />
                          Lihat
                        </button>
                      </div>
                    </div>
                  )}
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
              💡 <strong>Tips Integrasi JobList:</strong><br/>
              1. Pilih status <strong>"Diproses"</strong> atau <strong>"Produksi"</strong> untuk auto-generate jobs<br/>
              2. Jobs akan otomatis dibuat untuk departemen: Potong, Jahit, Finishing, Packing, QC<br/>
              3. Karyawan dapat mengambil jobs dari halaman <strong>JobList</strong><br/>
              4. Timeline order akan otomatis terupdate dari progress jobs
            </p>
          </div>
        </div>
      </div>

      {/* Notes Modal */}
      {notesModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center">
                <MessageSquare className="text-yellow-600 mr-3" size={24} />
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Catatan Item</h3>
                  <p className="text-sm text-gray-600">
                    Item: {items[notesModal.itemIndex]?.productName || 'Belum dipilih'}
                  </p>
                </div>
              </div>
              <button
                onClick={closeNotesModal}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Add New Note */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tambah Catatan Baru
                </label>
                <div className="flex space-x-2">
                  <textarea
                    className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    rows="3"
                    placeholder="Tulis catatan untuk item ini..."
                    value={notesModal.currentNote}
                    onChange={(e) => setNotesModal(prev => ({ ...prev, currentNote: e.target.value }))}
                  />
                  <button
                    onClick={addNote}
                    disabled={!notesModal.currentNote.trim()}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-start"
                  >
                    Tambah
                  </button>
                </div>
              </div>

              {/* Notes List */}
              <div>
                <h4 className="font-medium text-gray-800 mb-4">
                  Daftar Catatan ({notesModal.notes.length})
                </h4>
                
                {notesModal.notes.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <MessageSquare className="text-gray-400 mx-auto mb-3" size={32} />
                    <p className="text-gray-500">Belum ada catatan</p>
                    <p className="text-gray-400 text-sm mt-1">Tambahkan catatan pertama Anda</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notesModal.notes.map((note) => (
                      <div key={note.id} className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-gray-800">{note.author}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(note.timestamp).toLocaleString('id-ID')}
                            </p>
                          </div>
                          <button
                            onClick={() => removeNote(note.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Hapus catatan"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-gray-700">{note.text}</p>
                        {note.type && (
                          <span className="inline-block mt-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                            {note.type}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeNotesModal}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}