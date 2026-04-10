import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  Clock,
  Bell,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  X,
  Filter,
  Plus,
  Maximize2,
  ChevronLeft,
  Menu,
  Grid,
  BarChart3,
  Calendar,
  DollarSign,
  CalendarDays
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar
} from 'recharts';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function Dashboard() {
  const navigate = useNavigate();
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
  const [stageOrders, setStageOrders] = useState([]);
  const [productionCounts, setProductionCounts] = useState({
    'Cutting': 0,
    'Sewing': 0,
    'Finishing': 0,
    'Packing': 0
  });

  // State untuk Pesanan Selesai dan Dibatalkan
  const [completedOrders, setCompletedOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [cancelledCount, setCancelledCount] = useState(0);

  // ================== STATE UNTUK PESANAN AKTIF ==================
  const [activeOrders, setActiveOrders] = useState([]);
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);
  const [showActiveOrdersModal, setShowActiveOrdersModal] = useState(false);

  // ================== STATE UNTUK ITEM STUCK ==================
  const [stuckItems, setStuckItems] = useState([]);
  const [selectedStuckOrder, setSelectedStuckOrder] = useState(null);
  const [showStuckDetailModal, setShowStuckDetailModal] = useState(false);

  // Stats untuk dashboard - update nilai active orders secara dinamis
  const [stats, setStats] = useState([
    {
      title: "Pesanan Aktif",
      value: "0",
      icon: "📦",
      color: "blue",
      link: "#",
      onClick: "showActiveOrders"
    },
    {
      title: "Revenue Bulan Ini",
      value: "Rp 48.5jt",
      change: "+12.5%",
      icon: "💰",
      color: "green",
      link: "/finance"
    },
    {
      title: "Profit Margin",
      value: "33.2%",
      change: "+2.1%",
      icon: "📊",
      color: "purple",
      link: "/finance"
    },
    {
      title: "Avg Order Value",
      value: "Rp 1.25jt",
      change: "+5.3%",
      icon: "📈",
      color: "yellow",
      link: "/finance"
    },
  ]);

  // Data untuk Pesanan Terbaru (akan diisi dari localStorage)
  const [recentOrders, setRecentOrders] = useState([]);

  // Data untuk Status Produksi (akan diisi dari availableJobs)
  const [productionStatus, setProductionStatus] = useState([
    { stage: 'Cutting', count: 0, icon: '✂️', color: 'amber', jobs: [] },
    { stage: 'Sewing', count: 0, icon: '🧵', color: 'orange', jobs: [] },
    { stage: 'Finishing', count: 0, icon: '✨', color: 'lime', jobs: [] },
    { stage: 'Packing', count: 0, icon: '📦', color: 'emerald', jobs: [] }
  ]);

  // Data Mock untuk Charts
  const orderHistoryData = [
    { name: 'Sen', total: 4 },
    { name: 'Sel', total: 7 },
    { name: 'Rab', total: 5 },
    { name: 'Kam', total: 9 },
    { name: 'Jum', total: 12 },
    { name: 'Sab', total: 8 },
    { name: 'Min', total: 3 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 35 },
    { month: 'Feb', revenue: 42 },
    { month: 'Mar', revenue: 48 },
    { month: 'Apr', revenue: 38 },
    { month: 'May', revenue: 52 },
    { month: 'Jun', revenue: 61 },
  ];

  const productionMixData = [
    { name: 'Cutting', value: productionCounts.Cutting || 15 },
    { name: 'Sewing', value: productionCounts.Sewing || 45 },
    { name: 'Finishing', value: productionCounts.Finishing || 10 },
    { name: 'Packing', value: productionCounts.Packing || 20 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  // Data stok menipis
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    const loadStockData = () => {
      const savedStock = localStorage.getItem('stockItems');
      if (savedStock) {
        const stock = JSON.parse(savedStock);
        const criticalAndWarning = stock.filter(item => 
          item.status === 'critical' || item.status === 'warning'
        );
        setLowStockItems(criticalAndWarning);
      }
    };
    
    loadStockData();
    const interval = setInterval(loadStockData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Deteksi ukuran layar
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ================== FUNGSI UNTUK MENDAPATKAN PESANAN AKTIF ==================
  const getActiveOrders = () => {
    try {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const activeStatuses = [
        'cutting', 'sewing', 'finishing', 'packing', 'qc', 
        'processing', 'production', 'draft'
      ];
      const active = orders.filter(order => activeStatuses.includes(order.status));
      return active;
    } catch (error) {
      console.error('Error getting active orders:', error);
      return [];
    }
  };

  // ================== FUNGSI UNTUK MENGHITUNG ITEM STUCK ==================
  const calculateStuckItems = () => {
    try {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const today = new Date().toISOString().split('T')[0];
      const stuck = [];

      orders.forEach(order => {
        const completedStatuses = ['completed', 'delivered', 'cancelled'];
        if (completedStatuses.includes(order.status)) {
          return;
        }

        const dueDate = order.dueDate;
        
        if (dueDate && dueDate < today) {
          const dueDateObj = new Date(dueDate);
          const todayDate = new Date();
          const overdueDays = Math.ceil((todayDate - dueDateObj) / (1000 * 60 * 60 * 24));
          
          let priority = 'medium';
          if (overdueDays > 7) priority = 'critical';
          else if (overdueDays > 3) priority = 'high';
          
          stuck.push({
            id: order.id,
            orderId: order.id,
            customerName: order.customerName || 'Pelanggan',
            product: order.itemsDetail?.[0]?.productName || order.itemsDetail?.[0]?.product || 'Produk',
            department: getDepartmentFromStatus(order.status),
            stuckFor: `${overdueDays} hari`,
            reason: `Melewati jatuh tempo (${formatDate(dueDate)})`,
            priority: priority,
            assignedTo: getAssignedEmployee(order),
            deadline: dueDate,
            orderStatus: order.status,
            totalAmount: order.totalAmount,
            items: order.items,
            dueDate: dueDate
          });
        }
      });

      setStuckItems(stuck);
    } catch (error) {
      console.error('Error calculating stuck items:', error);
    }
  };

  // Helper function untuk mendapatkan departemen dari status
  const getDepartmentFromStatus = (status) => {
    const deptMap = {
      'cutting': 'Potong',
      'sewing': 'Jahit',
      'finishing': 'Finishing',
      'packing': 'Packing',
      'qc': 'QC',
      'production': 'Produksi',
      'processing': 'Processing',
      'draft': 'Draft'
    };
    return deptMap[status] || status;
  };

  // Helper function untuk mendapatkan karyawan yang ditugaskan
  const getAssignedEmployee = (order) => {
    try {
      const availableJobs = JSON.parse(localStorage.getItem('availableJobs') || '[]');
      const orderJobs = availableJobs.filter(job => job.order_id === order.id);
      const activeJob = orderJobs.find(job => job.status === 'dalam_proses');
      return activeJob?.accepted_by || 'Belum ditugaskan';
    } catch {
      return 'Belum ditugaskan';
    }
  };

  // Helper untuk mendapatkan warna priority badge
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Handler untuk klik item stuck
  const handleStuckItemClick = (stuckItem) => {
    setSelectedStuckOrder(stuckItem);
    setShowStuckDetailModal(true);
  };

  // Handler untuk klik Pesanan Aktif
  const handleActiveOrdersClick = () => {
    const active = getActiveOrders();
    setActiveOrders(active);
    setShowActiveOrdersModal(true);
  };

  // ================== FUNGSI UNTUK LOAD DATA PESANAN TERBARU ==================
  const loadRecentOrders = () => {
    try {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      // Ambil 5 pesanan terbaru (berdasarkan orderDate)
      const sortedOrders = [...orders].sort((a, b) => 
        new Date(b.orderDate) - new Date(a.orderDate)
      ).slice(0, 5);
      
      const formattedOrders = sortedOrders.map(order => {
        const dueDate = order.dueDate;
        const today = new Date().toISOString().split('T')[0];
        let deadlineText = '';
        if (dueDate) {
          if (dueDate < today) {
            deadlineText = 'Terlambat';
          } else {
            const dueDateObj = new Date(dueDate);
            const todayObj = new Date();
            const diffDays = Math.ceil((dueDateObj - todayObj) / (1000 * 60 * 60 * 24));
            deadlineText = `${diffDays} hari`;
          }
        }
        
        return {
          id: order.id,
          customer: order.customerName || 'Pelanggan',
          items: order.items || order.itemsDetail?.length || 0,
          status: order.status,
          deadline: deadlineText,
          isOverdue: dueDate && dueDate < today
        };
      });
      
      setRecentOrders(formattedOrders);
    } catch (error) {
      console.error('Error loading recent orders:', error);
    }
  };

  // ================== FUNGSI UNTUK PRODUCTION COUNTS ==================
  useEffect(() => {
    const loadProductionData = () => {
      try {
        const availableJobs = JSON.parse(localStorage.getItem('availableJobs') || '[]');
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');

        const counts = {
          'Cutting': 0,
          'Sewing': 0,
          'Finishing': 0,
          'Packing': 0
        };

        // Hitung jobs per departemen
        const deptJobs = {
          'Cutting': [],
          'Sewing': [],
          'Finishing': [],
          'Packing': []
        };

        availableJobs.forEach(job => {
          if (job.status !== 'selesai') {
            if (job.department === 'Potong') {
              counts['Cutting'] += (job.qty || 0);
              deptJobs['Cutting'].push(job);
            }
            if (job.department === 'Jahit') {
              counts['Sewing'] += (job.qty || 0);
              deptJobs['Sewing'].push(job);
            }
            if (job.department === 'Finishing') {
              counts['Finishing'] += (job.qty || 0);
              deptJobs['Finishing'].push(job);
            }
            if (job.department === 'Packing') {
              counts['Packing'] += (job.qty || 0);
              deptJobs['Packing'].push(job);
            }
          }
        });

        setProductionCounts(counts);
        
        // Update production status dengan data dari jobs
        setProductionStatus([
          { stage: 'Cutting', count: counts['Cutting'], icon: '✂️', color: 'amber', jobs: deptJobs['Cutting'] },
          { stage: 'Sewing', count: counts['Sewing'], icon: '🧵', color: 'orange', jobs: deptJobs['Sewing'] },
          { stage: 'Finishing', count: counts['Finishing'], icon: '✨', color: 'lime', jobs: deptJobs['Finishing'] },
          { stage: 'Packing', count: counts['Packing'], icon: '📦', color: 'emerald', jobs: deptJobs['Packing'] }
        ]);

        // Hitung pesanan selesai dan dibatalkan
        const completed = orders.filter(order => 
          order.status === 'completed' || order.status === 'delivered'
        );
        const cancelled = orders.filter(order => 
          order.status === 'cancelled'
        );

        setCompletedOrders(completed);
        setCancelledOrders(cancelled);
        setCompletedCount(completed.length);
        setCancelledCount(cancelled.length);

        // Hitung pesanan aktif
        const activeStatuses = [
          'cutting', 'sewing', 'finishing', 'packing', 'qc', 
          'processing', 'production', 'draft'
        ];
        const active = orders.filter(order => activeStatuses.includes(order.status));
        setActiveOrdersCount(active.length);
        
        // Update stats dengan nilai pesanan aktif
        setStats(prevStats => 
          prevStats.map(stat => 
            stat.title === "Pesanan Aktif" 
              ? { ...stat, value: active.length.toString() }
              : stat
          )
        );

        // Hitung stuck items
        calculateStuckItems();
        
        // Load recent orders
        loadRecentOrders();
      } catch (error) {
        console.error('Error loading production data:', error);
      }
    };

    loadProductionData();
    const interval = setInterval(loadProductionData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStageClick = (stageName, jobs) => {
    const targetDept = stageName === 'Cutting' ? 'Potong' :
                       stageName === 'Sewing' ? 'Jahit' :
                       stageName === 'Finishing' ? 'Finishing' : 'Packing';

    const availableJobs = JSON.parse(localStorage.getItem('availableJobs') || '[]');
    const filteredOrders = availableJobs
      .filter(job => job.department === targetDept && job.status !== 'selesai')
      .map(job => ({
        id: job.order_id,
        customer: job.customer_name || 'Pelanggan',
        product: job.product_name || 'Produk',
        qty: job.qty,
        deadline: job.deadline,
        priority: job.priority
      }));

    const uniqueOrders = Array.from(new Set(filteredOrders.map(o => o.id)))
      .map(id => filteredOrders.find(o => o.id === id));

    setStageOrders(uniqueOrders);
    setSelectedStage(stageName);
  };

  const handleStatusClick = (type) => {
    if (type === 'completed') {
      const formattedOrders = completedOrders.map(order => ({
        id: order.id,
        customerName: order.customerName,
        customer: order.customerName,
        items: order.items,
        itemsDetail: order.itemsDetail,
        totalAmount: order.totalAmount,
        orderDate: order.orderDate,
        status: order.status,
        qty: order.items
      }));
      setStageOrders(formattedOrders);
      setSelectedStage('Selesai');
    } else if (type === 'cancelled') {
      const formattedOrders = cancelledOrders.map(order => ({
        id: order.id,
        customerName: order.customerName,
        customer: order.customerName,
        items: order.items,
        itemsDetail: order.itemsDetail,
        totalAmount: order.totalAmount,
        orderDate: order.orderDate,
        status: order.status,
        qty: order.items
      }));
      setStageOrders(formattedOrders);
      setSelectedStage('Dibatalkan');
    }
  };

  // Handler untuk klik stat card
  const handleStatClick = (stat) => {
    if (stat.onClick === 'showActiveOrders') {
      handleActiveOrdersClick();
    } else if (stat.link && stat.link !== '#') {
      navigate(stat.link);
    }
  };

  // Helper untuk color classes
  const getColorClass = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      purple: 'bg-purple-100 text-purple-600',
      green: 'bg-green-100 text-green-600',
      red: 'bg-red-100 text-red-600'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-600';
  };

  // Helper untuk mendapatkan warna badge status
  const getStatusBadgeColor = (status) => {
    const colorMap = {
      cutting: 'bg-amber-100 text-amber-800',
      sewing: 'bg-orange-100 text-orange-800',
      finishing: 'bg-lime-100 text-lime-800',
      packing: 'bg-emerald-100 text-emerald-800',
      qc: 'bg-teal-100 text-teal-800',
      completed: 'bg-green-100 text-green-800',
      delivered: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800',
      processing: 'bg-blue-100 text-blue-800',
      production: 'bg-yellow-100 text-yellow-800',
      draft: 'bg-gray-100 text-gray-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      cutting: 'Potong',
      sewing: 'Jahit',
      finishing: 'Finishing',
      packing: 'Packing',
      qc: 'QC',
      completed: 'Selesai',
      delivered: 'Terkirim',
      cancelled: 'Dibatalkan',
      processing: 'Diproses',
      production: 'Produksi',
      draft: 'Draft'
    };
    return labelMap[status] || status;
  };

  // Helper untuk stock status
  const getStockStatus = (current, min) => {
    const percentage = (current / min) * 100;
    if (percentage <= 25) return { status: 'critical', color: 'text-red-600', bg: 'bg-red-50' };
    if (percentage <= 50) return { status: 'warning', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { status: 'low', color: 'text-green-600', bg: 'bg-green-50' };
  };

  // Helper untuk mendapatkan badge status order
  const getStatusBadge = (status) => {
    const statusMap = {
      'cutting': { label: 'Potong', color: 'bg-amber-100 text-amber-800' },
      'sewing': { label: 'Jahit', color: 'bg-orange-100 text-orange-800' },
      'finishing': { label: 'Finishing', color: 'bg-lime-100 text-lime-800' },
      'packing': { label: 'Packing', color: 'bg-emerald-100 text-emerald-800' },
      'qc': { label: 'QC', color: 'bg-teal-100 text-teal-800' },
      'processing': { label: 'Diproses', color: 'bg-blue-100 text-blue-800' },
      'production': { label: 'Produksi', color: 'bg-yellow-100 text-yellow-800' },
      'draft': { label: 'Draft', color: 'bg-gray-100 text-gray-800' },
      'completed': { label: 'Selesai', color: 'bg-green-100 text-green-800' },
      'delivered': { label: 'Terkirim', color: 'bg-purple-100 text-purple-800' },
      'cancelled': { label: 'Dibatalkan', color: 'bg-red-100 text-red-800' }
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <div className={`space-y-3 md:space-y-6 mt-2 ${isFullscreen ? 'fixed inset-0 bg-white z-40 overflow-auto p-2 md:p-4' : ''}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">Dashboard Produksi</h2>
          <p className="text-xs md:text-sm text-gray-600 mt-0.5">Ringkasan aktivitas produksi terkini</p>
        </div>
        <div className="flex items-center gap-2">
          {isMobile ? (
            <>
              <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
                <Maximize2 size={20} />
              </button>
              <Link to="/orders/create">
                <Button variant="primary" size="sm" className="text-xs">
                  <Plus size={14} className="mr-1" /> Pesanan
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/orders/create">
              <Button variant="primary" size="sm">
                <Plus size={16} className="mr-1.5" /> Buat Pesanan Baru
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {/* Stuck Items Alert */}
        <div className="enterprise-card p-3 md:p-4 animate-enter-fade delay-100">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <div className="flex items-center">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-red-100 rounded-lg flex items-center justify-center mr-2 md:mr-3">
                <AlertTriangle size={isMobile ? 16 : 20} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm md:text-base">Item Stuck</h3>
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-0.5">Perhatian Khusus</p>
              </div>
            </div>
            <span className="bg-red-100 text-red-800 text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">
              {stuckItems.length}
            </span>
          </div>

          <div className="space-y-1.5 md:space-y-2">
            {stuckItems.slice(0, 2).map((item, index) => (
              <div 
                key={index} 
                onClick={() => handleStuckItemClick(item)}
                className="py-2 border-b border-slate-100 last:border-0 group cursor-pointer hover:bg-red-50/50 rounded-lg transition-colors"
              >
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="text-xs md:text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-red-700 transition-colors">
                      {item.product}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      <p className="text-[10px] text-slate-500 font-medium">Order: {item.orderId}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                    {item.stuckFor}
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1 border-l-2 border-red-200 pl-2 mt-1.5">
                  {item.reason}
                </p>
              </div>
            ))}
            {stuckItems.length === 0 && (
              <div className="text-center py-4 text-gray-500 text-sm">
                Tidak ada item stuck
              </div>
            )}
          </div>

          <button
            onClick={() => setShowAllAlerts(true)}
            className="w-full mt-2 md:mt-3 text-center text-xs md:text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Lihat semua {stuckItems.length} item stuck
          </button>
        </div>

        {/* Low Stock Alert */}
        <div className="enterprise-card p-3 md:p-4 animate-enter-fade delay-200">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <div className="flex items-center">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-2 md:mr-3">
                <AlertCircle size={isMobile ? 16 : 20} className="text-yellow-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm md:text-base">Stok Menipis</h3>
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-0.5">Daftar Pengadaan</p>
              </div>
            </div>
            <Link 
              to="/stock?status=critical"
              className="bg-yellow-100 text-yellow-800 text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full hover:bg-yellow-200 transition-colors"
            >
              {lowStockItems.filter(item => item.status === 'critical').length} kritis
            </Link>
          </div>

          <div className="space-y-1.5 md:space-y-2">
            {lowStockItems.filter(item => item.status === 'critical').slice(0, 2).map((item, index) => (
              <Link 
                key={index} 
                to={`/stock?search=${encodeURIComponent(item.material)}`}
                className="py-2 border-b border-slate-100 last:border-0 group block hover:bg-yellow-50/50 rounded-lg transition-colors"
              >
                <div className="flex justify-between items-center mb-1.5">
                  <div><p className="text-xs md:text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-yellow-700 transition-colors">{item.material}</p></div>
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{item.currentStock} {item.unit}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1 mt-1 overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: `${(item.currentStock / item.minStock) * 100}%` }}></div>
                </div>
              </Link>
            ))}
          </div>

          <Link 
            to="/stock"
            className="w-full mt-2 md:mt-3 text-center text-xs md:text-sm text-yellow-600 hover:text-yellow-800 font-medium block"
          >
            Lihat semua {lowStockItems.length} bahan menipis
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="enterprise-card p-3 md:p-4 animate-enter-fade delay-300">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <div className="flex items-center">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-2 md:mr-3">
                <Package size={isMobile ? 16 : 20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm md:text-base">Statistik Cepat</h3>
                <p className="text-xs text-gray-600">Status produksi</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1.5 md:gap-2">
            <div className="text-center p-2 md:p-3 border border-slate-100 rounded-lg bg-white shadow-sm">
              <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">85<span className="text-sm">%</span></div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mt-1">Efisiensi</div>
            </div>
            <div className="text-center p-2 md:p-3 border border-slate-100 rounded-lg bg-white shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
              <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{completedCount}</div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mt-1">Selesai</div>
            </div>
            <div className="text-center p-2 md:p-3 border border-slate-100 rounded-lg bg-white shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
              <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">8</div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mt-1">Pending</div>
            </div>
            <div className="text-center p-2 md:p-3 border border-slate-100 rounded-lg bg-white shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
              <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{stuckItems.length}</div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mt-1">Stuck</div>
            </div>
          </div>
          <button onClick={() => { calculateStuckItems(); loadRecentOrders(); }} className="w-full mt-2 md:mt-3 text-center text-xs md:text-sm text-blue-600 hover:text-blue-800 font-medium">
            Refresh data
          </button>
        </div>
      </div>

      {/* Stats Grid - PESANAN AKTIF SEKARANG BISA DIKLIK */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            onClick={() => handleStatClick(stat)}
            className={`block enterprise-card p-4 animate-enter-fade ${stat.onClick === 'showActiveOrders' ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
            style={{ animationDelay: `${(index + 3) * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">{stat.title}</p>
                <div className="flex items-end mt-0.5 md:mt-1">
                  <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                  {stat.change && (
                    <span className={`ml-1 text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                  )}
                </div>
              </div>
              <div className={`text-lg md:text-xl p-2 md:p-2.5 rounded-xl enterprise-stat-icon ${getColorClass(stat.color)}`}>
                <span className="drop-shadow-sm">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Order Trend Chart */}
        <Card className="enterprise-card p-4 md:p-6 animate-enter-fade delay-300">
          <div className="flex items-center justify-between mb-6">
            <div><h3 className="text-lg font-bold text-gray-800 flex items-center"><BarChart3 size={18} className="mr-2 text-blue-500" /> Tren Pesanan (7 Hari)</h3><p className="text-xs text-gray-500">Jumlah pesanan masuk per hari</p></div>
            <select className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none"><option>Minggu ini</option><option>Minggu lalu</option></select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={orderHistoryData}>
                <defs><linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Production Mix Chart */}
        <Card className="enterprise-card p-4 md:p-6 animate-enter-fade delay-400">
          <div className="flex items-center justify-between mb-6">
            <div><h3 className="text-lg font-bold text-gray-800 flex items-center"><Grid size={18} className="mr-2 text-purple-500" /> Distribusi Produksi</h3><p className="text-xs text-gray-500">Persentase beban kerja tiap tahap</p></div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span><span className="text-[10px] text-gray-500 uppercase font-bold">Real-time</span></div>
          </div>
          <div className="h-64 w-full flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={productionMixData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {productionMixData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 mt-4 md:mt-0 grid grid-cols-2 gap-3">
              {productionMixData.map((entry, index) => (
                <div key={entry.name} className="flex flex-col p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-1"><span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span><span className="text-xs font-medium text-gray-600">{entry.name}</span></div>
                  <span className="text-sm font-bold text-gray-800 pl-4">{entry.value} item</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Revenue Chart */}
        <Card className="enterprise-card p-4 md:p-6 lg:col-span-2 animate-enter-fade delay-500">
          <div className="flex items-center justify-between mb-6">
            <div><h3 className="text-lg font-bold text-gray-800 flex items-center"><DollarSign size={18} className="mr-2 text-green-500" /> Performa Keuangan (Rp Juta)</h3><p className="text-xs text-gray-500">Rekapitulasi pendapatan 6 bulan terakhir</p></div>
            <div className="flex items-center bg-gray-100 p-1 rounded-lg"><button className="px-3 py-1 bg-white text-[10px] font-bold rounded-md shadow-sm">Revenue</button><button className="px-3 py-1 text-[10px] font-bold text-gray-500">Margin</button></div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Two Column Layout - FULL WIDTH dengan grid yang memenuhi space */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Orders - FULL WIDTH di kiri */}
        <Card className="enterprise-card animate-enter-fade delay-200 h-full">
          <CardHeader className="border-b border-gray-100 pb-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm md:text-base flex items-center gap-2">
                  <Clock size={16} className="text-blue-500" />
                  Pesanan Terbaru
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">5 pesanan terakhir yang masuk</p>
              </div>
              <Link to="/orders" className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                Lihat semua <ChevronRight size={12} />
              </Link>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-gray-100">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => {
                  const statusBadge = getStatusBadge(order.status);
                  return (
                    <Link 
                      key={order.id} 
                      to={`/orders/${order.id}`}
                      className="block p-4 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-bold text-blue-600 text-sm">{order.id}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge.color}`}>
                              {statusBadge.label}
                            </span>
                            {order.isOverdue && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                                ⚠️ Terlambat
                              </span>
                            )}
                          </div>
                          <p className="font-medium text-gray-800 text-sm">{order.customer}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Package size={12} /> {order.items} item
                            </span>
                            {order.deadline && (
                              <span className={`flex items-center gap-1 ${order.isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
                                <Clock size={12} /> Deadline: {order.deadline}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <Package className="text-gray-400" size={24} />
                  </div>
                  <p className="text-gray-500 text-sm">Belum ada pesanan</p>
                  <Link to="/orders/create" className="mt-3 inline-block text-blue-600 text-sm hover:text-blue-700">
                    Buat pesanan pertama →
                  </Link>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Production Status - FULL WIDTH di kanan */}
        <Card className="enterprise-card animate-enter-fade delay-300 h-full">
          <CardHeader className="border-b border-gray-100 pb-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm md:text-base flex items-center gap-2">
                  <Grid size={16} className="text-green-500" />
                  Status Produksi
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Jumlah item dalam setiap tahap produksi</p>
              </div>
              <Link to="/joblist" className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                Lihat semua <ChevronRight size={12} />
              </Link>
            </div>
          </CardHeader>
          <CardBody className="p-4">
            <div className="space-y-3">
              {productionStatus.map((stage) => {
                const colorMap = {
                  amber: 'bg-amber-50 border-amber-200 hover:border-amber-300',
                  orange: 'bg-orange-50 border-orange-200 hover:border-orange-300',
                  lime: 'bg-lime-50 border-lime-200 hover:border-lime-300',
                  emerald: 'bg-emerald-50 border-emerald-200 hover:border-emerald-300'
                };
                const iconColorMap = {
                  amber: 'text-amber-600',
                  orange: 'text-orange-600',
                  lime: 'text-lime-600',
                  emerald: 'text-emerald-600'
                };
                const badgeColorMap = {
                  amber: 'bg-amber-100 text-amber-800',
                  orange: 'bg-orange-100 text-orange-800',
                  lime: 'bg-lime-100 text-lime-800',
                  emerald: 'bg-emerald-100 text-emerald-800'
                };
                
                return (
                  <div 
                    key={stage.stage}
                    onClick={() => handleStageClick(stage.stage, stage.jobs)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 ${colorMap[stage.color]} hover:shadow-sm active:scale-[0.99]`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm`}>
                        {stage.icon}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{stage.stage}</p>
                        <p className="text-xs text-gray-500">Departemen</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className={`font-black text-lg ${iconColorMap[stage.color]}`}>{stage.count}</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase">item</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${badgeColorMap[stage.color]}`}>
                        {stage.count > 0 ? `${stage.count} item` : 'Kosong'}
                      </div>
                      <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>
                );
              })}
              
              {/* Pesanan Selesai Card */}
              <div 
                onClick={() => handleStatusClick('completed')}
                className="flex items-center justify-between p-3 rounded-xl border border-green-200 bg-green-50 cursor-pointer transition-all duration-200 hover:shadow-sm active:scale-[0.99] hover:border-green-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm">
                    ✅
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Pesanan Selesai</p>
                    <p className="text-xs text-gray-500">Telah selesai</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-black text-lg text-green-600">{completedCount}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">pesanan</p>
                  </div>
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {completedCount > 0 ? `${completedCount} selesai` : 'Belum ada'}
                  </div>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-green-500 transition-colors" />
                </div>
              </div>
              
              {/* Pesanan Dibatalkan Card */}
              <div 
                onClick={() => handleStatusClick('cancelled')}
                className="flex items-center justify-between p-3 rounded-xl border border-red-200 bg-red-50 cursor-pointer transition-all duration-200 hover:shadow-sm active:scale-[0.99] hover:border-red-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm">
                    ❌
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Pesanan Dibatalkan</p>
                    <p className="text-xs text-gray-500">Telah dibatalkan</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-black text-lg text-red-600">{cancelledCount}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">pesanan</p>
                  </div>
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {cancelledCount > 0 ? `${cancelledCount} batal` : 'Belum ada'}
                  </div>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* ================== MODAL PESANAN AKTIF ================== */}
      {showActiveOrdersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-xs md:max-w-lg lg:max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-3 md:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800">Pesanan Aktif</h3>
                    <p className="text-xs md:text-sm text-gray-600 mt-0.5">
                      Menampilkan pesanan yang masih dalam proses pengerjaan
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowActiveOrdersModal(false)} className="p-1.5 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[60vh] md:max-h-[70vh] p-3 md:p-6">
              {activeOrders.length > 0 ? (
                <div className="space-y-3">
                  {/* Header Table */}
                  <div className="hidden md:grid grid-cols-12 gap-3 bg-gray-50 p-3 rounded-lg text-xs font-semibold text-gray-600 border">
                    <div className="col-span-2">ID PESANAN</div>
                    <div className="col-span-3">PELANGGAN</div>
                    <div className="col-span-2">TANGGAL</div>
                    <div className="col-span-1 text-center">ITEM</div>
                    <div className="col-span-2 text-right">TOTAL</div>
                    <div className="col-span-2">STATUS</div>
                  </div>
                  
                  {activeOrders.map((order) => {
                    const statusBadge = getStatusBadge(order.status);
                    return (
                      <div 
                        key={order.id} 
                        className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => {
                          setShowActiveOrdersModal(false);
                          navigate(`/orders/${order.id}`);
                        }}
                      >
                        <div className="flex flex-col md:grid md:grid-cols-12 gap-3">
                          <div className="md:col-span-2">
                            <p className="font-bold text-blue-600 text-sm">{order.id}</p>
                          </div>
                          <div className="md:col-span-3">
                            <p className="font-medium text-gray-800 text-sm">{order.customerName}</p>
                            {order.customerPhone && (
                              <p className="text-xs text-gray-500">{order.customerPhone}</p>
                            )}
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-sm text-gray-600">{formatDate(order.orderDate)}</p>
                            {order.dueDate && (
                              <p className={`text-xs ${order.dueDate < new Date().toISOString().split('T')[0] ? 'text-red-500' : 'text-gray-400'}`}>
                                Jatuh tempo: {formatDate(order.dueDate)}
                              </p>
                            )}
                          </div>
                          <div className="md:col-span-1 text-center">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {order.items} item
                            </span>
                          </div>
                          <div className="md:col-span-2 text-right">
                            <p className="font-semibold text-gray-800 text-sm">
                              Rp {formatCurrency(order.totalAmount)}
                            </p>
                          </div>
                          <div className="md:col-span-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                              {statusBadge.label}
                            </span>
                          </div>
                        </div>
                        
                        {/* Preview produk pertama */}
                        {order.itemsDetail && order.itemsDetail.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500">
                              Produk: {order.itemsDetail.slice(0, 2).map(item => item.productName || item.product).join(', ')}
                              {order.itemsDetail.length > 2 && ` +${order.itemsDetail.length - 2} lainnya`}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Package className="text-gray-400" size={32} />
                  </div>
                  <h4 className="text-gray-800 font-bold">Tidak ada pesanan aktif</h4>
                  <p className="text-sm text-gray-500 max-w-[240px] mx-auto mt-1">
                    Saat ini tidak ada pesanan yang sedang dalam proses pengerjaan.
                  </p>
                  <Link 
                    to="/orders/create"
                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} className="mr-1" />
                    Buat Pesanan Baru
                  </Link>
                </div>
              )}
            </div>

            <div className="p-3 md:p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
              <div className="text-xs md:text-sm text-gray-600">
                Total {activeOrders.length} pesanan aktif
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowActiveOrdersModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Tutup
                </button>
                <Link
                  to="/orders"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Lihat Semua Pesanan
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal untuk Stuck Item Detail */}
      {showStuckDetailModal && selectedStuckOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-md md:max-w-lg max-h-[90vh] overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="text-red-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Detail Item Stuck</h3>
                    <p className="text-xs text-gray-600">Pesanan melewati jatuh tempo</p>
                  </div>
                </div>
                <button onClick={() => setShowStuckDetailModal(false)} className="p-1.5 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-4 md:p-6 space-y-4">
              {/* Order Info */}
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs text-gray-500">ID Pesanan</p>
                    <p className="font-bold text-gray-800 text-lg">{selectedStuckOrder.orderId}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityBadge(selectedStuckOrder.priority)}`}>
                    {selectedStuckOrder.priority?.toUpperCase() || 'MEDIUM'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Pelanggan</p>
                    <p className="font-medium text-gray-800">{selectedStuckOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Produk</p>
                    <p className="font-medium text-gray-800">{selectedStuckOrder.product}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status Order</p>
                    <p className="font-medium text-gray-800">{getDepartmentFromStatus(selectedStuckOrder.orderStatus)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Pesanan</p>
                    <p className="font-medium text-gray-800">Rp {formatCurrency(selectedStuckOrder.totalAmount)}</p>
                  </div>
                </div>
              </div>

              {/* Deadline Info */}
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarDays size={16} className="text-yellow-600" />
                  <h4 className="font-semibold text-gray-800">Informasi Deadline</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Jatuh Tempo</p>
                    <p className="font-medium text-red-600">{formatDate(selectedStuckOrder.dueDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Terlambat</p>
                    <p className="font-medium text-red-600 font-bold">{selectedStuckOrder.stuckFor}</p>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-red-100 rounded-lg">
                  <p className="text-sm text-red-700 flex items-center gap-2">
                    <AlertCircle size={14} />
                    {selectedStuckOrder.reason}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Link
                  to={`/orders/${selectedStuckOrder.orderId}`}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-center hover:bg-blue-700 transition-colors"
                  onClick={() => setShowStuckDetailModal(false)}
                >
                  Lihat Detail Order
                </Link>
                <Link
                  to={`/orders/edit/${selectedStuckOrder.orderId}`}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold text-center hover:bg-gray-50 transition-colors"
                  onClick={() => setShowStuckDetailModal(false)}
                >
                  Edit Order
                </Link>
              </div>
            </div>

            <div className="p-4 md:p-6 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-600 text-center">
                Segera tindak lanjuti pesanan yang melewati deadline untuk menghindari keterlambatan lebih lanjut.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal untuk All Alerts (Stuck Items + Low Stock) */}
      {showAllAlerts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-xs md:max-w-lg lg:max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-3 md:p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800">Semua Alert & Notifikasi</h3>
                  <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">Monitoring item stuck dan stok bahan</p>
                </div>
                <button onClick={() => setShowAllAlerts(false)} className="p-1.5 hover:bg-gray-100 rounded-full"><X size={18} /></button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[60vh] md:max-h-[70vh]">
              {/* Stuck Items Section */}
              <div className="p-3 md:p-6 border-b border-gray-200">
                <div className="flex items-center mb-3 md:mb-4">
                  <AlertTriangle size={18} className="text-red-500 mr-1.5 md:mr-2" />
                  <h4 className="font-semibold text-gray-800 text-sm md:text-base">Item Stuck dalam Produksi</h4>
                  <span className="ml-1.5 md:ml-2 bg-red-100 text-red-800 text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">{stuckItems.length} item</span>
                </div>
                <div className="space-y-2 md:space-y-3">
                  {stuckItems.length > 0 ? (
                    stuckItems.map((item, index) => (
                      <div key={index} className="p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setShowAllAlerts(false); handleStuckItemClick(item); }}>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center gap-1 mb-1">
                              <span className="font-bold text-gray-800 text-sm">{item.orderId}</span>
                              <span className="px-2 py-0.5 bg-white border border-red-300 text-red-700 text-xs font-semibold rounded w-fit">{item.department}</span>
                            </div>
                            <p className="text-gray-800 font-medium text-sm mt-1">{item.product}</p>
                            <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">Pelanggan: {item.customerName}</p>
                            <div className="flex flex-col md:flex-row md:items-center mt-1 md:mt-2 text-xs md:text-sm gap-1">
                              <div className="flex items-center"><Clock size={12} className="text-red-500 mr-1" /><span className="text-red-600 font-semibold">Terlambat {item.stuckFor}</span></div>
                              <span className="hidden md:block mx-1">•</span>
                              <span className="text-gray-600">Deadline: {formatDate(item.dueDate)}</span>
                            </div>
                          </div>
                          <div className="text-right md:text-left">
                            <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs font-bold ${getPriorityBadge(item.priority)} inline-block mb-1 md:mb-2`}>
                              {item.priority?.toUpperCase() || 'MEDIUM'}
                            </span>
                            <div className="flex gap-2 mt-2">
                              <Link to={`/orders/${item.orderId}`} className="px-2 md:px-3 py-1 md:py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">Lihat Order</Link>
                              <Link to={`/orders/edit/${item.orderId}`} className="px-2 md:px-3 py-1 md:py-1.5 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50">Edit</Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">Tidak ada item stuck</div>
                  )}
                </div>
              </div>

              {/* Low Stock Section */}
              <div className="p-3 md:p-6">
                <div className="flex items-center mb-3 md:mb-4">
                  <AlertCircle size={18} className="text-yellow-500 mr-1.5 md:mr-2" />
                  <h4 className="font-semibold text-gray-800 text-sm md:text-base">Stok Bahan Menipis</h4>
                  <span className="ml-1.5 md:ml-2 bg-yellow-100 text-yellow-800 text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">{lowStockItems.filter(item => item.status === 'critical').length} kritis</span>
                </div>
                <div className="space-y-2 md:space-y-3">
                  {lowStockItems.map((item, index) => {
                    const stockStatus = getStockStatus(item.currentStock, item.minStock);
                    return (
                      <div key={index} className="p-3 md:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center gap-1 mb-1">
                              <span className="font-bold text-gray-800 text-sm">{item.id}</span>
                              <span className={`px-2 py-0.5 text-xs font-semibold rounded w-fit ${stockStatus.bg} ${stockStatus.color}`}>{stockStatus.status.toUpperCase()}</span>
                            </div>
                            <p className="text-gray-800 font-medium text-sm mt-1">{item.material}</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 md:gap-4 mt-2 md:mt-3">
                              <div><div className="text-xs text-gray-600">Stok Saat Ini</div><div className="font-bold text-gray-800 text-sm">{item.currentStock} {item.unit}</div></div>
                              <div><div className="text-xs text-gray-600">Stok Minimal</div><div className="font-bold text-gray-800 text-sm">{item.minStock} {item.unit}</div></div>
                            </div>
                            <div className="mt-2 md:mt-3"><div className="flex justify-between text-xs mb-0.5"><span className="text-gray-600">Tingkat Stok</span><span className="font-bold">{Math.round((item.currentStock / item.minStock) * 100)}%</span></div><div className="w-full bg-gray-200 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${stockStatus.status === 'critical' ? 'bg-red-500' : 'bg-yellow-500'}`} style={{ width: `${(item.currentStock / item.minStock) * 100}%` }}></div></div></div>
                          </div>
                          <div className="mt-2 md:mt-0"><button className="px-3 md:px-4 py-1.5 md:py-2 bg-blue-600 text-white text-xs md:text-sm rounded-lg hover:bg-blue-700 w-full">Pesan Bahan</button></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-3 md:p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                <div className="text-xs md:text-sm text-gray-600">Terakhir diperbarui: {new Date().toLocaleTimeString('id-ID')}</div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                  <button onClick={() => setShowAllAlerts(false)} className="px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm w-full sm:w-auto">Tutup</button>
                  <button className="px-3 md:px-4 py-1.5 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm w-full sm:w-auto">Ekspor Laporan</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Stage Detail */}
      {selectedStage && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col scale-in">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-xl">
                  {selectedStage === 'Cutting' ? '✂️' : selectedStage === 'Sewing' ? '🧵' : selectedStage === 'Finishing' ? '✨' : selectedStage === 'Packing' ? '📦' : selectedStage === 'Selesai' ? '✅' : selectedStage === 'Dibatalkan' ? '❌' : '📋'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Daftar Pesanan - {selectedStage}</h3>
                  <p className="text-xs text-gray-500">{selectedStage === 'Selesai' ? 'Pesanan yang telah selesai diproses dan dikirim' : selectedStage === 'Dibatalkan' ? 'Pesanan yang telah dibatalkan oleh customer atau admin' : 'Menampilkan pesanan yang sedang diproses di departemen ini'}</p>
                </div>
              </div>
              <button onClick={() => setSelectedStage(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {stageOrders.length > 0 ? (
                <div className="space-y-3">
                  {stageOrders.map((order) => (
                    <div key={order.id} className={`p-4 bg-white border rounded-xl hover:shadow-md transition-all group ${selectedStage === 'Selesai' ? 'border-green-200 hover:border-green-300' : selectedStage === 'Dibatalkan' ? 'border-red-200 hover:border-red-300' : 'border-gray-100 hover:border-primary-200'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-black text-primary-600 text-sm">{order.id}</span>
                            {selectedStage === 'Selesai' && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-green-100 text-green-800">Selesai</span>}
                            {selectedStage === 'Dibatalkan' && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-red-100 text-red-800">Dibatalkan</span>}
                          </div>
                          <h4 className="font-bold text-gray-800">{order.customerName || order.customer}</h4>
                          <p className="text-sm text-gray-600 mt-0.5">{order.itemsDetail ? `${order.itemsDetail.length} item` : order.product || `${order.items} item`}</p>
                          {order.totalAmount && <p className="text-sm font-semibold text-gray-700 mt-1">Total: Rp {formatCurrency(order.totalAmount)}</p>}
                        </div>
                        <div className="text-right"><p className="text-lg font-black text-gray-900 leading-tight">{order.qty || order.items || 0}</p><p className="text-[10px] text-gray-500 font-bold uppercase">item</p></div>
                      </div>
                      <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500"><Clock size={12} className="mr-1 text-primary-400" />{order.orderDate ? <>Tanggal: <span className="ml-1 font-semibold text-gray-700">{formatDate(order.orderDate)}</span></> : order.deadline ? <>Deadline: <span className="ml-1 font-semibold text-gray-700">{order.deadline}</span></> : <>Selesai: <span className="ml-1 font-semibold text-gray-700">{order.completed_at ? formatDate(order.completed_at) : '-'}</span></>}</div>
                        <Link to={`/orders/${order.id}`} className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center group-hover:translate-x-1 transition-transform">Lihat Detail <ChevronRight size={14} className="ml-0.5" /></Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${selectedStage === 'Selesai' ? 'bg-green-50' : selectedStage === 'Dibatalkan' ? 'bg-red-50' : 'bg-slate-50'}`}>
                    {selectedStage === 'Selesai' ? <CheckCircle size={32} className="text-green-500" /> : selectedStage === 'Dibatalkan' ? <AlertCircle size={32} className="text-red-500" /> : <Package size={32} className="text-slate-300" />}
                  </div>
                  <h4 className="text-gray-800 font-bold">{selectedStage === 'Selesai' ? 'Belum ada pesanan selesai' : selectedStage === 'Dibatalkan' ? 'Belum ada pesanan dibatalkan' : 'Tidak ada pesanan'}</h4>
                  <p className="text-sm text-gray-500 max-w-[240px] mt-1">{selectedStage === 'Selesai' ? 'Pesanan yang selesai akan muncul di sini' : selectedStage === 'Dibatalkan' ? 'Pesanan yang dibatalkan akan muncul di sini' : `Saat ini tidak ada pesanan aktif di departemen ${selectedStage}.`}</p>
                  {selectedStage === 'Selesai' && <Link to="/orders" className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700">Lihat Semua Pesanan</Link>}
                  {selectedStage === 'Dibatalkan' && <Link to="/orders" className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700">Lihat Semua Pesanan</Link>}
                </div>
              )}
            </div>
            <div className="p-5 border-t border-gray-100 bg-slate-50/30 flex justify-end">
              <button onClick={() => setSelectedStage(null)} className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm shadow-sm">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}