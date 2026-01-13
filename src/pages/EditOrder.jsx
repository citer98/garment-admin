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
  FileImage
} from 'lucide-react';
import { syncOrderWithJobs } from '../utils/jobOrderSync';

export default function EditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalStatus, setOriginalStatus] = useState('');
  
  // Photo Preview State
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoZoom, setPhotoZoom] = useState(1);
  const [photoRotation, setPhotoRotation] = useState(0);
  
  // Order photos state
  const [orderPhotos, setOrderPhotos] = useState([]);
  const [expandedPhotoSection, setExpandedPhotoSection] = useState(false);
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
  status: 'draft',
  notes: '',
  items: [{ product: '', qty: 1, price: 0, productName: '', size: '', color: '', variantId: '' }]
});

  // Data produk
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
      { id: '2-28-h', size: '28', color: 'Hitam', price: 250000, stock: 40 },
      { id: '2-30-h', size: '30', color: 'Hitam', price: 250000, stock: 35 },
      { id: '2-32-h', size: '32', color: 'Hitam', price: 250000, stock: 25 },
      { id: '2-30-b', size: '30', color: 'Biru', price: 255000, stock: 30 },
      { id: '2-32-b', size: '32', color: 'Biru', price: 255000, stock: 20 },
    ]
  },
  { 
    id: 3, 
    name: 'Jaket Hoodie', 
    basePrice: 300000, 
    category: 'Jaket',
    variations: [
      { id: '3-m-h', size: 'M', color: 'Hitam', price: 300000, stock: 25 },
      { id: '3-l-h', size: 'L', color: 'Hitam', price: 300000, stock: 20 },
      { id: '3-xl-h', size: 'XL', color: 'Hitam', price: 310000, stock: 15 },
      { id: '3-m-a', size: 'M', color: 'Abu', price: 305000, stock: 20 },
      { id: '3-l-a', size: 'L', color: 'Abu', price: 305000, stock: 15 },
    ]
  },
  { 
    id: 4, 
    name: 'Kemeja Wanita Formal', 
    basePrice: 180000, 
    category: 'Kemeja',
    variations: [
      { id: '4-s-p', size: 'S', color: 'Putih', price: 180000, stock: 40 },
      { id: '4-m-p', size: 'M', color: 'Putih', price: 180000, stock: 30 },
      { id: '4-l-p', size: 'L', color: 'Putih', price: 185000, stock: 20 },
      { id: '4-s-m', size: 'S', color: 'Merah', price: 185000, stock: 25 },
      { id: '4-m-m', size: 'M', color: 'Merah', price: 185000, stock: 20 },
    ]
  },
  { 
    id: 5, 
    name: 'Blouse Wanita', 
    basePrice: 120000, 
    category: 'Blouse',
    variations: [
      { id: '5-s-h', size: 'S', color: 'Hitam', price: 120000, stock: 45 },
      { id: '5-m-h', size: 'M', color: 'Hitam', price: 120000, stock: 35 },
      { id: '5-l-h', size: 'L', color: 'Hitam', price: 125000, stock: 25 },
      { id: '5-s-c', size: 'S', color: 'Cream', price: 125000, stock: 30 },
      { id: '5-m-c', size: 'M', color: 'Cream', price: 125000, stock: 25 },
    ]
  },
  { 
    id: 6, 
    name: 'Celana Chino', 
    basePrice: 200000, 
    category: 'Celana',
    variations: [
      { id: '6-30-c', size: '30', color: 'Coklat', price: 200000, stock: 35 },
      { id: '6-32-c', size: '32', color: 'Coklat', price: 200000, stock: 30 },
      { id: '6-34-c', size: '34', color: 'Coklat', price: 205000, stock: 20 },
      { id: '6-30-k', size: '30', color: 'Khaki', price: 205000, stock: 25 },
      { id: '6-32-k', size: '32', color: 'Khaki', price: 205000, stock: 20 },
    ]
  }
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

  // Format currency helper
  const formatCurrency = (value) => {
    const num = Number(value) || 0;
    return num.toLocaleString('id-ID');
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

  // ================== END PHOTO FUNCTIONS ==================

  useEffect(() => {
    // Load order data
    setTimeout(() => {
      // Cari order dari localStorage
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const foundOrder = savedOrders.find(o => o.id === id);
      
      if (foundOrder) {
        setFormData({
          customerName: foundOrder.customerName || '',
          customerPhone: foundOrder.customerPhone || '',
          customerAddress: foundOrder.customerAddress || '',
          customerEmail: foundOrder.customerEmail || '',
          orderDate: foundOrder.orderDate || new Date().toISOString().split('T')[0],
          dueDate: foundOrder.dueDate || '',
          status: foundOrder.status || 'draft',
          notes: foundOrder.notes || '',
          items: foundOrder.itemsDetail?.map(item => ({
            product: products.find(p => p.name === item.product)?.id?.toString() || '',
            qty: item.qty || 1,
            price: item.price || 0,
            productName: item.product || ''
          })) || [{ product: '', qty: 1, price: 0, productName: '' }]
        });
        
        // Simpan status original
        setOriginalStatus(foundOrder.status || 'draft');
      } else {
        // Jika order tidak ditemukan
        setFormData({
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
        setOriginalStatus('draft');
      }
      
      // Load photos
      loadOrderPhotos();
      
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
  
  // Pastikan item di index tersebut ada
  if (!newItems[index]) {
    newItems[index] = { product: '', qty: 1, price: 0, productName: '', size: '', color: '', variantId: '' };
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
    // Reset jika produk dihapus
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

// Tambahkan fungsi untuk handle variant change
const handleVariantChange = (index, variantId) => {
  const newItems = [...formData.items];
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
  
  setFormData(prev => ({
    ...prev,
    items: newItems
  }));
};

// Tambahkan juga helper functions
const selectedProduct = (itemIndex) => {
  const productId = formData.items[itemIndex]?.product;
  return products.find(p => p.id === parseInt(productId));
};

const getAvailableVariations = (itemIndex) => {
  const product = selectedProduct(itemIndex);
  return product ? product.variations : [];
};

  // Fungsi untuk menghapus item
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi
    if (!formData.customerName || formData.customerName.trim() === '') {
      alert('Nama pelanggan harus diisi!');
      return;
    }

    // Validasi items
    const invalidItems = formData.items.filter(item => {
      return !item.product || !item.product.trim() || 
             !item.qty || item.qty < 1 ||
             !item.price || item.price <= 0;
    });

    if (invalidItems.length > 0) {
      alert('Periksa kembali item pesanan! Pastikan semua item sudah dipilih dengan kuantitas dan harga yang valid.');
      return;
    }

    setIsSubmitting(true);

    // Bersihkan data sebelum disimpan
    const cleanedItems = formData.items.map(item => ({
      product: item.product || '',
      qty: item.qty || 1,
      price: item.price || 0,
      productName: item.productName || '',
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
      status: formData.status || 'draft',
      notes: formData.notes.trim(),
      itemsDetail: cleanedItems,
      timeline: formData.timeline || [], // Preserve existing timeline
      priority: 'sedang', // Add priority field
      updated_at: new Date().toISOString() // Add update timestamp
    };

    // Simulasi API call
    setTimeout(() => {
      // Update di localStorage
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = savedOrders.map(order => 
        order.id === id ? updatedOrder : order
      );
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      // Handle job updates berdasarkan perubahan status
      handleJobUpdates(updatedOrder, originalStatus);
      
      setIsSubmitting(false);
      
      // Show success message
      alert('✅ Pesanan berhasil diperbarui! Jobs telah diupdate.');
      
      // Redirect ke view page
      navigate(`/orders/${id}`);
    }, 1500);
  };

  // Fungsi untuk handle job updates
  const handleJobUpdates = (order, oldStatus) => {
    const newStatus = order.status;
    
    // Jika status berubah dari draft/cancelled ke active status
    if ((oldStatus === 'draft' || oldStatus === 'cancelled') && 
        (newStatus === 'processing' || newStatus === 'production' || newStatus === 'completed')) {
      // Generate new jobs
      syncOrderWithJobs(order);
      console.log('✅ New jobs generated for order:', order.id);
    }
    // Jika status berubah dari active ke cancelled
    else if (oldStatus !== 'cancelled' && newStatus === 'cancelled') {
      // Hapus semua jobs terkait
      const availableJobs = JSON.parse(localStorage.getItem('availableJobs') || '[]');
      const filteredJobs = availableJobs.filter(job => job.order_id !== order.id);
      localStorage.setItem('availableJobs', JSON.stringify(filteredJobs));
      console.log('❌ Jobs removed for cancelled order:', order.id);
    }
    // Jika status berubah antar active states
    else if (oldStatus !== newStatus && 
             oldStatus !== 'draft' && oldStatus !== 'cancelled' &&
             newStatus !== 'draft' && newStatus !== 'cancelled') {
      // Update existing jobs
      syncOrderWithJobs(order);
      console.log('🔄 Jobs updated for order:', order.id);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Batalkan perubahan? Semua perubahan yang belum disimpan akan hilang.')) {
      navigate(`/orders/${id}`);
    }
  };

  // ================== PHOTO PREVIEW MODAL ==================
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

    const handleZoomIn = () => {
      setPhotoZoom(prev => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = () => {
      setPhotoZoom(prev => Math.max(prev - 0.25, 0.5));
    };

    const handleRotate = () => {
      setPhotoRotation(prev => (prev + 90) % 360);
    };

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
              <h3 className="text-lg font-semibold">Photo Preview</h3>
              <p className="text-sm text-gray-300">
                Order {id} • {currentPhotoIndex + 1} dari {allPhotos.length} • 
                {formatDateTime(currentPhoto.timestamp)}
              </p>
            </div>
            <button
              onClick={() => {
                setShowPhotoPreview(false);
                setSelectedPhoto(null);
                setPhotoZoom(1);
                setPhotoRotation(0);
              }}
              className="p-2 hover:bg-white/10 rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 flex flex-col md:flex-row gap-6">
            <div className="flex-1 relative bg-gray-900 rounded-xl overflow-hidden">
              <img
                src={currentPhoto.url}
                alt="Preview"
                className="w-full h-full object-contain"
                style={{
                  transform: `scale(${photoZoom}) rotate(${photoRotation}deg)`,
                  transition: 'transform 0.3s ease'
                }}
              />
              
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
              >
                <ChevronRight size={24} />
              </button>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                  disabled={photoZoom >= 3}
                >
                  <ZoomIn size={20} />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                  disabled={photoZoom <= 0.5}
                >
                  <ZoomOut size={20} />
                </button>
                <button
                  onClick={handleRotate}
                  className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                >
                  <RotateCw size={20} />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                >
                  <Download size={20} />
                </button>
              </div>
            </div>

            <div className="w-full md:w-80 bg-gray-800 rounded-xl p-4">
              <div className="mb-6">
                <h4 className="text-white font-medium mb-2">Info Foto</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>
                    <span className="text-gray-400">Order ID:</span>
                    <p className="font-medium">{id}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Upload oleh:</span>
                    <p>{currentPhoto.uploadedBy}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Tipe:</span>
                    <p>{currentPhoto.type || 'General'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Waktu:</span>
                    <p>{formatDateTime(currentPhoto.timestamp)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Ukuran:</span>
                    <p>{formatFileSize(currentPhoto.size)}</p>
                  </div>
                </div>
              </div>

              {currentPhoto.description && (
                <div className="mb-6">
                  <h4 className="text-white font-medium mb-2">Deskripsi</h4>
                  <p className="text-sm text-gray-300 bg-gray-700/50 p-3 rounded">
                    {currentPhoto.description}
                  </p>
                </div>
              )}

              <div className="mt-4">
                <h4 className="text-white font-medium mb-2">Navigasi Foto</h4>
                <div className="flex space-x-2 overflow-x-auto py-2">
                  {allPhotos.map((photo, index) => (
                    <button
                      key={photo.id}
                      onClick={() => {
                        setCurrentPhotoIndex(index);
                        setPhotoZoom(1);
                        setPhotoRotation(0);
                      }}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        index === currentPhotoIndex 
                          ? 'border-blue-500' 
                          : 'border-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={`Thumb ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ================== PHOTO UPLOAD COMPONENT ==================
  const PhotoUploadSection = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Camera className="text-blue-600 mr-3" size={24} />
              <div>
                <h3 className="font-bold text-lg text-gray-800">Photo Progress Tracking</h3>
                <p className="text-sm text-gray-600">Upload dan kelola foto dokumentasi order</p>
              </div>
            </div>
            <button
              onClick={() => setExpandedPhotoSection(!expandedPhotoSection)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {expandedPhotoSection ? <X size={20} /> : <Expand size={20} />}
            </button>
          </div>
        </div>

        {expandedPhotoSection && (
          <div className="p-6">
            {/* Upload Stats */}
            <div className="mb-6 grid grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="text-blue-600 text-2xl font-bold mb-1">{orderPhotos.length}</div>
                <div className="text-sm text-blue-800">Total Foto</div>
                <div className="text-xs text-blue-600 mt-1">Max: 20 foto</div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <div className="text-green-600 text-2xl font-bold mb-1">
                  {orderPhotos.filter(p => p.description).length}
                </div>
                <div className="text-sm text-green-800">Dengan Deskripsi</div>
                <div className="text-xs text-green-600 mt-1">Ter-dokumentasi</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                <div className="text-purple-600 text-2xl font-bold mb-1">
                  {orderPhotos.length > 0 ? formatDateTime(orderPhotos[orderPhotos.length-1].timestamp) : '-'}
                </div>
                <div className="text-sm text-purple-800">Upload Terakhir</div>
                <div className="text-xs text-purple-600 mt-1">Waktu terakhir</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                <div className="text-yellow-600 text-2xl font-bold mb-1">
                  {orderPhotos.filter(p => p.type === 'progress').length}
                </div>
                <div className="text-sm text-yellow-800">Progress Photos</div>
                <div className="text-xs text-yellow-600 mt-1">Update produksi</div>
              </div>
            </div>

            {/* Upload Area */}
            <div className="mb-8 border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-blue-400 transition-colors">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Upload className="text-blue-600" size={24} />
                </div>
                
                <h4 className="font-medium text-gray-800 mb-2">
                  Upload Foto Dokumentasi Order
                </h4>
                
                <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                  Unggah foto dokumentasi produksi atau progress. Format: JPG, PNG (maks. 5MB per file)
                </p>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />
                
                <button
                  onClick={triggerFileInput}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center mx-auto"
                  disabled={uploading || orderPhotos.length >= 20}
                >
                  <Camera size={18} className="mr-2" />
                  {uploading ? 'Uploading...' : 'Pilih Foto'}
                </button>
                
                <p className="text-xs text-gray-500 mt-3">
                  Klik untuk memilih foto dari komputer Anda
                </p>
              </div>
            </div>

            {/* Preview Section */}
            {photoPreview && (
              <div className="mb-8 bg-white rounded-xl border border-gray-200 p-5 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-800">Preview Foto</h4>
                  <button
                    onClick={() => setPhotoPreview(null)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <div className="rounded-lg overflow-hidden border border-gray-200">
                      <img
                        ref={previewRef}
                        src={photoPreview.url}
                        alt="Preview"
                        className="w-full h-64 object-contain bg-gray-50"
                      />
                    </div>
                    
                    <div className="mt-3 flex justify-center space-x-3">
                      <button
                        onClick={() => {
                          if (previewRef.current) {
                            previewRef.current.requestFullscreen();
                          }
                        }}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                        title="Zoom"
                      >
                        <ZoomIn size={16} className="inline mr-1" />
                        Fullscreen
                      </button>
                      <button
                        onClick={() => {
                          setPhotoPreview(null);
                          triggerFileInput();
                        }}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                        title="Ganti Foto"
                      >
                        <RotateCw size={16} className="inline mr-1" />
                        Ganti Foto
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipe Foto
                        </label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          value={photoPreview.type || 'general'}
                          onChange={(e) => setPhotoPreview({...photoPreview, type: e.target.value})}
                        >
                          <option value="general">Dokumentasi Umum</option>
                          <option value="progress">Progress Produksi</option>
                          <option value="quality">Quality Control</option>
                          <option value="delivery">Pengiriman</option>
                          <option value="reference">Referensi Desain</option>
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ukuran
                          </label>
                          <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                            {formatFileSize(photoPreview.size)}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Format
                          </label>
                          <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                            {photoPreview.type.split('/')[1].toUpperCase()}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Deskripsi (Opsional)
                        </label>
                        <textarea
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          rows="3"
                          placeholder="Tambahkan deskripsi foto..."
                          value={newPhotoDescription}
                          onChange={(e) => {
                            setNewPhotoDescription(e.target.value);
                            setPhotoPreview(prev => ({...prev, description: e.target.value}));
                          }}
                        />
                      </div>
                      
                      {/* Upload Progress */}
                      {uploading && (
                        <div className="mt-4">
                          <div className="flex justify-between text-sm text-gray-700 mb-1">
                            <span>Mengupload...</span>
                            <span className="font-medium">{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      {/* Upload Button */}
                      <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                          uploading
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'
                        } text-white`}
                      >
                        {uploading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Uploading... {uploadProgress}%
                          </>
                        ) : (
                          <>
                            <Upload size={18} className="mr-2" />
                            Upload Foto
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Photo Gallery */}
            {orderPhotos.length > 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-semibold text-gray-800">
                    Gallery Foto ({orderPhotos.length})
                  </h4>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle size={16} className="text-green-500 mr-1" />
                    Tersimpan di browser
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orderPhotos.map((photo) => (
                    <div key={photo.id} className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                      {/* Photo */}
                      <div className="relative h-48 bg-gray-100 cursor-pointer group" onClick={() => openPhotoPreview(photo)}>
                        <img
                          src={photo.url}
                          alt={photo.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
                        <div className="absolute top-2 left-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            photo.type === 'progress' ? 'bg-yellow-500 text-white' :
                            photo.type === 'quality' ? 'bg-green-500 text-white' :
                            photo.type === 'delivery' ? 'bg-blue-500 text-white' :
                            'bg-gray-500 text-white'
                          }`}>
                            {photo.type === 'progress' ? 'Progress' :
                             photo.type === 'quality' ? 'QC' :
                             photo.type === 'delivery' ? 'Delivery' :
                             photo.type === 'reference' ? 'Reference' : 'General'}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePhoto(photo.id);
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Hapus foto"
                        >
                          <X size={14} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                          <p className="text-white text-xs font-medium truncate">
                            {formatDateTime(photo.timestamp)}
                          </p>
                          <p className="text-white/80 text-xs truncate">
                            {photo.uploadedBy}
                          </p>
                        </div>
                      </div>
                      
                      {/* Photo Info */}
                      <div className="p-3">
                        <div className="mb-2">
                          <label className="block text-xs text-gray-500 mb-1">
                            Deskripsi:
                          </label>
                          <textarea
                            className="w-full p-2 text-sm border border-gray-200 rounded resize-none"
                            rows="2"
                            placeholder="Tambahkan deskripsi..."
                            value={photo.description || ''}
                            onChange={(e) => handleAddDescription(photo.id, e.target.value)}
                          />
                        </div>
                        
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <div className="flex items-center">
                            <Camera size={12} className="mr-1" />
                            {photo.type || 'General'}
                          </div>
                          <button
                            onClick={() => openPhotoPreview(photo)}
                            className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                          >
                            <Expand size={12} className="mr-1" />
                            Preview
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
                <FileImage size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Belum ada foto</p>
                <p className="text-gray-400 text-sm mt-2">
                  Upload foto pertama Anda untuk dokumentasi order
                </p>
              </div>
            )}

            {/* Guidelines */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h5 className="font-medium text-blue-800 mb-2 flex items-center">
                <Camera size={16} className="mr-2" />
                Tips Foto Dokumentasi
              </h5>
              <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
                <li>Gunakan foto dengan pencahayaan yang baik untuk detail yang jelas</li>
                <li>Foto progress produksi membantu tracking timeline</li>
                <li>Foto quality control penting untuk standar kualitas</li>
                <li>Tambahkan deskripsi untuk konteks yang lebih baik</li>
                <li>Foto akan tersimpan di browser secara otomatis</li>
                <li>Maksimal 20 foto per order</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    );
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
                  <div className="mt-1 p-2 bg-gray-50 rounded border border-gray-200">
                    <p className="text-xs text-gray-600">
                      Status sebelumnya: <span className="font-semibold">{originalStatus}</span><br/>
                      {formData.status !== originalStatus && (
                        <span className={`text-xs ${
                          (originalStatus === 'draft' || originalStatus === 'cancelled') && 
                          (formData.status === 'processing' || formData.status === 'production') 
                            ? 'text-green-600' 
                            : formData.status === 'cancelled' 
                              ? 'text-red-600' 
                              : 'text-yellow-600'
                        }`}>
                          {(() => {
                            if ((originalStatus === 'draft' || originalStatus === 'cancelled') && 
                                (formData.status === 'processing' || formData.status === 'production')) {
                              return '✅ Jobs akan digenerate otomatis';
                            } else if (formData.status === 'cancelled') {
                              return '❌ Semua jobs akan dihapus';
                            } else if (formData.status !== originalStatus) {
                              return '🔄 Jobs akan diupdate';
                            }
                            return '';
                          })()}
                        </span>
                      )}
                    </p>
                  </div>
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
                    {formData.items.reduce((total, item) => total + (item.qty || 0), 0)} pcs
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
                    Total {formData.items.length} item • {formData.items.reduce((total, item) => total + (item.qty || 0), 0)} pcs
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
                💡 <strong>Info Integrasi JobList:</strong><br/>
                1. Perubahan status akan mempengaruhi jobs otomatis<br/>
                2. Status <strong>"Diproses"</strong> dan <strong>"Produksi"</strong> akan generate jobs<br/>
                3. Status <strong>"Dibatalkan"</strong> akan menghapus semua jobs<br/>
                4. Progress jobs akan update timeline order secara real-time<br/>
                5. Lihat jobs terkait di halaman <strong>JobList</strong>
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* Photo Upload Section */}
      <PhotoUploadSection />

      {/* Photo Preview Modal */}
      <PhotoPreviewModal />
    </div>
  );
  // ... (bagian awal sama, hanya tambah state dan fungsi notes) ...

// Tambahkan state notesModal di dalam komponen EditOrder
const [notesModal, setNotesModal] = useState({
  isOpen: false,
  itemIndex: null,
  currentNote: '',
  notes: []
});

// Fungsi untuk Notes Modal
const openNotesModal = (index) => {
  setNotesModal({
    isOpen: true,
    itemIndex: index,
    currentNote: '',
    notes: formData.items[index]?.notes || []
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
  
  setNotesModal(prev => ({
    ...prev,
    notes: updatedNotes,
    currentNote: ''
  }));

  // Update notes in formData
  const newItems = [...formData.items];
  if (newItems[notesModal.itemIndex]) {
    newItems[notesModal.itemIndex].notes = updatedNotes;
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  }
};

const removeNote = (noteId) => {
  const updatedNotes = notesModal.notes.filter(note => note.id !== noteId);
  
  setNotesModal(prev => ({
    ...prev,
    notes: updatedNotes
  }));

  const newItems = [...formData.items];
  if (newItems[notesModal.itemIndex]) {
    newItems[notesModal.itemIndex].notes = updatedNotes;
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  }
};

// Dalam JSX render, tambahkan kolom untuk notes button di tabel items:
{/* Order Items Table */}
<div className="divide-y divide-gray-100">
  {formData.items.map((item, index) => (
    <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* ... existing columns ... */}
        
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
          
          {formData.items.length > 1 && (
            <button 
              type="button"
              onClick={() => handleRemoveItem(index)}
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

{/* Size Selector */}
<div className="col-span-1">
  {selectedProduct(itemIndex) ? (
    <select 
      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      value={item.variantId}
      onChange={(e) => handleVariantChange(index, e.target.value)}
      required
    >
      <option value="">-- Pilih Ukuran --</option>
      {getAvailableVariations(index).map(variant => (
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

// Tambahkan Notes Modal di akhir komponen (sebelum PhotoPreviewModal)
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
              Item: {formData.items[notesModal.itemIndex]?.productName || 'Belum dipilih'}
            </p>
          </div>
        </div>
        <button
          onClick={closeNotesModal}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <X size={24} />
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
}