import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Package, 
  CheckCircle, 
  Printer, 
  Download,
  Truck,
  FileText,
  Clock,
  AlertCircle,
  Edit,
  Save,
  X,
  Users,
  FileClock,
  Camera,
  Eye,
  Upload,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Expand,
  Maximize2,
  Trash2,
  FileImage,
  MessageSquare,
  Plus,
  Search,
  Filter,
  CalendarDays,
  UserCircle,
  FileEdit,
  ShoppingBag,
  TrendingUp,
  BarChart,
  CreditCard,
  FileSpreadsheet,
  History,
  DollarSign
} from 'lucide-react';

export default function ViewOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timelineData, setTimelineData] = useState([]);
  const [isEditingTimeline, setIsEditingTimeline] = useState(false);
  const [activeStep, setActiveStep] = useState(null);
  const [orderJobs, setOrderJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [customerStats, setCustomerStats] = useState(null); // Tambahkan state ini
  
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
  
  // Notes Modal State
  const [notesModal, setNotesModal] = useState({
    isOpen: false,
    itemIndex: null,
    currentNote: '',
    notes: [],
    itemName: '',
    readOnly: true,
    searchQuery: '',
    filterType: 'all',
    newNoteType: 'general'
  });

  // Notes filter types
  const noteTypes = [
    { value: 'all', label: 'Semua', color: 'bg-gray-100 text-gray-800' },
    { value: 'general', label: 'Umum', color: 'bg-blue-100 text-blue-800' },
    { value: 'instruction', label: 'Instruksi', color: 'bg-green-100 text-green-800' },
    { value: 'issue', label: 'Masalah', color: 'bg-red-100 text-red-800' },
    { value: 'solution', label: 'Solusi', color: 'bg-purple-100 text-purple-800' },
    { value: 'quality', label: 'Quality', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'progress', label: 'Progress', color: 'bg-indigo-100 text-indigo-800' }
  ];

  const fileInputRef = React.useRef(null);
  const previewRef = React.useRef(null);

  // Helper function untuk format currency
  const formatCurrency = (value) => {
    const num = Number(value) || 0;
    return num.toLocaleString('id-ID');
  };

  // Helper function untuk format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Tanggal tidak tersedia';
    try {
      return new Date(dateString).toLocaleDateString('id-ID');
    } catch (error) {
      return 'Tanggal tidak valid';
    }
  };

  // Helper function untuk format long date
  const formatLongDate = (dateString) => {
    if (!dateString) return 'Tanggal tidak tersedia';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Tanggal tidak valid';
    }
  };

  // Format datetime untuk display
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    try {
      return new Date(dateTimeString).toLocaleString('id-ID', {
        dateStyle: 'short',
        timeStyle: 'short'
      });
    } catch (error) {
      return dateTimeString;
    }
  };

  // Format datetime untuk input field
  const formatDateTimeForInput = (dateTimeString) => {
    if (!dateTimeString) return '';
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return '';
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      return '';
    }
  };

  // Status options
  const statusOptions = {
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800 border-gray-300', icon: <FileText size={16} /> },
    processing: { label: 'Diproses', color: 'bg-blue-100 text-blue-800 border-blue-300', icon: <Clock size={16} /> },
    production: { label: 'Produksi', color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: <Package size={16} /> },
    completed: { label: 'Selesai', color: 'bg-green-100 text-green-800 border-green-300', icon: <CheckCircle size={16} /> },
    delivered: { label: 'Terkirim', color: 'bg-purple-100 text-purple-800 border-purple-300', icon: <Truck size={16} /> },
    cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-800 border-red-300', icon: <AlertCircle size={16} /> },
  };

  // ================== CUSTOMER STATS FUNCTIONS ==================
  
  // Tambahkan fungsi untuk mendapatkan riwayat pelanggan
  const getCustomerHistory = (customerName) => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    return savedOrders
      .filter(order => order.customerName === customerName)
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  };

  // Tambahkan fungsi untuk menghitung statistik pelanggan
  const calculateCustomerStats = (customerName) => {
    const orders = getCustomerHistory(customerName);
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
    
    // Hitung status order
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
    
    // Order per bulan (6 bulan terakhir)
    const monthlyOrders = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
      monthlyOrders[key] = 0;
    }
    
    orders.forEach(order => {
      const orderDate = new Date(order.orderDate);
      const key = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyOrders[key] !== undefined) {
        monthlyOrders[key]++;
      }
    });
    
    return {
      totalOrders,
      totalSpent,
      avgOrderValue,
      statusCounts,
      monthlyOrders,
      orders
    };
  };

  const exportCustomerHistory = (orders) => {
    const headers = ['ID', 'Tanggal', 'Jumlah Item', 'Total', 'Status', 'Catatan'];
    const csvData = orders.map(order => [
      order.id,
      order.orderDate,
      order.items,
      order.totalAmount,
      order.status,
      order.notes || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customer-history-${order.customerName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ================== NOTES FUNCTIONS ==================
  
  const openNotesModal = (index, itemName, notes = [], readOnly = true) => {
    setNotesModal({
      isOpen: true,
      itemIndex: index,
      currentNote: '',
      notes: notes || [],
      itemName: itemName || 'Item',
      readOnly,
      searchQuery: '',
      filterType: 'all',
      newNoteType: 'general'
    });
  };

  const closeNotesModal = () => {
    setNotesModal({
      isOpen: false,
      itemIndex: null,
      currentNote: '',
      notes: [],
      itemName: '',
      readOnly: true,
      searchQuery: '',
      filterType: 'all',
      newNoteType: 'general'
    });
  };

  const addNote = () => {
    if (!notesModal.currentNote.trim()) {
      alert('Silakan isi catatan terlebih dahulu!');
      return;
    }

    const newNote = {
      id: Date.now(),
      text: notesModal.currentNote.trim(),
      timestamp: new Date().toISOString(),
      author: 'Admin',
      type: notesModal.newNoteType || 'general',
      priority: notesModal.newNoteType === 'issue' ? 'high' : 'normal'
    };

    const updatedNotes = [...notesModal.notes, newNote];
    
    // Update notes modal state
    setNotesModal(prev => ({
      ...prev,
      notes: updatedNotes,
      currentNote: ''
    }));

    // Update notes in order data if not readOnly
    if (!notesModal.readOnly && order) {
      const updatedOrder = { ...order };
      if (updatedOrder.itemsDetail && updatedOrder.itemsDetail[notesModal.itemIndex]) {
        updatedOrder.itemsDetail[notesModal.itemIndex].notes = updatedNotes;
        
        // Update localStorage
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const updatedOrders = savedOrders.map(o => 
          o.id === order.id ? updatedOrder : o
        );
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        setOrder(updatedOrder);
      }
    }

    alert('Catatan berhasil ditambahkan!');
  };

  const removeNote = (noteId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus catatan ini?')) return;

    const updatedNotes = notesModal.notes.filter(note => note.id !== noteId);
    
    setNotesModal(prev => ({
      ...prev,
      notes: updatedNotes
    }));

    // Update notes in order data if not readOnly
    if (!notesModal.readOnly && order) {
      const updatedOrder = { ...order };
      if (updatedOrder.itemsDetail && updatedOrder.itemsDetail[notesModal.itemIndex]) {
        updatedOrder.itemsDetail[notesModal.itemIndex].notes = updatedNotes;
        
        // Update localStorage
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const updatedOrders = savedOrders.map(o => 
          o.id === order.id ? updatedOrder : o
        );
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        setOrder(updatedOrder);
      }
    }

    alert('Catatan berhasil dihapus!');
  };

  const updateNote = (noteId, updates) => {
    const updatedNotes = notesModal.notes.map(note => 
      note.id === noteId ? { ...note, ...updates } : note
    );
    
    setNotesModal(prev => ({
      ...prev,
      notes: updatedNotes
    }));

    // Update notes in order data if not readOnly
    if (!notesModal.readOnly && order) {
      const updatedOrder = { ...order };
      if (updatedOrder.itemsDetail && updatedOrder.itemsDetail[notesModal.itemIndex]) {
        updatedOrder.itemsDetail[notesModal.itemIndex].notes = updatedNotes;
        
        // Update localStorage
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const updatedOrders = savedOrders.map(o => 
          o.id === order.id ? updatedOrder : o
        );
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        setOrder(updatedOrder);
      }
    }
  };

  const filterNotes = () => {
    let filtered = notesModal.notes;
    
    // Filter by type
    if (notesModal.filterType !== 'all') {
      filtered = filtered.filter(note => note.type === notesModal.filterType);
    }
    
    // Filter by search query
    if (notesModal.searchQuery) {
      const query = notesModal.searchQuery.toLowerCase();
      filtered = filtered.filter(note => 
        note.text.toLowerCase().includes(query) ||
        note.author.toLowerCase().includes(query) ||
        (note.type && note.type.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  };

  const getNoteTypeColor = (type) => {
    const noteType = noteTypes.find(t => t.value === type);
    return noteType ? noteType.color : 'bg-gray-100 text-gray-800';
  };

  const getNoteTypeLabel = (type) => {
    const noteType = noteTypes.find(t => t.value === type);
    return noteType ? noteType.label : 'Umum';
  };

  // ================== END NOTES FUNCTIONS ==================

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

  // Fungsi untuk menghitung durasi
  const calculateDuration = (start, end) => {
    if (!start || !end) return '';
    try {
      const startDate = new Date(start);
      const endDate = new Date(end);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return '';
      }
      
      const diffMs = endDate - startDate;
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      const hours = diffHours % 24;
      const minutes = diffMinutes % 60;
      
      if (diffDays > 0) {
        return `${diffDays} hari ${hours} jam ${minutes} menit`;
      } else if (diffHours > 0) {
        return `${diffHours} jam ${minutes} menit`;
      }
      return `${minutes} menit`;
    } catch (error) {
      return '';
    }
  };

  // Fungsi untuk menginisialisasi timeline
  const initializeTimeline = (orderData) => {
    const defaultSteps = [
      { 
        id: 1,
        status: 'draft', 
        label: 'Draft', 
        description: 'Pesanan dibuat',
        startTime: orderData?.orderDate ? `${orderData.orderDate}T08:00` : '',
        completeTime: '',
        duration: '',
        isCompleted: false,
        isInProgress: false,
        employee: 'Admin System',
        notes: 'Pesanan baru dibuat',
        department: 'Admin',
        progress: 0
      },
      { 
        id: 2,
        status: 'processing', 
        label: 'Verifikasi & Material', 
        description: 'Verifikasi pembayaran & persiapan material',
        startTime: '',
        completeTime: '',
        duration: '',
        isCompleted: false,
        isInProgress: false,
        employee: '',
        notes: '',
        department: 'Purchasing',
        progress: 0
      },
      { 
        id: 3,
        status: 'production', 
        label: 'Produksi', 
        description: 'Proses produksi di workshop',
        startTime: '',
        completeTime: '',
        duration: '',
        isCompleted: false,
        isInProgress: false,
        employee: '',
        notes: '',
        department: 'Production',
        progress: 0
      },
      { 
        id: 4,
        status: 'completed', 
        label: 'Quality Control', 
        description: 'Quality check & packaging',
        startTime: '',
        completeTime: '',
        duration: '',
        isCompleted: false,
        isInProgress: false,
        employee: '',
        notes: '',
        department: 'QC',
        progress: 0
      },
      { 
        id: 5,
        status: 'delivered', 
        label: 'Pengiriman', 
        description: 'Pengiriman ke pelanggan',
        startTime: '',
        completeTime: '',
        duration: '',
        isCompleted: false,
        isInProgress: false,
        employee: '',
        notes: '',
        department: 'Logistics',
        progress: 0
      },
    ];
    
    // Update timeline berdasarkan status order
    const statusOrder = ['draft', 'processing', 'production', 'completed', 'delivered'];
    const currentStatusIndex = statusOrder.indexOf(orderData?.status || 'draft');
    
    const updatedSteps = defaultSteps.map((step, index) => {
      const isStepCompleted = index <= currentStatusIndex;
      const isStepInProgress = index === currentStatusIndex;
      
      // Generate demo data untuk step yang selesai
      let startTime = step.startTime;
      let completeTime = '';
      let duration = '';
      let employee = step.employee;
      let progress = 0;
      
      if (isStepCompleted && step.id > 1) {
        const dayOffset = step.id - 1;
        startTime = orderData?.orderDate 
          ? new Date(new Date(orderData.orderDate).getTime() + (dayOffset * 24 * 60 * 60 * 1000))
              .toISOString().split('T')[0] + 'T08:00'
          : `2024-01-${15 + dayOffset}T08:00`;
        
        if (index < currentStatusIndex) {
          completeTime = orderData?.orderDate
            ? new Date(new Date(orderData.orderDate).getTime() + (dayOffset * 24 * 60 * 60 * 1000))
                .toISOString().split('T')[0] + 'T17:00'
            : `2024-01-${15 + dayOffset}T17:00`;
          duration = calculateDuration(startTime, completeTime);
          employee = 'Karyawan Departemen';
          progress = 100;
        } else if (isStepInProgress) {
          progress = 45; // Progress sedang berjalan
        }
      }
      
      return {
        ...step,
        startTime,
        completeTime,
        duration,
        employee,
        progress,
        isCompleted: isStepCompleted,
        isInProgress: isStepInProgress
      };
    });
    
    setTimelineData(updatedSteps);
  };

  // Fungsi untuk load jobs terkait order
  const loadOrderJobs = (orderId) => {
    setLoadingJobs(true);
    
    // Ambil semua jobs dari localStorage
    const allUsersJobs = [];
    const allUsers = JSON.parse(localStorage.getItem('userData') || '[]');
    
    allUsers.forEach(user => {
      const userJobs = JSON.parse(localStorage.getItem(`myJobs_${user.id}`) || '[]');
      const orderJobs = userJobs.filter(job => job.order_id === orderId);
      allUsersJobs.push(...orderJobs);
    });
    
    // Tambahkan available jobs yang belum diambil
    const jobListFromStorage = JSON.parse(localStorage.getItem('availableJobs') || '[]');
    const availableOrderJobs = jobListFromStorage.filter(job => 
      job.order_id === orderId && !allUsersJobs.some(j => j.id === job.id)
    );
    
    setOrderJobs([...allUsersJobs, ...availableOrderJobs]);
    setLoadingJobs(false);
  };

  useEffect(() => {
    // Simulasi loading data
    setTimeout(() => {
      // Cari order dari localStorage
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const foundOrder = savedOrders.find(o => o.id === id);
      
      if (foundOrder) {
        const orderData = {
          id: foundOrder.id || id,
          customerName: foundOrder.customerName || 'Pelanggan Tidak Dikenal',
          customerAddress: foundOrder.customerAddress || 'Jl. Sudirman No. 123, Jakarta',
          customerPhone: foundOrder.customerPhone || '0812-3456-7890',
          customerEmail: foundOrder.customerEmail || '',
          orderDate: foundOrder.orderDate || new Date().toISOString().split('T')[0],
          dueDate: foundOrder.dueDate || '',
          items: foundOrder.items || 0,
          totalAmount: foundOrder.totalAmount || 0,
          status: foundOrder.status || 'draft',
          notes: foundOrder.notes || '',
          itemsDetail: Array.isArray(foundOrder.itemsDetail) ? foundOrder.itemsDetail.map(item => ({
            ...item,
            notes: item.notes || []
          })) : [
            { product: 'Kemeja Pria Slimfit', qty: 2, price: 150000, subtotal: 300000, notes: [] },
            { product: 'Celana Jeans Denim', qty: 1, price: 250000, subtotal: 250000, notes: [] },
            { product: 'Jaket Hoodie', qty: 1, price: 300000, subtotal: 300000, notes: [] }
          ],
          timeline: foundOrder.timeline || []
        };
        
        setOrder(orderData);
        
        // Hitung statistik pelanggan
        const stats = calculateCustomerStats(orderData.customerName);
        setCustomerStats(stats);
        
        // Load jobs terkait order
        loadOrderJobs(orderData.id);
        
        // Load photos
        loadOrderPhotos();
        
        // Inisialisasi timeline
        if (foundOrder.timeline && foundOrder.timeline.length > 0) {
          setTimelineData(foundOrder.timeline);
          const activeStepIndex = foundOrder.timeline.findIndex(step => step.isInProgress);
          setActiveStep(activeStepIndex !== -1 ? activeStepIndex : null);
        } else {
          initializeTimeline(orderData);
          // Set active step berdasarkan status
          const statusOrder = ['draft', 'processing', 'production', 'completed', 'delivered'];
          const activeIndex = statusOrder.indexOf(orderData.status);
          setActiveStep(activeIndex !== -1 ? activeIndex : 0);
        }
      } else {
        // Fallback ke data mock jika tidak ditemukan
        const mockOrder = {
          id: id,
          customerName: 'Toko Baju Maju Jaya',
          customerAddress: 'Jl. Sudirman No. 123, Jakarta',
          customerPhone: '0812-3456-7890',
          customerEmail: 'toko@majujaya.com',
          orderDate: '2024-01-15',
          dueDate: '2024-01-25',
          items: 3,
          totalAmount: 850000,
          status: 'production',
          notes: 'Pesanan khusus dengan tambahan logo di bagian dada',
          itemsDetail: [
            { 
              product: 'Kemeja Pria Slimfit', 
              qty: 2, 
              price: 150000, 
              subtotal: 300000,
              notes: [
                {
                  id: 1,
                  text: 'Tambahkan logo perusahaan di dada kiri',
                  timestamp: '2024-01-15T10:30:00',
                  author: 'Sales',
                  type: 'instruction'
                },
                {
                  id: 2,
                  text: 'Warna khusus: Navy Blue',
                  timestamp: '2024-01-15T11:15:00',
                  author: 'Customer',
                  type: 'instruction'
                }
              ]
            },
            { 
              product: 'Celana Jeans Denim', 
              qty: 1, 
              price: 250000, 
              subtotal: 250000,
              notes: [
                {
                  id: 3,
                  text: 'Ukuran khusus: 32x34',
                  timestamp: '2024-01-15T14:20:00',
                  author: 'Admin',
                  type: 'instruction'
                }
              ]
            },
            { 
              product: 'Jaket Hoodie', 
              qty: 1, 
              price: 300000, 
              subtotal: 300000,
              notes: []
            }
          ],
          timeline: []
        };
        
        setOrder(mockOrder);
        
        // Hitung statistik pelanggan untuk mock data
        const stats = calculateCustomerStats(mockOrder.customerName);
        setCustomerStats(stats);
        
        loadOrderJobs(mockOrder.id);
        loadOrderPhotos();
        initializeTimeline(mockOrder);
        setActiveStep(2); // production step
      }
      
      setLoading(false);
    }, 500);
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Buat report timeline
    const timelineReport = {
      orderId: order.id,
      customer: order.customerName,
      timeline: timelineData,
      summary: {
        completedSteps: timelineData.filter(step => step.isCompleted).length,
        totalSteps: timelineData.length,
        totalDuration: calculateTotalDuration(),
      }
    };
    
    const blob = new Blob([JSON.stringify(timelineReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timeline-report-${order.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert(`Download timeline report ${order.id}`);
  };

  const handleEdit = () => {
    navigate(`/orders/edit/${id}`);
  };

  // Hitung total durasi timeline
  const calculateTotalDuration = () => {
    const completedSteps = timelineData.filter(step => step.duration);
    
    if (completedSteps.length === 0) return '0 jam';
    
    // Hitung total menit dari semua durasi
    let totalMinutes = 0;
    
    completedSteps.forEach(step => {
      const duration = step.duration;
      if (duration.includes('hari')) {
        const parts = duration.split(' ');
        const days = parseInt(parts[0]) || 0;
        const hours = parseInt(parts[2]) || 0;
        const minutes = parseInt(parts[4]) || 0;
        totalMinutes += (days * 24 * 60) + (hours * 60) + minutes;
      } else if (duration.includes('jam')) {
        const parts = duration.split(' ');
        const hours = parseInt(parts[0]) || 0;
        const minutes = parseInt(parts[2]) || 0;
        totalMinutes += (hours * 60) + minutes;
      } else if (duration.includes('menit')) {
        const minutes = parseInt(duration) || 0;
        totalMinutes += minutes;
      }
    });
    
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const remainingHours = totalHours % 24;
    const remainingMinutes = totalMinutes % 60;
    
    if (totalDays > 0) {
      return `${totalDays} hari ${remainingHours} jam`;
    } else if (totalHours > 0) {
      return `${totalHours} jam ${remainingMinutes} menit`;
    }
    return `${totalMinutes} menit`;
  };

  // ================== NOTES MODAL COMPONENT ==================
  const NotesModal = () => {
    const filteredNotes = filterNotes();
    const noteStats = {
      total: notesModal.notes.length,
      byType: noteTypes.reduce((acc, type) => {
        if (type.value !== 'all') {
          acc[type.value] = notesModal.notes.filter(note => note.type === type.value).length;
        }
        return acc;
      }, {})
    };

    if (!notesModal.isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 text-yellow-700 rounded-lg mr-3">
                <MessageSquare size={24} />
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-800">
                  Tracking Notes - {notesModal.itemName}
                </h3>
                <p className="text-sm text-gray-600">
                  Order ID: {id} • {notesModal.readOnly ? '📖 Mode Baca' : '✏️ Mode Edit'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!notesModal.readOnly && (
                <button
                  onClick={() => navigate(`/orders/edit/${id}`)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm flex items-center"
                >
                  <FileEdit size={16} className="mr-2" />
                  Edit di Halaman Edit
                </button>
              )}
              <button
                onClick={closeNotesModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Tutup"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Stats & Filters */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{noteStats.total}</div>
                    <div className="text-xs text-gray-600">Total Catatan</div>
                  </div>
                  <div className="hidden md:block border-l border-gray-300 h-8"></div>
                  <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0">
                    {noteTypes.filter(t => t.value !== 'all').map(type => (
                      <div key={type.value} className="flex items-center space-x-1">
                        <span className={`px-2 py-1 rounded text-xs ${type.color}`}>
                          {type.label}
                        </span>
                        <span className="text-xs font-medium text-gray-700">
                          {noteStats.byType[type.value] || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Cari catatan..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48"
                      value={notesModal.searchQuery}
                      onChange={(e) => setNotesModal(prev => ({ ...prev, searchQuery: e.target.value }))}
                    />
                  </div>
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={notesModal.filterType}
                    onChange={(e) => setNotesModal(prev => ({ ...prev, filterType: e.target.value }))}
                  >
                    {noteTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Add Note Form (only if not readOnly) */}
            {!notesModal.readOnly && (
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-white">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center">
                      <Plus size={16} className="mr-2" />
                      Tambah Catatan Baru
                    </span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div className="md:col-span-2">
                      <textarea
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        rows="3"
                        placeholder="Tulis catatan detail untuk item ini..."
                        value={notesModal.currentNote}
                        onChange={(e) => setNotesModal(prev => ({ ...prev, currentNote: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipe Catatan
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          value={notesModal.newNoteType}
                          onChange={(e) => setNotesModal(prev => ({ ...prev, newNoteType: e.target.value }))}
                        >
                          {noteTypes.filter(t => t.value !== 'all').map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={addNote}
                        disabled={!notesModal.currentNote.trim()}
                        className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                      >
                        <Plus size={18} className="mr-2" />
                        Tambah Catatan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredNotes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="text-gray-400" size={32} />
                  </div>
                  <h4 className="text-lg font-medium text-gray-800 mb-2">
                    {notesModal.searchQuery || notesModal.filterType !== 'all' 
                      ? 'Tidak ada catatan yang sesuai filter' 
                      : 'Belum ada catatan'}
                  </h4>
                  <p className="text-gray-600">
                    {notesModal.readOnly 
                      ? 'Catatan akan muncul setelah ditambahkan di mode edit' 
                      : 'Mulai tambahkan catatan pertama Anda'}
                  </p>
                  {!notesModal.readOnly && (
                    <button
                      onClick={() => setNotesModal(prev => ({ ...prev, currentNote: 'Catatan pertama untuk item ini...' }))}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Buat Catatan Pertama
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotes.map((note) => (
                    <div 
                      key={note.id} 
                      className={`border rounded-xl p-4 transition-all duration-300 hover:shadow-md ${
                        note.type === 'issue' ? 'border-red-200 bg-red-50' :
                        note.type === 'instruction' ? 'border-green-200 bg-green-50' :
                        note.type === 'solution' ? 'border-purple-200 bg-purple-50' :
                        'border-yellow-200 bg-yellow-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <UserCircle size={16} className="text-gray-500 mr-1" />
                            <span className="font-medium text-gray-800">{note.author}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNoteTypeColor(note.type)}`}>
                            {getNoteTypeLabel(note.type)}
                          </span>
                          {note.priority === 'high' && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              ⚠️ High Priority
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            <CalendarDays size={12} className="inline mr-1" />
                            {formatDateTime(note.timestamp)}
                          </span>
                          {!notesModal.readOnly && (
                            <button
                              onClick={() => removeNote(note.id)}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded transition-colors"
                              title="Hapus catatan"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-gray-800 whitespace-pre-wrap">{note.text}</p>
                      </div>
                      
                      {!notesModal.readOnly && note.type === 'issue' && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status Penyelesaian
                          </label>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateNote(note.id, { type: 'solution', priority: 'normal' })}
                              className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                            >
                              Tandai sebagai Selesai
                            </button>
                            <button
                              onClick={() => updateNote(note.id, { priority: note.priority === 'high' ? 'normal' : 'high' })}
                              className="px-3 py-1.5 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
                            >
                              {note.priority === 'high' ? 'Turunkan Priority' : 'Tingkatkan Priority'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {filteredNotes.length} dari {notesModal.notes.length} catatan ditampilkan
              {notesModal.filterType !== 'all' && ` • Filter: ${getNoteTypeLabel(notesModal.filterType)}`}
            </div>
            <div className="flex space-x-3">
              {!notesModal.readOnly ? (
                <button
                  onClick={() => setNotesModal(prev => ({ ...prev, readOnly: true }))}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  <Eye size={16} className="inline mr-2" />
                  Mode Baca
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/orders/edit/${id}`)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  <Edit size={16} className="inline mr-2" />
                  Edit Catatan
                </button>
              )}
              <button
                onClick={closeNotesModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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

  if (!order) {
    return (
      <div className="max-w-6xl mx-auto py-8">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pesanan Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">Pesanan dengan ID {id} tidak ditemukan dalam sistem.</p>
          <button 
            onClick={() => navigate('/orders')}
            className="inline-flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            Kembali ke Daftar Pesanan
          </button>
        </div>
      </div>
    );
  }

  const status = statusOptions[order.status] || statusOptions.draft;

  // Calculate total quantity
  const totalQty = order.itemsDetail?.reduce((total, item) => total + (item.qty || 0), 0) || 0;

  // Completed steps count
  const completedSteps = timelineData.filter(step => step.isCompleted).length;
  const totalSteps = timelineData.length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

  // Calculate notes statistics
  const notesStats = {
    total: order.itemsDetail?.reduce((total, item) => total + (item.notes?.length || 0), 0) || 0,
    byType: noteTypes.reduce((acc, type) => {
      if (type.value !== 'all') {
        acc[type.value] = order.itemsDetail?.reduce((total, item) => 
          total + (item.notes?.filter(note => note.type === type.value).length || 0), 0
        ) || 0;
      }
      return acc;
    }, {})
  };

  return (
    <div className="max-w-7xl mx-auto">
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
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-800">Detail Pesanan</h2>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${status.color}`}>
                  {status.icon}
                  {status.label}
                </span>
              </div>
              <p className="text-gray-600">ID: {order.id}</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={handleEdit}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center"
            >
              <Edit size={18} className="mr-2" />
              Edit Pesanan
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              <Printer size={18} className="mr-2" />
              Print
            </button>
            <button 
              onClick={handleDownload}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Download size={18} className="mr-2" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Customer Card dengan Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Tab.Group>
          <div className="border-b border-gray-200">
            <Tab.List className="flex">
              <Tab className={({ selected }) => 
                `flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  selected 
                    ? 'border-blue-500 text-blue-600 bg-blue-50' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`
              }>
                <div className="flex items-center justify-center">
                  <User size={16} className="mr-2" />
                  Informasi
                </div>
              </Tab>
              <Tab className={({ selected }) => 
                `flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  selected 
                    ? 'border-blue-500 text-blue-600 bg-blue-50' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`
              }>
                <div className="flex items-center justify-center">
                  <History size={16} className="mr-2" />
                  Riwayat ({customerStats?.totalOrders || 0})
                </div>
              </Tab>
              <Tab className={({ selected }) => 
                `flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  selected 
                    ? 'border-blue-500 text-blue-600 bg-blue-50' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`
              }>
                <div className="flex items-center justify-center">
                  <BarChart size={16} className="mr-2" />
                  Statistik
                </div>
              </Tab>
            </Tab.List>
          </div>
          
          <Tab.Panels className="p-6">
            {/* Tab 1: Informasi Pelanggan */}
            <Tab.Panel>
              <div className="flex items-center mb-6">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3">
                  <User size={20} />
                </div>
                <h3 className="font-semibold text-gray-800">Informasi Pelanggan</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Nama Pelanggan</p>
                  <p className="font-medium text-gray-900">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Telepon</p>
                  <p className="font-medium text-gray-900">{order.customerPhone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600 mb-1">Alamat</p>
                  <p className="font-medium text-gray-900">{order.customerAddress}</p>
                </div>
                {order.customerEmail && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-medium text-gray-900">{order.customerEmail}</p>
                  </div>
                )}
                {customerStats && (
                  <div className="md:col-span-2 mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-2">Ringkasan Pelanggan</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-blue-600">Total Pesanan</p>
                        <p className="text-lg font-bold text-blue-700">{customerStats.totalOrders}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-xs text-green-600">Total Belanja</p>
                        <p className="text-lg font-bold text-green-700">
                          Rp {formatCurrency(customerStats.totalSpent)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Tab.Panel>
            
            {/* Tab 2: Riwayat Transaksi */}
            <Tab.Panel>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg mr-3">
                    <History size={20} />
                  </div>
                  <h3 className="font-semibold text-gray-800">Riwayat Transaksi</h3>
                </div>
                <div className="text-sm text-gray-600">
                  {customerStats?.totalOrders || 0} pesanan ditemukan
                </div>
              </div>
              
              {customerStats && customerStats.orders.length > 0 ? (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">ID Pesanan</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Tanggal</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Jumlah</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {customerStats.orders.map((historyOrder) => (
                          <tr key={historyOrder.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="font-medium text-gray-900">{historyOrder.id}</div>
                              <div className="text-xs text-gray-500">
                                {historyOrder.items} item • {formatCurrency(historyOrder.totalAmount)}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm text-gray-900">
                                {formatDate(historyOrder.orderDate)}
                              </div>
                              {historyOrder.dueDate && (
                                <div className="text-xs text-gray-500">
                                  Jatuh tempo: {formatDate(historyOrder.dueDate)}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-semibold text-gray-900">
                                Rp {formatCurrency(historyOrder.totalAmount)}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                statusOptions[historyOrder.status]?.color || 'bg-gray-100 text-gray-800'
                              }`}>
                                {statusOptions[historyOrder.status]?.label || historyOrder.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => navigate(`/orders/${historyOrder.id}`)}
                                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                                >
                                  Lihat
                                </button>
                                {historyOrder.id !== id && (
                                  <button
                                    onClick={() => navigate(`/orders/edit/${historyOrder.id}`)}
                                    className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                                  >
                                    Edit
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center">
                        <ShoppingBag className="text-blue-600 mr-3" size={20} />
                        <div>
                          <p className="text-sm text-gray-600">Pesanan Aktif</p>
                          <p className="text-xl font-bold text-gray-900">
                            {Object.entries(customerStats.statusCounts || {}).reduce((sum, [status, count]) => {
                              return ['processing', 'production'].includes(status) ? sum + count : sum;
                            }, 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center">
                        <CreditCard className="text-green-600 mr-3" size={20} />
                        <div>
                          <p className="text-sm text-gray-600">Nilai Rata-rata</p>
                          <p className="text-xl font-bold text-gray-900">
                            Rp {formatCurrency(customerStats.avgOrderValue)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center">
                        <TrendingUp className="text-purple-600 mr-3" size={20} />
                        <div>
                          <p className="text-sm text-gray-600">Tren 6 Bulan</p>
                          <p className="text-xl font-bold text-gray-900">
                            {Math.round(Object.values(customerStats.monthlyOrders).reduce((a, b) => a + b, 0) / 6)}/bulan
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <History className="text-gray-400" size={32} />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Belum ada riwayat transaksi</h4>
                  <p className="text-gray-600 mb-6">
                    Pelanggan ini belum memiliki pesanan sebelumnya
                  </p>
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Buat Pesanan Baru
                  </button>
                </div>
              )}
            </Tab.Panel>
            
            {/* Tab 3: Statistik Pelanggan */}
            <Tab.Panel>
              <div className="flex items-center mb-6">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg mr-3">
                  <BarChart size={20} />
                </div>
                <h3 className="font-semibold text-gray-800">Statistik Pelanggan</h3>
              </div>
              
              {customerStats ? (
                <div className="space-y-6">
                  {/* Statistik Utama */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <div className="text-blue-600 text-2xl font-bold mb-1">{customerStats.totalOrders}</div>
                      <div className="text-sm text-blue-800">Total Pesanan</div>
                      <div className="text-xs text-blue-600 mt-1">Semua waktu</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                      <div className="text-green-600 text-2xl font-bold mb-1">
                        Rp {formatCurrency(customerStats.totalSpent)}
                      </div>
                      <div className="text-sm text-green-800">Total Belanja</div>
                      <div className="text-xs text-green-600 mt-1">Nilai kumulatif</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                      <div className="text-purple-600 text-2xl font-bold mb-1">
                        Rp {formatCurrency(customerStats.avgOrderValue)}
                      </div>
                      <div className="text-sm text-purple-800">Rata-rata Pesanan</div>
                      <div className="text-xs text-purple-600 mt-1">Per transaksi</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                      <div className="text-yellow-600 text-2xl font-bold mb-1">
                        {customerStats.orders.filter(o => ['processing', 'production'].includes(o.status)).length}
                      </div>
                      <div className="text-sm text-yellow-800">Dalam Proses</div>
                      <div className="text-xs text-yellow-600 mt-1">Pesanan aktif</div>
                    </div>
                  </div>
                  
                  {/* Distribusi Status */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h4 className="font-medium text-gray-800 mb-4">Distribusi Status Pesanan</h4>
                    <div className="space-y-3">
                      {Object.entries(customerStats.statusCounts || {}).map(([status, count]) => (
                        <div key={status} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className={`w-3 h-3 rounded-full mr-2 ${
                              status === 'completed' ? 'bg-green-500' :
                              status === 'processing' ? 'bg-blue-500' :
                              status === 'production' ? 'bg-yellow-500' :
                              status === 'delivered' ? 'bg-purple-500' :
                              'bg-gray-500'
                            }`}></span>
                            <span className="text-sm text-gray-700">
                              {statusOptions[status]?.label || status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{count}</span>
                            <span className="text-xs text-gray-500">
                              ({Math.round((count / customerStats.totalOrders) * 100)}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Tren Bulanan */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h4 className="font-medium text-gray-800 mb-4">Tren Pesanan 6 Bulan Terakhir</h4>
                    <div className="space-y-2">
                      {Object.entries(customerStats.monthlyOrders || {}).map(([month, count]) => {
                        const maxCount = Math.max(...Object.values(customerStats.monthlyOrders || {}));
                        const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                        
                        return (
                          <div key={month} className="flex items-center">
                            <div className="w-20 text-sm text-gray-600">
                              {month.split('-')[1]}/{month.split('-')[0]}
                            </div>
                            <div className="flex-1 ml-4">
                              <div className="flex items-center justify-between mb-1">
                                <div className="w-12 text-right text-sm font-medium">{count}</div>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Produk Favorit */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h4 className="font-medium text-gray-800 mb-4">Produk yang Sering Dibeli</h4>
                    <div className="space-y-3">
                      {/* Hitung produk favorit dari riwayat */}
                      {(() => {
                        const productCounts = {};
                        customerStats.orders.forEach(order => {
                          order.itemsDetail?.forEach(item => {
                            productCounts[item.product] = (productCounts[item.product] || 0) + (item.qty || 0);
                          });
                        });
                        
                        const sortedProducts = Object.entries(productCounts)
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 5);
                        
                        return sortedProducts.length > 0 ? (
                          sortedProducts.map(([product, count]) => (
                            <div key={product} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Package size={16} className="text-gray-400 mr-2" />
                                <span className="text-sm text-gray-700">{product}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="font-medium text-gray-900 mr-2">{count} pcs</span>
                                <span className="text-xs text-gray-500">
                                  ({Math.round((count / Object.values(productCounts).reduce((a, b) => a + b, 0)) * 100)}%)
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-center py-4">Belum ada data produk</p>
                        );
                      })()}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        // Export customer history to CSV
                        exportCustomerHistory(customerStats.orders);
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center"
                    >
                      <FileSpreadsheet size={16} className="mr-2" />
                      Export CSV
                    </button>
                    <button
                      onClick={() => navigate(`/orders/create?customer=${encodeURIComponent(order.customerName)}`)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center"
                    >
                      <ShoppingBag size={16} className="mr-2" />
                      Pesanan Baru
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <BarChart className="text-gray-400" size={32} />
                  </div>
                  <p className="text-gray-600">Memuat statistik pelanggan...</p>
                </div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* Photo Upload Section */}
      <PhotoUploadSection />

      {/* Photo Preview Modal */}
      <PhotoPreviewModal />

      {/* Notes Modal */}
      <NotesModal />
    </div>
  );
}