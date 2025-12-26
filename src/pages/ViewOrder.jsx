import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
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
  FileClock
} from 'lucide-react';

export default function ViewOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timelineData, setTimelineData] = useState([]);
  const [isEditingTimeline, setIsEditingTimeline] = useState(false);
  const [activeStep, setActiveStep] = useState(null);

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

  // Fungsi untuk handle update timeline
  const handleTimelineUpdate = (index, field, value) => {
    const newTimeline = [...timelineData];
    
    if (field === 'startTime' || field === 'completeTime') {
      // Format value untuk input datetime-local
      newTimeline[index][field] = value;
      
      // Jika kedua waktu sudah diisi, hitung durasi
      if (newTimeline[index].startTime && newTimeline[index].completeTime) {
        newTimeline[index].duration = calculateDuration(
          newTimeline[index].startTime,
          newTimeline[index].completeTime
        );
        newTimeline[index].isCompleted = true;
        newTimeline[index].isInProgress = false;
        newTimeline[index].progress = 100;
      } else if (newTimeline[index].startTime && !newTimeline[index].completeTime) {
        newTimeline[index].isInProgress = true;
        newTimeline[index].progress = 45;
      }
    } else {
      newTimeline[index][field] = value;
    }
    
    setTimelineData(newTimeline);
  };

  // Fungsi untuk update progress
  const handleProgressUpdate = (index, newProgress) => {
    const newTimeline = [...timelineData];
    newTimeline[index].progress = Math.min(100, Math.max(0, newProgress));
    
    if (newTimeline[index].progress === 100 && !newTimeline[index].completeTime) {
      newTimeline[index].completeTime = new Date().toISOString().slice(0, 16);
      newTimeline[index].duration = calculateDuration(
        newTimeline[index].startTime,
        newTimeline[index].completeTime
      );
      newTimeline[index].isCompleted = true;
      newTimeline[index].isInProgress = false;
    }
    
    setTimelineData(newTimeline);
  };

  // Fungsi untuk save timeline
  const handleSaveTimeline = () => {
    // Validasi data timeline
    const invalidSteps = timelineData.filter(step => 
      step.completeTime && !step.startTime
    );
    
    if (invalidSteps.length > 0) {
      alert('Step dengan waktu selesai harus memiliki waktu mulai!');
      return;
    }
    
    // Simpan ke localStorage
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = savedOrders.map(o => 
      o.id === order.id ? { 
        ...o, 
        timeline: timelineData,
        // Update order status berdasarkan timeline
        status: timelineData.find(step => step.isInProgress)?.status || 
                timelineData[timelineData.length - 1]?.status || 
                order.status
      } : o
    );
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    // Update order state
    setOrder(prev => ({ 
      ...prev, 
      timeline: timelineData,
      status: timelineData.find(step => step.isInProgress)?.status || prev.status
    }));
    
    setIsEditingTimeline(false);
    alert('✅ Timeline berhasil diperbarui!');
  };

  // Fungsi untuk reset timeline
  const handleResetTimeline = () => {
    if (window.confirm('Reset timeline ke data default? Perubahan yang belum disimpan akan hilang.')) {
      initializeTimeline(order);
    }
  };

  // Fungsi untuk mulai step
  const handleStartStep = (index) => {
    const newTimeline = [...timelineData];
    newTimeline[index].startTime = new Date().toISOString().slice(0, 16);
    newTimeline[index].isInProgress = true;
    newTimeline[index].progress = 5; // Mulai dengan 5%
    newTimeline[index].employee = 'User Aktif';
    setTimelineData(newTimeline);
    setActiveStep(index);
  };

  // Fungsi untuk selesaikan step
  const handleCompleteStep = (index) => {
    const newTimeline = [...timelineData];
    newTimeline[index].completeTime = new Date().toISOString().slice(0, 16);
    newTimeline[index].duration = calculateDuration(
      newTimeline[index].startTime,
      newTimeline[index].completeTime
    );
    newTimeline[index].isCompleted = true;
    newTimeline[index].isInProgress = false;
    newTimeline[index].progress = 100;
    
    // Jika ada step berikutnya, set sebagai active
    if (index < newTimeline.length - 1) {
      newTimeline[index + 1].isInProgress = true;
      setActiveStep(index + 1);
    }
    
    setTimelineData(newTimeline);
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

  // Hitung estimasi waktu selesai
  const calculateEstimatedCompletion = () => {
    const activeStep = timelineData.find(step => step.isInProgress);
    if (!activeStep || !activeStep.startTime) return '';
    
    const startTime = new Date(activeStep.startTime);
    const estimatedHours = 8; // Estimasi default 8 jam per step
    const estimatedEnd = new Date(startTime.getTime() + (estimatedHours * 60 * 60 * 1000));
    
    return formatDateTime(estimatedEnd.toISOString());
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
          itemsDetail: Array.isArray(foundOrder.itemsDetail) ? foundOrder.itemsDetail : [
            { product: 'Kemeja Pria Slimfit', qty: 2, price: 150000, subtotal: 300000 },
            { product: 'Celana Jeans Denim', qty: 1, price: 250000, subtotal: 250000 },
            { product: 'Jaket Hoodie', qty: 1, price: 300000, subtotal: 300000 }
          ],
          timeline: foundOrder.timeline || []
        };
        
        setOrder(orderData);
        
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
            { product: 'Kemeja Pria Slimfit', qty: 2, price: 150000, subtotal: 300000 },
            { product: 'Celana Jeans Denim', qty: 1, price: 250000, subtotal: 250000 },
            { product: 'Jaket Hoodie', qty: 1, price: 300000, subtotal: 300000 }
          ],
          timeline: []
        };
        
        setOrder(mockOrder);
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
        estimatedCompletion: calculateEstimatedCompletion()
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
            </div>
          </div>

          {/* Order Timeline - Enhanced Version */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 timeline-step-appear">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-semibold text-gray-800">Timeline Produksi</h3>
                <p className="text-sm text-gray-600 mt-1">Lacak progress setiap langkah produksi</p>
              </div>
              {isEditingTimeline ? (
                <div className="flex space-x-2">
                  <button 
                    onClick={handleResetTimeline}
                    className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 flex items-center timeline-no-print"
                  >
                    <X size={14} className="mr-1" />
                    Reset
                  </button>
                  <button 
                    onClick={() => setIsEditingTimeline(false)}
                    className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 timeline-no-print"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleSaveTimeline}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center timeline-no-print"
                  >
                    <Save size={14} className="mr-1" />
                    Simpan
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsEditingTimeline(true)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 flex items-center timeline-no-print"
                >
                  <Edit size={14} className="mr-1" />
                  Edit Timeline
                </button>
              )}
            </div>
            
            {/* Progress Summary */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-gray-50 rounded-xl border border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center">
                    <div className="text-2xl font-bold text-blue-600 mr-3">
                      {completedSteps}/{totalSteps}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Progress Keseluruhan</p>
                      <p className="text-xs text-gray-600">
                        {progressPercentage}% selesai • {calculateTotalDuration()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">Step Aktif</p>
                  <p className="text-lg font-bold text-blue-600">
                    {timelineData.find(step => step.isInProgress)?.label || 'Tidak ada'}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 timeline-progress-bar">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 timeline-progress-fill"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            
            {/* Timeline Steps */}
            <div className="space-y-4">
              {timelineData.map((step, index) => {
                const isCurrentStep = step.status === order.status;
                const isActive = step.isInProgress || (isCurrentStep && !step.isCompleted);
                const stepProgress = step.progress || 0;
                
                return (
                  <div key={step.id} className="relative timeline-step-hover">
                    {/* Timeline connector */}
                    {index < timelineData.length - 1 && (
                      <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-200 z-0 timeline-connector"></div>
                    )}
                    
                    <div className="flex timeline-step-container">
                      {/* Timeline indicator */}
                      <div className="relative z-10 mr-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${
                          step.isCompleted ? 'bg-green-500' : 
                          isActive ? 'bg-blue-500 animate-timeline-pulse timeline-step-active' : 'bg-gray-300'
                        }`}>
                          {step.isCompleted ? (
                            <CheckCircle size={18} className="text-white" />
                          ) : isActive ? (
                            <Clock size={18} className="text-white" />
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-gray-100"></div>
                          )}
                        </div>
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs text-gray-500">
                          Step {step.id}
                        </div>
                      </div>
                      
                      {/* Step content */}
                      <div className="flex-1">
                        <div className={`p-4 rounded-xl border timeline-step-card ${
                          isActive ? 'border-blue-200 bg-blue-50' : 
                          step.isCompleted ? 'border-green-200 bg-green-50' : 
                          'border-gray-200 bg-gray-50'
                        }`}>
                          {/* Step header */}
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center">
                                <h4 className={`font-bold ${
                                  step.isCompleted ? 'text-green-800' : 
                                  isActive ? 'text-blue-800' : 'text-gray-700'
                                }`}>
                                  {step.label}
                                </h4>
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold border ${
                                  step.isCompleted ? 'bg-green-100 text-green-800 border-green-300 timeline-status-completed' : 
                                  isActive ? 'bg-blue-100 text-blue-800 border-blue-300 timeline-status-current' : 
                                  'bg-gray-100 text-gray-800 border-gray-300 timeline-status-pending'
                                }`}>
                                  {step.isCompleted ? 'Selesai' : 
                                   isActive ? 'Dalam Proses' : 'Menunggu'}
                                </span>
                              </div>
                              <div className="flex items-center mt-1">
                                <Package size={12} className="text-gray-400 mr-1" />
                                <p className={`text-xs ${
                                  step.isCompleted ? 'text-green-600' : 
                                  isActive ? 'text-blue-600' : 'text-gray-500'
                                }`}>
                                  {step.description}
                                </p>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="flex items-center justify-end mb-1">
                                <Users size={12} className="text-gray-400 mr-1" />
                                <p className="text-xs text-gray-500">Departemen</p>
                              </div>
                              <p className="text-sm font-medium text-gray-800">{step.department}</p>
                            </div>
                          </div>
                          
                          {/* Employee & Progress Info */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <User size={12} className="text-gray-400 mr-1" />
                              <span className="text-xs text-gray-600">
                                {step.employee || 'Belum ditugaskan'}
                              </span>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="w-32">
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Progress</span>
                                <span className="font-semibold">{stepProgress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    step.isCompleted ? 'bg-green-500' : 
                                    isActive ? 'bg-blue-500' : 'bg-gray-300'
                                  }`}
                                  style={{ width: `${stepProgress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Time inputs */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 timeline-time-inputs timeline-time-inputs-responsive">
                            {/* Start Time */}
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1 timeline-time-label">
                                <Clock size={12} className="mr-1" />
                                Waktu Mulai
                              </label>
                              {isEditingTimeline ? (
                                <div className="flex items-center">
                                  <input
                                    type="datetime-local"
                                    value={formatDateTimeForInput(step.startTime)}
                                    onChange={(e) => handleTimelineUpdate(index, 'startTime', e.target.value)}
                                    className="flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent timeline-time-input"
                                    placeholder="Pilih waktu mulai"
                                  />
                                  <button
                                    onClick={() => handleTimelineUpdate(index, 'startTime', '')}
                                    className="ml-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg timeline-no-print"
                                    disabled={!step.startTime}
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between">
                                  <div className="p-2 bg-white border border-gray-200 rounded-lg flex-1">
                                    <p className="text-sm text-gray-800 font-mono">
                                      {step.startTime ? formatDateTime(step.startTime) : 'Belum dimulai'}
                                    </p>
                                  </div>
                                  {!step.startTime && !isEditingTimeline && (
                                    <button
                                      onClick={() => handleStartStep(index)}
                                      className="ml-2 px-3 py-2 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 timeline-no-print"
                                    >
                                      Mulai
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {/* Complete Time */}
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1 timeline-time-label">
                                <CheckCircle size={12} className="mr-1" />
                                Waktu Selesai
                              </label>
                              {isEditingTimeline ? (
                                <div className="flex items-center">
                                  <input
                                    type="datetime-local"
                                    value={formatDateTimeForInput(step.completeTime)}
                                    onChange={(e) => handleTimelineUpdate(index, 'completeTime', e.target.value)}
                                    className="flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent timeline-time-input"
                                    placeholder="Pilih waktu selesai"
                                    disabled={!step.startTime}
                                  />
                                  <button
                                    onClick={() => handleTimelineUpdate(index, 'completeTime', '')}
                                    className="ml-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg timeline-no-print"
                                    disabled={!step.completeTime}
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between">
                                  <div className="p-2 bg-white border border-gray-200 rounded-lg flex-1">
                                    <p className="text-sm text-gray-800 font-mono">
                                      {step.completeTime ? formatDateTime(step.completeTime) : 'Belum selesai'}
                                    </p>
                                  </div>
                                  {step.startTime && !step.completeTime && !isEditingTimeline && (
                                    <button
                                      onClick={() => handleCompleteStep(index)}
                                      className="ml-2 px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 timeline-no-print"
                                    >
                                      Selesai
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Duration & Progress Controls */}
                          <div className="flex justify-between items-center mt-3">
                            <div className="flex items-center">
                              {step.duration && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-gray-100 text-gray-700 timeline-duration-badge">
                                  <Clock size={10} className="mr-1" />
                                  {step.duration}
                                </span>
                              )}
                            </div>
                            
                            {/* Progress Controls */}
                            {isActive && !step.isCompleted && (
                              <div className="flex space-x-1 timeline-no-print">
                                <button
                                  onClick={() => handleProgressUpdate(index, stepProgress - 10)}
                                  disabled={stepProgress <= 0}
                                  className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                                >
                                  -10%
                                </button>
                                <button
                                  onClick={() => handleProgressUpdate(index, stepProgress + 10)}
                                  disabled={stepProgress >= 100}
                                  className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                                >
                                  +10%
                                </button>
                                <button
                                  onClick={() => handleProgressUpdate(index, stepProgress + 25)}
                                  disabled={stepProgress >= 100}
                                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
                                >
                                  +25%
                                </button>
                              </div>
                            )}
                          </div>
                          
                          {/* Notes */}
                          <div className="mt-3">
                            {isEditingTimeline ? (
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Catatan Tambahan
                                </label>
                                <textarea
                                  value={step.notes || ''}
                                  onChange={(e) => handleTimelineUpdate(index, 'notes', e.target.value)}
                                  className="w-full p-2 text-sm border border-gray-300 rounded-lg resize-none"
                                  rows="2"
                                  placeholder="Tambahkan catatan untuk step ini..."
                                />
                              </div>
                            ) : step.notes ? (
                              <div className="p-2 bg-white border border-gray-200 rounded">
                                <div className="flex items-start">
                                  <FileClock size={12} className="text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs font-medium text-gray-700 mb-1">Catatan:</p>
                                    <p className="text-xs text-gray-600">{step.notes}</p>
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </div>
                          
                          {/* Estimated Completion for Active Step */}
                          {isActive && !step.completeTime && step.startTime && (
                            <div className="mt-3 p-2 bg-blue-50 border border-blue-100 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Clock size={12} className="text-blue-600 mr-2" />
                                  <span className="text-xs font-medium text-blue-700">Estimasi Selesai:</span>
                                </div>
                                <span className="text-xs font-semibold text-blue-800">
                                  {calculateEstimatedCompletion()}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Timeline Summary */}
            <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                <FileClock size={16} className="mr-2" />
                Statistik Timeline
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-white rounded-lg border shadow-sm">
                  <div className="text-xl font-bold text-blue-600">{completedSteps}</div>
                  <div className="text-xs text-gray-600">Step Selesai</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border shadow-sm">
                  <div className="text-xl font-bold text-yellow-600">
                    {timelineData.filter(s => s.isInProgress).length}
                  </div>
                  <div className="text-xs text-gray-600">Dalam Proses</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border shadow-sm">
                  <div className="text-xl font-bold text-green-600">
                    {timelineData.filter(s => s.startTime && s.completeTime).length}
                  </div>
                  <div className="text-xs text-gray-600">Dengan Durasi</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border shadow-sm">
                  <div className="text-xl font-bold text-purple-600">
                    {calculateTotalDuration()}
                  </div>
                  <div className="text-xs text-gray-600">Total Waktu</div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg mr-3">
                <Package size={20} />
              </div>
              <h3 className="font-semibold text-gray-800">Item Pesanan</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">PRODUK</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">QTY</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">HARGA SATUAN</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">SUBTOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.itemsDetail?.map((item, index) => {
                    const itemQty = item.qty || 0;
                    const itemPrice = item.price || 0;
                    const subtotal = itemQty * itemPrice;
                    
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{item.product}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                            {itemQty} pcs
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          Rp {formatCurrency(itemPrice)}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          Rp {formatCurrency(subtotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Total Section */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-gray-600">
                  Total {order.items} item • {totalQty} pcs
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Pembayaran</p>
                  <p className="text-2xl font-bold text-blue-600">
                    Rp {formatCurrency(order.totalAmount)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Card */}
          {order.notes && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Catatan Pesanan</h3>
              <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                <p className="text-gray-800">{order.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Details & Summary */}
        <div className="space-y-6">
          {/* Order Status Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-6">Status Pesanan</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {status.icon}
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Status Saat Ini</p>
                    <p className="font-medium text-gray-900">{status.label}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${status.color}`}>
                  {status.label}
                </span>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">Estimasi Penyelesaian</p>
                <div className="flex items-center">
                  <Calendar size={16} className="text-gray-400 mr-2" />
                  <span className="font-medium text-gray-900">
                    {order.dueDate ? formatLongDate(order.dueDate) : 'Belum ditentukan'}
                  </span>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm font-medium text-blue-800 mb-1">Timeline Progress</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-blue-600">Selesai: {completedSteps} step</span>
                  <span className="text-xs text-blue-600">Sisa: {totalSteps - completedSteps} step</span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="text-center mt-2">
                  <span className="text-xs font-semibold text-blue-700">{progressPercentage}% Complete</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-6">Detail Pesanan</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar size={18} className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Tanggal Pesanan</p>
                  <p className="font-medium text-gray-900">
                    {formatLongDate(order.orderDate)}
                  </p>
                </div>
              </div>
              
              {order.dueDate && (
                <div className="flex items-center">
                  <Clock size={18} className="text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Tanggal Jatuh Tempo</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(order.dueDate)}
                    </p>
                  </div>
                </div>
              )}
              
              <div>
                <p className="text-sm text-gray-600 mb-1">ID Pesanan</p>
                <p className="font-medium text-gray-900 font-mono bg-gray-50 p-2 rounded border">{order.id}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">Aksi Timeline</p>
                <div className="space-y-2">
                  <button
                    onClick={() => setIsEditingTimeline(!isEditingTimeline)}
                    className="w-full flex items-center justify-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors timeline-no-print"
                  >
                    {isEditingTimeline ? (
                      <>
                        <X size={14} className="mr-2" />
                        Batalkan Edit
                      </>
                    ) : (
                      <>
                        <Edit size={14} className="mr-2" />
                        Edit Timeline
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors timeline-no-print"
                  >
                    <Download size={14} className="mr-2" />
                    Download Timeline Report
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Active Step Info */}
          {activeStep !== null && timelineData[activeStep] && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Clock size={18} className="mr-2 text-blue-600" />
                Step Aktif
              </h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Nama Step</p>
                  <p className="font-bold text-blue-700">{timelineData[activeStep].label}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-600 mb-1">Departemen</p>
                  <div className="flex items-center">
                    <Users size={12} className="text-gray-400 mr-2" />
                    <span className="font-medium text-gray-800">{timelineData[activeStep].department}</span>
                  </div>
                </div>
                
                {timelineData[activeStep].startTime && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Dimulai Pada</p>
                    <div className="flex items-center">
                      <Clock size={12} className="text-gray-400 mr-2" />
                      <span className="font-mono text-sm text-gray-800">
                        {formatDateTime(timelineData[activeStep].startTime)}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="pt-3 border-t border-blue-100">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress Saat Ini</span>
                    <span className="font-bold">{timelineData[activeStep].progress}%</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${timelineData[activeStep].progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-6">Informasi Pembayaran</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">Rp {formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Diskon:</span>
                <span className="font-medium text-green-600">Rp 0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pajak (10%):</span>
                <span className="font-medium">Rp {formatCurrency(order.totalAmount * 0.1)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-semibold">Total:</span>
                  <span className="text-xl font-bold text-blue-600">
                    Rp {formatCurrency(order.totalAmount * 1.1)}
                  </span>
                </div>
              </div>
              
              <div className="pt-4">
                <p className="text-sm text-gray-600 mb-2">Status Pembayaran</p>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="font-medium text-green-700">Lunas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-6">Aksi Cepat</h3>
            <div className="space-y-3">
              <button
                onClick={handleEdit}
                className="w-full py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center timeline-no-print"
              >
                <Edit size={16} className="mr-2" />
                Edit Pesanan
              </button>
              <button
                onClick={() => navigate('/tracking')}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center timeline-no-print"
              >
                <FileClock size={16} className="mr-2" />
                Tracking Produksi
              </button>
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center timeline-no-print"
              >
                <Printer size={16} className="mr-2" />
                Print Semua Dokumen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}