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
  Warehouse,
  PlusCircle,
  Tag,
  Edit,
  Trash,
  Ruler,
  Truck,
  Building2,
  Phone,
  Mail,
  FileText,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Data stok awal
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
    notes: 'Kualitas premium, warna putih',
    variations: [
      { id: 'VAR-001-1', size: 'S', color: 'Putih', stock: 15, price: 45000 },
      { id: 'VAR-001-2', size: 'M', color: 'Putih', stock: 20, price: 45000 },
      { id: 'VAR-001-3', size: 'L', color: 'Putih', stock: 10, price: 45500 }
    ]
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
    notes: 'Warna putih, ukuran 40s',
    variations: [
      { id: 'VAR-002-1', size: '40s', color: 'Putih', stock: 12, price: 25000 }
    ]
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
    notes: 'Warna silver, diameter 15mm',
    variations: [
      { id: 'VAR-003-1', size: '15mm', color: 'Silver', stock: 50, price: 500 },
      { id: 'VAR-003-2', size: '15mm', color: 'Gold', stock: 35, price: 550 }
    ]
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
    notes: 'Panjang 60cm, warna hitam',
    variations: [
      { id: 'VAR-004-1', size: '60cm', color: 'Hitam', stock: 40, price: 3000 },
      { id: 'VAR-004-2', size: '60cm', color: 'Coklat', stock: 20, price: 3100 }
    ]
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
    notes: 'Custom logo',
    variations: [
      { id: 'VAR-005-1', size: '3x5cm', color: 'Putih', stock: 60, price: 800 },
      { id: 'VAR-005-2', size: '3x5cm', color: 'Hitam', stock: 50, price: 850 }
    ]
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
    notes: 'Warna hitam, tebal',
    variations: [
      { id: 'VAR-006-1', size: 'S', color: 'Hitam', stock: 100, price: 35000 },
      { id: 'VAR-006-2', size: 'M', color: 'Hitam', stock: 80, price: 35000 },
      { id: 'VAR-006-3', size: 'L', color: 'Hitam', stock: 70, price: 35500 }
    ]
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
    notes: 'Warna hitam',
    variations: [
      { id: 'VAR-007-1', size: '40s', color: 'Hitam', stock: 35, price: 28000 }
    ]
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
    notes: 'Untuk kemeja',
    variations: [
      { id: 'VAR-008-1', size: 'S', color: 'Putih', stock: 80, price: 15000 },
      { id: 'VAR-008-2', size: 'M', color: 'Putih', stock: 60, price: 15000 },
      { id: 'VAR-008-3', size: 'L', color: 'Putih', stock: 40, price: 15500 }
    ]
  }
];

