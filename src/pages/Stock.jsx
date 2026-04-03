// src/pages/Stock.jsx
import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  AlertTriangle, 
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Download,
  Upload,
  X,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Eye,
  Save,
  ArrowLeft,
  Clock,
  Calendar,
  DollarSign,
  ShoppingCart,
  Warehouse
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';

// Data stok awal dengan perhitungan status yang benar
const initialStockItems = [
  {
    id: 'MAT-001',
    code: 'KAT-30S',
    material: 'Kain Katun 30s',
    category: 'Kain',
    currentStock: 45,
    minStock: 100,
    maxStock: 500,
    unit: 'meter',
    price: 45000,
    supplier: 'PT. Sandang Textile',
    lastRestock: '2024-03-15',
    location: 'Gudang A-01',
    notes: 'Kualitas premium, warna putih'
  },
  {
    id: 'MAT-002',
    code: 'BNG-PLY',
    material: 'Benang Polyester',
    category: 'Benang',
    currentStock: 12,
    minStock: 50,
    maxStock: 200,
    unit: 'roll',
    price: 25000,
    supplier: 'CV. Benang Nusantara',
    lastRestock: '2024-03-10',
    location: 'Gudang B-03',
    notes: 'Warna putih, ukuran 40s'
  },
  {
    id: 'MAT-003',
    code: 'KNC-MTL',
    material: 'Kancing Metalik',
    category: 'Aksesoris',
    currentStock: 85,
    minStock: 200,
    maxStock: 1000,
    unit: 'pcs',
    price: 500,
    supplier: 'UD. Kancing Jaya',
    lastRestock: '2024-02-28',
    location: 'Gudang C-02',
    notes: 'Warna silver, diameter 15mm'
  },
  {
    id: 'MAT-004',
    code: 'RST-NYL',
    material: 'Resleting Nylon',
    category: 'Aksesoris',
    currentStock: 60,
    minStock: 150,
    maxStock: 800,
    unit: 'pcs',
    price: 3000,
    supplier: 'CV. Resleting Prima',
    lastRestock: '2024-03-01',
    location: 'Gudang C-02',
    notes: 'Panjang 60cm, warna hitam'
  },
  {
    id: 'MAT-005',
    code: 'LBL-BRD',
    material: 'Label Brand',
    category: 'Aksesoris',
    currentStock: 110,
    minStock: 300,
    maxStock: 1500,
    unit: 'pcs',
    price: 800,
    supplier: 'PT. Label Indonesia',
    lastRestock: '2024-03-05',
    location: 'Gudang D-01',
    notes: 'Custom logo'
  },
  {
    id: 'MAT-006',
    code: 'KAT-POL',
    material: 'Kain Polyester',
    category: 'Kain',
    currentStock: 250,
    minStock: 80,
    maxStock: 600,
    unit: 'meter',
    price: 35000,
    supplier: 'PT. Sandang Textile',
    lastRestock: '2024-03-18',
    location: 'Gudang A-02',
    notes: 'Warna hitam, tebal'
  },
  {
    id: 'MAT-007',
    code: 'BNG-KAT',
    material: 'Benang Katun',
    category: 'Benang',
    currentStock: 35,
    minStock: 40,
    maxStock: 150,
    unit: 'roll',
    price: 28000,
    supplier: 'CV. Benang Nusantara',
    lastRestock: '2024-03-12',
    location: 'Gudang B-03',
    notes: 'Warna hitam'
  },
  {
    id: 'MAT-008',
    code: 'INT-LIN',
    material: 'Interlining',
    category: 'Bahan Pelapis',
    currentStock: 180,
    minStock: 50,
    maxStock: 300,
    unit: 'meter',
    price: 15000,
    supplier: 'PT. Textile Makmur',
    lastRestock: '2024-03-14',
    location: 'Gudang A-03',
    notes: 'Untuk kemeja'
  }
];

// Kategori options
const categories = ['Semua', 'Kain', 'Benang', 'Aksesoris', 'Bahan Pelapis', 'Lainnya'];

