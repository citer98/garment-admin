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
  PlusCircle
} from 'lucide-react';
import { syncOrderWithJobs } from '../utils/jobOrderSync';

export default function EditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalStatus, setOriginalStatus] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [expandedPhotoSection, setExpandedPhotoSection] = useState(false);
  
  // ================== STATE UNTUK PRODUK CUSTOM ==================
  const [products, setProducts] = useState([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  
  // State untuk form produk - DIPISAHKAN
  const [productNameInput, setProductNameInput] = useState('');
  const [productBasePriceInput, setProductBasePriceInput] = useState('');
  
  // State untuk variasi - DIPISAHKAN
  const [variationSizeInput, setVariationSizeInput] = useState('');
  const [variationColorInput, setVariationColorInput] = useState('');
  const [variationPriceInput, setVariationPriceInput] = useState('');
  const [tempVariationsList, setTempVariationsList] = useState([]);
  
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

  // Load products dari localStorage
  useEffect(() => {
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
      setProducts(defaultProducts);
      localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
  }, []);

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

  // ================== FUNGSI TAMBAH PRODUK BARU ==================
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
    
    // Reset input variasi
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
      category: 'Custom',
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
    
    // Reset semua state
    setProductNameInput('');
    setProductBasePriceInput('');
    setTempVariationsList([]);
    setVariationSizeInput('');
    setVariationColorInput('');
    setVariationPriceInput('');
    setShowAddProductModal(false);
    
    alert(`✅ Produk "${productToAdd.name}" berhasil ditambahkan!`);
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
        
        setFormData({
          customerName: foundOrder.customerName || '',
          customerPhone: foundOrder.customerPhone || '',
          customerAddress: foundOrder.customerAddress || '',
          customerEmail: foundOrder.customerEmail || '',
          orderDate: foundOrder.orderDate || new Date().toISOString().split('T')[0],
          dueDate: foundOrder.dueDate || '',
          status: mappedStatus,
          notes: foundOrder.notes || '',
          items: foundOrder.itemsDetail?.map(item => ({
            product: products.find(p => p.name === item.product)?.id?.toString() || '',
            qty: item.qty || 1,
            price: item.price || 0,
            productName: item.product || '',
            size: item.size || '',
            color: item.color || '',
            variantId: item.variantId || ''
          })) || [{ 
            product: '', qty: 1, price: 0, productName: '', size: '', color: '', variantId: ''
          }]
        });
        
        setOriginalStatus(mappedStatus);
      }
      
      loadOrderPhotos();
      setLoading(false);
    }, 500);
  }, [id]);

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
      product: item.product || '',
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

  // Photo Preview Modal Component
  const PhotoPreviewModal = () => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [allPhotos, setAllPhotos] = useState([]);

    useEffect(() => {
      if (selectedPhoto) {
        setAllPhotos(orderPhotos);
        const index = orderPhotos.findIndex(p => p.id === selectedPhoto.id);
        setCurrentPhotoIndex(index >= 0 ? index : 0);
      }
    }, [selectedPhoto, orderPhotos]);

    if (!showPhotoPreview || !selectedPhoto) return null;

    const currentPhoto = allPhotos[currentPhotoIndex] || selectedPhoto;

    const handlePrev = () => {
      setCurrentPhotoIndex(prev => prev === 0 ? allPhotos.length - 1 : prev - 1);
      setPhotoZoom(1);
      setPhotoRotation(0);
    };

    const handleNext = () => {
      setCurrentPhotoIndex(prev => prev === allPhotos.length - 1 ? 0 : prev + 1);
      setPhotoZoom(1);
      setPhotoRotation(0);
    };

    const handleZoomIn = () => setPhotoZoom(prev => Math.min(prev + 0.25, 3));
    const handleZoomOut = () => setPhotoZoom(prev => Math.max(prev - 0.25, 0.5));
    const handleRotate = () => setPhotoRotation(prev => (prev + 90) % 360);
    const handleDownload = () => {
      const link = document.createElement('a');
      link.href = currentPhoto.url;
      link.download = currentPhoto.name || 'photo.jpg';
      link.click();
    };

    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl max-h-[90vh] flex flex-col">
          <div className="flex justify-between items-center text-white mb-4">
            <div>
              <h3 className="text-lg font-semibold">Preview Foto</h3>
              <p className="text-sm text-gray-300">
                {currentPhotoIndex + 1} dari {allPhotos.length} • {formatDateTime(currentPhoto.timestamp)}
              </p>
            </div>
            <button onClick={() => setShowPhotoPreview(false)} className="p-2 hover:bg-white/10 rounded-full">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 flex flex-col md:flex-row gap-6">
            <div className="flex-1 relative bg-gray-900 rounded-xl overflow-hidden min-h-[400px]">
              <img
                src={currentPhoto.url}
                alt="Preview"
                className="w-full h-full object-contain"
                style={{
                  transform: `scale(${photoZoom}) rotate(${photoRotation}deg)`,
                  transition: 'transform 0.3s ease'
                }}
              />
              
              <button onClick={handlePrev} className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70">
                <ChevronLeft size={24} />
              </button>
              <button onClick={handleNext} className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70">
                <ChevronRight size={24} />
              </button>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                <button onClick={handleZoomIn} className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70" disabled={photoZoom >= 3}>
                  <ZoomIn size={20} />
                </button>
                <button onClick={handleZoomOut} className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70" disabled={photoZoom <= 0.5}>
                  <ZoomOut size={20} />
                </button>
                <button onClick={handleRotate} className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70">
                  <RotateCw size={20} />
                </button>
                <button onClick={handleDownload} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                  <Download size={20} />
                </button>
              </div>
            </div>

            <div className="w-full md:w-80 bg-gray-800 rounded-xl p-4">
              <div className="mb-6">
                <h4 className="text-white font-medium mb-2">Info Foto</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div><span className="text-gray-400">Upload oleh:</span> {currentPhoto.uploadedBy}</div>
                  <div><span className="text-gray-400">Waktu:</span> {formatDateTime(currentPhoto.timestamp)}</div>
                  <div><span className="text-gray-400">Ukuran:</span> {formatFileSize(currentPhoto.size)}</div>
                </div>
              </div>
              {currentPhoto.description && (
                <div className="mb-6">
                  <h4 className="text-white font-medium mb-2">Deskripsi</h4>
                  <p className="text-sm text-gray-300 bg-gray-700/50 p-3 rounded">{currentPhoto.description}</p>
                </div>
              )}
            </div>
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
          <p className="text-gray-600">Memuat data pesanan...</p>
        </div>
      </div>
    );
  }

  const currentStatus = statusOptions.find(s => s.value === formData.status) || statusOptions[0];
  const originalStatusObj = statusOptions.find(s => s.value === originalStatus) || statusOptions[0];
  const isOrderOverdue = isDeadlineOverdue(formData.dueDate);

  return (
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
                  <label className="block text-xs font-medium text-gray-500 mb-1">Nama Pelanggan *</label>
                  <input
                    type="text"
                    name="customerName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Telepon</label>
                  <input
                    type="text"
                    name="customerPhone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Alamat</label>
                  <textarea
                    name="customerAddress"
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                    value={formData.customerAddress}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                  <input
                    type="email"
                    name="customerEmail"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Tanggal Pesanan</label>
                    <input 
                      type="date" 
                      name="orderDate"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      value={formData.orderDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Jatuh Tempo</label>
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

                      {/* Size & Color */}
                      {product && (
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

      {/* ================== MODAL TAMBAH PRODUK - INLINE RENDERING ================== */}
      {/* ✅ PERBAIKAN: Modal di-render langsung di sini, bukan sebagai komponen terpisah */}
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
              {/* Informasi Dasar Produk */}
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
              
              {/* Tambah Variasi */}
              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Variasi Produk (Ukuran & Warna)</label>
                
                {/* Form Tambah Variasi */}
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
                      className="px-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                
                {/* Daftar Variasi yang Sudah Ditambahkan */}
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
            
            <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowAddProductModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Batal</button>
              <button onClick={handleSaveNewProductSimple} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium">Simpan Produk</button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Preview Modal */}
      <PhotoPreviewModal />
    </div>
  );
}