// Default units
const defaultUnits = ['meter', 'roll', 'pcs', 'kg', 'yard'];

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
  
  // ================== STATE UNTUK KATEGORI ==================
  const [categories, setCategories] = useState(['Kain', 'Benang', 'Aksesoris', 'Bahan Pelapis', 'Lainnya']);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showManageCategoriesModal, setShowManageCategoriesModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  
  // ================== STATE UNTUK SATUAN ==================
  const [units, setUnits] = useState([...defaultUnits]);
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [showManageUnitsModal, setShowManageUnitsModal] = useState(false);
  const [newUnitName, setNewUnitName] = useState('');
  const [editingUnit, setEditingUnit] = useState(null);
  const [editUnitName, setEditUnitName] = useState('');
  
  // ================== STATE UNTUK SUPPLIER ==================
  const [suppliers, setSuppliers] = useState([
    'PT. Sandang Textile',
    'CV. Benang Nusantara',
    'UD. Kancing Jaya',
    'CV. Resleting Prima',
    'PT. Label Indonesia',
    'PT. Textile Makmur'
  ]);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showManageSuppliersModal, setShowManageSuppliersModal] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierContact, setNewSupplierContact] = useState('');
  const [newSupplierPhone, setNewSupplierPhone] = useState('');
  const [newSupplierEmail, setNewSupplierEmail] = useState('');
  const [newSupplierAddress, setNewSupplierAddress] = useState('');
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [editSupplierData, setEditSupplierData] = useState({
    name: '',
    contact: '',
    phone: '',
    email: '',
    address: ''
  });
  
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

  // ================== FUNGSI UNTUK KATEGORI ==================
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      alert('Mohon isi nama kategori!');
      return;
    }
    
    if (categories.includes(newCategoryName.trim())) {
      alert('Kategori sudah ada!');
      return;
    }
    
    const updatedCategories = [...categories, newCategoryName.trim()];
    setCategories(updatedCategories);
    localStorage.setItem('materialCategories', JSON.stringify(updatedCategories));
    
    setNewCategoryName('');
    setShowAddCategoryModal(false);
    
    alert(`✅ Kategori "${newCategoryName}" berhasil ditambahkan!`);
  };

  const handleEditCategory = () => {
    if (!editCategoryName.trim()) {
      alert('Mohon isi nama kategori!');
      return;
    }
    
    if (categories.includes(editCategoryName.trim()) && editCategoryName.trim() !== editingCategory) {
      alert('Kategori sudah ada!');
      return;
    }
    
    const updatedCategories = categories.map(cat => 
      cat === editingCategory ? editCategoryName.trim() : cat
    );
    setCategories(updatedCategories);
    localStorage.setItem('materialCategories', JSON.stringify(updatedCategories));
    
    const updatedStockItems = stockItems.map(item => 
      item.category === editingCategory 
        ? { ...item, category: editCategoryName.trim() }
        : item
    );
    setStockItems(updatedStockItems);
    localStorage.setItem('stockItems', JSON.stringify(updatedStockItems));
    
    if (categoryFilter === editingCategory) {
      setCategoryFilter(editCategoryName.trim());
    }
    
    if (formData.category === editingCategory) {
      setFormData(prev => ({ ...prev, category: editCategoryName.trim() }));
    }
    
    setEditingCategory(null);
    setEditCategoryName('');
    setShowManageCategoriesModal(false);
    
    alert(`✅ Kategori berhasil diubah menjadi "${editCategoryName}"!`);
  };

  const handleDeleteCategory = (categoryToDelete) => {
    const itemsWithCategory = stockItems.filter(item => item.category === categoryToDelete);
    
    if (itemsWithCategory.length > 0) {
      alert(`⚠️ Kategori "${categoryToDelete}" sedang digunakan oleh ${itemsWithCategory.length} material. Hapus atau ubah kategori material tersebut terlebih dahulu!`);
      return;
    }
    
    if (window.confirm(`Apakah Anda yakin ingin menghapus kategori "${categoryToDelete}"?`)) {
      const updatedCategories = categories.filter(cat => cat !== categoryToDelete);
      setCategories(updatedCategories);
      localStorage.setItem('materialCategories', JSON.stringify(updatedCategories));
      
      if (categoryFilter === categoryToDelete) {
        setCategoryFilter('Semua');
      }
      
      if (formData.category === categoryToDelete) {
        setFormData(prev => ({ ...prev, category: categories[0] || 'Lainnya' }));
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
    setShowAddCategoryModal(true);
    setNewCategoryName('');
  };

  // ================== FUNGSI UNTUK SATUAN ==================
  const handleAddUnit = () => {
    if (!newUnitName.trim()) {
      alert('Mohon isi nama satuan!');
      return;
    }
    
    if (units.includes(newUnitName.trim().toLowerCase())) {
      alert('Satuan sudah ada!');
      return;
    }
    
    const updatedUnits = [...units, newUnitName.trim().toLowerCase()];
    setUnits(updatedUnits);
    localStorage.setItem('materialUnits', JSON.stringify(updatedUnits));
    
    setNewUnitName('');
    setShowAddUnitModal(false);
    
    alert(`✅ Satuan "${newUnitName}" berhasil ditambahkan!`);
  };

  const handleEditUnit = () => {
    if (!editUnitName.trim()) {
      alert('Mohon isi nama satuan!');
      return;
    }
    
    if (units.includes(editUnitName.trim().toLowerCase()) && editUnitName.trim().toLowerCase() !== editingUnit) {
      alert('Satuan sudah ada!');
      return;
    }
    
    const updatedUnits = units.map(unit => 
      unit === editingUnit ? editUnitName.trim().toLowerCase() : unit
    );
    setUnits(updatedUnits);
    localStorage.setItem('materialUnits', JSON.stringify(updatedUnits));
    
    const updatedStockItems = stockItems.map(item => 
      item.unit === editingUnit 
        ? { ...item, unit: editUnitName.trim().toLowerCase() }
        : item
    );
    setStockItems(updatedStockItems);
    localStorage.setItem('stockItems', JSON.stringify(updatedStockItems));
    
    if (formData.unit === editingUnit) {
      setFormData(prev => ({ ...prev, unit: editUnitName.trim().toLowerCase() }));
    }
    
    setEditingUnit(null);
    setEditUnitName('');
    setShowManageUnitsModal(false);
    
    alert(`✅ Satuan berhasil diubah menjadi "${editUnitName}"!`);
  };

  const handleDeleteUnit = (unitToDelete) => {
    const itemsWithUnit = stockItems.filter(item => item.unit === unitToDelete);
    
    if (itemsWithUnit.length > 0) {
      alert(`⚠️ Satuan "${unitToDelete}" sedang digunakan oleh ${itemsWithUnit.length} material. Hapus atau ubah satuan material tersebut terlebih dahulu!`);
      return;
    }
    
    if (window.confirm(`Apakah Anda yakin ingin menghapus satuan "${unitToDelete}"?`)) {
      const updatedUnits = units.filter(unit => unit !== unitToDelete);
      setUnits(updatedUnits);
      localStorage.setItem('materialUnits', JSON.stringify(updatedUnits));
      
      if (formData.unit === unitToDelete) {
        setFormData(prev => ({ ...prev, unit: units[0] || 'pcs' }));
      }
      
      alert(`✅ Satuan "${unitToDelete}" berhasil dihapus!`);
    }
  };

  const openEditUnitModal = (unit) => {
    setEditingUnit(unit);
    setEditUnitName(unit);
    setShowManageUnitsModal(true);
  };

  const openAddUnitFromManage = () => {
    setShowManageUnitsModal(false);
    setEditingUnit(null);
    setShowAddUnitModal(true);
    setNewUnitName('');
  };

  // ================== FUNGSI UNTUK SUPPLIER ==================
  const handleAddSupplier = () => {
    if (!newSupplierName.trim()) {
      alert('Mohon isi nama supplier!');
      return;
    }
    
    if (suppliers.includes(newSupplierName.trim())) {
      alert('Supplier sudah ada!');
      return;
    }
    
    const updatedSuppliers = [...suppliers, newSupplierName.trim()];
    setSuppliers(updatedSuppliers);
    localStorage.setItem('suppliers', JSON.stringify(updatedSuppliers));
    localStorage.setItem(`supplier_detail_${newSupplierName.trim()}`, JSON.stringify({
      name: newSupplierName.trim(),
      contact: newSupplierContact,
      phone: newSupplierPhone,
      email: newSupplierEmail,
      address: newSupplierAddress
    }));
    
    setNewSupplierName('');
    setNewSupplierContact('');
    setNewSupplierPhone('');
    setNewSupplierEmail('');
    setNewSupplierAddress('');
    setShowAddSupplierModal(false);
    
    alert(`✅ Supplier "${newSupplierName}" berhasil ditambahkan!`);
  };

  const handleEditSupplier = () => {
    if (!editSupplierData.name.trim()) {
      alert('Mohon isi nama supplier!');
      return;
    }
    
    if (suppliers.includes(editSupplierData.name.trim()) && editSupplierData.name.trim() !== editingSupplier) {
      alert('Supplier sudah ada!');
      return;
    }
    
    const updatedSuppliers = suppliers.map(sup => 
      sup === editingSupplier ? editSupplierData.name.trim() : sup
    );
    setSuppliers(updatedSuppliers);
    localStorage.setItem('suppliers', JSON.stringify(updatedSuppliers));
    
    localStorage.setItem(`supplier_detail_${editSupplierData.name.trim()}`, JSON.stringify(editSupplierData));
    if (editingSupplier !== editSupplierData.name.trim()) {
      localStorage.removeItem(`supplier_detail_${editingSupplier}`);
    }
    
    const updatedStockItems = stockItems.map(item => 
      item.supplier === editingSupplier 
        ? { ...item, supplier: editSupplierData.name.trim() }
        : item
    );
    setStockItems(updatedStockItems);
    localStorage.setItem('stockItems', JSON.stringify(updatedStockItems));
    
    if (formData.supplier === editingSupplier) {
      setFormData(prev => ({ ...prev, supplier: editSupplierData.name.trim() }));
    }
    
    setEditingSupplier(null);
    setEditSupplierData({ name: '', contact: '', phone: '', email: '', address: '' });
    setShowManageSuppliersModal(false);
    
    alert(`✅ Supplier berhasil diubah menjadi "${editSupplierData.name}"!`);
  };

  const handleDeleteSupplier = (supplierToDelete) => {
    const itemsWithSupplier = stockItems.filter(item => item.supplier === supplierToDelete);
    
    if (itemsWithSupplier.length > 0) {
      alert(`⚠️ Supplier "${supplierToDelete}" sedang digunakan oleh ${itemsWithSupplier.length} material. Hapus atau ubah supplier material tersebut terlebih dahulu!`);
      return;
    }
    
    if (window.confirm(`Apakah Anda yakin ingin menghapus supplier "${supplierToDelete}"?`)) {
      const updatedSuppliers = suppliers.filter(sup => sup !== supplierToDelete);
      setSuppliers(updatedSuppliers);
      localStorage.setItem('suppliers', JSON.stringify(updatedSuppliers));
      localStorage.removeItem(`supplier_detail_${supplierToDelete}`);
      
      if (formData.supplier === supplierToDelete) {
        setFormData(prev => ({ ...prev, supplier: '' }));
      }
      
      alert(`✅ Supplier "${supplierToDelete}" berhasil dihapus!`);
    }
  };

  const openEditSupplierModal = (supplier) => {
    const savedDetail = localStorage.getItem(`supplier_detail_${supplier}`);
    let detail = { name: supplier, contact: '', phone: '', email: '', address: '' };
    if (savedDetail) {
      detail = JSON.parse(savedDetail);
    }
    setEditingSupplier(supplier);
    setEditSupplierData(detail);
    setShowManageSuppliersModal(true);
  };

  const openAddSupplierFromManage = () => {
    setShowManageSuppliersModal(false);
    setEditingSupplier(null);
    setShowAddSupplierModal(true);
    setNewSupplierName('');
    setNewSupplierContact('');
    setNewSupplierPhone('');
    setNewSupplierEmail('');
    setNewSupplierAddress('');
  };

  // Load data dari localStorage
  useEffect(() => {
    const savedCategories = localStorage.getItem('materialCategories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
    
    const savedUnits = localStorage.getItem('materialUnits');
    if (savedUnits) {
      setUnits(JSON.parse(savedUnits));
    }
    
    const savedSuppliers = localStorage.getItem('suppliers');
    if (savedSuppliers) {
      setSuppliers(JSON.parse(savedSuppliers));
    }
  }, []);

  // ================== FUNGSI STATUS STOK ==================
  const updateItemStatus = (item) => {
    if (!item.minStock || item.minStock === 0) return 'normal';
    
    const percentage = (item.currentStock / item.minStock) * 100;
    
    if (percentage >= 50) return 'normal';
    if (percentage >= 25) return 'warning';
    return 'critical';
  };

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
      default:
        return { 
          label: 'Normal', 
          color: 'bg-green-100 text-green-800', 
          icon: <CheckCircle size={12} className="mr-1" />,
          description: 'Stok ≥ 50% dari kebutuhan minimal'
        };
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'critical': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const getProgressBarColor = (status) => {
    switch(status) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getProgressBarWidth = (currentStock, minStock) => {
    if (!minStock || minStock === 0) return 100;
    const percentage = (currentStock / minStock) * 100;
    return Math.min(100, percentage);
  };

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
      
      const updatedItems = items.map(item => {
        let totalStock = item.currentStock;
        let totalPrice = item.price;
        
        if (item.variations && item.variations.length > 0) {
          totalStock = item.variations.reduce((sum, v) => sum + (v.stock || 0), 0);
          totalPrice = item.variations[0]?.price || item.price;
        }
        
        return {
          ...item,
          currentStock: totalStock,
          price: totalPrice,
          status: updateItemStatus({ ...item, currentStock: totalStock })
        };
      });
      
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

  useEffect(() => {
    loadStockData();
  }, []);

  // Hitung statistik
  const totalItems = stockItems.length;
  const criticalItems = stockItems.filter(i => i.status === 'critical').length;
  const lowStockItems = stockItems.filter(i => i.status === 'warning').length;
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
      notes: formData.notes || '',
      variations: [
        {
          id: `VAR-${newId}`,
          size: 'Default',
          color: 'Default',
          stock: Number(formData.currentStock),
          price: Number(formData.price)
        }
      ]
    };
    
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

  // ================== EXPORT FUNCTIONS - PER VARIASI ==================
  const formatCurrencyIDR = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  const formatPriceDisplay = (price) => {
    if (!price) return '';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Fungsi untuk mendapatkan data export per variasi
  const getVariationExportData = () => {
    const exportRows = [];
    
    filteredItems.forEach(product => {
      if (product.variations && product.variations.length > 0) {
        product.variations.forEach(variation => {
          const percentage = getStockPercentage(variation.stock, product.minStock);
          const statusBadge = getStatusBadge(
            variation.stock === 0 ? 'critical' : 
            variation.stock < product.minStock * 0.5 ? 'warning' : 'normal'
          );
          const totalValue = variation.stock * variation.price;
          
          exportRows.push({
            'Kode Produk': product.code,
            'Nama Produk': product.material,
            'Kategori': product.category,
            'Ukuran': variation.size || '-',
            'Warna': variation.color || '-',
            'Stok Saat Ini': variation.stock || 0,
            'Satuan': product.unit,
            'Stok Minimal': product.minStock,
            'Stok Maksimal': product.maxStock,
            'Persentase Stok': `${percentage}%`,
            'Status': statusBadge.label,
            'Harga Satuan (Rp)': variation.price || 0,
            'Total Nilai (Rp)': totalValue,
            'Supplier': product.supplier || '-',
            'Lokasi': product.location || '-',
            'Terakhir Restock': product.lastRestock || '-',
            'Catatan': product.notes || '-'
          });
        });
      } else {
        const percentage = getStockPercentage(product.currentStock, product.minStock);
        const statusBadge = getStatusBadge(product.status);
        const totalValue = product.currentStock * product.price;
        
        exportRows.push({
          'Kode Produk': product.code,
          'Nama Produk': product.material,
          'Kategori': product.category,
          'Ukuran': '-',
          'Warna': '-',
          'Stok Saat Ini': product.currentStock,
          'Satuan': product.unit,
          'Stok Minimal': product.minStock,
          'Stok Maksimal': product.maxStock,
          'Persentase Stok': `${percentage}%`,
          'Status': statusBadge.label,
          'Harga Satuan (Rp)': product.price,
          'Total Nilai (Rp)': totalValue,
          'Supplier': product.supplier || '-',
          'Lokasi': product.location || '-',
          'Terakhir Restock': product.lastRestock || '-',
          'Catatan': product.notes || '-'
        });
      }
    });
    
    return exportRows;
  };

  // Export to Excel dengan per variasi
  const exportToExcel = () => {
    const exportData = getVariationExportData();
    
    if (exportData.length === 0) {
      alert('Tidak ada data untuk diekspor!');
      return;
    }
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    const colWidths = [
      { wch: 15 }, { wch: 30 }, { wch: 15 }, { wch: 12 }, { wch: 15 },
      { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 12 },
      { wch: 12 }, { wch: 15 }, { wch: 18 }, { wch: 25 }, { wch: 15 },
      { wch: 15 }, { wch: 30 }
    ];
    ws['!cols'] = colWidths;
    
    const totalStockValue = exportData.reduce((sum, row) => sum + (row['Total Nilai (Rp)'] || 0), 0);
    const totalItemsExport = exportData.length;
    const totalCritical = exportData.filter(row => row['Status'] === 'Kritis').length;
    const totalWarning = exportData.filter(row => row['Status'] === 'Menipis').length;
    const totalNormal = exportData.filter(row => row['Status'] === 'Normal').length;
    
    const summaryData = [
      { 'A': 'Ringkasan Laporan Stok Material (Per Variasi)', 'B': '' },
      { 'A': 'Tanggal Laporan', 'B': new Date().toLocaleDateString('id-ID') },
      { 'A': 'Waktu Laporan', 'B': new Date().toLocaleTimeString('id-ID') },
      { 'A': '', 'B': '' },
      { 'A': 'Total Variasi', 'B': totalItemsExport },
      { 'A': 'Total Nilai Inventaris', 'B': formatCurrencyIDR(totalStockValue) },
      { 'A': '', 'B': '' },
      { 'A': 'Status Stok', 'B': '' },
      { 'A': 'Kritis (<25%)', 'B': totalCritical },
      { 'A': 'Menipis (25%-49%)', 'B': totalWarning },
      { 'A': 'Normal (≥50%)', 'B': totalNormal },
      { 'A': '', 'B': '' },
      { 'A': 'Kategori', 'B': '' }
    ];
    
    categories.forEach(cat => {
      const count = exportData.filter(row => row['Kategori'] === cat).length;
      summaryData.push({ 'A': cat, 'B': `${count} variasi` });
    });
    
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    wsSummary['!cols'] = [{ wch: 30 }, { wch: 25 }];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Stok Material');
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan');
    
    const fileName = `Laporan_Stok_Material_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    alert(`✅ Berhasil mengekspor ${totalItemsExport} variasi ke file Excel!`);
  };

  // Export to CSV dengan per variasi
  const exportToCSV = () => {
    const exportData = getVariationExportData();
    
    if (exportData.length === 0) {
      alert('Tidak ada data untuk diekspor!');
      return;
    }
    
    const headers = [
      'Kode Produk', 'Nama Produk', 'Kategori', 'Ukuran', 'Warna',
      'Stok Saat Ini', 'Satuan', 'Stok Minimal', 'Stok Maksimal',
      'Persentase Stok', 'Status', 'Harga Satuan (Rp)', 'Total Nilai (Rp)',
      'Supplier', 'Lokasi', 'Terakhir Restock', 'Catatan'
    ];
    
    const rows = exportData.map(row => [
      row['Kode Produk'],
      row['Nama Produk'],
      row['Kategori'],
      row['Ukuran'],
      row['Warna'],
      row['Stok Saat Ini'],
      row['Satuan'],
      row['Stok Minimal'],
      row['Stok Maksimal'],
      row['Persentase Stok'],
      row['Status'],
      row['Harga Satuan (Rp)'],
      row['Total Nilai (Rp)'],
      row['Supplier'],
      row['Lokasi'],
      row['Terakhir Restock'],
      row['Catatan']
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const fileName = `Laporan_Stok_Material_${new Date().toISOString().split('T')[0]}.csv`;
    saveAs(blob, fileName);
    
    alert(`✅ Berhasil mengekspor ${exportData.length} variasi ke file CSV!`);
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

  // ================== MODAL-MODAL DENGAN BACKGROUND PUTIH/BLUR ==================

  // Modal Tambah Kategori
  const AddCategoryModal = () => {
    if (!showAddCategoryModal) return null;
    
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-purple-50 to-white">
            <div className="flex items-center gap-2">
              <Tag size={20} className="text-purple-600" />
              <h3 className="font-bold text-lg text-gray-800">Tambah Kategori Baru</h3>
            </div>
            <button onClick={() => setShowAddCategoryModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
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
                placeholder="Contoh: Kemasan, Perlengkapan, dll"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">Kategori akan muncul di dropdown pilihan</p>
            </div>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
            <button onClick={() => setShowAddCategoryModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">Batal</button>
            <button onClick={handleAddCategory} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
              Simpan Kategori
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Modal Kelola Kategori
  const ManageCategoriesModal = () => {
    if (!showManageCategoriesModal) return null;
    
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-purple-50 to-white sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <Tag size={20} className="text-purple-600" />
              <h3 className="font-bold text-lg text-gray-800">Kelola Kategori</h3>
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
                  <p className="text-sm text-gray-600">Daftar semua kategori yang tersedia</p>
                  <button
                    onClick={openAddCategoryFromManage}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700"
                  >
                    <Plus size={14} /> Tambah
                  </button>
                </div>
                <div className="space-y-2">
                  {categories.map((category) => {
                    const itemCount = stockItems.filter(item => item.category === category).length;
                    return (
                      <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">{category}</p>
                          <p className="text-xs text-gray-500">{itemCount} material</p>
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
                            disabled={itemCount > 0}
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
    );
  };

  // Modal Tambah Satuan
  const AddUnitModal = () => {
    if (!showAddUnitModal) return null;
    
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-cyan-50 to-white">
            <div className="flex items-center gap-2">
              <Ruler size={20} className="text-cyan-600" />
              <h3 className="font-bold text-lg text-gray-800">Tambah Satuan Baru</h3>
            </div>
            <button onClick={() => setShowAddUnitModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Satuan *</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                value={newUnitName}
                onChange={(e) => setNewUnitName(e.target.value)}
                placeholder="Contoh: cm, box, pack, dll"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">Satuan akan muncul di dropdown pilihan</p>
            </div>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
            <button onClick={() => setShowAddUnitModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">Batal</button>
            <button onClick={handleAddUnit} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700">
              Simpan Satuan
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Modal Kelola Satuan
  const ManageUnitsModal = () => {
    if (!showManageUnitsModal) return null;
    
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-cyan-50 to-white sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <Ruler size={20} className="text-cyan-600" />
              <h3 className="font-bold text-lg text-gray-800">Kelola Satuan</h3>
            </div>
            <button onClick={() => { setShowManageUnitsModal(false); setEditingUnit(null); }} className="p-1 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {editingUnit ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Edit Satuan</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                  value={editUnitName}
                  onChange={(e) => setEditUnitName(e.target.value)}
                  placeholder="Nama satuan"
                  autoFocus
                />
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => { setEditingUnit(null); setEditUnitName(''); }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleEditUnit}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-gray-600">Daftar semua satuan yang tersedia</p>
                  <button
                    onClick={openAddUnitFromManage}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700"
                  >
                    <Plus size={14} /> Tambah
                  </button>
                </div>
                <div className="space-y-2">
                  {units.map((unit) => {
                    const itemCount = stockItems.filter(item => item.unit === unit).length;
                    return (
                      <div key={unit} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">{unit}</p>
                          <p className="text-xs text-gray-500">{itemCount} material</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditUnitModal(unit)}
                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Edit Satuan"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteUnit(unit)}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Hapus Satuan"
                            disabled={itemCount > 0}
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
            <button onClick={() => { setShowManageUnitsModal(false); setEditingUnit(null); }} className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Modal Tambah Supplier
  const AddSupplierModal = () => {
    if (!showAddSupplierModal) return null;
    
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-orange-50 to-white">
            <div className="flex items-center gap-2">
              <Truck size={20} className="text-orange-600" />
              <h3 className="font-bold text-lg text-gray-800">Tambah Supplier Baru</h3>
            </div>
            <button onClick={() => setShowAddSupplierModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Supplier *</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                value={newSupplierName}
                onChange={(e) => setNewSupplierName(e.target.value)}
                placeholder="Contoh: PT. Supplier Utama"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" 
                value={newSupplierContact}
                onChange={(e) => setNewSupplierContact(e.target.value)}
                placeholder="Nama kontak"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" 
                value={newSupplierPhone}
                onChange={(e) => setNewSupplierPhone(e.target.value)}
                placeholder="Nomor telepon"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" 
                value={newSupplierEmail}
                onChange={(e) => setNewSupplierEmail(e.target.value)}
                placeholder="email@supplier.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
              <textarea 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" 
                rows="2"
                value={newSupplierAddress}
                onChange={(e) => setNewSupplierAddress(e.target.value)}
                placeholder="Alamat lengkap supplier"
              />
            </div>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
            <button onClick={() => setShowAddSupplierModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">Batal</button>
            <button onClick={handleAddSupplier} className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700">
              Simpan Supplier
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Modal Kelola Supplier
  const ManageSuppliersModal = () => {
    if (!showManageSuppliersModal) return null;
    
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-orange-50 to-white sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <Truck size={20} className="text-orange-600" />
              <h3 className="font-bold text-lg text-gray-800">Kelola Supplier</h3>
            </div>
            <button onClick={() => { setShowManageSuppliersModal(false); setEditingSupplier(null); }} className="p-1 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {editingSupplier ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Supplier *</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  value={editSupplierData.name}
                  onChange={(e) => setEditSupplierData({...editSupplierData, name: e.target.value})}
                  placeholder="Nama supplier"
                />
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" 
                    value={editSupplierData.contact}
                    onChange={(e) => setEditSupplierData({...editSupplierData, contact: e.target.value})}
                  />
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" 
                    value={editSupplierData.phone}
                    onChange={(e) => setEditSupplierData({...editSupplierData, phone: e.target.value})}
                  />
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" 
                    value={editSupplierData.email}
                    onChange={(e) => setEditSupplierData({...editSupplierData, email: e.target.value})}
                  />
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" 
                    rows="2"
                    value={editSupplierData.address}
                    onChange={(e) => setEditSupplierData({...editSupplierData, address: e.target.value})}
                  />
                </div>
                <div className="flex gap-2 mt-5">
                  <button
                    onClick={() => { setEditingSupplier(null); setEditSupplierData({ name: '', contact: '', phone: '', email: '', address: '' }); }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleEditSupplier}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-gray-600">Daftar semua supplier yang tersedia</p>
                  <button
                    onClick={openAddSupplierFromManage}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700"
                  >
                    <Plus size={14} /> Tambah
                  </button>
                </div>
                <div className="space-y-2">
                  {suppliers.map((supplier) => {
                    const itemCount = stockItems.filter(item => item.supplier === supplier).length;
                    const savedDetail = localStorage.getItem(`supplier_detail_${supplier}`);
                    let detail = null;
                    if (savedDetail) {
                      detail = JSON.parse(savedDetail);
                    }
                    return (
                      <div key={supplier} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">{supplier}</p>
                          <p className="text-xs text-gray-500">{itemCount} material</p>
                          {detail && detail.phone && (
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                              <Phone size={10} /> {detail.phone}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditSupplierModal(supplier)}
                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Edit Supplier"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteSupplier(supplier)}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Hapus Supplier"
                            disabled={itemCount > 0}
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
            <button onClick={() => { setShowManageSuppliersModal(false); setEditingSupplier(null); }} className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ================== MODAL TAMBAH/EDIT MATERIAL ==================
  const StockFormModal = ({ isOpen, onClose, onSubmit, title }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <Warehouse size={22} className="text-blue-600" />
              <h3 className="font-bold text-xl text-gray-800">{title}</h3>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={22} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Kode Material <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                  value={formData.code} 
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} 
                  placeholder="Contoh: KAT-30S" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nama Material <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                  value={formData.material} 
                  onChange={(e) => setFormData({...formData, material: e.target.value})} 
                  placeholder="Contoh: Kain Katun 30s" 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
                <div className="flex gap-2">
                  <select 
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowManageCategoriesModal(true)}
                    className="px-3 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-1 whitespace-nowrap transition-colors"
                    title="Kelola Kategori"
                  >
                    <Tag size={16} /> Kelola
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Satuan</label>
                <div className="flex gap-2">
                  <select 
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    value={formData.unit} 
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowManageUnitsModal(true)}
                    className="px-3 py-2.5 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 flex items-center gap-1 whitespace-nowrap transition-colors"
                    title="Kelola Satuan"
                  >
                    <Ruler size={16} /> Kelola
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Stok Saat Ini
                </label>
                <input 
                  type="number" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                  value={formData.currentStock} 
                  onChange={(e) => setFormData({...formData, currentStock: parseInt(e.target.value) || 0})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Stok Minimal
                </label>
                <input 
                  type="number" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                  value={formData.minStock} 
                  onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value) || 0})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Stok Maksimal
                </label>
                <input 
                  type="number" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                  value={formData.maxStock} 
                  onChange={(e) => setFormData({...formData, maxStock: parseInt(e.target.value) || 0})} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Harga Satuan (Rp)
                </label>
                <input 
                  type="text"
                  inputMode="numeric"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                  value={formatPriceDisplay(formData.price)}
                  onChange={(e) => setFormData({...formData, price: parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0})} 
                  placeholder="Contoh: 150000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Supplier</label>
                <div className="flex gap-2">
                  <select 
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    value={formData.supplier} 
                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                  >
                    <option value="">Pilih Supplier</option>
                    {suppliers.map(sup => (
                      <option key={sup} value={sup}>{sup}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowManageSuppliersModal(true)}
                    className="px-3 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 flex items-center gap-1 whitespace-nowrap transition-colors"
                    title="Kelola Supplier"
                  >
                    <Truck size={16} /> Kelola
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Lokasi Penyimpanan
              </label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                value={formData.location} 
                onChange={(e) => setFormData({...formData, location: e.target.value})} 
                placeholder="Contoh: Gudang A-01" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Catatan
              </label>
              <textarea 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y" 
                rows="3" 
                value={formData.notes} 
                onChange={(e) => setFormData({...formData, notes: e.target.value})} 
                placeholder="Catatan tambahan tentang material ini..." 
              />
            </div>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl sticky bottom-0">
            <button onClick={onClose} className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
              Batal
            </button>
            <button onClick={onSubmit} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
              Simpan Material
            </button>
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
    
    const supplierDetail = localStorage.getItem(`supplier_detail_${selectedItem.supplier}`);
    const supplierInfo = supplierDetail ? JSON.parse(supplierDetail) : null;
    
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <Package size={20} className="text-blue-600" />
              <h3 className="font-bold text-lg text-gray-800">Detail Material</h3>
            </div>
            <button onClick={() => { setShowDetailModal(false); setSelectedItem(null); setRestockAmount(0); }} className="p-1 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
            
            <div className="border-t pt-3">
              <div className="flex items-center gap-2 mb-2">
                <Truck size={16} className="text-orange-600" />
                <p className="text-sm font-medium text-gray-700">Informasi Supplier</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="font-medium text-gray-800">{selectedItem.supplier || '-'}</p>
                {supplierInfo && (
                  <div className="mt-2 space-y-1 text-xs text-gray-600">
                    {supplierInfo.contact && <p>Contact: {supplierInfo.contact}</p>}
                    {supplierInfo.phone && <p>Telp: {supplierInfo.phone}</p>}
                    {supplierInfo.email && <p>Email: {supplierInfo.email}</p>}
                    {supplierInfo.address && <p>Alamat: {supplierInfo.address}</p>}
                  </div>
                )}
              </div>
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
          
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
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
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* ==================== MAIN CONTENT WITH SCALE TRANSFORM ==================== */}
      <div 
        className="transition-all duration-300"
        style={{
          transform: 'scale(0.85)',
          transformOrigin: 'top left',
          width: '117.65%',
          minHeight: '100vh',
          paddingBottom: '100px'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Manajemen Stok Material</h1>
                <p className="text-sm text-gray-500 mt-1">Kelola stok bahan baku dan aksesoris produksi</p>
              </div>
              <div className="flex gap-3">
                <button onClick={exportToExcel} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                  <Download size={16} /> Export Excel
                </button>
                <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  <FileText size={16} /> Export CSV
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
                  <option value="Semua">Semua Kategori</option>
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
          
          <AddCategoryModal />
          <ManageCategoriesModal />
          <AddUnitModal />
          <ManageUnitsModal />
          <AddSupplierModal />
          <ManageSuppliersModal />
        </div>
      </div>
    </div>
  );
}