// Supplier options
const suppliers = [
  'PT. Sandang Textile',
  'CV. Benang Nusantara',
  'UD. Kancing Jaya',
  'CV. Resleting Prima',
  'PT. Label Indonesia',
  'PT. Textile Makmur'
];

export default function Stock() {
  const navigate = useNavigate();
  const [stockItems, setStockItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    material: '',
    category: 'Kain',
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    unit: 'meter',
    price: 0,
    supplier: '',
    location: '',
    notes: ''
  });
  const [restockAmount, setRestockAmount] = useState(0);

  // Deteksi ukuran layar
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ================== FUNGSI STATUS STOK ==================
  // Update status berdasarkan persentase dari minStock
  const updateItemStatus = (item) => {
    if (!item.minStock || item.minStock === 0) return 'normal';
    
    const percentage = (item.currentStock / item.minStock) * 100;
    
    if (percentage >= 50) return 'normal';      // Normal: >= 50% dari stok minimal
    if (percentage >= 25) return 'warning';     // Menipis: 25% - 49% dari stok minimal
    return 'critical';                          // Kritis: < 25% dari stok minimal
  };

  // Get status badge untuk tampilan
  const getStatusBadge = (status) => {
    switch(status) {
      case 'critical':
        return { 
          label: 'Kritis', 
          color: 'bg-red-100 text-red-800', 
          icon: <AlertTriangle size={12} className="mr-1" />,
          description: 'Stok < 25% dari kebutuhan minimal'
        };
      case 'warning':
        return { 
          label: 'Menipis', 
          color: 'bg-yellow-100 text-yellow-800', 
          icon: <AlertCircle size={12} className="mr-1" />,
          description: 'Stok 25% - 49% dari kebutuhan minimal'
        };
      case 'low':
        return { 
          label: 'Menipis', 
          color: 'bg-yellow-100 text-yellow-800', 
          icon: <AlertCircle size={12} className="mr-1" />,
          description: 'Stok 25% - 49% dari kebutuhan minimal'
        };
      default:
        return { 
          label: 'Normal', 
          color: 'bg-green-100 text-green-800', 
          icon: <CheckCircle size={12} className="mr-1" />,
          description: 'Stok ≥ 50% dari kebutuhan minimal'
        };
    }
  };

  // Get warna teks untuk status
  const getStatusColor = (status) => {
    switch(status) {
      case 'critical': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'low': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  // Get warna progress bar
  const getProgressBarColor = (status) => {
    switch(status) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'low': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  // Get lebar progress bar (maksimal 100%)
  const getProgressBarWidth = (currentStock, minStock) => {
    if (!minStock || minStock === 0) return 100;
    const percentage = (currentStock / minStock) * 100;
    return Math.min(100, percentage);
  };

  // Get persentase stok
  const getStockPercentage = (currentStock, minStock) => {
    if (!minStock || minStock === 0) return 0;
    return Math.min(100, Math.round((currentStock / minStock) * 100));
  };

  // ================== LOAD DATA ==================
  const loadStockData = () => {
    setLoading(true);
    setTimeout(() => {
      const savedStock = localStorage.getItem('stockItems');
      let items;
      
      if (savedStock) {
        items = JSON.parse(savedStock);
      } else {
        items = initialStockItems;
      }
      
      // Auto-update status berdasarkan currentStock dan minStock
      const updatedItems = items.map(item => ({
        ...item,
        status: updateItemStatus(item)
      }));
      
      setStockItems(updatedItems);
      localStorage.setItem('stockItems', JSON.stringify(updatedItems));
      setLoading(false);
    }, 300);
  };

  // Filter data
  useEffect(() => {
    let filtered = [...stockItems];
    
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.supplier && item.supplier.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (categoryFilter !== 'Semua') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    
    if (statusFilter !== 'Semua') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    setFilteredItems(filtered);
  }, [searchQuery, categoryFilter, statusFilter, stockItems]);

  // Load data saat pertama kali
  useEffect(() => {
    loadStockData();
  }, []);

  // Hitung statistik
  const totalItems = stockItems.length;
  const criticalItems = stockItems.filter(i => i.status === 'critical').length;
  const lowStockItems = stockItems.filter(i => i.status === 'warning' || i.status === 'low').length;
  const normalStock = stockItems.filter(i => i.status === 'normal').length;
  const totalValue = stockItems.reduce((sum, item) => sum + (item.currentStock * item.price), 0);

  // ================== CRUD FUNCTIONS ==================
  const handleAddItem = () => {
    if (!formData.material || !formData.code) {
      alert('Mohon isi nama material dan kode!');
      return;
    }

    const newId = `MAT-${String(stockItems.length + 1).padStart(3, '0')}`;
    const newItem = {
      id: newId,
      ...formData,
      currentStock: Number(formData.currentStock),
      minStock: Number(formData.minStock),
      maxStock: Number(formData.maxStock),
      price: Number(formData.price),
      lastRestock: new Date().toISOString().split('T')[0],
      location: formData.location || '-',
      notes: formData.notes || ''
    };
    
    // Update status
    newItem.status = updateItemStatus(newItem);
    
    const updatedItems = [...stockItems, newItem];
    setStockItems(updatedItems);
    localStorage.setItem('stockItems', JSON.stringify(updatedItems));
    
    setShowAddModal(false);
    resetForm();
    alert('✅ Material berhasil ditambahkan!');
  };

  const handleEditItem = () => {
    if (!selectedItem) return;
    
    const updatedItem = {
      ...selectedItem,
      ...formData,
      currentStock: Number(formData.currentStock),
      minStock: Number(formData.minStock),
      maxStock: Number(formData.maxStock),
      price: Number(formData.price)
    };
    
    // Update status
    updatedItem.status = updateItemStatus(updatedItem);
    
    const updatedItems = stockItems.map(item => 
      item.id === selectedItem.id ? updatedItem : item
    );
    
    setStockItems(updatedItems);
    localStorage.setItem('stockItems', JSON.stringify(updatedItems));
    
    setShowEditModal(false);
    setSelectedItem(null);
    resetForm();
    alert('✅ Material berhasil diperbarui!');
  };

  const handleRestock = () => {
    if (!selectedItem || restockAmount <= 0) {
      alert('Masukkan jumlah restock yang valid!');
      return;
    }
    
    const newStock = selectedItem.currentStock + restockAmount;
    const updatedItem = { 
      ...selectedItem, 
      currentStock: newStock, 
      lastRestock: new Date().toISOString().split('T')[0]
    };
    updatedItem.status = updateItemStatus(updatedItem);
    
    const updatedItems = stockItems.map(item => 
      item.id === selectedItem.id ? updatedItem : item
    );
    
    setStockItems(updatedItems);
    localStorage.setItem('stockItems', JSON.stringify(updatedItems));
    
    setShowDetailModal(false);
    setSelectedItem(null);
    setRestockAmount(0);
    alert(`✅ Berhasil menambah stok ${restockAmount} ${selectedItem.unit}!`);
  };

  const handleDeleteItem = (item) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus material "${item.material}"?`)) {
      const updatedItems = stockItems.filter(i => i.id !== item.id);
      setStockItems(updatedItems);
      localStorage.setItem('stockItems', JSON.stringify(updatedItems));
      alert('✅ Material berhasil dihapus!');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      material: '',
      category: 'Kain',
      currentStock: 0,
      minStock: 0,
      maxStock: 0,
      unit: 'meter',
      price: 0,
      supplier: '',
      location: '',
      notes: ''
    });
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormData({
      code: item.code,
      material: item.material,
      category: item.category,
      currentStock: item.currentStock,
      minStock: item.minStock,
      maxStock: item.maxStock,
      unit: item.unit,
      price: item.price,
      supplier: item.supplier || '',
      location: item.location || '',
      notes: item.notes || ''
    });
    setShowEditModal(true);
  };

  const openDetailModal = (item) => {
    setSelectedItem(item);
    setRestockAmount(0);
    setShowDetailModal(true);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Kode', 'Material', 'Kategori', 'Stok Saat Ini', 'Stok Minimal', 'Persentase', 'Satuan', 'Harga', 'Supplier', 'Lokasi', 'Status', 'Terakhir Restock'];
    const csvData = filteredItems.map(item => {
      const percentage = getStockPercentage(item.currentStock, item.minStock);
      const statusBadge = getStatusBadge(item.status);
      return [
        item.code,
        item.material,
        item.category,
        item.currentStock,
        item.minStock,
        `${percentage}%`,
        item.unit,
        item.price,
        item.supplier || '',
        item.location || '',
        statusBadge.label,
        item.lastRestock || ''
      ];
    });
    
    const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `stok-material-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    URL.revokeObjectURL(url);
    alert('✅ Data berhasil diexport!');
  };

  const formatCurrencyIDR = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  // Stat Cards Component
  const StatCards = () => (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6">
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Package size={18} className="text-blue-600" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-800 mt-2">{totalItems}</p>
        <p className="text-xs text-gray-500">Total Material</p>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle size={18} className="text-red-600" />
          </div>
        </div>
        <p className="text-2xl font-bold text-red-600 mt-2">{criticalItems}</p>
        <p className="text-xs text-gray-500">Kritis (&lt;25%)</p>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <AlertCircle size={18} className="text-yellow-600" />
          </div>
        </div>
        <p className="text-2xl font-bold text-yellow-600 mt-2">{lowStockItems}</p>
        <p className="text-xs text-gray-500">Menipis (25%-49%)</p>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle size={18} className="text-green-600" />
          </div>
        </div>
        <p className="text-2xl font-bold text-green-600 mt-2">{normalStock}</p>
        <p className="text-xs text-gray-500">Normal (≥50%)</p>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-purple-100 rounded-lg">
            <DollarSign size={18} className="text-purple-600" />
          </div>
        </div>
        <p className="text-xl font-bold text-purple-600 mt-2">{formatCurrencyIDR(totalValue)}</p>
        <p className="text-xs text-gray-500">Total Inventaris</p>
      </div>
    </div>
  );

  // Add/Edit Modal
  const StockFormModal = ({ isOpen, onClose, onSubmit, title }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center gap-2">
              <Warehouse size={20} className="text-blue-600" />
              <h3 className="font-bold text-lg text-gray-800">{title}</h3>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Kode Material *</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={formData.code} 
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} 
                  placeholder="Contoh: KAT-30S" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Nama Material *</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={formData.material} 
                  onChange={(e) => setFormData({...formData, material: e.target.value})} 
                  placeholder="Contoh: Kain Katun 30s" 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Kategori</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {categories.filter(c => c !== 'Semua').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Satuan</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={formData.unit} 
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                >
                  <option value="meter">Meter</option>
                  <option value="roll">Roll</option>
                  <option value="pcs">Pcs</option>
                  <option value="kg">Kg</option>
                  <option value="yard">Yard</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Stok Saat Ini</label>
                <input 
                  type="number" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={formData.currentStock} 
                  onChange={(e) => setFormData({...formData, currentStock: parseInt(e.target.value) || 0})} 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Stok Minimal</label>
                <input 
                  type="number" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={formData.minStock} 
                  onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value) || 0})} 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Stok Maksimal</label>
                <input 
                  type="number" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={formData.maxStock} 
                  onChange={(e) => setFormData({...formData, maxStock: parseInt(e.target.value) || 0})} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Harga Satuan (Rp)</label>
                <input 
                  type="number" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={formData.price} 
                  onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})} 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Supplier</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={formData.supplier} 
                  onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                >
                  <option value="">Pilih Supplier</option>
                  {suppliers.map(sup => (
                    <option key={sup} value={sup}>{sup}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Lokasi Penyimpanan</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                value={formData.location} 
                onChange={(e) => setFormData({...formData, location: e.target.value})} 
                placeholder="Contoh: Gudang A-01" 
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Catatan</label>
              <textarea 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                rows="2" 
                value={formData.notes} 
                onChange={(e) => setFormData({...formData, notes: e.target.value})} 
                placeholder="Catatan tambahan..." 
              />
            </div>
          </div>
          
          <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">Batal</button>
            <button onClick={onSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Simpan</button>
          </div>
        </div>
      </div>
    );
  };

  // Detail Modal with Restock
  const DetailModal = () => {
    if (!showDetailModal || !selectedItem) return null;
    
    const statusBadge = getStatusBadge(selectedItem.status);
    const percentage = getStockPercentage(selectedItem.currentStock, selectedItem.minStock);
    const progressWidth = getProgressBarWidth(selectedItem.currentStock, selectedItem.minStock);
    
    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center gap-2">
              <Package size={20} className="text-blue-600" />
              <h3 className="font-bold text-lg text-gray-800">Detail Material</h3>
            </div>
            <button onClick={() => { setShowDetailModal(false); setSelectedItem(null); setRestockAmount(0); }} className="p-1 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500">Kode</p>
                <p className="font-bold text-gray-800 text-lg">{selectedItem.code}</p>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                {statusBadge.icon} {statusBadge.label}
              </span>
            </div>
            
            <div>
              <p className="text-xs text-gray-500">Nama Material</p>
              <p className="font-semibold text-gray-800 text-lg">{selectedItem.material}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500">Kategori</p>
                <p className="font-medium">{selectedItem.category}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Satuan</p>
                <p className="font-medium">{selectedItem.unit}</p>
              </div>
            </div>
            
            {/* Stock Info with Percentage */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Level Stok</span>
                <span className={`text-sm font-bold ${getStatusColor(selectedItem.status)}`}>
                  {selectedItem.currentStock} / {selectedItem.minStock} {selectedItem.unit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressBarColor(selectedItem.status)} transition-all duration-500`} 
                  style={{ width: `${progressWidth}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Min: {selectedItem.minStock} {selectedItem.unit}</span>
                <span className={`font-medium ${getStatusColor(selectedItem.status)}`}>
                  {percentage}% dari minimal
                </span>
                <span>Max: {selectedItem.maxStock} {selectedItem.unit}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500">Harga Satuan</p>
                <p className="font-semibold text-blue-600">{formatCurrencyIDR(selectedItem.price)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Nilai</p>
                <p className="font-semibold text-purple-600">{formatCurrencyIDR(selectedItem.currentStock * selectedItem.price)}</p>
              </div>
            </div>
            
            <div>
              <p className="text-xs text-gray-500">Supplier</p>
              <p className="font-medium">{selectedItem.supplier || '-'}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500">Lokasi</p>
              <p className="font-medium">{selectedItem.location || '-'}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500">Terakhir Restock</p>
              <p className="font-medium">{selectedItem.lastRestock || '-'}</p>
            </div>
            
            {selectedItem.notes && (
              <div>
                <p className="text-xs text-gray-500">Catatan</p>
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{selectedItem.notes}</p>
              </div>
            )}
            
            {/* Restock Section */}
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tambah Stok</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Jumlah tambahan"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(parseInt(e.target.value) || 0)}
                />
                <button
                  onClick={handleRestock}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-1"
                >
                  <ShoppingCart size={16} /> Restock
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                * Setelah restock, status stok akan diperbarui otomatis
              </p>
            </div>
          </div>
          
          <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
            <button onClick={() => openEditModal(selectedItem)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-1">
              <Edit2 size={14} /> Edit
            </button>
            <button onClick={() => { setShowDetailModal(false); setSelectedItem(null); }} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">Tutup</button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data stok...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Stok Material</h1>
            <p className="text-sm text-gray-500 mt-1">Kelola stok bahan baku dan aksesoris produksi</p>
          </div>
          <div className="flex gap-3">
            <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              <Download size={16} /> Export CSV
            </button>
            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              <Plus size={16} /> Tambah Material
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <StatCards />

      {/* Info Box Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-blue-800">
          <AlertCircle size={16} />
          <span className="font-medium">Tingkatan Status Stok:</span>
          <span className="text-green-700">● Normal (≥50%)</span>
          <span className="text-yellow-700">● Menipis (25%-49%)</span>
          <span className="text-red-700">● Kritis (&lt;25%)</span>
          <span className="text-gray-500 text-xs ml-2">*Persentase dihitung dari Stok Minimal</span>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari material, kode, atau supplier..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="Semua">Semua Status</option>
              <option value="critical">Kritis (&lt;25%)</option>
              <option value="warning">Menipis (25%-49%)</option>
              <option value="normal">Normal (≥50%)</option>
            </select>
            <button 
              onClick={() => { setSearchQuery(''); setCategoryFilter('Semua'); setStatusFilter('Semua'); }} 
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Kode</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Material</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Kategori</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Stok</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Supplier</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const statusBadge = getStatusBadge(item.status);
                  const percentage = getStockPercentage(item.currentStock, item.minStock);
                  const progressWidth = getProgressBarWidth(item.currentStock, item.minStock);
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => openDetailModal(item)}>
                      <td className="px-5 py-4">
                        <span className="font-mono text-sm font-medium text-gray-800">{item.code}</span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">{item.material}</p>
                        <p className="text-xs text-gray-400">Lokasi: {item.location || '-'}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">{item.category}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="min-w-[140px]">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">{item.currentStock}</span>
                            <span className="text-gray-400 text-xs">/ {item.minStock} {item.unit}</span>
                            <span className={`text-xs font-medium ${getStatusColor(item.status)}`}>
                              ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${getProgressBarColor(item.status)} transition-all duration-500`} 
                              style={{ width: `${progressWidth}%` }}
                            ></div>
                          </div>
                        </div>
                       </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                          {statusBadge.icon} {statusBadge.label}
                        </span>
                       </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-600 truncate max-w-[150px]">{item.supplier || '-'}</p>
                       </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                       </td>
                     </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Package className="text-gray-300 mb-3" size={48} />
                      <p className="text-gray-500 font-medium">Tidak ada data stok</p>
                      <p className="text-gray-400 text-sm mt-1">Coba ubah filter atau tambahkan material baru</p>
                      <button onClick={() => setShowAddModal(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">Tambah Material</button>
                    </div>
                   </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Menampilkan <span className="font-semibold">{filteredItems.length}</span> dari <span className="font-semibold">{stockItems.length}</span> material
          </p>
          <button onClick={loadStockData} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Low Stock Alert Banner */}
      {criticalItems > 0 && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-semibold text-red-800">Perhatian! Stok Kritis</h4>
              <p className="text-sm text-red-700">
                Terdapat {criticalItems} material yang stoknya berada di bawah 25% dari kebutuhan minimal. 
                Segera lakukan restock untuk menghindari keterlambatan produksi.
              </p>
              <button 
                onClick={() => setStatusFilter('critical')}
                className="mt-2 text-sm text-red-700 font-medium hover:text-red-800 underline"
              >
                Lihat material kritis →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warning Stock Alert Banner */}
      {lowStockItems > 0 && criticalItems === 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-semibold text-yellow-800">Perhatian! Stok Menipis</h4>
              <p className="text-sm text-yellow-700">
                Terdapat {lowStockItems} material yang stoknya berada di antara 25% - 49% dari kebutuhan minimal.
                Segera persiapkan pembelian bahan baku.
              </p>
              <button 
                onClick={() => setStatusFilter('warning')}
                className="mt-2 text-sm text-yellow-700 font-medium hover:text-yellow-800 underline"
              >
                Lihat material menipis →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <StockFormModal 
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); resetForm(); }}
        onSubmit={handleAddItem}
        title="Tambah Material Baru"
      />
      
      <StockFormModal 
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); resetForm(); setSelectedItem(null); }}
        onSubmit={handleEditItem}
        title="Edit Material"
      />
      
      <DetailModal />
    </div>
  );
}