// src/pages/ViewOrder.jsx
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
  DollarSign,
  Calendar,
  Phone,
  MapPin,
  Mail,
  Calendar as CalendarIcon
} from 'lucide-react';
import { syncOrderWithJobs } from '../utils/jobOrderSync';

export default function ViewOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timelineData, setTimelineData] = useState([]);
  const [activeStep, setActiveStep] = useState(null);
  const [orderJobs, setOrderJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [customerStats, setCustomerStats] = useState(null);
  
  // Photo State
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoZoom, setPhotoZoom] = useState(1);
  const [photoRotation, setPhotoRotation] = useState(0);
  const [orderPhotos, setOrderPhotos] = useState([]);
  const [expandedPhotoSection, setExpandedPhotoSection] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [newPhotoDescription, setNewPhotoDescription] = useState('');
  
  // Notes State
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

  // Helper functions
  const formatCurrency = (value) => {
    const num = Number(value) || 0;
    return num.toLocaleString('id-ID');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Tanggal tidak tersedia';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'Tanggal tidak valid';
    }
  };

  const formatShortDate = (dateString) => {
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

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    try {
      return new Date(dateTimeString).toLocaleString('id-ID', {
        dateStyle: 'short',
        timeStyle: 'short'
      });
    } catch {
      return dateTimeString;
    }
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

  const calculateDuration = (start, end) => {
    if (!start || !end) return '';
    try {
      const startDate = new Date(start);
      const endDate = new Date(end);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return '';
      
      const diffMs = endDate - startDate;
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);
      const hours = diffHours % 24;
      const minutes = diffMinutes % 60;
      
      if (diffDays > 0) return `${diffDays} hari ${hours} jam`;
      if (diffHours > 0) return `${diffHours} jam ${minutes} menit`;
      return `${minutes} menit`;
    } catch {
      return '';
    }
  };

  // ================== STATUS OPTIONS - DENGAN FALLBACK ==================
  const getStatusOption = (status) => {
    const statusMap = {
      // ========== STATUS PRODUKSI (PROSES AKTIF) ==========
      cutting: { label: 'Potong', icon: '✂️', color: 'bg-amber-100 text-amber-800' },
      sewing: { label: 'Jahit', icon: '🧵', color: 'bg-blue-100 text-blue-800' },
      finishing: { label: 'Finishing', icon: '✨', color: 'bg-purple-100 text-purple-800' },
      qc: { label: 'QC', icon: '🔍', color: 'bg-indigo-100 text-indigo-800' },
      delivering: { label: 'Mengirim', icon: '🚚', color: 'bg-cyan-100 text-cyan-800' },
      
      // ========== STATUS AKHIR (FINAL) ==========
      completed: { label: 'Selesai', icon: '✅', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Dibatalkan', icon: '❌', color: 'bg-red-100 text-red-800' },
      
      // ========== FALLBACK UNTUK KOMPATIBILITAS ==========
      draft: { label: 'Draft', icon: '📄', color: 'bg-gray-100 text-gray-800' },
      processing: { label: 'Diproses', icon: '⚙️', color: 'bg-blue-100 text-blue-800' },
      production: { label: 'Produksi', icon: '🏭', color: 'bg-yellow-100 text-yellow-800' },
      packing: { label: 'Packing', icon: '📦', color: 'bg-emerald-100 text-emerald-800' },
      delivered: { label: 'Mengirim', icon: '🚚', color: 'bg-cyan-100 text-cyan-800' },
    };
    
    // Fallback untuk status yang tidak dikenal
    if (!statusMap[status]) {
      console.warn(`Unknown status: ${status}`);
      return { label: status || 'Unknown', icon: '📋', color: 'bg-gray-100 text-gray-800' };
    }
    
    return statusMap[status];
  };

  // ================== CUSTOMER STATS FUNCTIONS ==================
  const getCustomerHistory = (customerName) => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    return savedOrders
      .filter(order => order.customerName === customerName)
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  };

  const calculateCustomerStats = (customerName) => {
    const orders = getCustomerHistory(customerName);
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
    
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
    
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
      if (monthlyOrders[key] !== undefined) monthlyOrders[key]++;
    });
    
    return { totalOrders, totalSpent, avgOrderValue, statusCounts, monthlyOrders, orders };
  };

  const exportCustomerHistory = (orders) => {
    const headers = ['ID', 'Tanggal', 'Jumlah Item', 'Total', 'Status', 'Catatan'];
    const csvData = orders.map(order => [
      order.id, order.orderDate, order.items, order.totalAmount, order.status, order.notes || ''
    ]);
    const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customer-history-${order.customerName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ================== PRINT INVOICE FUNCTION ==================
  const formatCurrencyForPrint = (value) => {
    const num = Number(value) || 0;
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  const handlePrintInvoice = () => {
    const printWindow = window.open('', '_blank');
    
    const status = getStatusOption(order.status);
    const calculatedTotal = order.itemsDetail?.reduce((sum, item) => sum + ((item.qty || 0) * (item.price || 0)), 0) || 0;
    
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Nota Pesanan - ${order.id}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Courier New', 'Monaco', monospace;
            background: #fff;
            padding: 20px;
            font-size: 12px;
            line-height: 1.4;
          }
          
          .invoice-container {
            max-width: 350px;
            margin: 0 auto;
            background: white;
          }
          
          /* Header Toko */
          .store-header {
            text-align: center;
            border-bottom: 1px dashed #000;
            padding-bottom: 10px;
            margin-bottom: 10px;
          }
          
          .store-name {
            font-size: 18px;
            font-weight: bold;
            letter-spacing: 2px;
            margin-bottom: 5px;
          }
          
          .store-info {
            font-size: 9px;
            color: #666;
            line-height: 1.3;
          }
          
          /* Info Pesanan */
          .order-info {
            margin-bottom: 15px;
            font-size: 10px;
          }
          
          .order-info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
          }
          
          .order-info-label {
            font-weight: bold;
          }
          
          /* Divider */
          .divider {
            border-top: 1px dashed #000;
            margin: 10px 0;
          }
          
          .divider-dotted {
            border-top: 1px dotted #999;
            margin: 8px 0;
          }
          
          /* Item List */
          .items-table {
            width: 100%;
            margin: 10px 0;
            border-collapse: collapse;
          }
          
          .items-table th {
            text-align: left;
            font-size: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #000;
          }
          
          .items-table td {
            padding: 5px 0;
            vertical-align: top;
          }
          
          .item-name {
            font-size: 11px;
            font-weight: 500;
          }
          
          .item-variant {
            font-size: 9px;
            color: #666;
          }
          
          .item-qty {
            text-align: center;
            width: 40px;
          }
          
          .item-price {
            text-align: right;
            width: 80px;
          }
          
          .item-subtotal {
            text-align: right;
            width: 80px;
          }
          
          /* Total Section */
          .total-section {
            margin: 10px 0;
          }
          
          .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 10px;
          }
          
          .grand-total {
            font-size: 14px;
            font-weight: bold;
            border-top: 1px dashed #000;
            padding-top: 8px;
            margin-top: 5px;
          }
          
          /* Footer */
          .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px dashed #000;
            font-size: 9px;
            color: #666;
          }
          
          .thankyou {
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          /* Customer Info */
          .customer-info {
            background: #f9f9f9;
            padding: 8px;
            margin: 10px 0;
            font-size: 9px;
            border-radius: 4px;
          }
          
          .customer-info p {
            margin-bottom: 3px;
          }
          
          /* Status Badge */
          .status-badge {
            display: inline-block;
            padding: 2px 6px;
            background: ${status.color.replace('bg-', '').replace(' text-', '')};
            color: white;
            font-size: 9px;
            border-radius: 3px;
            font-weight: bold;
          }
          
          /* Print Styles */
          @media print {
            body {
              padding: 0;
              margin: 0;
            }
            .invoice-container {
              max-width: 100%;
            }
            .no-print {
              display: none;
            }
          }
          
          /* Notes Section */
          .notes-section {
            margin-top: 10px;
            padding: 8px;
            background: #fef3e2;
            font-size: 9px;
            border-radius: 4px;
          }
          
          .notes-title {
            font-weight: bold;
            margin-bottom: 4px;
          }
          
          /* QR Code Placeholder */
          .qr-placeholder {
            text-align: center;
            margin: 10px 0;
            font-size: 8px;
            color: #999;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <!-- Header Toko -->
          <div class="store-header">
            <div class="store-name">GARMENT STORE</div>
            <div class="store-info">
              Jl. Industri No. 123, Kota Bandung<br>
              Telp: (022) 1234567 | Email: cs@garment.com<br>
              IG: @garmentstore | Web: www.garmentstore.com
            </div>
          </div>
          
          <!-- Info Pesanan -->
          <div class="order-info">
            <div class="order-info-row">
              <span class="order-info-label">No. Pesanan:</span>
              <span>${order.id}</span>
            </div>
            <div class="order-info-row">
              <span class="order-info-label">Tanggal:</span>
              <span>${new Date(order.orderDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div class="order-info-row">
              <span class="order-info-label">Status:</span>
              <span><span class="status-badge">${status.icon} ${status.label}</span></span>
            </div>
            ${order.dueDate ? `
            <div class="order-info-row">
              <span class="order-info-label">Jatuh Tempo:</span>
              <span>${new Date(order.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            ` : ''}
          </div>
          
          <div class="divider"></div>
          
          <!-- Customer Info -->
          <div class="customer-info">
            <strong>DATA PELANGGAN</strong>
            <p>${order.customerName || '-'}</p>
            ${order.customerPhone ? `<p>📞 ${order.customerPhone}</p>` : ''}
            ${order.customerAddress ? `<p>📍 ${order.customerAddress}</p>` : ''}
            ${order.customerEmail ? `<p>✉️ ${order.customerEmail}</p>` : ''}
          </div>
          
          <div class="divider"></div>
          
          <!-- Item Pesanan -->
          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th class="item-qty">Qty</th>
                <th class="item-price">Harga</th>
                <th class="item-subtotal">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${order.itemsDetail.map(item => `
                <tr>
                  <td>
                    <div class="item-name">${item.productName || item.product}</div>
                    ${item.size || item.color ? `<div class="item-variant">${item.size ? `Uk: ${item.size}` : ''}${item.size && item.color ? ' | ' : ''}${item.color ? `Wrn: ${item.color}` : ''}</div>` : ''}
                   </td>
                  <td class="item-qty">${item.qty}</td>
                  <td class="item-price">${formatCurrencyForPrint(item.price)}</td>
                  <td class="item-subtotal">${formatCurrencyForPrint((item.qty || 0) * (item.price || 0))}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="divider-dotted"></div>
          
          <!-- Total Section -->
          <div class="total-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${formatCurrencyForPrint(calculatedTotal)}</span>
            </div>
            ${order.totalAmount !== calculatedTotal ? `
            <div class="total-row">
              <span>Total (record):</span>
              <span>${formatCurrencyForPrint(order.totalAmount)}</span>
            </div>
            ` : ''}
            <div class="grand-total">
              <span>TOTAL:</span>
              <span>${formatCurrencyForPrint(calculatedTotal)}</span>
            </div>
          </div>
          
          <div class="divider"></div>
          
          <!-- Catatan Pesanan -->
          ${order.notes ? `
          <div class="notes-section">
            <div class="notes-title">📝 CATATAN PESANAN:</div>
            <div>${order.notes.replace(/\n/g, '<br>')}</div>
          </div>
          ` : ''}
          
          <!-- Catatan Per Item -->
          ${order.itemsDetail.some(item => item.notes?.length > 0) ? `
          <div class="notes-section">
            <div class="notes-title">📝 CATATAN ITEM:</div>
            ${order.itemsDetail.filter(item => item.notes?.length > 0).map(item => `
              <div style="margin-bottom: 5px;">
                <strong>${item.productName || item.product}:</strong><br>
                ${item.notes.map(note => `• ${note.text}`).join('<br>')}
              </div>
            `).join('')}
          </div>
          ` : ''}
          
          <div class="divider"></div>
          
          <!-- Footer -->
          <div class="footer">
            <div class="thankyou">TERIMA KASIH</div>
            <div>Barang yang sudah dibeli tidak dapat dikembalikan</div>
            <div>Kecuali ada kerusakan dari pihak kami</div>
            <div class="qr-placeholder">◊◊◊ Simpan nota ini sebagai bukti pesanan ◊◊◊</div>
            <div>${new Date().toLocaleString('id-ID')}</div>
          </div>
        </div>
        
        <div class="no-print" style="text-align: center; margin-top: 20px; padding: 10px;">
          <button onclick="window.print()" style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">🖨️ Cetak</button>
          <button onclick="window.close()" style="padding: 8px 16px; background: #6b7280; color: white; border: none; border-radius: 6px; cursor: pointer;">Tutup</button>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
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
    
    setNotesModal(prev => ({ ...prev, notes: updatedNotes, currentNote: '' }));

    if (!notesModal.readOnly && order) {
      const updatedOrder = { ...order };
      if (updatedOrder.itemsDetail && updatedOrder.itemsDetail[notesModal.itemIndex]) {
        updatedOrder.itemsDetail[notesModal.itemIndex].notes = updatedNotes;
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const updatedOrders = savedOrders.map(o => o.id === order.id ? updatedOrder : o);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        setOrder(updatedOrder);
      }
    }

    alert('Catatan berhasil ditambahkan!');
  };

  const removeNote = (noteId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus catatan ini?')) return;

    const updatedNotes = notesModal.notes.filter(note => note.id !== noteId);
    setNotesModal(prev => ({ ...prev, notes: updatedNotes }));

    if (!notesModal.readOnly && order) {
      const updatedOrder = { ...order };
      if (updatedOrder.itemsDetail && updatedOrder.itemsDetail[notesModal.itemIndex]) {
        updatedOrder.itemsDetail[notesModal.itemIndex].notes = updatedNotes;
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const updatedOrders = savedOrders.map(o => o.id === order.id ? updatedOrder : o);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        setOrder(updatedOrder);
      }
    }

    alert('Catatan berhasil dihapus!');
  };

  const getNoteTypeColor = (type) => {
    const noteType = noteTypes.find(t => t.value === type);
    return noteType ? noteType.color : 'bg-gray-100 text-gray-800';
  };

  const getNoteTypeLabel = (type) => {
    const noteType = noteTypes.find(t => t.value === type);
    return noteType ? noteType.label : 'Umum';
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
    if (fileInputRef.current) fileInputRef.current.click();
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
        const itemsDetail = Array.isArray(foundOrder.itemsDetail) 
          ? foundOrder.itemsDetail.map(item => ({
              ...item,
              notes: item.notes || [],
              size: item.size || '',
              color: item.color || '',
              variantId: item.variantId || '',
              productName: item.productName || item.product || 'Produk'
            }))
          : [];
        
        const orderData = {
          id: foundOrder.id,
          customerName: foundOrder.customerName || 'Pelanggan Tidak Dikenal',
          customerAddress: foundOrder.customerAddress || '',
          customerPhone: foundOrder.customerPhone || '',
          customerEmail: foundOrder.customerEmail || '',
          orderDate: foundOrder.orderDate || new Date().toISOString().split('T')[0],
          dueDate: foundOrder.dueDate || '',
          items: foundOrder.items || itemsDetail.length,
          totalAmount: foundOrder.totalAmount || 0,
          status: foundOrder.status || 'draft',
          notes: foundOrder.notes || '',
          itemsDetail: itemsDetail,
          timeline: foundOrder.timeline || []
        };
        
        setOrder(orderData);
        const stats = calculateCustomerStats(orderData.customerName);
        setCustomerStats(stats);
        loadOrderPhotos();
        setLoading(false);
      } else {
        setLoading(false);
      }
    }, 500);
  }, [id]);

  const handleEdit = () => {
    navigate(`/orders/edit/${id}`);
  };

  const handleDownload = () => {
    const report = { orderId: order.id, customer: order.customerName, orderData: order };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `order-${order.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
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

  if (!order) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pesanan Tidak Ditemukan</h2>
        <p className="text-gray-600 mb-6">Pesanan dengan ID {id} tidak ditemukan.</p>
        <button onClick={() => navigate('/orders')} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
          Kembali ke Daftar Pesanan
        </button>
      </div>
    );
  }

  const status = getStatusOption(order.status);
  const isOverdue = isDeadlineOverdue(order.dueDate);
  const totalQty = order.itemsDetail?.reduce((sum, item) => sum + (item.qty || 0), 0) || 0;
  const calculatedTotal = order.itemsDetail?.reduce((sum, item) => sum + ((item.qty || 0) * (item.price || 0)), 0) || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/orders')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Detail Pesanan</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <p className="text-sm text-gray-500">ID: {order.id}</p>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                {status && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                    <span>{status.icon}</span>
                    {status.label}
                  </span>
                )}
                {order.dueDate && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${isOverdue ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}`}>
                    <Calendar size={12} />
                    Jatuh Tempo: {formatShortDate(order.dueDate)}
                    {isOverdue && ' ⚠️ Terlambat!'}
                    {!isOverdue && !order.dueDate.includes('Invalid') && getRemainingDays(order.dueDate) > 0 && ` (Sisa ${getRemainingDays(order.dueDate)} hari)`}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleEdit} className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center gap-2">
              <Edit size={18} /> Edit
            </button>
            <button onClick={handlePrintInvoice} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2">
              <Printer size={18} /> Nota
            </button>
            <button onClick={handleDownload} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2">
              <Download size={18} /> Download
            </button>
          </div>
        </div>
      </div>

      {/* Customer Card with Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-6">
        <Tab.Group>
          <div className="border-b border-gray-200">
            <Tab.List className="flex">
              <Tab className={({ selected }) => `flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${selected ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
                <div className="flex items-center justify-center gap-2"><User size={16} /> Informasi</div>
              </Tab>
              <Tab className={({ selected }) => `flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${selected ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
                <div className="flex items-center justify-center gap-2"><History size={16} /> Riwayat ({customerStats?.totalOrders || 0})</div>
              </Tab>
              <Tab className={({ selected }) => `flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${selected ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
                <div className="flex items-center justify-center gap-2"><BarChart size={16} /> Statistik</div>
              </Tab>
            </Tab.List>
          </div>
          
          <Tab.Panels className="p-6">
            {/* Tab 1: Informasi Pelanggan */}
            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <User size={18} className="text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Nama Pelanggan</p>
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone size={18} className="text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Telepon</p>
                      <p className="font-medium text-gray-900">{order.customerPhone || '-'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail size={18} className="text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{order.customerEmail || '-'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin size={18} className="text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Alamat</p>
                      <p className="font-medium text-gray-900">{order.customerAddress || '-'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <CalendarIcon size={18} className="text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Tanggal Pesanan</p>
                      <p className="font-medium text-gray-900">{formatDate(order.orderDate)}</p>
                    </div>
                  </div>
                  
                  <div className={`flex items-start gap-3 p-3 rounded-lg ${isOverdue ? 'bg-red-50' : 'bg-gray-50'}`}>
                    <Clock size={18} className={isOverdue ? "text-red-500" : "text-gray-500"} />
                    <div>
                      <p className="text-xs text-gray-500">Jatuh Tempo</p>
                      <p className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                        {order.dueDate ? formatDate(order.dueDate) : 'Tidak ditentukan'}
                        {isOverdue && <span className="ml-2 text-xs text-red-500">⚠️ Terlambat!</span>}
                      </p>
                    </div>
                  </div>
                </div>
                
                {order.notes && (
                  <div className="md:col-span-2">
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <FileText size={18} className="text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Catatan Pesanan</p>
                        <p className="text-gray-700">{order.notes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Tab.Panel>
            
            {/* Tab 2: Riwayat Transaksi */}
            <Tab.Panel>
              {customerStats && customerStats.orders.length > 0 ? (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">ID Pesanan</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Tanggal</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Total</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerStats.orders.map((historyOrder) => {
                          const historyStatus = getStatusOption(historyOrder.status);
                          return (
                            <tr key={historyOrder.id} className="border-t hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium">{historyOrder.id}</td>
                              <td className="px-4 py-3 text-sm">{formatShortDate(historyOrder.orderDate)}</td>
                              <td className="px-4 py-3 text-sm font-semibold">Rp {formatCurrency(historyOrder.totalAmount)}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${historyStatus?.color || 'bg-gray-100 text-gray-800'}`}>
                                  {historyStatus?.label || historyOrder.status}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <button onClick={() => navigate(`/orders/${historyOrder.id}`)} className="text-blue-600 hover:text-blue-800 text-sm">Lihat</button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <p className="text-xs text-blue-600">Total Pesanan</p>
                      <p className="text-xl font-bold text-blue-700">{customerStats.totalOrders}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl">
                      <p className="text-xs text-green-600">Total Belanja</p>
                      <p className="text-xl font-bold text-green-700">Rp {formatCurrency(customerStats.totalSpent)}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl">
                      <p className="text-xs text-purple-600">Rata-rata</p>
                      <p className="text-xl font-bold text-purple-700">Rp {formatCurrency(customerStats.avgOrderValue)}</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button onClick={() => exportCustomerHistory(customerStats.orders)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50">
                      <FileSpreadsheet size={16} /> Export CSV
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8"><p className="text-gray-500">Belum ada riwayat transaksi</p></div>
              )}
            </Tab.Panel>
            
            {/* Tab 3: Statistik */}
            <Tab.Panel>
              {customerStats ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600">{customerStats.totalOrders}</div>
                      <div className="text-sm text-blue-800">Total Pesanan</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-green-600">Rp {formatCurrency(customerStats.totalSpent)}</div>
                      <div className="text-sm text-green-800">Total Belanja</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-purple-600">Rp {formatCurrency(customerStats.avgOrderValue)}</div>
                      <div className="text-sm text-purple-800">Rata-rata</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-yellow-600">{Object.values(customerStats.statusCounts || {}).reduce((a, b) => a + b, 0)}</div>
                      <div className="text-sm text-yellow-800">Total Order</div>
                    </div>
                  </div>
                  <div className="bg-white border rounded-xl p-5">
                    <h4 className="font-medium mb-4">Tren Pesanan 6 Bulan Terakhir</h4>
                    {Object.entries(customerStats.monthlyOrders || {}).map(([month, count]) => (
                      <div key={month} className="flex items-center mb-2">
                        <div className="w-20 text-sm">{month.split('-')[1]}/{month.split('-')[0]}</div>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(count / Math.max(...Object.values(customerStats.monthlyOrders || {}), 1)) * 100}%` }}></div>
                        </div>
                        <div className="w-12 text-right text-sm">{count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8"><p className="text-gray-500">Memuat statistik...</p></div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* Item Pesanan */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Package size={18} className="text-green-600" />
            <h3 className="font-semibold text-gray-800">Item Pesanan</h3>
            <span className="text-xs text-gray-500">({order.itemsDetail?.length || 0} item)</span>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {order.itemsDetail?.map((item, idx) => (
            <div key={idx} className="p-5 hover:bg-gray-50/50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-gray-800 text-lg">{item.productName || item.product}</h4>
                  <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Package size={14} /> Qty: {item.qty} pcs
                    </span>
                    {item.size && (
                      <span className="inline-flex items-center gap-1">
                        📏 Ukuran: {item.size}
                      </span>
                    )}
                    {item.color && (
                      <span className="inline-flex items-center gap-1">
                        🎨 Warna: {item.color}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Harga Satuan</p>
                  <p className="font-medium text-gray-800">Rp {formatCurrency(item.price)}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {item.notes?.length > 0 && (
                    <button 
                      onClick={() => openNotesModal(idx, item.productName, item.notes, true)} 
                      className="flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 rounded-lg text-xs hover:bg-yellow-100 transition-colors"
                    >
                      <MessageSquare size={12} /> {item.notes.length} catatan
                    </button>
                  )}
                  {item.variantId && (
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      Varian: {item.size} / {item.color}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Subtotal</p>
                  <p className="text-lg font-bold text-blue-600">Rp {formatCurrency((item.qty || 0) * (item.price || 0))}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Total {order.itemsDetail?.length || 0} item • {totalQty} pcs
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Total Pembayaran</p>
              <p className="text-2xl font-bold text-blue-600">Rp {formatCurrency(calculatedTotal || order.totalAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <button 
          onClick={() => setExpandedPhotoSection(!expandedPhotoSection)} 
          className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Camera size={18} className="text-blue-600" />
            <h3 className="font-semibold text-gray-800">Dokumentasi Foto</h3>
            <span className="text-xs text-gray-500">({orderPhotos.length} foto)</span>
          </div>
          {expandedPhotoSection ? <ChevronRight size={18} className="rotate-90" /> : <ChevronRight size={18} />}
        </button>
        
        {expandedPhotoSection && (
          <div className="p-6 border-t">
            <div className="mb-6 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
              <Upload className="mx-auto text-blue-600 mb-2" size={24} />
              <p className="text-sm text-gray-600 mb-2">Upload foto dokumentasi</p>
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
              <button onClick={triggerFileInput} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                Pilih Foto
              </button>
            </div>
            
            {orderPhotos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {orderPhotos.map(photo => (
                  <div key={photo.id} className="relative group cursor-pointer" onClick={() => openPhotoPreview(photo)}>
                    <img src={photo.url} className="w-full h-32 object-cover rounded-lg" alt="Dokumentasi" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleRemovePhoto(photo.id); }} 
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                    <div className="absolute bottom-1 left-1 text-xs text-white bg-black/50 px-1 rounded">
                      {formatDateTime(photo.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notes Modal */}
      {notesModal.isOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
            <div className="px-5 py-4 border-b flex justify-between items-center bg-gradient-to-r from-yellow-50 to-white">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-yellow-600" />
                <h3 className="font-bold text-gray-800">Catatan - {notesModal.itemName}</h3>
              </div>
              <button onClick={closeNotesModal} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-5">
              {!notesModal.readOnly && (
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
                    className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
                  >
                    Tambah Catatan
                  </button>
                </div>
              )}
              
              {notesModal.notes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="mx-auto mb-2" size={32} />
                  <p>Belum ada catatan</p>
                </div>
              ) : (
                notesModal.notes.map(note => (
                  <div key={note.id} className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium text-sm">{note.author}</span>
                        <span className="text-xs text-gray-500 ml-2">{formatDateTime(note.timestamp)}</span>
                      </div>
                      {!notesModal.readOnly && (
                        <button onClick={() => removeNote(note.id)} className="text-red-500 hover:text-red-700 text-xs">
                          Hapus
                        </button>
                      )}
                    </div>
                    <p className="text-sm mt-1">{note.text}</p>
                    {note.type && (
                      <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs ${getNoteTypeColor(note.type)}`}>
                        {getNoteTypeLabel(note.type)}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
            
            <div className="px-5 py-4 border-t bg-gray-50 flex justify-end">
              <button onClick={closeNotesModal} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Preview Modal */}
      {showPhotoPreview && selectedPhoto && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh]">
            <img 
              src={selectedPhoto.url} 
              className="max-w-full max-h-[90vh] object-contain" 
              style={{ transform: `scale(${photoZoom}) rotate(${photoRotation}deg)`, transition: 'transform 0.3s ease' }}
              alt="Preview"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <button onClick={() => setPhotoZoom(prev => Math.min(prev + 0.25, 3))} className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70">🔍+</button>
              <button onClick={() => setPhotoZoom(prev => Math.max(prev - 0.25, 0.5))} className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70">🔍-</button>
              <button onClick={() => setPhotoRotation(prev => (prev + 90) % 360)} className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70">🔄</button>
            </div>
            <button onClick={() => setShowPhotoPreview(false)} className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70">
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}