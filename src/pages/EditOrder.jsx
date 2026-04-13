// src/pages/EditOrder.jsx
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
  AlertCircle,
  Camera,
  Eye,
  Upload,
  X,
  ZoomIn,
  RotateCw,
  CheckCircle,
  Download,
  ChevronLeft,
  ChevronRight,
  Expand,
  Maximize2,
  FileImage,
  Clock,
  Edit2,
  Trash,
  Image,
  MessageSquare,
  PlusCircle,
  Tag,
  Edit,
  Users,
  Phone,
  MapPin,
  Mail,
  List,
  FolderOpen
} from 'lucide-react';
import { syncOrderWithJobs } from '../utils/jobOrderSync';

// Helper untuk ZoomOut (karena tidak diimport)
const ZoomOut = (props) => <RotateCw {...props} />;

export default function EditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalStatus, setOriginalStatus] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [expandedPhotoSection, setExpandedPhotoSection] = useState(false);
  
  // ================== STATE UNTUK PELANGGAN (CUSTOMER) ==================
  const [customers, setCustomers] = useState([]);
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
  
  // ================== STATE UNTUK PRODUK ==================
  const [products, setProducts] = useState([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showProductListModal, setShowProductListModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // State untuk form produk - DIPISAHKAN
  const [productNameInput, setProductNameInput] = useState('');
  const [productBasePriceInput, setProductBasePriceInput] = useState('');
  const [productCategoryInput, setProductCategoryInput] = useState('');
  
  // State untuk variasi - DIPISAHKAN (untuk tambah produk)
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
  
  // Photo State
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoZoom, setPhotoZoom] = useState(1);
  const [photoRotation, setPhotoRotation] = useState(0);
  const [orderPhotos, setOrderPhotos] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [newPhotoDescription, setNewPhotoDescription] = useState('');
  
  const fileInputRef = React.useRef(null);
  const previewRef = React.useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    customerEmail: '',
    orderDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: 'cutting',
    notes: '',
    items: [{ 
      product: '', 
      qty: 1, 
      price: 0, 
      productName: '', 
      size: '', 
      color: '', 
      variantId: ''
    }]
  });

  // ================== FUNGSI UNTUK PELANGGAN (CUSTOMER) ==================
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

    setFormData(prev => ({
      ...prev,
      customerName: customerToAdd.name,
      customerPhone: customerToAdd.phone || '',
      customerAddress: customerToAdd.address || '',
      customerEmail: customerToAdd.email || ''
    }));
    
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
    
    if (formData.customerName === editingCustomer.name) {
      setFormData(prev => ({
        ...prev,
        customerName: customerFormData.name,
        customerPhone: customerFormData.phone || '',
        customerAddress: customerFormData.address || '',
        customerEmail: customerFormData.email || ''
      }));
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

  const handleSelectCustomer = (customerId) => {
    const selectedCustomer = customers.find(c => c.id === parseInt(customerId));
    if (selectedCustomer) {
      setFormData(prev => ({
        ...prev,
        customerName: selectedCustomer.name,
        customerPhone: selectedCustomer.phone || '',
        customerAddress: selectedCustomer.address || '',
        customerEmail: selectedCustomer.email || ''
      }));
    }
  };

  // ================== FUNGSI UNTUK KATEGORI PRODUK ==================
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

  // ================== FUNGSI UNTUK PRODUK ==================
  
  // Load categories dari localStorage
  useEffect(() => {
    const savedCategories = localStorage.getItem('productCategories');
    if (savedCategories) {
      setProductCategories(JSON.parse(savedCategories));
    }
    loadCustomers();
  }, []);

  // Load products dari localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Produk dengan variasi lengkap
      const defaultProducts = [
        { 
          id: 1, 
          name: 'Kemeja Pria Slimfit', 
          basePrice: 150000, 
          category: 'Kemeja', 
          variations: [
            { id: '1-S-Merah', size: 'S', color: 'Merah', price: 150000, stock: 50 },
            { id: '1-S-Biru', size: 'S', color: 'Biru', price: 150000, stock: 45 },
            { id: '1-S-Hitam', size: 'S', color: 'Hitam', price: 150000, stock: 40 },
            { id: '1-M-Merah', size: 'M', color: 'Merah', price: 155000, stock: 60 },
            { id: '1-M-Biru', size: 'M', color: 'Biru', price: 155000, stock: 55 },
            { id: '1-M-Hitam', size: 'M', color: 'Hitam', price: 155000, stock: 50 },
            { id: '1-L-Merah', size: 'L', color: 'Merah', price: 160000, stock: 40 },
            { id: '1-L-Biru', size: 'L', color: 'Biru', price: 160000, stock: 35 },
            { id: '1-L-Hitam', size: 'L', color: 'Hitam', price: 160000, stock: 30 },
            { id: '1-XL-Merah', size: 'XL', color: 'Merah', price: 165000, stock: 25 },
            { id: '1-XL-Biru', size: 'XL', color: 'Biru', price: 165000, stock: 20 },
            { id: '1-XL-Hitam', size: 'XL', color: 'Hitam', price: 165000, stock: 15 }
          ]
        },
        { 
          id: 2, 
          name: 'Celana Jeans Denim', 
          basePrice: 250000, 
          category: 'Celana', 
          variations: [
            { id: '2-28-Biru', size: '28', color: 'Biru Tua', price: 250000, stock: 30 },
            { id: '2-29-Biru', size: '29', color: 'Biru Tua', price: 255000, stock: 28 },
            { id: '2-30-Biru', size: '30', color: 'Biru Tua', price: 260000, stock: 35 },
            { id: '2-31-Biru', size: '31', color: 'Biru Tua', price: 265000, stock: 32 },
            { id: '2-32-Biru', size: '32', color: 'Biru Tua', price: 270000, stock: 30 },
            { id: '2-33-Biru', size: '33', color: 'Biru Tua', price: 275000, stock: 25 },
            { id: '2-34-Biru', size: '34', color: 'Biru Tua', price: 280000, stock: 20 },
            { id: '2-28-Hitam', size: '28', color: 'Hitam', price: 250000, stock: 25 },
            { id: '2-29-Hitam', size: '29', color: 'Hitam', price: 255000, stock: 23 },
            { id: '2-30-Hitam', size: '30', color: 'Hitam', price: 260000, stock: 28 },
            { id: '2-31-Hitam', size: '31', color: 'Hitam', price: 265000, stock: 25 },
            { id: '2-32-Hitam', size: '32', color: 'Hitam', price: 270000, stock: 22 },
            { id: '2-33-Hitam', size: '33', color: 'Hitam', price: 275000, stock: 18 },
            { id: '2-34-Hitam', size: '34', color: 'Hitam', price: 280000, stock: 15 }
          ]
        },
        { 
          id: 3, 
          name: 'Jaket Hoodie', 
          basePrice: 300000, 
          category: 'Jaket', 
          variations: [
            { id: '3-S-Abu', size: 'S', color: 'Abu-abu', price: 300000, stock: 40 },
            { id: '3-S-Hitam', size: 'S', color: 'Hitam', price: 300000, stock: 38 },
            { id: '3-S-Navy', size: 'S', color: 'Navy', price: 305000, stock: 35 },
            { id: '3-M-Abu', size: 'M', color: 'Abu-abu', price: 310000, stock: 45 },
            { id: '3-M-Hitam', size: 'M', color: 'Hitam', price: 310000, stock: 42 },
            { id: '3-M-Navy', size: 'M', color: 'Navy', price: 315000, stock: 40 },
            { id: '3-L-Abu', size: 'L', color: 'Abu-abu', price: 320000, stock: 35 },
            { id: '3-L-Hitam', size: 'L', color: 'Hitam', price: 320000, stock: 32 },
            { id: '3-L-Navy', size: 'L', color: 'Navy', price: 325000, stock: 30 },
            { id: '3-XL-Abu', size: 'XL', color: 'Abu-abu', price: 330000, stock: 25 },
            { id: '3-XL-Hitam', size: 'XL', color: 'Hitam', price: 330000, stock: 22 },
            { id: '3-XL-Navy', size: 'XL', color: 'Navy', price: 335000, stock: 20 }
          ]
        },
        { 
          id: 4, 
          name: 'Kemeja Wanita Formal', 
          basePrice: 180000, 
          category: 'Kemeja', 
          variations: [
            { id: '4-S-Putih', size: 'S', color: 'Putih', price: 180000, stock: 50 },
            { id: '4-S-Cream', size: 'S', color: 'Cream', price: 180000, stock: 45 },
            { id: '4-S-Pink', size: 'S', color: 'Pink', price: 185000, stock: 40 },
            { id: '4-M-Putih', size: 'M', color: 'Putih', price: 185000, stock: 55 },
            { id: '4-M-Cream', size: 'M', color: 'Cream', price: 185000, stock: 50 },
            { id: '4-M-Pink', size: 'M', color: 'Pink', price: 190000, stock: 45 },
            { id: '4-L-Putih', size: 'L', color: 'Putih', price: 190000, stock: 40 },
            { id: '4-L-Cream', size: 'L', color: 'Cream', price: 190000, stock: 35 },
            { id: '4-L-Pink', size: 'L', color: 'Pink', price: 195000, stock: 30 }
          ]
        },
        { 
          id: 5, 
          name: 'Blouse Wanita', 
          basePrice: 120000, 
          category: 'Blouse', 
          variations: [
            { id: '5-S-Kuning', size: 'S', color: 'Kuning', price: 120000, stock: 60 },
            { id: '5-S-Merah', size: 'S', color: 'Merah', price: 120000, stock: 55 },
            { id: '5-S-Ungu', size: 'S', color: 'Ungu', price: 125000, stock: 50 },
            { id: '5-M-Kuning', size: 'M', color: 'Kuning', price: 125000, stock: 65 },
            { id: '5-M-Merah', size: 'M', color: 'Merah', price: 125000, stock: 60 },
            { id: '5-M-Ungu', size: 'M', color: 'Ungu', price: 130000, stock: 55 },
            { id: '5-L-Kuning', size: 'L', color: 'Kuning', price: 130000, stock: 50 },
            { id: '5-L-Merah', size: 'L', color: 'Merah', price: 130000, stock: 45 },
            { id: '5-L-Ungu', size: 'L', color: 'Ungu', price: 135000, stock: 40 }
          ]
        },
        { 
          id: 6, 
          name: 'Celana Chino', 
          basePrice: 200000, 
          category: 'Celana', 
          variations: [
            { id: '6-28-Khaki', size: '28', color: 'Khaki', price: 200000, stock: 35 },
            { id: '6-29-Khaki', size: '29', color: 'Khaki', price: 205000, stock: 32 },
            { id: '6-30-Khaki', size: '30', color: 'Khaki', price: 210000, stock: 40 },
            { id: '6-31-Khaki', size: '31', color: 'Khaki', price: 215000, stock: 38 },
            { id: '6-32-Khaki', size: '32', color: 'Khaki', price: 220000, stock: 35 },
            { id: '6-33-Khaki', size: '33', color: 'Khaki', price: 225000, stock: 30 },
            { id: '6-34-Khaki', size: '34', color: 'Khaki', price: 230000, stock: 25 },
            { id: '6-28-Coklat', size: '28', color: 'Coklat', price: 200000, stock: 30 },
            { id: '6-29-Coklat', size: '29', color: 'Coklat', price: 205000, stock: 28 },
            { id: '6-30-Coklat', size: '30', color: 'Coklat', price: 210000, stock: 35 },
            { id: '6-31-Coklat', size: '31', color: 'Coklat', price: 215000, stock: 32 },
            { id: '6-32-Coklat', size: '32', color: 'Coklat', price: 220000, stock: 30 },
            { id: '6-33-Coklat', size: '33', color: 'Coklat', price: 225000, stock: 25 },
            { id: '6-34-Coklat', size: '34', color: 'Coklat', price: 230000, stock: 20 }
          ]
        }
      ];
      setProducts(defaultProducts);
      localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
  }, []);

  // Fungsi untuk tambah produk baru
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
    
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
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

  // Fungsi untuk edit produk
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
    const updatedItems = formData.items.map(item => {
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
    setFormData(prev => ({ ...prev, items: updatedItems }));
    
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
      
      // Hapus produk yang terpilih dari items
      const updatedItems = formData.items.filter(item => item.product !== productToDelete.id.toString());
      if (updatedItems.length === 0) {
        setFormData(prev => ({
          ...prev,
          items: [{ product: '', qty: 1, price: 0, productName: '', size: '', color: '', variantId: '' }]
        }));
      } else {
        setFormData(prev => ({ ...prev, items: updatedItems }));
      }
      
      alert(`✅ Produk "${productToDelete.name}" berhasil dihapus!`);
    }
  };

  // Status options
  const statusOptions = [
    { value: 'cutting', label: 'Potong', icon: '✂️', color: 'bg-amber-100 text-amber-800' },
    { value: 'sewing', label: 'Jahit', icon: '🧵', color: 'bg-orange-100 text-orange-800' },
    { value: 'finishing', label: 'Finishing', icon: '✨', color: 'bg-lime-100 text-lime-800' },
    { value: 'packing', label: 'Packing', icon: '📦', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'qc', label: 'QC', icon: '✅', color: 'bg-teal-100 text-teal-800' },
    { value: 'completed', label: 'Selesai', icon: '🎉', color: 'bg-green-100 text-green-800' },
    { value: 'delivered', label: 'Terkirim', icon: '🚚', color: 'bg-purple-100 text-purple-800' },
    { value: 'cancelled', label: 'Dibatalkan', icon: '❌', color: 'bg-red-100 text-red-800' },
  ];

  // Helper functions
  const formatCurrency = (value) => {
    const num = Number(value) || 0;
    return num.toLocaleString('id-ID');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatPriceDisplay = (price) => {
    if (!price) return '';
    const num = typeof price === 'string' ? parseInt(price.replace(/[^0-9]/g, '')) : price;
    if (!num) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
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

  // ================== PHOTO FUNCTIONS ==================
  const loadOrderPhotos = () => {
    const key = `order_photos_${id}`;
    const photos = JSON.parse(localStorage.getItem(key) || '[]');
    setOrderPhotos(photos);
    return photos;
  };

  const saveOrderPhotos = (photos) => {
    const key = `order_photos_${id}`;
    localStorage.setItem(key, JSON.stringify(photos));
    setOrderPhotos(photos);
  };

  const formatDateForFileName = () => {
    const now = new Date();
    return `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('id-ID', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Hanya file gambar yang diizinkan!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB!');
      return;
    }

    if (orderPhotos.length >= 20) {
      alert('Maksimal 20 foto untuk order ini!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview({
        url: e.target.result,
        name: file.name,
        size: file.size,
        type: file.type,
        description: ''
      });
    };
    reader.readAsDataURL(file);
  };

  const simulateUpload = (fileData) => {
    setUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      const newPhoto = {
        id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        url: fileData.url,
        name: `order_${id}_${formatDateForFileName()}.jpg`,
        timestamp: new Date().toISOString(),
        uploadedBy: 'Admin',
        size: fileData.size,
        description: fileData.description || '',
        status: 'uploaded',
        type: 'general'
      };

      const updatedPhotos = [...orderPhotos, newPhoto];
      saveOrderPhotos(updatedPhotos);
      setPhotoPreview(null);
      setNewPhotoDescription('');

      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        alert('Foto berhasil diupload!');
      }, 500);
    }, 1500);
  };

  const handleUpload = () => {
    if (!photoPreview) return;
    simulateUpload(photoPreview);
  };

  const handleRemovePhoto = (photoId) => {
    if (window.confirm('Hapus foto ini?')) {
      const updatedPhotos = orderPhotos.filter(photo => photo.id !== photoId);
      saveOrderPhotos(updatedPhotos);
    }
  };

  const handleAddDescription = (photoId, description) => {
    const updatedPhotos = orderPhotos.map(photo => 
      photo.id === photoId ? { ...photo, description } : photo
    );
    saveOrderPhotos(updatedPhotos);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const openPhotoPreview = (photo) => {
    setSelectedPhoto(photo);
    setPhotoZoom(1);
    setPhotoRotation(0);
    setShowPhotoPreview(true);
  };

  // ================== LOAD ORDER DATA ==================
  useEffect(() => {
    setTimeout(() => {
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const foundOrder = savedOrders.find(o => o.id === id);
      
      if (foundOrder) {
        let mappedStatus = foundOrder.status;
        if (mappedStatus === 'draft' || mappedStatus === 'processing' || mappedStatus === 'production') {
          mappedStatus = 'cutting';
        }
        
        // Map items dengan products yang ada
        const mappedItems = foundOrder.itemsDetail?.map(item => {
          // Cari product berdasarkan nama
          const foundProduct = products.find(p => p.name === item.product);
          return {
            product: foundProduct?.id?.toString() || '',
            qty: item.qty || 1,
            price: item.price || 0,
            productName: item.product || '',
            size: item.size || '',
            color: item.color || '',
            variantId: item.variantId || ''
          };
        }) || [{ 
          product: '', qty: 1, price: 0, productName: '', size: '', color: '', variantId: ''
        }];
        
        setFormData({
          customerName: foundOrder.customerName || '',
          customerPhone: foundOrder.customerPhone || '',
          customerAddress: foundOrder.customerAddress || '',
          customerEmail: foundOrder.customerEmail || '',
          orderDate: foundOrder.orderDate || new Date().toISOString().split('T')[0],
          dueDate: foundOrder.dueDate || '',
          status: mappedStatus,
          notes: foundOrder.notes || '',
          items: mappedItems,
          timeline: foundOrder.timeline || []
        });
        
        setOriginalStatus(mappedStatus);
      }
      
      loadOrderPhotos();
      setLoading(false);
    }, 500);
  }, [id, products]);

  // ================== HANDLE INPUT ==================
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
      items: [...prev.items, { 
        product: '', qty: 1, price: 0, productName: '', size: '', color: '', variantId: ''
      }]
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    
    if (!newItems[index]) {
      newItems[index] = { 
        product: '', qty: 1, price: 0, productName: '', size: '', color: '', variantId: ''
      };
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
    
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const handleSizeChange = (index, size) => {
    const newItems = [...formData.items];
    const selectedProduct = products.find(p => p.id === parseInt(newItems[index].product));
    
    newItems[index].size = size;
    newItems[index].color = '';
    newItems[index].variantId = '';
    
    if (selectedProduct && size) {
      const availableColors = selectedProduct.variations
        .filter(v => v.size === size)
        .map(v => v.color);
      
      const uniqueColors = [...new Set(availableColors)];
      if (uniqueColors.length === 1) {
        const color = uniqueColors[0];
        const variant = selectedProduct.variations.find(v => v.size === size && v.color === color);
        if (variant) {
          newItems[index].color = color;
          newItems[index].variantId = variant.id;
          newItems[index].price = variant.price;
        }
      }
    }
    
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const handleColorChange = (index, color) => {
    const newItems = [...formData.items];
    const selectedProduct = products.find(p => p.id === parseInt(newItems[index].product));
    
    if (selectedProduct && newItems[index].size && color) {
      const variant = selectedProduct.variations.find(
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
    
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const selectedProduct = (itemIndex) => {
    const productId = formData.items[itemIndex]?.product;
    return products.find(p => p.id === parseInt(productId));
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
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

  const handleJobUpdates = (order, oldStatus) => {
    const newStatus = order.status;
    const activeStatuses = ['cutting', 'sewing', 'finishing', 'packing', 'qc', 'completed', 'delivered'];
    
    if (newStatus === 'cancelled' && oldStatus !== 'cancelled') {
      const availableJobs = JSON.parse(localStorage.getItem('availableJobs') || '[]');
      const filteredJobs = availableJobs.filter(job => job.order_id !== order.id);
      localStorage.setItem('availableJobs', JSON.stringify(filteredJobs));
      
      const users = JSON.parse(localStorage.getItem('userData') || '[]');
      users.forEach(user => {
        const userJobs = JSON.parse(localStorage.getItem(`myJobs_${user.id}`) || '[]');
        const filteredUserJobs = userJobs.filter(job => job.order_id !== order.id);
        localStorage.setItem(`myJobs_${user.id}`, JSON.stringify(filteredUserJobs));
      });
    } else if (activeStatuses.includes(newStatus) && newStatus !== 'cancelled') {
      syncOrderWithJobs(order);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customerName || formData.customerName.trim() === '') {
      alert('Nama pelanggan harus diisi!');
      return;
    }

    const invalidItems = formData.items.filter(item => {
      return !item.product || !item.product.trim() || 
             !item.qty || item.qty < 1 ||
             !item.price || item.price <= 0;
    });

    if (invalidItems.length > 0) {
      alert('Periksa kembali item pesanan!');
      return;
    }

    setIsSubmitting(true);

    const cleanedItems = formData.items.map(item => ({
      product: item.productName || '',
      qty: item.qty || 1,
      price: item.price || 0,
      productName: item.productName || '',
      size: item.size || '',
      color: item.color || '',
      variantId: item.variantId || '',
      subtotal: (item.qty || 0) * (item.price || 0)
    }));

    const updatedOrder = {
      id: id,
      customerName: formData.customerName.trim(),
      customerPhone: formData.customerPhone.trim(),
      customerAddress: formData.customerAddress.trim(),
      customerEmail: formData.customerEmail.trim(),
      orderDate: formData.orderDate,
      dueDate: formData.dueDate || '',
      items: cleanedItems.length,
      totalAmount: calculateTotal(),
      status: formData.status || 'cutting',
      notes: formData.notes.trim(),
      itemsDetail: cleanedItems,
      timeline: formData.timeline || [],
      priority: 'sedang',
      updated_at: new Date().toISOString()
    };

    setTimeout(() => {
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = savedOrders.map(order => 
        order.id === id ? updatedOrder : order
      );
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      handleJobUpdates(updatedOrder, originalStatus);
      
      setIsSubmitting(false);
      alert('✅ Pesanan berhasil diperbarui!');
      navigate(`/orders/${id}`);
    }, 1500);
  };

  const handleCancel = () => {
    if (window.confirm('Batalkan perubahan?')) {
      navigate(`/orders/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data pesanan...</p>
        </div>
      </div>
    );
  }

  const currentStatus = statusOptions.find(s => s.value === formData.status) || statusOptions[0];
  const isOrderOverdue = isDeadlineOverdue(formData.dueDate);

  // ================== RENDER COMPONENT DENGAN SCALING 80% ==================
  return (
    <div className="scaled-container" style={{
      transform: 'scale(0.8)',
      transformOrigin: 'top center',
      width: '125%',
      marginLeft: '-12.5%',
      paddingBottom: '60px'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate(`/orders/${id}`)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Pesanan</h1>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-gray-500">ID: {id}</p>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${currentStatus.color}`}>
                    <span>{currentStatus.icon}</span>
                    {currentStatus.label}
                  </span>
                  {formData.dueDate && (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${isOrderOverdue ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}`}>
                      <Clock size={12} />
                      Jatuh Tempo: {formatDate(formData.dueDate)}
                      {isOrderOverdue && ' ⚠️ Terlambat!'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 2 Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Customer Info */}
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
                    <label className="block text-xs font-medium text-gray-500 mb-1">Pilih Pelanggan</label>
                    <div className="flex flex-col gap-2">
                      <select 
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        value={customers.find(c => c.name === formData.customerName)?.id || ''}
                        onChange={(e) => handleSelectCustomer(e.target.value)}
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
                        type="button"
                        onClick={() => setShowManageCustomersModal(true)} 
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"
                      >
                        <Users size={12} /> Kelola
                      </button>
                    </div>
                  </div>

                  {formData.customerName && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="font-medium text-blue-800 text-sm">{formData.customerName}</p>
                      <p className="text-xs text-blue-600 mt-0.5">{formData.customerAddress}</p>
                      <p className="text-xs text-blue-600">{formData.customerPhone}</p>
                      {formData.customerEmail && <p className="text-xs text-blue-600">{formData.customerEmail}</p>}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        <div className="flex items-center gap-1"><Calendar size={12} /> Tanggal Pesanan</div>
                      </label>
                      <input 
                        type="date" 
                        name="orderDate"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        value={formData.orderDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        <div className="flex items-center gap-1"><Clock size={12} /> Jatuh Tempo</div>
                      </label>
                      <input 
                        type="date" 
                        name="dueDate"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${isOrderOverdue ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                        value={formData.dueDate}
                        onChange={handleInputChange}
                      />
                      {formData.dueDate && isOrderOverdue && (
                        <p className="text-xs text-red-500 mt-1">⚠️ Telah melewati jatuh tempo!</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Status Pesanan</label>
                    <select 
                      name="status"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <optgroup label="Status Produksi">
                        <option value="cutting">✂️ Potong</option>
                        <option value="sewing">🧵 Jahit</option>
                        <option value="finishing">✨ Finishing</option>
                        <option value="packing">📦 Packing</option>
                        <option value="qc">✅ QC</option>
                      </optgroup>
                      <optgroup label="Status Akhir">
                        <option value="completed">🎉 Selesai</option>
                        <option value="delivered">🚚 Terkirim</option>
                        <option value="cancelled">❌ Dibatalkan</option>
                      </optgroup>
                    </select>
                    {formData.status !== originalStatus && (
                      <p className={`text-xs mt-1 ${formData.status === 'cancelled' ? 'text-red-500' : 'text-green-500'}`}>
                        {formData.status === 'cancelled' ? '⚠️ Jobs akan dihapus' : '✅ Jobs akan diupdate'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Catatan</label>
                    <textarea
                      name="notes"
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Catatan tambahan..."
                    />
                  </div>
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="font-semibold text-gray-800">Ringkasan Pesanan</h3>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Jumlah Item</span>
                    <span className="font-medium text-gray-800">{formData.items.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Kuantitas</span>
                    <span className="font-medium text-gray-800">
                      {formData.items.reduce((total, item) => total + (item.qty || 0), 0)} pcs
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Pembayaran</span>
                      <span className="text-xl font-bold text-blue-600">
                        Rp {formatCurrency(calculateTotal())}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Items */}
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
                      type="button"
                      onClick={() => setShowProductListModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      <List size={16} /> Kelola Produk
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowAddProductModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      <PlusCircle size={16} /> Produk Baru
                    </button>
                    <button 
                      type="button"
                      onClick={handleAddItem}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Plus size={16} />
                      Tambah Item
                    </button>
                  </div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-gray-100">
                  {formData.items.map((item, index) => {
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
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {item.productName}
                                </span>
                              )}
                            </div>
                          </div>
                          {formData.items.length > 1 && (
                            <button 
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>

                        {/* Size & Color - Dengan variasi produk */}
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

                        {/* Variant Info */}
                        <div className="flex flex-wrap gap-3 mt-2">
                          {item.variantId && product && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              <Package size={12} />
                              {product.name} - {item.size} / {item.color}
                            </span>
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
                      Total {formData.items.length} item • {formData.items.reduce((total, item) => total + (item.qty || 0), 0)} pcs
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Total Pembayaran</p>
                      <p className="text-2xl font-bold text-blue-600">
                        Rp {formatCurrency(calculateTotal())}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-5 py-4 border-t border-gray-200 bg-white flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={handleCancel}
                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Batalkan
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Simpan Perubahan
                      </>
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
        </form>

        {/* Photo Upload Section */}
        <div className="mt-8">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setExpandedPhotoSection(!expandedPhotoSection)}
              className="w-full px-5 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Camera size={18} className="text-blue-600" />
                <h3 className="font-semibold text-gray-800">Dokumentasi Foto</h3>
                <span className="text-xs text-gray-500">({orderPhotos.length} foto)</span>
              </div>
              {expandedPhotoSection ? <ChevronRight size={18} className="rotate-90" /> : <ChevronRight size={18} />}
            </button>

            {expandedPhotoSection && (
              <div className="p-5 border-t border-gray-100">
                {/* Upload Area */}
                <div className="mb-6 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <Upload className="text-blue-600" size={20} />
                  </div>
                  <h4 className="font-medium text-gray-800 mb-1">Upload Foto Dokumentasi</h4>
                  <p className="text-xs text-gray-500 mb-4">Format: JPG, PNG (maks. 5MB)</p>
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                  <button onClick={triggerFileInput} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                    Pilih Foto
                  </button>
                </div>

                {/* Photo Gallery */}
                {orderPhotos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {orderPhotos.map((photo) => (
                      <div key={photo.id} className="relative group">
                        <img
                          src={photo.url}
                          alt=""
                          className="w-full h-32 object-cover rounded-lg cursor-pointer"
                          onClick={() => openPhotoPreview(photo)}
                        />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleRemovePhoto(photo.id); }}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                        <div className="absolute bottom-1 left-1 right-1 bg-black/50 text-white text-xs p-1 rounded truncate">
                          {formatDateTime(photo.timestamp)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ================== MODAL DAFTAR PRODUK ================== */}
        {showProductListModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-green-50 to-white">
                <div className="flex items-center gap-2">
                  <Package size={20} className="text-green-600" />
                  <h3 className="font-bold text-lg text-gray-800">Daftar Produk</h3>
                </div>
                <button onClick={() => setShowProductListModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-gray-500">Total {products.length} produk</p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProductListModal(false);
                      setShowAddProductModal(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                  >
                    <Plus size={14} /> Tambah Produk Baru
                  </button>
                </div>
                
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-gray-800 text-lg">{product.name}</h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{product.category || 'Tanpa Kategori'}</span>
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">Harga Dasar: Rp {formatCurrency(product.basePrice)}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowProductListModal(false);
                              openEditProductModal(product);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Produk"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(product)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus Produk"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Tabel Variasi Produk */}
                      {product.variations && product.variations.length > 0 && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Ukuran</th>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Warna</th>
                                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600">Harga</th>
                                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600">Stok</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {product.variations.slice(0, 8).map((variant, idx) => (
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
                          {product.variations.length > 8 && (
                            <div className="px-4 py-2 text-center text-xs text-gray-500 bg-gray-50">
                              + {product.variations.length - 8} variasi lainnya
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {products.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                      <Package size={48} className="text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Belum ada produk</p>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProductListModal(false);
                          setShowAddProductModal(true);
                        }}
                        className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
                      >
                        Tambah Produk Pertama
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                <button onClick={() => setShowProductListModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================== MODAL TAMBAH PRODUK BARU ================== */}
        {showAddProductModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-green-50 to-white">
                <div className="flex items-center gap-2">
                  <PlusCircle size={20} className="text-green-600" />
                  <h3 className="font-bold text-lg text-gray-800">Tambah Produk Baru</h3>
                </div>
                <button onClick={() => setShowAddProductModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
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
                      title="Kelola Kategori"
                    >
                      <Tag size={14} /> Kelola
                    </button>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Variasi Produk (Ukuran & Warna)</label>
                  
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
                        type="button"
                        onClick={handleAddVariationSimple}
                        className="px-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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
                          <button type="button" onClick={() => handleRemoveVariationSimple(v.id)} className="text-red-500 hover:text-red-700">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <button onClick={() => setShowAddProductModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Batal</button>
                <button onClick={handleSaveNewProductSimple} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium">Simpan Produk</button>
              </div>
            </div>
          </div>
        )}

        {/* ================== MODAL EDIT PRODUK ================== */}
        {showEditProductModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-yellow-50 to-white">
                <div className="flex items-center gap-2">
                  <Edit2 size={20} className="text-yellow-600" />
                  <h3 className="font-bold text-lg text-gray-800">Edit Produk</h3>
                </div>
                <button onClick={() => setShowEditProductModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Nama Produk *</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent" 
                      value={productNameInput}
                      onChange={(e) => setProductNameInput(e.target.value)}
                      placeholder="Nama produk"
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
                      placeholder="Harga dasar"
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
                      title="Kelola Kategori"
                    >
                      <Tag size={14} /> Kelola
                    </button>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Variasi Produk (Ukuran & Warna)</label>
                  
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
                        type="button"
                        onClick={handleAddEditVariation}
                        className="px-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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
                          <button type="button" onClick={() => handleRemoveEditVariation(v.id)} className="text-red-500 hover:text-red-700 ml-2">
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
              
              <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <button onClick={() => setShowEditProductModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Batal</button>
                <button onClick={handleSaveEditedProduct} className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700">
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Tambah Kategori */}
        {showCategoryModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
              <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-purple-50 to-white">
                <div className="flex items-center gap-2">
                  <Tag size={20} className="text-purple-600" />
                  <h3 className="font-bold text-lg text-gray-800">Tambah Kategori Produk</h3>
                </div>
                <button onClick={() => setShowCategoryModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-5 space-y-4">
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
              
              <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                <button onClick={() => setShowCategoryModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Batal</button>
                <button onClick={handleAddCategory} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
                  Simpan Kategori
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Kelola Kategori */}
        {showManageCategoriesModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-purple-50 to-white">
                <div className="flex items-center gap-2">
                  <Tag size={20} className="text-purple-600" />
                  <h3 className="font-bold text-lg text-gray-800">Kelola Kategori Produk</h3>
                </div>
                <button onClick={() => { setShowManageCategoriesModal(false); setEditingCategory(null); }} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
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
                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => { setEditingCategory(null); setEditCategoryName(''); }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={handleEditCategory}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        Simpan Perubahan
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-sm text-gray-600">Daftar semua kategori produk yang tersedia</p>
                      <button
                        type="button"
                        onClick={openAddCategoryFromManage}
                        className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700"
                      >
                        <Plus size={12} /> Tambah
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
                                type="button"
                                onClick={() => openEditCategoryModal(category)}
                                className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                title="Edit Kategori"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                type="button"
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
              
              <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                <button onClick={() => { setShowManageCategoriesModal(false); setEditingCategory(null); }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Tambah Pelanggan */}
        {showAddCustomerModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
              <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-blue-600" />
                  <h3 className="font-bold text-lg text-gray-800">Tambah Pelanggan Baru</h3>
                </div>
                <button onClick={() => setShowAddCustomerModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-5 space-y-4">
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
              
              <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                <button onClick={() => setShowAddCustomerModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Batal</button>
                <button onClick={handleAddCustomer} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  Simpan Pelanggan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Kelola Pelanggan */}
        {showManageCustomersModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-blue-600" />
                  <h3 className="font-bold text-lg text-gray-800">Kelola Pelanggan</h3>
                </div>
                <button onClick={() => { setShowManageCustomersModal(false); setEditingCustomer(null); }} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
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
                    <div className="flex gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => { setEditingCustomer(null); setCustomerFormData({ name: '', phone: '', address: '', email: '', joinDate: new Date().toISOString().split('T')[0] }); }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={handleEditCustomer}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        Simpan Perubahan
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-sm text-gray-600">Daftar semua pelanggan yang tersedia</p>
                      <button
                        type="button"
                        onClick={openAddCustomerFromManage}
                        className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700"
                      >
                        <Plus size={12} /> Tambah
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
                                type="button"
                                onClick={() => openEditCustomerModal(customer)}
                                className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                title="Edit Pelanggan"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                type="button"
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
              
              <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                <button onClick={() => { setShowManageCustomersModal(false); setEditingCustomer(null); }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Photo Preview Modal */}
        {showPhotoPreview && selectedPhoto && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center text-white mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Preview Foto</h3>
                  <p className="text-sm text-gray-300">
                    {orderPhotos.findIndex(p => p.id === selectedPhoto.id) + 1} dari {orderPhotos.length} • {formatDateTime(selectedPhoto.timestamp)}
                  </p>
                </div>
                <button onClick={() => setShowPhotoPreview(false)} className="p-2 hover:bg-white/10 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 flex flex-col md:flex-row gap-6">
                <div className="flex-1 relative bg-gray-900 rounded-xl overflow-hidden min-h-[400px]">
                  <img
                    src={selectedPhoto.url}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    style={{
                      transform: `scale(${photoZoom}) rotate(${photoRotation}deg)`,
                      transition: 'transform 0.3s ease'
                    }}
                  />
                  
                  <button 
                    onClick={() => {
                      const currentIndex = orderPhotos.findIndex(p => p.id === selectedPhoto.id);
                      const prevIndex = currentIndex === 0 ? orderPhotos.length - 1 : currentIndex - 1;
                      setSelectedPhoto(orderPhotos[prevIndex]);
                      setPhotoZoom(1);
                      setPhotoRotation(0);
                    }} 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={() => {
                      const currentIndex = orderPhotos.findIndex(p => p.id === selectedPhoto.id);
                      const nextIndex = currentIndex === orderPhotos.length - 1 ? 0 : currentIndex + 1;
                      setSelectedPhoto(orderPhotos[nextIndex]);
                      setPhotoZoom(1);
                      setPhotoRotation(0);
                    }} 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                  >
                    <ChevronRight size={24} />
                  </button>

                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                    <button onClick={() => setPhotoZoom(prev => Math.min(prev + 0.25, 3))} className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70" disabled={photoZoom >= 3}>
                      <ZoomIn size={20} />
                    </button>
                    <button onClick={() => setPhotoZoom(prev => Math.max(prev - 0.25, 0.5))} className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70" disabled={photoZoom <= 0.5}>
                      <ZoomOut size={20} />
                    </button>
                    <button onClick={() => setPhotoRotation(prev => (prev + 90) % 360)} className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70">
                      <RotateCw size={20} />
                    </button>
                    <button onClick={() => {
                      const link = document.createElement('a');
                      link.href = selectedPhoto.url;
                      link.download = selectedPhoto.name || 'photo.jpg';
                      link.click();
                    }} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                      <Download size={20} />
                    </button>
                  </div>
                </div>

                <div className="w-full md:w-80 bg-gray-800 rounded-xl p-4">
                  <div className="mb-6">
                    <h4 className="text-white font-medium mb-2">Info Foto</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div><span className="text-gray-400">Upload oleh:</span> {selectedPhoto.uploadedBy}</div>
                      <div><span className="text-gray-400">Waktu:</span> {formatDateTime(selectedPhoto.timestamp)}</div>
                      <div><span className="text-gray-400">Ukuran:</span> {formatFileSize(selectedPhoto.size)}</div>
                    </div>
                  </div>
                  {selectedPhoto.description && (
                    <div className="mb-6">
                      <h4 className="text-white font-medium mb-2">Deskripsi</h4>
                      <p className="text-sm text-gray-300 bg-gray-700/50 p-3 rounded">{selectedPhoto.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}