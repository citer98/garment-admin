import React, { useState, useEffect } from 'react';
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
  DollarSign
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar
} from 'recharts';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import StatCard from '../components/StatCard';

export default function Dashboard() {
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

  const stats = [
    {
      title: "Pesanan Aktif",
      value: "12",
      change: "+2",
      icon: "📦",
      color: "blue",
      link: "/orders"
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
  ];

  const recentOrders = [
    { id: 'ORD-00124', customer: 'Toko Maju Jaya', items: 3, status: 'production', deadline: '2 hari' },
    { id: 'ORD-00123', customer: 'Butik Modern', items: 1, status: 'cutting', deadline: '1 hari' },
    { id: 'ORD-00122', customer: 'Konveksi Sejahtera', items: 5, status: 'sewing', deadline: '3 hari' },
  ];

  // Data kinerja departemen dengan mini-chart
  const departmentPerformance = [
    {
      name: 'Potong',
      totalJobs: 24,
      completed: 18,
      pending: 6,
      efficiency: 85,
      avgTime: '2.5 jam',
      trend: 'up',
      color: 'blue',
      icon: '✂️',
      employees: 8
    },
    {
      name: 'Jahit',
      totalJobs: 32,
      completed: 28,
      pending: 4,
      efficiency: 92,
      avgTime: '4 jam',
      trend: 'up',
      color: 'green',
      icon: '🧵',
      employees: 12
    },
    {
      name: 'Finishing',
      totalJobs: 28,
      completed: 22,
      pending: 6,
      efficiency: 78,
      avgTime: '1.5 jam',
      trend: 'down',
      color: 'yellow',
      icon: '✨',
      employees: 6
    },
    {
      name: 'Packing',
      totalJobs: 20,
      completed: 19,
      pending: 1,
      efficiency: 95,
      avgTime: '1 jam',
      trend: 'up',
      color: 'purple',
      icon: '📦',
      employees: 5
    },
    {
      name: 'QC',
      totalJobs: 18,
      completed: 16,
      pending: 2,
      efficiency: 88,
      avgTime: '0.8 jam',
      trend: 'stable',
      color: 'red',
      icon: '✅',
      employees: 4
    }
  ];

  // Data Mock untuk Charts
  const orderHistoryData = [
    { name: 'Mon', total: 4 },
    { name: 'Tue', total: 7 },
    { name: 'Wed', total: 5 },
    { name: 'Thu', total: 9 },
    { name: 'Fri', total: 12 },
    { name: 'Sat', total: 8 },
    { name: 'Sun', total: 3 },
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

  // Data stuck items
  const stuckItems = [
    {
      id: 'ORD-00120',
      product: 'Kemeja Pria Slimfit',
      department: 'Jahit',
      stuckFor: '3 hari',
      reason: 'Menunggu benang khusus',
      priority: 'high',
      assignedTo: 'Budi Santoso'
    },
    {
      id: 'ORD-00118',
      product: 'Celana Chino Premium',
      department: 'Finishing',
      stuckFor: '2 hari',
      reason: 'Kekurangan kancing',
      priority: 'high',
      assignedTo: 'Siti Aminah'
    },
    {
      id: 'ORD-00115',
      product: 'Jaket Hoodie',
      department: 'Potong',
      stuckFor: '1 hari',
      reason: 'Pola belum disetujui',
      priority: 'medium',
      assignedTo: 'Joko Anwar'
    }
  ];

  // Data stok menipis
  const lowStockItems = [
    {
      id: 'MAT-001',
      material: 'Kain Katun 30s',
      currentStock: 45,
      minStock: 100,
      unit: 'meter',
      status: 'critical'
    },
    {
      id: 'MAT-002',
      material: 'Benang Polyester',
      currentStock: 12,
      minStock: 50,
      unit: 'roll',
      status: 'critical'
    },
    {
      id: 'MAT-003',
      material: 'Kancing Metalik',
      currentStock: 85,
      minStock: 200,
      unit: 'pcs',
      status: 'warning'
    },
    {
      id: 'MAT-004',
      material: 'Resleting Nylon',
      currentStock: 60,
      minStock: 150,
      unit: 'pcs',
      status: 'warning'
    },
    {
      id: 'MAT-005',
      material: 'Label Brand',
      currentStock: 110,
      minStock: 300,
      unit: 'pcs',
      status: 'low'
    }
  ];

  // Deteksi ukuran layar
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sync real counts from localStorage
  useEffect(() => {
    const loadProductionData = () => {
      try {
        const availableJobs = JSON.parse(localStorage.getItem('availableJobs') || '[]');

        // Map Indonesian department names to English labels in the card
        const counts = {
          'Cutting': 0,
          'Sewing': 0,
          'Finishing': 0,
          'Packing': 0
        };

        availableJobs.forEach(job => {
          if (job.status !== 'selesai') {
            if (job.department === 'Potong') counts['Cutting'] += (job.qty || 0);
            if (job.department === 'Jahit') counts['Sewing'] += (job.qty || 0);
            if (job.department === 'Finishing') counts['Finishing'] += (job.qty || 0);
            if (job.department === 'Packing') counts['Packing'] += (job.qty || 0);
          }
        });

        setProductionCounts(counts);
      } catch (error) {
        console.error('Error loading production data:', error);
      }
    };

    loadProductionData();
    // Refresh every 30 seconds
    const interval = setInterval(loadProductionData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStageClick = (stageName) => {
    const deptMap = {
      'Cutting': 'Potong',
      'Sewing': 'Jahit',
      'Finishing': 'Finishing',
      'Packing': 'Packing'
    };

    const targetDept = deptMap[stageName];
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

    // Remove duplicates if any (one order might have multiple jobs, though rarely in the same dept)
    const uniqueOrders = Array.from(new Set(filteredOrders.map(o => o.id)))
      .map(id => filteredOrders.find(o => o.id === id));

    setStageOrders(uniqueOrders);
    setSelectedStage(stageName);
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

  // Helper untuk trend icon
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp size={14} className="text-green-500" />;
      case 'down': return <TrendingDown size={14} className="text-red-500" />;
      default: return <span className="text-gray-400">→</span>;
    }
  };

  // Helper untuk progress bar color
  const getProgressColor = (efficiency) => {
    if (efficiency >= 90) return 'bg-green-500';
    if (efficiency >= 75) return 'bg-blue-500';
    if (efficiency >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Helper untuk priority badge
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'critical':
      case 'high':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Helper untuk stock status
  const getStockStatus = (current, min) => {
    const percentage = (current / min) * 100;
    if (percentage <= 25) return { status: 'critical', color: 'text-red-600', bg: 'bg-red-50' };
    if (percentage <= 50) return { status: 'warning', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { status: 'low', color: 'text-green-600', bg: 'bg-green-50' };
  };



  // Mobile Department Card
  const MobileDepartmentCard = ({ dept }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClass(dept.color)} mr-3`}>
            <span className="text-lg">{dept.icon}</span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 text-sm">{dept.name}</h4>
            <p className="text-xs text-gray-500">{dept.employees} orang</p>
          </div>
        </div>
        {getTrendIcon(dept.trend)}
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Efisiensi</span>
          <span className="font-bold">{dept.efficiency}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${getProgressColor(dept.efficiency)}`}
            style={{ width: `${dept.efficiency}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="bg-blue-50 p-2 rounded">
          <div className="text-xs text-blue-700">Selesai</div>
          <div className="font-bold text-blue-800 text-sm">{dept.completed}</div>
        </div>
        <div className="bg-yellow-50 p-2 rounded">
          <div className="text-xs text-yellow-700">Pending</div>
          <div className="font-bold text-yellow-800 text-sm">{dept.pending}</div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex justify-between items-center text-xs">
          <div className="text-gray-600">Rata-rata waktu:</div>
          <div className="font-semibold text-gray-800">{dept.avgTime}</div>
        </div>
      </div>
    </div>
  );

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
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
              >
                <Maximize2 size={20} />
              </button>

              <Button variant="primary" size="sm" className="text-xs">
                <Plus size={14} className="mr-1" />
                Pesanan
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" size="sm">
                <Plus size={16} className="mr-1.5" />
                Buat Pesanan Baru
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Alert Summary Cards - Responsive Grid */}
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
              <div key={index} className="py-2 border-b border-slate-100 last:border-0 group">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="text-xs md:text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-red-700 transition-colors">{item.product}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      <p className="text-[10px] text-slate-500 font-medium">{item.department}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">{item.stuckFor}</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1 border-l-2 border-red-200 pl-2 mt-1.5">{item.reason}</p>
              </div>
            ))}
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
            <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">
              {lowStockItems.filter(item => item.status === 'critical').length} kritis
            </span>
          </div>

          <div className="space-y-1.5 md:space-y-2">
            {lowStockItems
              .filter(item => item.status === 'critical')
              .slice(0, 2)
              .map((item, index) => {
                const stockStatus = getStockStatus(item.currentStock, item.minStock);
                return (
                  <div key={index} className="py-2 border-b border-slate-100 last:border-0 group">
                    <div className="flex justify-between items-center mb-1.5">
                      <div>
                        <p className="text-xs md:text-sm font-bold text-slate-800 line-clamp-1">{item.material}</p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {item.currentStock} {item.unit}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1 mt-1 overflow-hidden">
                      <div
                        className="bg-red-500 h-full rounded-full"
                        style={{ width: `${(item.currentStock / item.minStock) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>

          <button
            onClick={() => setShowAllAlerts(true)}
            className="w-full mt-2 md:mt-3 text-center text-xs md:text-sm text-yellow-600 hover:text-yellow-800 font-medium"
          >
            Lihat semua {lowStockItems.length} bahan menipis
          </button>
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
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">

            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 md:gap-2">
            <div className="text-center p-2 md:p-3 border border-slate-100 rounded-lg bg-white shadow-sm">
              <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">85<span className="text-sm">%</span></div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mt-1">Efisiensi</div>
            </div>
            <div className="text-center p-2 md:p-3 border border-slate-100 rounded-lg bg-white shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
              <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">92</div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mt-1">Selesai</div>
            </div>
            <div className="text-center p-2 md:p-3 border border-slate-100 rounded-lg bg-white shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
              <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">8</div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mt-1">Pending</div>
            </div>
            <div className="text-center p-2 md:p-3 border border-slate-100 rounded-lg bg-white shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
              <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">3</div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mt-1">Stuck</div>
            </div>
          </div>

          <button className="w-full mt-2 md:mt-3 text-center text-xs md:text-sm text-blue-600 hover:text-blue-800 font-medium">
            Refresh data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, index) => (
          <a
            key={index}
            href={stat.link}
            className="block enterprise-card p-4 animate-enter-fade"
            style={{ animationDelay: `${(index + 3) * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">{stat.title}</p>
                <div className="flex items-end mt-0.5 md:mt-1">
                  <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                  <span className={`ml-1 text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`text-lg md:text-xl p-2 md:p-2.5 rounded-xl enterprise-stat-icon ${getColorClass(stat.color)}`}>
                <span className="drop-shadow-sm">{stat.icon}</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Order Trend Chart */}
        <Card className="enterprise-card p-4 md:p-6 animate-enter-fade delay-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <BarChart3 size={18} className="mr-2 text-blue-500" />
                Tren Pesanan (7 Hari)
              </h3>
              <p className="text-xs text-gray-500">Jumlah pesanan masuk per hari</p>
            </div>
            <select className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none">
              <option>Minggu ini</option>
              <option>Minggu lalu</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={orderHistoryData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Production Mix Chart */}
        <Card className="enterprise-card p-4 md:p-6 animate-enter-fade delay-400">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <Grid size={18} className="mr-2 text-purple-500" />
                Distribusi Produksi
              </h3>
              <p className="text-xs text-gray-500">Persentase beban kerja tiap tahap</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-[10px] text-gray-500 uppercase font-bold">Real-time</span>
            </div>
          </div>
          <div className="h-64 w-full flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productionMixData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {productionMixData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 mt-4 md:mt-0 grid grid-cols-2 gap-3">
              {productionMixData.map((entry, index) => (
                <div key={entry.name} className="flex flex-col p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-1">
                    <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <span className="text-xs font-medium text-gray-600">{entry.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800 pl-4">{entry.value} item</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Revenue Performance Chart */}
        <Card className="enterprise-card p-4 md:p-6 lg:col-span-2 animate-enter-fade delay-500">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <DollarSign size={18} className="mr-2 text-green-500" />
                Performa Keuangan (Rp Juta)
              </h3>
              <p className="text-xs text-gray-500">Rekapitulasi pendapatan 6 bulan terakhir</p>
            </div>
            <div className="flex items-center bg-gray-100 p-1 rounded-lg">
              <button className="px-3 py-1 bg-white text-[10px] font-bold rounded-md shadow-sm">Revenue</button>
              <button className="px-3 py-1 text-[10px] font-bold text-gray-500">Margin</button>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <Card className="enterprise-card p-2 md:p-3 lg:col-span-1 animate-enter-fade delay-200">
          <CardHeader className="pb-1 md:pb-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800 text-sm md:text-base">Pesanan Terbaru</h3>
              <a href="/orders" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                Lihat semua →
              </a>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-2 md:space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-1.5 md:p-2 hover:bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <p className="font-medium text-gray-800 text-xs md:text-sm">{order.id}</p>
                    <p className="text-xs text-gray-600 line-clamp-1">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-1.5 md:px-2 py-0.5 md:py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {order.items} item
                    </span>
                    <p className="text-xs text-gray-600 mt-0.5">Deadline: {order.deadline}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Production Status */}
        <Card className="enterprise-card p-2 md:p-3 lg:col-span-1 animate-enter-fade delay-300">
          <CardHeader className="pb-1 md:pb-2 border-b border-gray-50 mb-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800 text-sm md:text-base">Status Produksi</h3>
              {/* <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                Live
              </span> */}
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3 md:space-y-4">
              {['Cutting', 'Sewing', 'Finishing', 'Packing'].map((stage) => (
                <div
                  key={stage}
                  onClick={() => handleStageClick(stage)}
                  className="flex items-center justify-between p-2.5 hover:bg-slate-50 cursor-pointer rounded-xl transition-all duration-200 border border-transparent hover:border-slate-200 hover:shadow-sm active:scale-[0.98] group"
                >
                  <div className="flex items-center">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-white group-hover:shadow-sm transition-colors border border-slate-100">
                      <span className="text-lg md:text-xl transform group-hover:scale-110 transition-transform">
                        {stage === 'Cutting' ? '✂️' :
                          stage === 'Sewing' ? '🧵' :
                            stage === 'Finishing' ? '✨' : '📦'}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-xs md:text-sm group-hover:text-primary-600 transition-colors">{stage}</p>
                      <p className="text-[10px] text-gray-500 font-medium">Departemen</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center space-x-3">
                    <div>
                      <p className="font-black text-gray-900 text-sm md:text-lg leading-none">{productionCounts[stage] || 0}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">item</p>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Department Performance Summary */}
        <Card className="enterprise-card p-2 md:p-3 lg:col-span-1 animate-enter-fade delay-400">
          <CardHeader className="pb-1 md:pb-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800 text-sm md:text-base">Kinerja Departemen</h3>
              <a href="/joblist" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                Detail →
              </a>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-2 md:space-y-4">
              <div className="grid grid-cols-2 gap-1.5 md:gap-3 mb-1 md:mb-2">
                <div className="enterprise-pill p-2 md:p-3 overflow-hidden group">
                  <div className="flex items-center relative z-10">
                    <Users size={14} className="text-slate-600 mr-1 md:mr-2" />
                    <span className="text-xs text-slate-500 font-medium">Karyawan</span>
                  </div>
                  <p className="text-sm md:text-xl font-black text-slate-900 mt-1 relative z-10">35</p>
                </div>
                <div className="enterprise-pill p-2 md:p-3 overflow-hidden group">
                  <div className="flex items-center relative z-10">
                    <Package size={14} className="text-slate-600 mr-1 md:mr-2" />
                    <span className="text-xs text-slate-500 font-medium">Pekerjaan</span>
                  </div>
                  <p className="text-sm md:text-xl font-black text-slate-900 mt-1 relative z-10">122</p>
                </div>
              </div>

              <div className="space-y-1.5 md:space-y-2">
                {departmentPerformance.slice(0, 3).map((dept) => (
                  <div key={dept.name} className="p-1.5 md:p-2 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-0.5 md:mb-1">
                      <div className="flex items-center">
                        <span className="mr-1.5 md:mr-2 text-base md:text-lg">{dept.icon}</span>
                        <span className="text-xs md:text-sm font-medium text-gray-800">{dept.name}</span>
                      </div>
                      <div className="flex items-center">
                        {getTrendIcon(dept.trend)}
                        <span className={`ml-0.5 md:ml-1 text-xs font-bold ${dept.trend === 'up' ? 'text-green-600' :
                          dept.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                          {dept.efficiency}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1 md:h-1.5">
                      <div
                        className={`h-1 md:h-1.5 rounded-full ${getProgressColor(dept.efficiency)}`}
                        style={{ width: `${dept.efficiency}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-0.5 md:mt-1">
                      <span>{dept.completed}/{dept.totalJobs} selesai</span>
                      <span className="flex items-center">
                        <Clock size={10} className="mr-0.5 md:mr-1" />
                        {dept.avgTime}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Department Performance Full Chart - Hidden */}

      {/* Modal untuk Alerts Lengkap - Responsive */}
      {showAllAlerts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-xs md:max-w-lg lg:max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-3 md:p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800">Semua Alert & Notifikasi</h3>
                  <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">Monitoring item stuck dan stok bahan</p>
                </div>
                <button
                  onClick={() => setShowAllAlerts(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-full"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[60vh] md:max-h-[70vh]">
              {/* Stuck Items Section */}
              <div className="p-3 md:p-6 border-b border-gray-200">
                <div className="flex items-center mb-3 md:mb-4">
                  <AlertTriangle size={18} className="text-red-500 mr-1.5 md:mr-2" />
                  <h4 className="font-semibold text-gray-800 text-sm md:text-base">Item Stuck dalam Produksi</h4>
                  <span className="ml-1.5 md:ml-2 bg-red-100 text-red-800 text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">
                    {stuckItems.length} item
                  </span>
                </div>

                <div className="space-y-2 md:space-y-3">
                  {stuckItems.map((item, index) => (
                    <div key={index} className="p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center gap-1 mb-1">
                            <span className="font-bold text-gray-800 text-sm">{item.id}</span>
                            <span className="px-2 py-0.5 bg-white border border-red-300 text-red-700 text-xs font-semibold rounded w-fit">
                              {item.department}
                            </span>
                          </div>
                          <p className="text-gray-800 font-medium text-sm mt-1">{item.product}</p>
                          <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">Alasan: {item.reason}</p>
                          <div className="flex flex-col md:flex-row md:items-center mt-1 md:mt-2 text-xs md:text-sm gap-1">
                            <div className="flex items-center">
                              <Clock size={12} className="text-red-500 mr-1" />
                              <span className="text-red-600 font-semibold">Stuck {item.stuckFor}</span>
                            </div>
                            <span className="hidden md:block mx-1">•</span>
                            <span className="text-gray-600">Ditangani: {item.assignedTo}</span>
                          </div>
                        </div>
                        <div className="text-right md:text-left">
                          <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs font-bold ${getPriorityBadge(item.priority)} inline-block mb-1 md:mb-2`}>
                            {item.priority.toUpperCase()}
                          </span>
                          <button className="px-2 md:px-3 py-1 md:py-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-700 w-full md:w-auto">
                            Tindak Lanjut
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Section */}
              <div className="p-3 md:p-6">
                <div className="flex items-center mb-3 md:mb-4">
                  <AlertCircle size={18} className="text-yellow-500 mr-1.5 md:mr-2" />
                  <h4 className="font-semibold text-gray-800 text-sm md:text-base">Stok Bahan Menipis</h4>
                  <span className="ml-1.5 md:ml-2 bg-yellow-100 text-yellow-800 text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">
                    {lowStockItems.filter(item => item.status === 'critical').length} kritis
                  </span>
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
                              <span className={`px-2 py-0.5 text-xs font-semibold rounded w-fit ${stockStatus.bg} ${stockStatus.color}`}>
                                {stockStatus.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-gray-800 font-medium text-sm mt-1">{item.material}</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 md:gap-4 mt-2 md:mt-3">
                              <div>
                                <div className="text-xs text-gray-600">Stok Saat Ini</div>
                                <div className="font-bold text-gray-800 text-sm">{item.currentStock} {item.unit}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-600">Stok Minimal</div>
                                <div className="font-bold text-gray-800 text-sm">{item.minStock} {item.unit}</div>
                              </div>
                            </div>
                            <div className="mt-2 md:mt-3">
                              <div className="flex justify-between text-xs mb-0.5">
                                <span className="text-gray-600">Tingkat Stok</span>
                                <span className="font-bold">{Math.round((item.currentStock / item.minStock) * 100)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className={`h-1.5 rounded-full ${stockStatus.status === 'critical' ? 'bg-red-500' : 'bg-yellow-500'}`}
                                  style={{ width: `${(item.currentStock / item.minStock) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <button className="px-3 md:px-4 py-1.5 md:py-2 bg-blue-600 text-white text-xs md:text-sm rounded-lg hover:bg-blue-700 w-full">
                              Pesan Bahan
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-3 md:p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                <div className="text-xs md:text-sm text-gray-600">
                  Terakhir diperbarui: {new Date().toLocaleTimeString('id-ID')}
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                  <button
                    onClick={() => setShowAllAlerts(false)}
                    className="px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm w-full sm:w-auto"
                  >
                    Tutup
                  </button>
                  <button className="px-3 md:px-4 py-1.5 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm w-full sm:w-auto">
                    Ekspor Laporan
                  </button>
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
                  {selectedStage === 'Cutting' ? '✂️' :
                    selectedStage === 'Sewing' ? '🧵' :
                      selectedStage === 'Finishing' ? '✨' : '📦'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Daftar Pesanan - {selectedStage}</h3>
                  <p className="text-xs text-gray-500">Menampilkan pesanan yang sedang diproses di departemen ini</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStage(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {stageOrders.length > 0 ? (
                <div className="space-y-3">
                  {stageOrders.map((order) => (
                    <div key={order.id} className="p-4 bg-white border border-gray-100 rounded-xl hover:border-primary-200 hover:shadow-md transition-all group">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-black text-primary-600 text-sm">{order.id}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getPriorityBadge(order.priority)}`}>
                              {order.priority}
                            </span>
                          </div>
                          <h4 className="font-bold text-gray-800">{order.customer}</h4>
                          <p className="text-sm text-gray-600 mt-0.5">{order.product}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-gray-900 leading-tight">{order.qty}</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase">item</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock size={12} className="mr-1 text-primary-400" />
                          Deadline: <span className="ml-1 font-semibold text-gray-700">{order.deadline}</span>
                        </div>
                        <a
                          href={`/orders/${order.id}`}
                          className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center group-hover:translate-x-1 transition-transform"
                        >
                          Lihat Detail <ChevronRight size={14} className="ml-0.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Package size={32} className="text-slate-300" />
                  </div>
                  <h4 className="text-gray-800 font-bold">Tidak ada pesanan</h4>
                  <p className="text-sm text-gray-500 max-w-[240px] mt-1">
                    Saat ini tidak ada pesanan aktif yang sedang diproses di departemen {selectedStage}.
                  </p>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-gray-100 bg-slate-50/30 flex justify-end">
              <button
                onClick={() => setSelectedStage(null)}
                className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm shadow-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}