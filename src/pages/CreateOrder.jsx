// src/pages/CreateOrder.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, User, Package, ArrowLeft, MessageSquare, Eye, Upload, FileText, Check, X, ChevronLeft, ChevronRight, AlertCircle, Clock, Edit2, Save, PlusCircle, Tag, Edit, Trash, Users, Phone, MapPin, Mail, List, FolderOpen } from 'lucide-react';
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
  const [dueDate, setDueDate] = useState('');
  const [orderStatus, setOrderStatus] = useState('cutting');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // ================== STATE UNTUK PRODUK ==================
  const [products, setProducts] = useState([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showProductListModal, setShowProductListModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // State untuk form produk
  const [productNameInput, setProductNameInput] = useState('');
  const [productBasePriceInput, setProductBasePriceInput] = useState('');
  const [productCategoryInput, setProductCategoryInput] = useState('');
  
  // State untuk variasi produk
  const [variationSizeInput, setVariationSizeInput] = useState('');
  const [variationColorInput, setVariationColorInput] = useState('');
  const [variationPriceInput, setVariationPriceInput] = useState('');
  const [tempVariationsList, setTempVariationsList] = useState([]);
  
  // State untuk edit variasi
  const [editVariationsList, setEditVariationsList] = useState([]);
  const [editVariationSizeInput, setEditVariationSizeInput] = useState('');
  const [editVariationColorInput, setEditVariationColorInput] = useState('');
  const [editVariationPriceInput, setEditVariationPriceInput] = useState('');
  
  // ================== STATE UNTUK KATEGORI PRODUK ==================
  const [productCategories, setProductCategories] = useState(['Kemeja', 'Celana', 'Jaket', 'Blouse', 'Aksesoris', 'Lainnya']);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showManageCategoriesModal, setShowManageCategoriesModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  
  // ================== STATE UNTUK PELANGGAN ==================
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showManageCustomersModal, setShowManageCustomersModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customerFormData, setCustomerFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    joinDate: new Date().toISOString().split('T')[0]
  });
  
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
    step: 'upload'
  });

  // Deteksi ukuran layar
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ================== FUNGSI UNTUK PELANGGAN ==================
  const loadCustomers = () => {
    const savedCustomers = localStorage.getItem('customers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    } else {
      const mockCustomers = [
        { id: 1, name: 'Toko Baju Maju Jaya', address: 'Jl. Sudirman No. 123', phone: '0812-3456-7890', email: 'maju@jaya.com', joinDate: '2023-01-15' },
        { id: 2, name: 'Butik Modern', address: 'Jl. Thamrin No. 45', phone: '0813-4567-8901', email: 'modern@butik.com', joinDate: '2023-02-20' },
        { id: 3, name: 'Konveksi Sejahtera', address: 'Jl. Gatot Subroto No. 67', phone: '0814-5678-9012', email: 'sejahtera@konveksi.com', joinDate: '2023-03-10' },
        { id: 4, name: 'Distro Urban', address: 'Jl. Malioboro No. 89', phone: '0815-6789-0123', email: 'urban@distro.com', joinDate: '2023-04-05' },
      ];
      setCustomers(mockCustomers);
      localStorage.setItem('customers', JSON.stringify(mockCustomers));
    }
  };

  const handleAddCustomer = () => {
    if (!customerFormData.name.trim()) {
      alert('Mohon isi nama pelanggan!');
      return;
    }

    const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    const customerToAdd = {
      id: newId,
      ...customerFormData,
      joinDate: customerFormData.joinDate || new Date().toISOString().split('T')[0]
    };

    const updatedCustomers = [...customers, customerToAdd];
    setCustomers(updatedCustomers);
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));

    setSelectedCustomer(newId.toString());
    setCustomerFormData({ name: '', phone: '', address: '', email: '', joinDate: new Date().toISOString().split('T')[0] });
    setShowAddCustomerModal(false);
    
    alert(`✅ Pelanggan "${customerToAdd.name}" berhasil ditambahkan!`);
  };

  const handleEditCustomer = () => {
    if (!editingCustomer) return;
    
    if (!customerFormData.name.trim()) {
      alert('Mohon isi nama pelanggan!');
      return;
    }
    
    const updatedCustomers = customers.map(customer => 
      customer.id === editingCustomer.id 
        ? { ...customer, ...customerFormData, joinDate: customerFormData.joinDate || customer.joinDate }
        : customer
    );
    
    setCustomers(updatedCustomers);
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
    
    if (selectedCustomer === editingCustomer.id.toString()) {
      setSelectedCustomer(editingCustomer.id.toString());
    }
    
    setEditingCustomer(null);
    setCustomerFormData({ name: '', phone: '', address: '', email: '', joinDate: new Date().toISOString().split('T')[0] });
    setShowManageCustomersModal(false);
    
    alert(`✅ Pelanggan berhasil diperbarui!`);
  };

  const handleDeleteCustomer = (customerToDelete) => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const hasOrders = orders.some(order => order.customerName === customerToDelete.name);
    
    if (hasOrders) {
      alert(`⚠️ Pelanggan "${customerToDelete.name}" memiliki riwayat pesanan. Hapus pesanan terlebih dahulu!`);
      return;
    }
    
    if (window.confirm(`Apakah Anda yakin ingin menghapus pelanggan "${customerToDelete.name}"?`)) {
      const updatedCustomers = customers.filter(c => c.id !== customerToDelete.id);
      setCustomers(updatedCustomers);
      localStorage.setItem('customers', JSON.stringify(updatedCustomers));
      
      if (selectedCustomer === customerToDelete.id.toString()) {
        setSelectedCustomer('');
      }
      
      alert(`✅ Pelanggan "${customerToDelete.name}" berhasil dihapus!`);
    }
  };

  const openEditCustomerModal = (customer) => {
    setEditingCustomer(customer);
    setCustomerFormData({
      name: customer.name,
      phone: customer.phone || '',
      address: customer.address || '',
      email: customer.email || '',
      joinDate: customer.joinDate || new Date().toISOString().split('T')[0]
    });
    setShowManageCustomersModal(true);
  };

  const openAddCustomerFromManage = () => {
    setShowManageCustomersModal(false);
    setEditingCustomer(null);
    setShowAddCustomerModal(true);
    setCustomerFormData({
      name: '',
      phone: '',
      address: '',
      email: '',
      joinDate: new Date().toISOString().split('T')[0]
    });
  };

  // ================== FUNGSI UNTUK PRODUK ==================
  const handleAddVariationSimple = () => {
    if (!variationSizeInput.trim()) {
      alert('Mohon isi ukuran!');
      return;
    }
    if (!variationColorInput.trim()) {
      alert('Mohon isi warna!');
      return;
    }
    if (!variationPriceInput) {
      alert('Mohon isi harga!');
      return;
    }
    
    const priceNum = parseInt(variationPriceInput.replace(/[^0-9]/g, '')) || 0;
    
    setTempVariationsList([...tempVariationsList, {
      id: Date.now(),
      size: variationSizeInput,
      color: variationColorInput,
      price: priceNum
    }]);
    
    setVariationSizeInput('');
    setVariationColorInput('');
    setVariationPriceInput('');
  };

  const handleRemoveVariationSimple = (id) => {
    setTempVariationsList(tempVariationsList.filter(v => v.id !== id));
  };

  const handleSaveNewProductSimple = () => {
    if (!productNameInput.trim()) {
      alert('Mohon isi nama produk!');
      return;
    }
    
    const basePriceNum = parseInt(productBasePriceInput.replace(/[^0-9]/g, '')) || 0;
    if (basePriceNum === 0) {
      alert('Mohon isi harga dasar yang valid!');
      return;
    }
    
    if (tempVariationsList.length === 0) {
      alert('Mohon tambahkan minimal satu variasi (ukuran & warna)!');
      return;
    }
    
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id), 0) + 1 : 1;
    const productToAdd = {
      id: newId,
      name: productNameInput,
      basePrice: basePriceNum,
      category: productCategoryInput || 'Lainnya',
      variations: tempVariationsList.map((v, idx) => ({
        id: `${newId}-${v.size}-${v.color}`,
        size: v.size,
        color: v.color,
        price: v.price,
        stock: 100
      }))
    };
    
    const updatedProducts = [...products, productToAdd];
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    setProductNameInput('');
    setProductBasePriceInput('');
    setProductCategoryInput('');
    setTempVariationsList([]);
    setVariationSizeInput('');
    setVariationColorInput('');
    setVariationPriceInput('');
    setShowAddProductModal(false);
    
    alert(`✅ Produk "${productToAdd.name}" berhasil ditambahkan!`);
  };

  // ================== FUNGSI UNTUK EDIT PRODUK ==================
  const openEditProductModal = (product) => {
    setEditingProduct(product);
    setProductNameInput(product.name);
    setProductBasePriceInput(product.basePrice.toString());
    setProductCategoryInput(product.category || 'Lainnya');
    setEditVariationsList([...(product.variations || []).map(v => ({ ...v, id: v.id || Date.now() }))]);
    setShowEditProductModal(true);
  };

  const handleAddEditVariation = () => {
    if (!editVariationSizeInput.trim()) {
      alert('Mohon isi ukuran!');
      return;
    }
    if (!editVariationColorInput.trim()) {
      alert('Mohon isi warna!');
      return;
    }
    if (!editVariationPriceInput) {
      alert('Mohon isi harga!');
      return;
    }
    
    const priceNum = parseInt(editVariationPriceInput.replace(/[^0-9]/g, '')) || 0;
    
    setEditVariationsList([...editVariationsList, {
      id: Date.now(),
      size: editVariationSizeInput,
      color: editVariationColorInput,
      price: priceNum,
      stock: 100
    }]);
    
    setEditVariationSizeInput('');
    setEditVariationColorInput('');
    setEditVariationPriceInput('');
  };

  const handleRemoveEditVariation = (id) => {
    setEditVariationsList(editVariationsList.filter(v => v.id !== id));
  };

  const handleUpdateEditVariation = (id, field, value) => {
    setEditVariationsList(editVariationsList.map(v => 
      v.id === id ? { ...v, [field]: field === 'price' ? parseInt(value.replace(/[^0-9]/g, '')) || 0 : value } : v
    ));
  };

  const handleSaveEditedProduct = () => {
    if (!productNameInput.trim()) {
      alert('Mohon isi nama produk!');
      return;
    }
    
    const basePriceNum = parseInt(productBasePriceInput.replace(/[^0-9]/g, '')) || 0;
    if (basePriceNum === 0) {
      alert('Mohon isi harga dasar yang valid!');
      return;
    }
    
    if (editVariationsList.length === 0) {
      alert('Mohon tambahkan minimal satu variasi (ukuran & warna)!');
      return;
    }
    
    const updatedProduct = {
      ...editingProduct,
      name: productNameInput,
      basePrice: basePriceNum,
      category: productCategoryInput || 'Lainnya',
      variations: editVariationsList.map(v => ({
        ...v,
        id: v.id.toString().includes('-') ? v.id : `${editingProduct.id}-${v.size}-${v.color}`
      }))
    };
    
    const updatedProducts = products.map(p => 
      p.id === editingProduct.id ? updatedProduct : p
    );
    
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    // Update items yang menggunakan produk ini
    const updatedItems = items.map(item => {
      if (item.product === editingProduct.id.toString()) {
        return {
          ...item,
          productName: updatedProduct.name,
          price: updatedProduct.basePrice,
          size: '',
          color: '',
          variantId: ''
        };
      }
      return item;
    });
    setItems(updatedItems);
    
    setShowEditProductModal(false);
    setEditingProduct(null);
    setProductNameInput('');
    setProductBasePriceInput('');
    setProductCategoryInput('');
    setEditVariationsList([]);
    
    alert(`✅ Produk "${updatedProduct.name}" berhasil diperbarui!`);
  };

  const handleDeleteProduct = (productToDelete) => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const isUsedInOrders = orders.some(order => 
      order.itemsDetail?.some(item => item.product === productToDelete.id.toString())
    );
    
    if (isUsedInOrders) {
      alert(`⚠️ Produk "${productToDelete.name}" sedang digunakan di pesanan yang ada. Tidak dapat dihapus!`);
      return;
    }
    
    if (window.confirm(`Apakah Anda yakin ingin menghapus produk "${productToDelete.name}"?`)) {
      const updatedProducts = products.filter(p => p.id !== productToDelete.id);
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      
      const updatedItems = items.filter(item => item.product !== productToDelete.id.toString());
      if (updatedItems.length === 0) {
        setItems([{ 
          product: '', 
          qty: 1, 
          price: 0, 
          productName: '',
          notes: [],
          size: '',
          color: '',
          variantId: ''
        }]);
      } else {
        setItems(updatedItems);
      }
      
      alert(`✅ Produk "${productToDelete.name}" berhasil dihapus!`);
    }
  };

  // ================== FUNGSI UNTUK KATEGORI ==================
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      alert('Mohon isi nama kategori!');
      return;
    }
    
    if (productCategories.includes(newCategoryName.trim())) {
      alert('Kategori sudah ada!');
      return;
    }
    
    const updatedCategories = [...productCategories, newCategoryName.trim()];
    setProductCategories(updatedCategories);
    localStorage.setItem('productCategories', JSON.stringify(updatedCategories));
    
    setNewCategoryName('');
    setShowCategoryModal(false);
    
    alert(`✅ Kategori "${newCategoryName}" berhasil ditambahkan!`);
  };

  const handleEditCategory = () => {
    if (!editCategoryName.trim()) {
      alert('Mohon isi nama kategori!');
      return;
    }
    
    if (productCategories.includes(editCategoryName.trim()) && editCategoryName.trim() !== editingCategory) {
      alert('Kategori sudah ada!');
      return;
    }
    
    const updatedCategories = productCategories.map(cat => 
      cat === editingCategory ? editCategoryName.trim() : cat
    );
    setProductCategories(updatedCategories);
    localStorage.setItem('productCategories', JSON.stringify(updatedCategories));
    
    const updatedProducts = products.map(product => 
      product.category === editingCategory 
        ? { ...product, category: editCategoryName.trim() }
        : product
    );
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    setEditingCategory(null);
    setEditCategoryName('');
    setShowManageCategoriesModal(false);
    
    alert(`✅ Kategori berhasil diubah menjadi "${editCategoryName}"!`);
  };

  const handleDeleteCategory = (categoryToDelete) => {
    const productsWithCategory = products.filter(product => product.category === categoryToDelete);
    
    if (productsWithCategory.length > 0) {
      alert(`⚠️ Kategori "${categoryToDelete}" sedang digunakan oleh ${productsWithCategory.length} produk. Hapus atau ubah kategori produk tersebut terlebih dahulu!`);
      return;
    }
    
    if (window.confirm(`Apakah Anda yakin ingin menghapus kategori "${categoryToDelete}"?`)) {
      const updatedCategories = productCategories.filter(cat => cat !== categoryToDelete);
      setProductCategories(updatedCategories);
      localStorage.setItem('productCategories', JSON.stringify(updatedCategories));
      
      if (productCategoryInput === categoryToDelete) {
        setProductCategoryInput(updatedCategories[0] || 'Lainnya');
      }
      
      alert(`✅ Kategori "${categoryToDelete}" berhasil dihapus!`);
    }
  };

  const openEditCategoryModal = (category) => {
    setEditingCategory(category);
    setEditCategoryName(category);
    setShowManageCategoriesModal(true);
  };

  const openAddCategoryFromManage = () => {
    setShowManageCategoriesModal(false);
    setEditingCategory(null);
    setShowCategoryModal(true);
    setNewCategoryName('');
  };

  // Load data
  useEffect(() => {
    loadCustomers();
    
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      const defaultProducts = [
        { 
          id: 1, 
          name: 'Kemeja Pria Slimfit', 
          basePrice: 150000, 
          category: 'Kemeja', 
          variations: [
            { id: '1-S-Merah', size: 'S', color: 'Merah', price: 150000, stock: 50 },
            { id: '1-S-Biru', size: 'S', color: 'Biru', price: 150000, stock: 45 },
            { id: '1-M-Merah', size: 'M', color: 'Merah', price: 155000, stock: 60 },
            { id: '1-M-Biru', size: 'M', color: 'Biru', price: 155000, stock: 55 },
            { id: '1-L-Merah', size: 'L', color: 'Merah', price: 160000, stock: 40 }
          ]
        },
        { 
          id: 2, 
          name: 'Celana Jeans Denim', 
          basePrice: 250000, 
          category: 'Celana', 
          variations: [
            { id: '2-30-Biru', size: '30', color: 'Biru Tua', price: 260000, stock: 35 },
            { id: '2-32-Biru', size: '32', color: 'Biru Tua', price: 270000, stock: 30 },
            { id: '2-30-Hitam', size: '30', color: 'Hitam', price: 260000, stock: 28 }
          ]
        },
        { 
          id: 3, 
          name: 'Jaket Hoodie', 
          basePrice: 300000, 
          category: 'Jaket', 
          variations: [
            { id: '3-M-Abu', size: 'M', color: 'Abu-abu', price: 310000, stock: 45 },
            { id: '3-M-Hitam', size: 'M', color: 'Hitam', price: 310000, stock: 42 }
          ]
        }
      ];
      setProducts(defaultProducts);
      localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
    
    const savedCategories = localStorage.getItem('productCategories');
    if (savedCategories) {
      setProductCategories(JSON.parse(savedCategories));
    }
  }, []);

  // Helper functions
  const formatCurrency = (value) => {
    const num = Number(value) || 0;
    return num.toLocaleString('id-ID');
  };

  const formatPriceDisplay = (price) => {
    if (!price) return '';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const isDeadlineOverdue = (deadline) => {
    if (!deadline) return false;
    const today = new Date().toISOString().split('T')[0];
    return deadline < today;
  };

  const getRemainingDays = (deadline) => {
    if (!deadline) return 0;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Status options
  const statusOptions = [
  // ========== STATUS PRODUKSI (PROSES AKTIF) ==========
  { value: 'cutting', label: '✂️ Potong', color: 'bg-amber-100 text-amber-800' },
  { value: 'sewing', label: '🧵 Jahit', color: 'bg-blue-100 text-blue-800' },
  { value: 'finishing', label: '✨ Finishing', color: 'bg-purple-100 text-purple-800' },
  { value: 'qc', label: '🔍 QC', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'delivering', label: '🚚 Mengirim', color: 'bg-cyan-100 text-cyan-800' },
  
  // ========== STATUS AKHIR ==========
  { value: 'completed', label: '✅ Selesai', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: '❌ Dibatalkan', color: 'bg-red-100 text-red-800' },
  ];

  // ================== CSV IMPORT FUNCTIONS ==================
  const openCsvModal = () => {
    setCsvModal({
      isOpen: true,
      file: null,
      previewData: [],
      mapping: { name: 0, phone: 1, address: 2, email: 3 },
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
      return { id: index + 1, raw: values, parsed: {} };
    });

    const mapping = {};
    headers.forEach((header, index) => {
      if (header.includes('nama') || header.includes('name')) mapping.name = index;
      if (header.includes('telp') || header.includes('phone')) mapping.phone = index;
      if (header.includes('alamat') || header.includes('address')) mapping.address = index;
      if (header.includes('email')) mapping.email = index;
    });

    const previewData = data.map(item => {
      const parsed = {};
      Object.entries(mapping).forEach(([key, index]) => {
        if (index !== undefined && item.raw[index]) {
          parsed[key] = item.raw[index];
        }
      });
      return { ...item, parsed };
    });

    setCsvModal(prev => ({ ...prev, file: csvText, previewData, mapping, step: 'preview' }));
  };

  const importCustomers = () => {
    const { previewData } = csvModal;
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

    setCustomers(prev => [...prev, ...newCustomers]);
    localStorage.setItem('customers', JSON.stringify([...customers, ...newCustomers]));
    alert(`✅ ${newCustomers.length} pelanggan berhasil diimport!`);
    closeCsvModal();
  };

  // ================== ORDER FUNCTIONS ==================
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

  const handleSizeChange = (index, size) => {
    const newItems = [...items];
    const selectedProduct = products.find(p => p.id === parseInt(newItems[index].product));
    newItems[index].size = size;
    newItems[index].color = '';
    newItems[index].variantId = '';
    
    if (selectedProduct && size) {
      const availableColors = selectedProduct.variations?.filter(v => v.size === size).map(v => v.color) || [];
      const uniqueColors = [...new Set(availableColors)];
      if (uniqueColors.length === 1) {
        const color = uniqueColors[0];
        const variant = selectedProduct.variations?.find(v => v.size === size && v.color === color);
        if (variant) {
          newItems[index].color = color;
          newItems[index].variantId = variant.id;
          newItems[index].price = variant.price;
        }
      }
    }
    setItems(newItems);
  };

  const handleColorChange = (index, color) => {
    const newItems = [...items];
    const selectedProduct = products.find(p => p.id === parseInt(newItems[index].product));
    if (selectedProduct && newItems[index].size && color) {
      const variant = selectedProduct.variations?.find(
        v => v.size === newItems[index].size && v.color === color
      );
      if (variant) {
        newItems[index].color = color;
        newItems[index].variantId = variant.id;
        newItems[index].price = variant.price;
      }
    } else {
      newItems[index].color = color;
      newItems[index].variantId = '';
    }
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
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
    setNotesModal(prev => ({ ...prev, notes: updatedNotes, currentNote: '' }));

    const newItems = [...items];
    if (newItems[notesModal.itemIndex]) {
      newItems[notesModal.itemIndex].notes = updatedNotes;
      setItems(newItems);
    }
  };

  const removeNote = (noteId) => {
    const updatedNotes = notesModal.notes.filter(note => note.id !== noteId);
    setNotesModal(prev => ({ ...prev, notes: updatedNotes }));

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
    if (!selectedCustomer) {
      alert('Pilih pelanggan terlebih dahulu!');
      return;
    }

    const invalidItems = items.filter(item => {
      return !item.product || !item.product.trim() || !item.qty || item.qty < 1 || !item.price || item.price <= 0;
    });

    if (invalidItems.length > 0) {
      alert('Periksa kembali item pesanan! Pastikan semua item sudah dipilih dengan kuantitas dan harga yang valid.');
      return;
    }

    setIsSubmitting(true);

    const selectedCustomerData = customers.find(c => c.id === parseInt(selectedCustomer));
    
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

    const orderData = {
      id: `ORD-${String(Date.now()).slice(-6)}`,
      customerName: selectedCustomerData?.name || 'Pelanggan Tidak Dikenal',
      customerPhone: selectedCustomerData?.phone || '',
      customerAddress: selectedCustomerData?.address || '',
      customerEmail: selectedCustomerData?.email || '',
      orderDate: orderDate,
      dueDate: dueDate,
      items: cleanedItems.length,
      totalAmount: calculateTotal(),
      status: orderStatus,
      notes: orderNotes,
      itemsDetail: cleanedItems,
      timeline: [],
      priority: 'sedang',
      created_at: new Date().toISOString()
    };

    setTimeout(() => {
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = [orderData, ...existingOrders];
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      if (orderData.status !== 'cancelled') {
        syncOrderWithJobs(orderData);
      }
      
      setIsSubmitting(false);
      alert(`✅ Pesanan ${orderData.id} berhasil disimpan!`);
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

  const isOrderOverdue = isDeadlineOverdue(dueDate);

  // ================== RENDER COMPONENT DENGAN HIERARKI Z-INDEX ==================
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="scale-container" style={{
        transform: 'scale(0.85)',
        transformOrigin: 'top left',
        width: '117.65%',
        minHeight: '100vh',
        paddingBottom: '100px'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <button onClick={() => navigate('/orders')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Buat Pesanan Baru</h1>
                  <p className="text-sm text-gray-500 mt-1">Input data pesanan dari pelanggan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Customer & Order Items */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Customer & Order Details */}
            <div className="lg:col-span-1 space-y-6">
              {/* Customer Card */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-2">
                    <User size={18} className="text-blue-600" />
                    <h3 className="font-semibold text-gray-800">Data Pelanggan</h3>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Pilih Pelanggan *</label>
                    <div className="flex flex-col gap-2">
                      <select 
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                    <div className="flex gap-2 mt-2">
                      <button 
                        onClick={() => setShowManageCustomersModal(true)} 
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"
                      >
                        <Users size={12} /> Kelola
                      </button>
                      <button onClick={openCsvModal} className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700">
                        <Upload size={12} /> Import CSV
                      </button>
                    </div>
                  </div>

                  {selectedCustomerData && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="font-medium text-blue-800 text-sm">{selectedCustomerData.name}</p>
                      <p className="text-xs text-blue-600 mt-0.5">{selectedCustomerData.address}</p>
                      <p className="text-xs text-blue-600">{selectedCustomerData.phone}</p>
                      {selectedCustomerData.email && <p className="text-xs text-blue-600">{selectedCustomerData.email}</p>}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        <div className="flex items-center gap-1"><Calendar size={12} /> Tanggal Pesanan</div>
                      </label>
                      <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        <div className="flex items-center gap-1"><Clock size={12} /> Jatuh Tempo</div>
                      </label>
                      <input type="date" className={`w-full px-3 py-2 border rounded-lg text-sm ${isOrderOverdue ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                      {dueDate && isOrderOverdue && <p className="text-xs text-red-500 mt-1">⚠️ Telah melewati jatuh tempo!</p>}
                      {dueDate && !isOrderOverdue && <p className="text-xs text-green-500 mt-1">Sisa {getRemainingDays(dueDate)} hari</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Status Awal</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
                      <optgroup label="Status Produksi">
                        <option value="cutting">✂️ Potong</option>
                        <option value="sewing">🧵 Jahit</option>
                        <option value="finishing">✨ Finishing</option>
                        <option value="qc">🔍 QC</option>
                        <option value="delivering">🚚 Mengirim</option>
                      </optgroup>
                      <optgroup label="Status Akhir">
                        <option value="completed">✅ Selesai</option>
                        <option value="cancelled">❌ Dibatalkan</option>
                      </optgroup>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Status akan menentukan jobs yang digenerate</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      <div className="flex items-center gap-1">
                        <FileText size={12} /> Catatan Pesanan
                      </div>
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows="3"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                    />
                    <p className="text-xs text-gray-400 mt-1">Catatan akan muncul di detail pesanan dan dapat dilihat oleh tim produksi.</p>
                  </div>
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="font-semibold text-gray-800">Ringkasan Pesanan</h3>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Jumlah Item</span><span className="font-medium">{items.length}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Total Kuantitas</span><span className="font-medium">{items.reduce((t, i) => t + (i.qty || 0), 0)} pcs</span></div>
                  <div className="border-t pt-3"><div className="flex justify-between"><span className="text-gray-600">Total Pembayaran</span><span className="text-xl font-bold text-blue-600">Rp {formatCurrency(calculateTotal())}</span></div></div>
                </div>
                <div className="px-5 py-3 bg-blue-50 border-t border-blue-100">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-700">Jatuh tempo akan digunakan sebagai deadline utama. Pesanan yang melewati jatuh tempo akan terdeteksi di Dashboard.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <Package size={18} className="text-green-600" />
                    <h3 className="font-semibold text-gray-800">Item Pesanan</h3>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowProductListModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      <List size={16} /> Kelola Produk
                    </button>
                    <button 
                      onClick={() => setShowAddProductModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      <PlusCircle size={16} /> Produk Baru
                    </button>
                    <button 
                      onClick={handleAddItem}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Plus size={16} /> Tambah Item
                    </button>
                  </div>
                </div>

                {/* Order Items List */}
                <div className="divide-y divide-gray-100">
                  {items.map((item, index) => {
                    const product = selectedProduct(index);
                    
                    return (
                      <div key={index} className="p-5 hover:bg-gray-50/50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <select 
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px]"
                                value={item.product}
                                onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                                required
                              >
                                <option value="">Pilih Produk</option>
                                {products.map(p => (
                                  <option key={p.id} value={p.id}>
                                    {p.name} • Rp {formatCurrency(p.basePrice)}
                                  </option>
                                ))}
                              </select>
                              {item.productName && (
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.productName}</span>
                              )}
                            </div>
                          </div>
                          {items.length > 1 && (
                            <button onClick={() => handleRemoveItem(index)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>

                        {/* Size & Color */}
                        {product && product.variations && product.variations.length > 0 && (
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Ukuran</label>
                              <select 
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                value={item.size}
                                onChange={(e) => handleSizeChange(index, e.target.value)}
                              >
                                <option value="">Pilih Ukuran</option>
                                {[...new Set(product.variations.map(v => v.size))].map(size => (
                                  <option key={size} value={size}>{size}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Warna</label>
                              <select 
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                value={item.color}
                                onChange={(e) => handleColorChange(index, e.target.value)}
                                disabled={!item.size}
                              >
                                <option value="">Pilih Warna</option>
                                {product.variations
                                  .filter(v => v.size === item.size)
                                  .map(v => (
                                    <option key={v.color} value={v.color}>{v.color}</option>
                                  ))}
                              </select>
                            </div>
                          </div>
                        )}

                        {/* Jika produk tidak memiliki variasi */}
                        {product && (!product.variations || product.variations.length === 0) && (
                          <div className="mb-4 p-3 bg-yellow-50 rounded-lg text-xs text-yellow-700">
                            ⚠️ Produk ini belum memiliki variasi ukuran dan warna. Silakan edit produk untuk menambahkan variasi.
                          </div>
                        )}

                        {/* Quantity, Price, Subtotal */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Kuantitas</label>
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-fit">
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
                                className="w-16 text-center py-2 border-x border-gray-300 focus:outline-none text-sm"
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
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Harga Satuan</label>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium">
                              Rp {formatCurrency(item.price)}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Subtotal</label>
                            <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 text-sm font-bold text-blue-700 text-right">
                              Rp {formatCurrency(calculateSubtotal(item.qty, item.price))}
                            </div>
                          </div>
                        </div>

                        {/* Variant & Notes Info */}
                        <div className="flex flex-wrap gap-3 mt-2">
                          {item.variantId && product && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              <Package size={12} />
                              {product.name} - {item.size} / {item.color}
                            </span>
                          )}
                          <button
                            onClick={() => openNotesModal(index)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                              item.notes?.length > 0 
                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            <MessageSquare size={12} />
                            Catatan {item.notes?.length > 0 && `(${item.notes.length})`}
                          </button>
                          {item.notes?.length > 0 && (
                            <button onClick={() => openNotesModal(index)} className="text-xs text-blue-600 hover:text-blue-800">
                              Lihat semua
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Total Section */}
                <div className="px-5 py-4 border-t border-gray-200 bg-gray-50/50">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Total {items.length} item • {items.reduce((total, item) => total + (item.qty || 0), 0)} pcs
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Total Pembayaran</p>
                      <p className="text-2xl font-bold text-blue-600">Rp {formatCurrency(calculateTotal())}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-5 py-4 border-t border-gray-200 bg-white flex justify-end gap-3">
                  <button onClick={handleCancel} className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                    Batalkan
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || !selectedCustomer || items.some(item => !item.product)}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Menyimpan...</>
                    ) : (
                      'Simpan & Proses Pesanan'
                    )}
                  </button>
                </div>
              </div>

              {/* Help Text */}
              <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-xs text-blue-800">
                  💡 <span className="font-medium">Info Integrasi JobList & Deadline:</span><br/>
                  • Jatuh tempo pesanan akan digunakan sebagai deadline utama<br/>
                  • Pesanan yang melewati jatuh tempo akan terdeteksi di Dashboard sebagai item stuck<br/>
                  • Status akan mempengaruhi jobs yang digenerate<br/>
                  • Lihat jobs terkait di halaman <strong>JobList</strong>
                </p>
              </div>
            </div>
          </div>

          {/* ==================== MODALS DENGAN HIERARKI Z-INDEX ==================== */}
          
          {/* ========== LEVEL 1: MODAL UTAMA (z-40) ========== */}
          
          {/* Modal Daftar Produk - Level 1 */}
          {showProductListModal && (
            <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-40 flex items-start justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-green-50 to-white sticky top-0 z-10">
                  <div className="flex items-center gap-2">
                    <Package size={22} className="text-green-600" />
                    <h3 className="font-bold text-xl text-gray-800">Daftar Produk</h3>
                  </div>
                  <button onClick={() => setShowProductListModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="flex justify-between items-center mb-5">
                    <p className="text-sm text-gray-500">Total {products.length} produk</p>
                    <button
                      onClick={() => setShowAddProductModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      <Plus size={16} /> Tambah Produk Baru
                    </button>
                  </div>
                  
                  <div className="space-y-5">
                    {products.map((product) => (
                      <div key={product.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-4 bg-gray-50/80 border-b border-gray-100 flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold text-gray-800 text-lg">{product.name}</h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{product.category || 'Tanpa Kategori'}</span>
                              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Harga Dasar: Rp {formatCurrency(product.basePrice)}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setShowProductListModal(false);
                                openEditProductModal(product);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Produk"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus Produk"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </div>
                        
                        {product.variations && product.variations.length > 0 && (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Ukuran</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Warna</th>
                                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Harga</th>
                                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Stok</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {product.variations.map((variant) => (
                                  <tr key={variant.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 text-gray-700 font-medium">{variant.size}</td>
                                    <td className="px-4 py-2">
                                      <span className="inline-flex items-center gap-1">
                                        <span className="w-3 h-3 rounded-full" style={{ 
                                          backgroundColor: 
                                            variant.color.toLowerCase() === 'merah' ? '#ef4444' :
                                            variant.color.toLowerCase() === 'biru' ? '#3b82f6' :
                                            variant.color.toLowerCase() === 'hitam' ? '#1f2937' :
                                            variant.color.toLowerCase() === 'putih' ? '#f3f4f6' :
                                            variant.color.toLowerCase() === 'kuning' ? '#eab308' :
                                            variant.color.toLowerCase() === 'ungu' ? '#a855f7' :
                                            variant.color.toLowerCase() === 'abu-abu' ? '#9ca3af' :
                                            variant.color.toLowerCase() === 'navy' ? '#1e3a8a' :
                                            variant.color.toLowerCase() === 'khaki' ? '#b8a99a' :
                                            variant.color.toLowerCase() === 'coklat' ? '#8b5a2b' :
                                            variant.color.toLowerCase() === 'cream' ? '#fde68a' :
                                            variant.color.toLowerCase() === 'pink' ? '#ec4899' : '#cbd5e1'
                                        }} />
                                        {variant.color}
                                      </span>
                                    </td>
                                    <td className="px-4 py-2 text-right text-green-600 font-medium">Rp {formatCurrency(variant.price)}</td>
                                    <td className="px-4 py-2 text-right">
                                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                        variant.stock > 50 ? 'bg-green-100 text-green-700' :
                                        variant.stock > 20 ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                      }`}>
                                        {variant.stock} pcs
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {products.length === 0 && (
                      <div className="text-center py-12 border-2 border-dashed rounded-xl">
                        <Package size={48} className="text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Belum ada produk</p>
                        <button
                          onClick={() => setShowAddProductModal(true)}
                          className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
                        >
                          Tambah Produk Pertama
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                  <button onClick={() => setShowProductListModal(false)} className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Kelola Pelanggan - Level 1 */}
          {showManageCustomersModal && (
            <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-40 flex items-start justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white sticky top-0 z-10">
                  <div className="flex items-center gap-2">
                    <Users size={20} className="text-blue-600" />
                    <h3 className="font-bold text-lg text-gray-800">Kelola Pelanggan</h3>
                  </div>
                  <button onClick={() => { setShowManageCustomersModal(false); setEditingCustomer(null); }} className="p-1 hover:bg-gray-100 rounded-lg">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {editingCustomer ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pelanggan *</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        value={customerFormData.name}
                        onChange={(e) => setCustomerFormData({...customerFormData, name: e.target.value})}
                      />
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
                        <input 
                          type="text" 
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" 
                          value={customerFormData.phone}
                          onChange={(e) => setCustomerFormData({...customerFormData, phone: e.target.value})}
                        />
                      </div>
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                        <textarea 
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" 
                          rows="2"
                          value={customerFormData.address}
                          onChange={(e) => setCustomerFormData({...customerFormData, address: e.target.value})}
                        />
                      </div>
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                          type="email" 
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" 
                          value={customerFormData.email}
                          onChange={(e) => setCustomerFormData({...customerFormData, email: e.target.value})}
                        />
                      </div>
                      <div className="flex gap-2 mt-5">
                        <button
                          onClick={() => { setEditingCustomer(null); setCustomerFormData({ name: '', phone: '', address: '', email: '', joinDate: new Date().toISOString().split('T')[0] }); }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                        >
                          Batal
                        </button>
                        <button
                          onClick={handleEditCustomer}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                        >
                          Simpan Perubahan
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-gray-600">Daftar semua pelanggan yang tersedia</p>
                        <button
                          onClick={openAddCustomerFromManage}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700"
                        >
                          <Plus size={14} /> Tambah
                        </button>
                      </div>
                      <div className="space-y-2">
                        {customers.map((customer) => {
                          const orderCount = JSON.parse(localStorage.getItem('orders') || '[]').filter(o => o.customerName === customer.name).length;
                          return (
                            <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-800">{customer.name}</p>
                                <p className="text-xs text-gray-500">{orderCount} pesanan</p>
                                {customer.phone && (
                                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                    <Phone size={10} /> {customer.phone}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openEditCustomerModal(customer)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                  title="Edit Pelanggan"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteCustomer(customer)}
                                  className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                  title="Hapus Pelanggan"
                                  disabled={orderCount > 0}
                                >
                                  <Trash size={14} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                  <button onClick={() => { setShowManageCustomersModal(false); setEditingCustomer(null); }} className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========== LEVEL 2: MODAL ANAK (z-50) ========== */}
          
          {/* Modal Tambah Produk Baru - Level 2 */}
          {showAddProductModal && (
            <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-start justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-green-50 to-white sticky top-0 z-10">
                  <div className="flex items-center gap-2">
                    <PlusCircle size={22} className="text-green-600" />
                    <h3 className="font-bold text-xl text-gray-800">Tambah Produk Baru</h3>
                  </div>
                  <button onClick={() => setShowAddProductModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Nama Produk *</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                        value={productNameInput}
                        onChange={(e) => setProductNameInput(e.target.value)}
                        placeholder="Contoh: Kemeja Batik Pria"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Harga Dasar (Rp) *</label>
                      <input 
                        type="text"
                        inputMode="numeric"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                        value={productBasePriceInput}
                        onChange={(e) => setProductBasePriceInput(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="Contoh: 150000"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Kategori</label>
                    <div className="flex gap-2">
                      <select 
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                        value={productCategoryInput}
                        onChange={(e) => setProductCategoryInput(e.target.value)}
                      >
                        <option value="">Pilih Kategori</option>
                        {productCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowManageCategoriesModal(true)}
                        className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-1 whitespace-nowrap"
                      >
                        <Tag size={14} /> Kelola
                      </button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Variasi Produk (Ukuran & Warna)</label>
                    
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div>
                        <input 
                          type="text" 
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" 
                          placeholder="Ukuran (S, M, L, XL)"
                          value={variationSizeInput}
                          onChange={(e) => setVariationSizeInput(e.target.value)}
                        />
                      </div>
                      <div>
                        <input 
                          type="text" 
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" 
                          placeholder="Warna (Merah, Biru, Hitam)"
                          value={variationColorInput}
                          onChange={(e) => setVariationColorInput(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-1">
                        <input 
                          type="text"
                          inputMode="numeric"
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" 
                          placeholder="Harga"
                          value={variationPriceInput}
                          onChange={(e) => setVariationPriceInput(e.target.value.replace(/[^0-9]/g, ''))}
                        />
                        <button 
                          onClick={handleAddVariationSimple}
                          className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {tempVariationsList.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-gray-500">Variasi yang sudah ditambahkan:</p>
                        {tempVariationsList.map((v) => (
                          <div key={v.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                            <div className="flex gap-3 text-sm">
                              <span className="font-medium">{v.size}</span>
                              <span className="text-gray-500">•</span>
                              <span>{v.color}</span>
                              <span className="text-blue-600">Rp {formatPriceDisplay(v.price)}</span>
                            </div>
                            <button onClick={() => handleRemoveVariationSimple(v.id)} className="text-red-500 hover:text-red-700">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                  <button onClick={() => setShowAddProductModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">Batal</button>
                  <button onClick={handleSaveNewProductSimple} className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                    Simpan Produk
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Tambah Pelanggan Baru - Level 2 */}
          {showAddCustomerModal && (
            <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-start justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
                  <div className="flex items-center gap-2">
                    <Users size={20} className="text-blue-600" />
                    <h3 className="font-bold text-lg text-gray-800">Tambah Pelanggan Baru</h3>
                  </div>
                  <button onClick={() => setShowAddCustomerModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pelanggan *</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      value={customerFormData.name}
                      onChange={(e) => setCustomerFormData({...customerFormData, name: e.target.value})}
                      placeholder="Contoh: Toko Maju Jaya"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        value={customerFormData.phone}
                        onChange={(e) => setCustomerFormData({...customerFormData, phone: e.target.value})}
                        placeholder="08123456789"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                      <textarea 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        rows="2"
                        value={customerFormData.address}
                        onChange={(e) => setCustomerFormData({...customerFormData, address: e.target.value})}
                        placeholder="Jl. Contoh No. 123"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input 
                        type="email" 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        value={customerFormData.email}
                        onChange={(e) => setCustomerFormData({...customerFormData, email: e.target.value})}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                  <button onClick={() => setShowAddCustomerModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">Batal</button>
                  <button onClick={handleAddCustomer} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                    Simpan Pelanggan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Edit Produk - Level 2 */}
          {showEditProductModal && (
            <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-start justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-yellow-50 to-white sticky top-0 z-10">
                  <div className="flex items-center gap-2">
                    <Edit2 size={22} className="text-yellow-600" />
                    <h3 className="font-bold text-xl text-gray-800">Edit Produk</h3>
                  </div>
                  <button onClick={() => setShowEditProductModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Nama Produk *</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent" 
                        value={productNameInput}
                        onChange={(e) => setProductNameInput(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Harga Dasar (Rp) *</label>
                      <input 
                        type="text"
                        inputMode="numeric"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent" 
                        value={productBasePriceInput}
                        onChange={(e) => setProductBasePriceInput(e.target.value.replace(/[^0-9]/g, ''))}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Kategori</label>
                    <div className="flex gap-2">
                      <select 
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent" 
                        value={productCategoryInput}
                        onChange={(e) => setProductCategoryInput(e.target.value)}
                      >
                        <option value="">Pilih Kategori</option>
                        {productCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowManageCategoriesModal(true)}
                        className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-1 whitespace-nowrap"
                      >
                        <Tag size={14} /> Kelola
                      </button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Variasi Produk (Ukuran & Warna)</label>
                    
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div>
                        <input 
                          type="text" 
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" 
                          placeholder="Ukuran (S, M, L, XL)"
                          value={editVariationSizeInput}
                          onChange={(e) => setEditVariationSizeInput(e.target.value)}
                        />
                      </div>
                      <div>
                        <input 
                          type="text" 
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" 
                          placeholder="Warna (Merah, Biru, Hitam)"
                          value={editVariationColorInput}
                          onChange={(e) => setEditVariationColorInput(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-1">
                        <input 
                          type="text"
                          inputMode="numeric"
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" 
                          placeholder="Harga"
                          value={editVariationPriceInput}
                          onChange={(e) => setEditVariationPriceInput(e.target.value.replace(/[^0-9]/g, ''))}
                        />
                        <button 
                          onClick={handleAddEditVariation}
                          className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {editVariationsList.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-gray-500">Variasi yang sudah ditambahkan:</p>
                        {editVariationsList.map((v) => (
                          <div key={v.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                            <div className="flex gap-2 flex-1">
                              <input 
                                type="text" 
                                className="w-20 border border-gray-200 rounded px-2 py-1 text-sm"
                                value={v.size}
                                onChange={(e) => handleUpdateEditVariation(v.id, 'size', e.target.value)}
                              />
                              <input 
                                type="text" 
                                className="w-24 border border-gray-200 rounded px-2 py-1 text-sm"
                                value={v.color}
                                onChange={(e) => handleUpdateEditVariation(v.id, 'color', e.target.value)}
                              />
                              <input 
                                type="text" 
                                inputMode="numeric"
                                className="w-28 border border-gray-200 rounded px-2 py-1 text-sm"
                                value={v.price}
                                onChange={(e) => handleUpdateEditVariation(v.id, 'price', e.target.value)}
                              />
                            </div>
                            <button onClick={() => handleRemoveEditVariation(v.id)} className="text-red-500 hover:text-red-700 ml-2">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {editVariationsList.length === 0 && (
                      <p className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded-lg">
                        ⚠️ Produk harus memiliki minimal satu variasi
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                  <button onClick={() => setShowEditProductModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">Batal</button>
                  <button onClick={handleSaveEditedProduct} className="px-5 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700">
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Notes - Level 2 */}
          {notesModal.isOpen && (
            <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-start justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-yellow-50 to-white">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={18} className="text-yellow-600" />
                    <h3 className="font-bold text-lg text-gray-800">Catatan Item</h3>
                  </div>
                  <button onClick={closeNotesModal} className="p-1 hover:bg-gray-100 rounded-lg">
                    <X size={18} />
                  </button>
                </div>
                <div className="flex-1 overflow-auto p-6">
                  <div className="mb-5">
                    <textarea 
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent" 
                      rows="3" 
                      placeholder="Tulis catatan..." 
                      value={notesModal.currentNote} 
                      onChange={(e) => setNotesModal(prev => ({ ...prev, currentNote: e.target.value }))} 
                    />
                    <button 
                      onClick={addNote} 
                      disabled={!notesModal.currentNote.trim()} 
                      className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm disabled:opacity-50 hover:bg-yellow-700 transition-colors"
                    >
                      Tambah Catatan
                    </button>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 text-gray-700">Daftar Catatan ({notesModal.notes.length})</h4>
                    {notesModal.notes.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed rounded-lg">
                        <MessageSquare className="text-gray-400 mx-auto mb-2" size={32} />
                        <p className="text-gray-500">Belum ada catatan</p>
                      </div>
                    ) : (
                      notesModal.notes.map(note => (
                        <div key={note.id} className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mb-3">
                          <div className="flex justify-between">
                            <span className="font-medium text-sm text-gray-700">{note.author}</span>
                            <span className="text-xs text-gray-500">{new Date(note.timestamp).toLocaleString('id-ID')}</span>
                          </div>
                          <p className="text-sm mt-1 text-gray-600">{note.text}</p>
                          <button onClick={() => removeNote(note.id)} className="text-red-500 text-xs mt-2 hover:text-red-700">
                            Hapus
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end rounded-b-xl">
                  <button onClick={closeNotesModal} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors">
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal CSV Import - Level 2 */}
          {csvModal.isOpen && (
            <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-start justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white sticky top-0 z-10">
                  <div className="flex items-center gap-2">
                    <FileText size={20} className="text-green-600" />
                    <h3 className="font-bold text-lg text-gray-800">Import Pelanggan dari CSV</h3>
                  </div>
                  <button onClick={closeCsvModal} className="p-1 hover:bg-gray-100 rounded-lg">
                    <X size={20} />
                  </button>
                </div>
                <div className="flex-1 overflow-auto p-6">
                  <div className="flex items-center justify-center gap-2 mb-6">
                    {['upload', 'mapping', 'preview'].map((step, idx) => (
                      <div key={step} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          csvModal.step === step ? 'bg-blue-600 text-white' : 
                          idx < ['upload', 'mapping', 'preview'].indexOf(csvModal.step) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {idx + 1}
                        </div>
                        <span className="ml-1 text-xs text-gray-600">{step}</span>
                        {idx < 2 && <div className="w-8 h-0.5 bg-gray-300 mx-1"></div>}
                      </div>
                    ))}
                  </div>
                  {csvModal.step === 'upload' && (
                    <div className="text-center py-8">
                      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Upload className="text-blue-600" size={24} />
                      </div>
                      <div className="border-2 border-dashed rounded-xl p-6">
                        <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csv-upload" />
                        <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center">
                          <FileText size={32} className="text-gray-400 mb-2" />
                          <p className="text-gray-700">Klik untuk memilih file</p>
                          <p className="text-xs text-gray-500">CSV dengan kolom: nama, telepon, alamat, email</p>
                        </label>
                      </div>
                    </div>
                  )}
                  {csvModal.step === 'preview' && csvModal.previewData.length > 0 && (
                    <div>
                      <div className="overflow-x-auto border rounded-lg">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Nama</th>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Telepon</th>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Alamat</th>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Email</th>
                            </tr>
                          </thead>
                          <tbody>
                            {csvModal.previewData.slice(0, 5).map((item, idx) => (
                              <tr key={idx} className="border-t">
                                <td className="px-3 py-2 text-sm">{item.parsed.name || '-'}</td>
                                <td className="px-3 py-2 text-sm">{item.parsed.phone || '-'}</td>
                                <td className="px-3 py-2 text-sm">{item.parsed.address || '-'}</td>
                                <td className="px-3 py-2 text-sm">{item.parsed.email || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {csvModal.previewData.length > 5 && (
                          <p className="text-xs text-gray-500 mt-1.5 text-center">
                            Menampilkan 5 dari {csvModal.previewData.length} baris
                          </p>
                        )}
                      </div>
                      <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setCsvModal(prev => ({ ...prev, step: 'mapping' }))} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                          Kembali
                        </button>
                        <button onClick={importCustomers} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                          Import Pelanggan
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========== LEVEL 3: MODAL CUCU (z-[100]) - TAMPIL DI DEPAN ========== */}
          
          {/* Modal Kelola Kategori - Level 3 */}
          {showManageCategoriesModal && (
            <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-[100] flex items-start justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-purple-50 to-white sticky top-0 z-10">
                  <div className="flex items-center gap-2">
                    <Tag size={20} className="text-purple-600" />
                    <h3 className="font-bold text-lg text-gray-800">Kelola Kategori Produk</h3>
                  </div>
                  <button onClick={() => { setShowManageCategoriesModal(false); setEditingCategory(null); }} className="p-1 hover:bg-gray-100 rounded-lg">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {editingCategory ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Edit Kategori</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        placeholder="Nama kategori"
                        autoFocus
                      />
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => { setEditingCategory(null); setEditCategoryName(''); }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                        >
                          Batal
                        </button>
                        <button
                          onClick={handleEditCategory}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                        >
                          Simpan Perubahan
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-gray-600">Daftar semua kategori produk yang tersedia</p>
                        <button
                          onClick={openAddCategoryFromManage}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700"
                        >
                          <Plus size={14} /> Tambah
                        </button>
                      </div>
                      <div className="space-y-2">
                        {productCategories.map((category) => {
                          const productCount = products.filter(p => p.category === category).length;
                          return (
                            <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-800">{category}</p>
                                <p className="text-xs text-gray-500">{productCount} produk</p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openEditCategoryModal(category)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                  title="Edit Kategori"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(category)}
                                  className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                  title="Hapus Kategori"
                                  disabled={productCount > 0}
                                >
                                  <Trash size={14} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                  <button onClick={() => { setShowManageCategoriesModal(false); setEditingCategory(null); }} className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Tambah Kategori - Level 3 */}
          {showCategoryModal && (
            <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-[100] flex items-start justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-purple-50 to-white">
                  <div className="flex items-center gap-2">
                    <Tag size={20} className="text-purple-600" />
                    <h3 className="font-bold text-lg text-gray-800">Tambah Kategori Produk</h3>
                  </div>
                  <button onClick={() => setShowCategoryModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori *</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Contoh: Baju Atasan, Bawahan, Outer, dll"
                      autoFocus
                    />
                    <p className="text-xs text-gray-500 mt-1">Kategori akan muncul di dropdown pilihan produk</p>
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                  <button onClick={() => setShowCategoryModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">Batal</button>
                  <button onClick={handleAddCategory} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
                    Simpan Kategori
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