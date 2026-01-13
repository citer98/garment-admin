import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, User, Package, ArrowLeft, MessageSquare, Eye, Upload, FileText, Check, X } from 'lucide-react';
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
    notes: [],
    size: '',
    color: '',
    variantId: ''
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

  // State untuk CSV Import Modal
  const [csvModal, setCsvModal] = useState({
    isOpen: false,
    file: null,
    previewData: [],
    mapping: {},
    errors: [],
    step: 'upload' // 'upload', 'mapping', 'preview'
  });

  // Helper function untuk format currency
  const formatCurrency = (value) => {
    const num = Number(value) || 0;
    return num.toLocaleString('id-ID');
  };

  // Data produk dengan variasi
  const products = [
    { 
      id: 1, 
      name: 'Kemeja Pria Slimfit', 
      basePrice: 150000, 
      category: 'Kemeja',
      variations: [
        { id: '1-s-m', size: 'S', color: 'Putih', price: 150000, stock: 50 },
        { id: '1-m-m', size: 'M', color: 'Putih', price: 150000, stock: 30 },
        { id: '1-l-m', size: 'L', color: 'Putih', price: 155000, stock: 20 },
        { id: '1-s-b', size: 'S', color: 'Biru', price: 155000, stock: 25 },
        { id: '1-m-b', size: 'M', color: 'Biru', price: 155000, stock: 15 },
      ]
    },
    { 
      id: 2, 
      name: 'Celana Jeans Denim', 
      basePrice: 250000, 
      category: 'Celana',
      variations: [
        { id: '2-28-b', size: '28', color: 'Blue Denim', price: 250000, stock: 40 },
        { id: '2-30-b', size: '30', color: 'Blue Denim', price: 250000, stock: 35 },
        { id: '2-32-b', size: '32', color: 'Blue Denim', price: 255000, stock: 25 },
        { id: '2-30-bk', size: '30', color: 'Black Denim', price: 260000, stock: 20 },
      ]
    },
    { 
      id: 3, 
      name: 'Jaket Hoodie', 
      basePrice: 300000, 
      category: 'Jaket',
      variations: [
        { id: '3-s-h', size: 'S', color: 'Hitam', price: 300000, stock: 30 },
        { id: '3-m-h', size: 'M', color: 'Hitam', price: 300000, stock: 25 },
        { id: '3-l-h', size: 'L', color: 'Hitam', price: 310000, stock: 15 },
        { id: '3-m-ab', size: 'M', color: 'Abu-abu', price: 305000, stock: 20 },
      ]
    },
    { 
      id: 4, 
      name: 'Kemeja Wanita Formal', 
      basePrice: 180000, 
      category: 'Kemeja',
      variations: [
        { id: '4-s-p', size: 'S', color: 'Pink', price: 180000, stock: 35 },
        { id: '4-m-p', size: 'M', color: 'Pink', price: 180000, stock: 30 },
        { id: '4-l-p', size: 'L', color: 'Pink', price: 185000, stock: 15 },
        { id: '4-s-w', size: 'S', color: 'Putih', price: 180000, stock: 40 },
      ]
    },
    { 
      id: 5, 
      name: 'Blouse Wanita', 
      basePrice: 120000, 
      category: 'Blouse',
      variations: [
        { id: '5-s-r', size: 'S', color: 'Merah', price: 120000, stock: 45 },
        { id: '5-m-r', size: 'M', color: 'Merah', price: 120000, stock: 35 },
        { id: '5-s-b', size: 'S', color: 'Biru', price: 125000, stock: 25 },
      ]
    },
    { 
      id: 6, 
      name: 'Celana Chino', 
      basePrice: 200000, 
      category: 'Celana',
      variations: [
        { id: '6-30-k', size: '30', color: 'Khaki', price: 200000, stock: 30 },
        { id: '6-32-k', size: '32', color: 'Khaki', price: 200000, stock: 25 },
        { id: '6-30-n', size: '30', color: 'Navy', price: 205000, stock: 20 },
        { id: '6-32-n', size: '32', color: 'Navy', price: 205000, stock: 15 },
      ]
    },
  ];

  // Status options
  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'processing', label: 'Diproses' },
    { value: 'production', label: 'Produksi' },
    { value: 'completed', label: 'Selesai' },
    { value: 'delivered', label: 'Terkirim' },
  ];

  // Available sizes and colors
  const sizeOptions = ['S', 'M', 'L', 'XL', '28', '30', '32', '34', '36'];
  const colorOptions = ['Putih', 'Hitam', 'Biru', 'Merah', 'Hijau', 'Kuning', 'Abu-abu', 'Coklat', 'Navy', 'Khaki', 'Pink', 'Ungu'];

  // Simulasi data pelanggan
  useEffect(() => {
    const mockCustomers = [
      { id: 1, name: 'Toko Baju Maju Jaya', address: 'Jl. Sudirman No. 123', phone: '0812-3456-7890', email: 'maju@jaya.com', joinDate: '2023-01-15' },
      { id: 2, name: 'Butik Modern', address: 'Jl. Thamrin No. 45', phone: '0813-4567-8901', email: 'modern@butik.com', joinDate: '2023-02-20' },
      { id: 3, name: 'Konveksi Sejahtera', address: 'Jl. Gatot Subroto No. 67', phone: '0814-5678-9012', email: 'sejahtera@konveksi.com', joinDate: '2023-03-10' },
      { id: 4, name: 'Distro Urban', address: 'Jl. Malioboro No. 89', phone: '0815-6789-0123', email: 'urban@distro.com', joinDate: '2023-04-05' },
    ];
    setCustomers(mockCustomers);
  }, []);

  // ================== CSV IMPORT FUNCTIONS ==================
  
  const openCsvModal = () => {
    setCsvModal({
      isOpen: true,
      file: null,
      previewData: [],
      mapping: {
        name: 0,
        phone: 1,
        address: 2,
        email: 3
      },
      errors: [],
      step: 'upload'
    });
  };

  const closeCsvModal = () => {
    setCsvModal({
      isOpen: false,
      file: null,
      previewData: [],
      mapping: {},
      errors: [],
      step: 'upload'
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      alert('Hanya file CSV yang diizinkan!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const data = lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim());
      return {
        id: index + 1,
        raw: values,
        parsed: {}
      };
    });

    // Auto-detect mapping
    const mapping = {};
    headers.forEach((header, index) => {
      if (header.includes('nama') || header.includes('name')) mapping.name = index;
      if (header.includes('telp') || header.includes('phone')) mapping.phone = index;
      if (header.includes('alamat') || header.includes('address')) mapping.address = index;
      if (header.includes('email')) mapping.email = index;
    });

    // Parse data with mapping
    const previewData = data.map(item => {
      const parsed = {};
      Object.entries(mapping).forEach(([key, index]) => {
        if (index !== undefined && item.raw[index]) {
          parsed[key] = item.raw[index];
        }
      });
      return { ...item, parsed };
    });

    setCsvModal(prev => ({
      ...prev,
      file: csvText,
      previewData,
      mapping,
      step: 'preview'
    }));
  };

  const handleMappingChange = (field, value) => {
    setCsvModal(prev => ({
      ...prev,
      mapping: { ...prev.mapping, [field]: parseInt(value) }
    }));
  };

  const applyMapping = () => {
    const { previewData, mapping } = csvModal;
    
    const updatedData = previewData.map(item => {
      const parsed = {};
      Object.entries(mapping).forEach(([key, index]) => {
        if (index !== undefined && item.raw[index]) {
          parsed[key] = item.raw[index];
        }
      });
      return { ...item, parsed };
    });

    setCsvModal(prev => ({
      ...prev,
      previewData: updatedData,
      step: 'preview'
    }));
  };

  const importCustomers = () => {
    const { previewData } = csvModal;
    
    // Validate data
    const errors = [];
    const newCustomers = previewData.map((item, index) => {
      if (!item.parsed.name) {
        errors.push(`Baris ${index + 1}: Nama tidak boleh kosong`);
      }
      return {
        id: customers.length + index + 1,
        name: item.parsed.name || 'Pelanggan ' + (customers.length + index + 1),
        phone: item.parsed.phone || '',
        address: item.parsed.address || '',
        email: item.parsed.email || '',
        joinDate: new Date().toISOString().split('T')[0]
      };
    });

    if (errors.length > 0) {
      setCsvModal(prev => ({ ...prev, errors }));
      return;
    }

    // Add to customers list
    setCustomers(prev => [...prev, ...newCustomers]);
    
    // Show success message
    alert(`✅ ${newCustomers.length} pelanggan berhasil diimport!`);
    
    // Close modal
    closeCsvModal();
  };

  // ================== END CSV IMPORT FUNCTIONS ==================

  const handleAddItem = () => {
    setItems([...items, { 
      product: '', 
      qty: 1, 
      price: 0, 
      productName: '',
      notes: [],
      size: '',
      color: '',
      variantId: ''
    }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    
    if (!newItems[index]) {
      newItems[index] = { product: '', qty: 1, price: 0, productName: '', notes: [], size: '', color: '', variantId: '' };
    }
    
    newItems[index][field] = value;
    
    if (field === 'product' && value) {
      const selectedProduct = products.find(p => p.id === parseInt(value));
      if (selectedProduct) {
        newItems[index].price = selectedProduct.basePrice || 0;
        newItems[index].productName = selectedProduct.name || '';
        // Reset size and color when product changes
        newItems[index].size = '';
        newItems[index].color = '';
        newItems[index].variantId = '';
      }
    } else if (field === 'product' && !value) {
      newItems[index].price = 0;
      newItems[index].productName = '';
      newItems[index].size = '';
      newItems[index].color = '';
      newItems[index].variantId = '';
    }
    
    setItems(newItems);
  };

  const handleVariantChange = (index, variantId) => {
    const newItems = [...items];
    const selectedProduct = products.find(p => p.id === parseInt(newItems[index].product));
    
    if (selectedProduct && variantId) {
      const variant = selectedProduct.variations.find(v => v.id === variantId);
      if (variant) {
        newItems[index].variantId = variantId;
        newItems[index].size = variant.size;
        newItems[index].color = variant.color;
        newItems[index].price = variant.price;
      }
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
      size: item.size || '',
      color: item.color || '',
      variantId: item.variantId || '',
      subtotal: (item.qty || 0) * (item.price || 0)
    }));

    // Buat order data
    const orderData = {
      id: `ORD-${String(Date.now()).slice(-6)}`,
      customerName: selectedCustomerData?.name || 'Pelanggan Tidak Dikenal',
      customerPhone: selectedCustomerData?.phone || '',
      customerAddress: selectedCustomerData?.address || '',
      customerEmail: selectedCustomerData?.email || '',
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
        size: item.size || '',
        color: item.color || '',
        variantId: item.variantId || '',
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
  const selectedProduct = (itemIndex) => {
    const productId = items[itemIndex]?.product;
    return products.find(p => p.id === parseInt(productId));
  };

  // Get available variations for selected product
  const getAvailableVariations = (itemIndex) => {
    const product = selectedProduct(itemIndex);
    return product ? product.variations : [];
  };

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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3">
                  <User size={20} />
                </div>
                <h3 className="font-semibold text-gray-800">Data Pelanggan</h3>
              </div>
              <button
                onClick={openCsvModal}
                className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center"
              >
                <Upload size={14} className="mr-1" />
                Import CSV
              </button>
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
                      {customer.name} • {customer.phone}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCustomerData && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="font-medium text-blue-800">{selectedCustomerData.name}</p>
                  <p className="text-sm text-blue-600 mt-1">{selectedCustomerData.address}</p>
                  <p className="text-sm text-blue-600">{selectedCustomerData.phone}</p>
                  {selectedCustomerData.email && (
                    <p className="text-sm text-blue-600">{selectedCustomerData.email}</p>
                  )}
                  <p className="text-xs text-blue-500 mt-2">
                    Bergabung: {new Date(selectedCustomerData.joinDate).toLocaleDateString('id-ID')}
                  </p>
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
              <div className="col-span-3 text-sm font-semibold text-gray-700">PRODUK</div>
              <div className="col-span-1 text-sm font-semibold text-gray-700">UKURAN</div>
              <div className="col-span-1 text-sm font-semibold text-gray-700">WARNA</div>
              <div className="col-span-1 text-sm font-semibold text-gray-700">QTY</div>
              <div className="col-span-2 text-sm font-semibold text-gray-700">HARGA</div>
              <div className="col-span-2 text-sm font-semibold text-gray-700">SUBTOTAL</div>
              <div className="col-span-2 text-sm font-semibold text-gray-700 text-center">CATATAN</div>
            </div>

            {/* Order Items */}
            <div className="divide-y divide-gray-100">
              {items.map((item, index) => {
                const product = selectedProduct(index);
                const variations = getAvailableVariations(index);
                
                return (
                  <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Product Select */}
                      <div className="col-span-3">
                        <select 
                          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={item.product}
                          onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                          required
                        >
                          <option value="">-- Pilih Produk --</option>
                          {products.map(product => (
                            <option key={product.id} value={product.id}>
                              {product.name} • Rp {formatCurrency(product.basePrice)}
                            </option>
                          ))}
                        </select>
                        {item.productName && (
                          <p className="text-xs text-gray-500 mt-1">{item.productName}</p>
                        )}
                      </div>

                      {/* Size Selector */}
                      <div className="col-span-1">
                        {product ? (
                          <select 
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={item.variantId}
                            onChange={(e) => handleVariantChange(index, e.target.value)}
                            required
                          >
                            <option value="">-- Pilih --</option>
                            {variations.map(variant => (
                              <option key={variant.id} value={variant.id}>
                                {variant.size}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
                            <span className="text-gray-400 text-sm">Pilih produk</span>
                          </div>
                        )}
                        {item.size && (
                          <p className="text-xs text-gray-500 mt-1">{item.size}</p>
                        )}
                      </div>

                      {/* Color Display */}
                      <div className="col-span-1">
                        {item.color ? (
                          <div className="flex items-center">
                            <div 
                              className="w-6 h-6 rounded-full border border-gray-300 mr-2"
                              style={{ backgroundColor: item.color.toLowerCase() === 'putih' ? '#ffffff' : 
                                                         item.color.toLowerCase() === 'hitam' ? '#000000' : 
                                                         item.color.toLowerCase() === 'biru' ? '#2563eb' : 
                                                         item.color.toLowerCase() === 'merah' ? '#dc2626' : 
                                                         item.color.toLowerCase() === 'hijau' ? '#16a34a' : 
                                                         item.color.toLowerCase() === 'kuning' ? '#facc15' : 
                                                         item.color.toLowerCase() === 'abu-abu' ? '#6b7280' : 
                                                         item.color.toLowerCase() === 'coklat' ? '#92400e' : 
                                                         item.color.toLowerCase() === 'navy' ? '#1e3a8a' : 
                                                         item.color.toLowerCase() === 'khaki' ? '#d4af37' : 
                                                         item.color.toLowerCase() === 'pink' ? '#ec4899' : 
                                                         item.color.toLowerCase() === 'ungu' ? '#9333ea' : '#ccc' }}
                            ></div>
                            <span className="text-sm">{item.color}</span>
                          </div>
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
                            <span className="text-gray-400 text-sm">-</span>
                          </div>
                        )}
                      </div>

                      {/* Quantity */}
                      <div className="col-span-1">
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
                    
                    {/* Variant Info */}
                    {item.variantId && product && (
                      <div className="mt-2 pl-4 border-l-2 border-green-400">
                        <div className="flex items-center text-sm text-gray-600">
                          <Package size={14} className="mr-1" />
                          <span className="font-medium mr-2">Varian:</span>
                          <span className="text-gray-700">
                            {product.name} - Size: {item.size} - Warna: {item.color}
                          </span>
                          {variations.find(v => v.id === item.variantId)?.stock && (
                            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                              Stok: {variations.find(v => v.id === item.variantId).stock}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
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
                );
              })}
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

      {/* CSV Import Modal */}
      {csvModal.isOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center">
                <FileText className="text-green-600 mr-3" size={24} />
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Import Pelanggan dari CSV</h3>
                  <p className="text-sm text-gray-600">
                    Upload file CSV untuk menambahkan pelanggan baru
                  </p>
                </div>
              </div>
              <button
                onClick={closeCsvModal}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Step Indicator */}
              <div className="mb-8">
                <div className="flex items-center justify-center">
                  {['upload', 'mapping', 'preview'].map((step, index) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        csvModal.step === step 
                          ? 'bg-blue-600 text-white border-2 border-blue-600' 
                          : index < ['upload', 'mapping', 'preview'].indexOf(csvModal.step)
                            ? 'bg-green-500 text-white border-2 border-green-500'
                            : 'bg-gray-100 text-gray-400 border-2 border-gray-300'
                      }`}>
                        {index < ['upload', 'mapping', 'preview'].indexOf(csvModal.step) ? (
                          <Check size={16} />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="ml-2 mr-4 text-sm font-medium">
                        {step === 'upload' && 'Upload File'}
                        {step === 'mapping' && 'Mapping Data'}
                        {step === 'preview' && 'Preview & Import'}
                      </div>
                      {index < 2 && (
                        <div className={`w-16 h-0.5 ${
                          index < ['upload', 'mapping', 'preview'].indexOf(csvModal.step)
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 1: Upload */}
              {csvModal.step === 'upload' && (
                <div className="text-center py-8">
                  <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <Upload className="text-blue-600" size={32} />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-3">
                    Upload File CSV
                  </h4>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Unggah file CSV yang berisi data pelanggan. Pastikan file memiliki kolom: Nama, Telepon, Alamat, Email.
                  </p>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 mb-6 hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label
                      htmlFor="csv-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FileText size={24} className="text-gray-400" />
                      </div>
                      <p className="text-gray-700 font-medium mb-2">
                        Klik untuk memilih file
                      </p>
                      <p className="text-sm text-gray-500">
                        atau drag & drop file CSV di sini
                      </p>
                    </label>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-md mx-auto">
                    <h5 className="font-medium text-blue-800 mb-2">Format CSV yang didukung:</h5>
                    <pre className="text-sm text-blue-700 bg-white p-3 rounded border border-blue-100 overflow-x-auto">
{`nama,telepon,alamat,email
John Doe,08123456789,Jl. Contoh No.1,john@email.com
Jane Smith,08234567890,Jl. Sample No.2,jane@email.com`}
                    </pre>
                  </div>
                </div>
              )}

              {/* Step 2: Mapping */}
              {csvModal.step === 'mapping' && csvModal.previewData.length > 0 && (
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-6">
                    Mapping Kolom CSV
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kolom Nama
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg p-3"
                        value={csvModal.mapping.name}
                        onChange={(e) => handleMappingChange('name', e.target.value)}
                      >
                        {csvModal.previewData[0]?.raw.map((_, index) => (
                          <option key={index} value={index}>
                            Kolom {index + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kolom Telepon
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg p-3"
                        value={csvModal.mapping.phone}
                        onChange={(e) => handleMappingChange('phone', e.target.value)}
                      >
                        {csvModal.previewData[0]?.raw.map((_, index) => (
                          <option key={index} value={index}>
                            Kolom {index + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kolom Alamat
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg p-3"
                        value={csvModal.mapping.address}
                        onChange={(e) => handleMappingChange('address', e.target.value)}
                      >
                        {csvModal.previewData[0]?.raw.map((_, index) => (
                          <option key={index} value={index}>
                            Kolom {index + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kolom Email
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg p-3"
                        value={csvModal.mapping.email}
                        onChange={(e) => handleMappingChange('email', e.target.value)}
                      >
                        {csvModal.previewData[0]?.raw.map((_, index) => (
                          <option key={index} value={index}>
                            Kolom {index + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={applyMapping}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Terapkan Mapping
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Preview */}
              {csvModal.step === 'preview' && csvModal.previewData.length > 0 && (
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-6">
                    Preview Data ({csvModal.previewData.length} pelanggan)
                  </h4>
                  
                  {csvModal.errors.length > 0 && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <h5 className="font-medium text-red-800 mb-2">Error Validasi:</h5>
                      <ul className="text-sm text-red-700 list-disc pl-5">
                        {csvModal.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Telepon</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Alamat</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {csvModal.previewData.slice(0, 10).map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm">
                              {item.parsed.name || (
                                <span className="text-red-500 italic">Kosong</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {item.parsed.phone || (
                                <span className="text-gray-400 italic">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {item.parsed.address || (
                                <span className="text-gray-400 italic">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {item.parsed.email || (
                                <span className="text-gray-400 italic">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {item.parsed.name ? (
                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                  Valid
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                  Error
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {csvModal.previewData.length > 10 && (
                      <p className="text-sm text-gray-500 mt-2 text-center">
                        Menampilkan 10 dari {csvModal.previewData.length} baris
                      </p>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <h5 className="font-medium text-blue-800 mb-2">Ringkasan Import:</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
                        <div className="text-2xl font-bold text-blue-600">{csvModal.previewData.length}</div>
                        <div className="text-sm text-blue-800">Total Data</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
                        <div className="text-2xl font-bold text-green-600">
                          {csvModal.previewData.filter(item => item.parsed.name).length}
                        </div>
                        <div className="text-sm text-green-800">Data Valid</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
                        <div className="text-2xl font-bold text-red-600">
                          {csvModal.previewData.filter(item => !item.parsed.name).length}
                        </div>
                        <div className="text-sm text-red-800">Data Error</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
                        <div className="text-2xl font-bold text-purple-600">
                          {csvModal.previewData.filter(item => item.parsed.email).length}
                        </div>
                        <div className="text-sm text-purple-800">Dengan Email</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setCsvModal(prev => ({ ...prev, step: 'mapping' }))}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Kembali ke Mapping
                    </button>
                    <button
                      onClick={importCustomers}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Import Pelanggan
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Data akan ditambahkan ke daftar pelanggan
              </div>
              <button
                onClick={closeCsvModal}
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