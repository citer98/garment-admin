// src/pages/Finance.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Wallet, 
  PieChart,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  ChevronRight,
  BarChart3,
  Grid,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Maximize2,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Package,
  Users,
  Clock,
  AlertCircle,
  FileText,
  Printer,
  Mail,
  Settings,
  HelpCircle
} from 'lucide-react';

export default function Finance() {
  const [timeRange, setTimeRange] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('stacked');
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMonth, setSelectedMonth] = useState(1);
  
  const chartContainerRef = useRef(null);
  const xAxisRef = useRef(null);

  // ==================== DATA STATIS UNTUK GARMENT MANUFACTURING ====================
  
  // Data Keuangan Bulanan (realistis untuk industri garmen skala menengah)
  const monthlyFinancialData = {
    2024: {
      1: { // Januari
        revenue: 42500000,
        expenses: {
          material: 18500000,
          labor: 8500000,
          operational: 5200000,
          overhead: 3500000
        },
        production: {
          unitsProduced: 1250,
          ordersCompleted: 28,
          avgTimePerOrder: 3.2
        }
      },
      2: { // Februari
        revenue: 45200000,
        expenses: {
          material: 19800000,
          labor: 8900000,
          operational: 5300000,
          overhead: 3600000
        },
        production: {
          unitsProduced: 1320,
          ordersCompleted: 30,
          avgTimePerOrder: 3.1
        }
      },
      3: { // Maret
        revenue: 48560000,
        expenses: {
          material: 21500000,
          labor: 9200000,
          operational: 5400000,
          overhead: 3800000
        },
        production: {
          unitsProduced: 1410,
          ordersCompleted: 32,
          avgTimePerOrder: 3.0
        }
      },
      4: { // April
        revenue: 46800000,
        expenses: {
          material: 20500000,
          labor: 9000000,
          operational: 5350000,
          overhead: 3700000
        },
        production: {
          unitsProduced: 1360,
          ordersCompleted: 31,
          avgTimePerOrder: 3.1
        }
      },
      5: { // Mei
        revenue: 51200000,
        expenses: {
          material: 22800000,
          labor: 9500000,
          operational: 5600000,
          overhead: 3900000
        },
        production: {
          unitsProduced: 1480,
          ordersCompleted: 34,
          avgTimePerOrder: 2.9
        }
      },
      6: { // Juni
        revenue: 49800000,
        expenses: {
          material: 22000000,
          labor: 9300000,
          operational: 5500000,
          overhead: 3850000
        },
        production: {
          unitsProduced: 1440,
          ordersCompleted: 33,
          avgTimePerOrder: 3.0
        }
      },
      7: { // Juli
        revenue: 53500000,
        expenses: {
          material: 24000000,
          labor: 9800000,
          operational: 5800000,
          overhead: 4000000
        },
        production: {
          unitsProduced: 1550,
          ordersCompleted: 36,
          avgTimePerOrder: 2.8
        }
      },
      8: { // Agustus
        revenue: 55800000,
        expenses: {
          material: 25200000,
          labor: 10100000,
          operational: 6000000,
          overhead: 4200000
        },
        production: {
          unitsProduced: 1620,
          ordersCompleted: 38,
          avgTimePerOrder: 2.8
        }
      },
      9: { // September
        revenue: 54500000,
        expenses: {
          material: 24500000,
          labor: 9900000,
          operational: 5900000,
          overhead: 4100000
        },
        production: {
          unitsProduced: 1580,
          ordersCompleted: 37,
          avgTimePerOrder: 2.9
        }
      },
      10: { // Oktober
        revenue: 57200000,
        expenses: {
          material: 25800000,
          labor: 10400000,
          operational: 6200000,
          overhead: 4300000
        },
        production: {
          unitsProduced: 1660,
          ordersCompleted: 39,
          avgTimePerOrder: 2.7
        }
      },
      11: { // November
        revenue: 59800000,
        expenses: {
          material: 27000000,
          labor: 10700000,
          operational: 6400000,
          overhead: 4500000
        },
        production: {
          unitsProduced: 1740,
          ordersCompleted: 41,
          avgTimePerOrder: 2.7
        }
      },
      12: { // Desember
        revenue: 62500000,
        expenses: {
          material: 28500000,
          labor: 11200000,
          operational: 6800000,
          overhead: 4700000
        },
        production: {
          unitsProduced: 1820,
          ordersCompleted: 44,
          avgTimePerOrder: 2.6
        }
      }
    }
  };

  // Data untuk chart berdasarkan timeRange
  const getChartData = () => {
    if (timeRange === 'yearly') {
      // Data tahunan (2020-2024)
      return {
        labels: ['2020', '2021', '2022', '2023', '2024'],
        timeLabels: ['2020', '2021', '2022', '2023', '2024'],
        fullTimeLabels: ['Tahun 2020', 'Tahun 2021', 'Tahun 2022', 'Tahun 2023', 'Tahun 2024'],
        revenue: [385000000, 425000000, 480000000, 550000000, 625000000],
        expenses: [265000000, 295000000, 335000000, 385000000, 438000000],
        profit: [120000000, 130000000, 145000000, 165000000, 187000000],
        periodLabel: 'Periode: 5 Tahun Terakhir'
      };
    } else if (timeRange === 'monthly') {
      // Data per bulan dalam setahun
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const revenue = [];
      const expenses = [];
      const profit = [];
      
      for (let i = 1; i <= 12; i++) {
        const data = monthlyFinancialData[selectedYear]?.[i];
        if (data) {
          const totalExpenses = Object.values(data.expenses).reduce((a, b) => a + b, 0);
          revenue.push(data.revenue);
          expenses.push(totalExpenses);
          profit.push(data.revenue - totalExpenses);
        } else {
          revenue.push(0);
          expenses.push(0);
          profit.push(0);
        }
      }
      
      return {
        labels: months,
        timeLabels: months.map((m, i) => `${m} ${selectedYear}`),
        fullTimeLabels: months.map((m, i) => `${m} ${selectedYear}`),
        revenue: revenue,
        expenses: expenses,
        profit: profit,
        periodLabel: `Periode: ${selectedYear}`
      };
    } else if (timeRange === 'quarterly') {
      // Data per kuartal
      const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
      const revenue = [0, 0, 0, 0];
      const expenses = [0, 0, 0, 0];
      
      for (let q = 0; q < 4; q++) {
        for (let m = q * 3 + 1; m <= q * 3 + 3; m++) {
          const data = monthlyFinancialData[selectedYear]?.[m];
          if (data) {
            revenue[q] += data.revenue;
            expenses[q] += Object.values(data.expenses).reduce((a, b) => a + b, 0);
          }
        }
      }
      
      return {
        labels: quarters,
        timeLabels: [`Q1 ${selectedYear}`, `Q2 ${selectedYear}`, `Q3 ${selectedYear}`, `Q4 ${selectedYear}`],
        fullTimeLabels: [`Kuartal 1 ${selectedYear}`, `Kuartal 2 ${selectedYear}`, `Kuartal 3 ${selectedYear}`, `Kuartal 4 ${selectedYear}`],
        revenue: revenue,
        expenses: expenses,
        profit: revenue.map((r, i) => r - expenses[i]),
        periodLabel: `Periode: ${selectedYear}`
      };
    } else {
      // Data harian (7 hari terakhir)
      const today = new Date();
      const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      const labels = [];
      const revenue = [];
      const expenses = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dayName = days[date.getDay()];
        labels.push(dayName);
        
        // Simulasi data harian
        const baseRevenue = 5000000 + Math.random() * 3000000;
        const baseExpenses = 3500000 + Math.random() * 1500000;
        revenue.push(Math.round(baseRevenue / 1000) * 1000);
        expenses.push(Math.round(baseExpenses / 1000) * 1000);
      }
      
      return {
        labels: labels,
        timeLabels: labels,
        fullTimeLabels: labels.map((l, i) => `${l}, ${new Date(today.setDate(today.getDate() - (6 - i))).toLocaleDateString('id-ID')}`),
        revenue: revenue,
        expenses: expenses,
        profit: revenue.map((r, i) => r - expenses[i]),
        periodLabel: 'Periode: 7 Hari Terakhir'
      };
    }
  };

  // Data untuk expense breakdown (berdasarkan bulan terpilih)
  const getExpenseBreakdown = () => {
    const currentData = monthlyFinancialData[selectedYear]?.[selectedMonth];
    if (!currentData) {
      return [
        { category: 'Bahan Baku', amount: 0, percentage: 0, color: 'bg-blue-500' },
        { category: 'Tenaga Kerja', amount: 0, percentage: 0, color: 'bg-green-500' },
        { category: 'Operasional', amount: 0, percentage: 0, color: 'bg-yellow-500' },
        { category: 'Overhead', amount: 0, percentage: 0, color: 'bg-purple-500' }
      ];
    }
    
    const total = Object.values(currentData.expenses).reduce((a, b) => a + b, 0);
    
    return [
      { category: 'Bahan Baku', amount: currentData.expenses.material, percentage: Math.round((currentData.expenses.material / total) * 100), color: 'bg-blue-500', icon: '📦' },
      { category: 'Tenaga Kerja', amount: currentData.expenses.labor, percentage: Math.round((currentData.expenses.labor / total) * 100), color: 'bg-green-500', icon: '👥' },
      { category: 'Operasional', amount: currentData.expenses.operational, percentage: Math.round((currentData.expenses.operational / total) * 100), color: 'bg-yellow-500', icon: '⚙️' },
      { category: 'Overhead', amount: currentData.expenses.overhead, percentage: Math.round((currentData.expenses.overhead / total) * 100), color: 'bg-purple-500', icon: '🏢' }
    ];
  };

  // Data untuk recent transactions
  const recentTransactions = [
    { id: 'TRX-001', date: '2024-01-15', description: 'Pembayaran Order #ORD-00124 - Toko Maju Jaya', amount: 4500000, type: 'income', status: 'completed', category: 'Pesanan' },
    { id: 'TRX-002', date: '2024-01-14', description: 'Pembelian Kain Denim (500 meter)', amount: 3200000, type: 'expense', status: 'completed', category: 'Bahan Baku' },
    { id: 'TRX-003', date: '2024-01-13', description: 'Pembayaran Order #ORD-00123 - Butik Modern', amount: 2800000, type: 'income', status: 'pending', category: 'Pesanan' },
    { id: 'TRX-004', date: '2024-01-12', description: 'Gaji Karyawan - Periode Januari', amount: 8500000, type: 'expense', status: 'completed', category: 'Tenaga Kerja' },
    { id: 'TRX-005', date: '2024-01-11', description: 'Pembayaran Order #ORD-00122 - Konveksi Sejahtera', amount: 6100000, type: 'income', status: 'completed', category: 'Pesanan' },
    { id: 'TRX-006', date: '2024-01-10', description: 'Pembelian Benang & Aksesoris', amount: 1250000, type: 'expense', status: 'completed', category: 'Bahan Baku' },
    { id: 'TRX-007', date: '2024-01-09', description: 'Biaya Listrik & Air', amount: 850000, type: 'expense', status: 'completed', category: 'Operasional' },
    { id: 'TRX-008', date: '2024-01-08', description: 'DP Order Custom #ORD-00125', amount: 3000000, type: 'income', status: 'pending', category: 'Pesanan' }
  ];

  // Data untuk top customers
  const topCustomers = [
    { name: 'Toko Baju Maju Jaya', totalSpent: 28500000, orders: 24, lastOrder: '2024-01-15', avgOrderValue: 1187500, status: 'active' },
    { name: 'Butik Modern', totalSpent: 24500000, orders: 18, lastOrder: '2024-01-14', avgOrderValue: 1361111, status: 'active' },
    { name: 'Konveksi Sejahtera', totalSpent: 19800000, orders: 15, lastOrder: '2024-01-12', avgOrderValue: 1320000, status: 'active' },
    { name: 'Distro Urban', totalSpent: 15600000, orders: 12, lastOrder: '2024-01-10', avgOrderValue: 1300000, status: 'active' },
    { name: 'Fashion Haven', totalSpent: 9800000, orders: 8, lastOrder: '2024-01-08', avgOrderValue: 1225000, status: 'active' }
  ];

  // Data untuk production metrics
  const getProductionMetrics = () => {
    const currentData = monthlyFinancialData[selectedYear]?.[selectedMonth];
    if (!currentData) {
      return {
        totalUnits: 0,
        totalOrders: 0,
        avgTimePerOrder: 0,
        efficiency: 0,
        onTimeDelivery: 0
      };
    }
    
    return {
      totalUnits: currentData.production.unitsProduced,
      totalOrders: currentData.production.ordersCompleted,
      avgTimePerOrder: currentData.production.avgTimePerOrder,
      efficiency: Math.min(100, Math.round((currentData.production.ordersCompleted / 40) * 100)),
      onTimeDelivery: 92
    };
  };

  // Data untuk cash flow
  const getCashFlowData = () => {
    const currentData = monthlyFinancialData[selectedYear]?.[selectedMonth];
    if (!currentData) {
      return {
        inflow: 0,
        outflow: 0,
        netCash: 0,
        openingBalance: 50000000,
        closingBalance: 50000000
      };
    }
    
    const totalExpenses = Object.values(currentData.expenses).reduce((a, b) => a + b, 0);
    const netCash = currentData.revenue - totalExpenses;
    
    return {
      inflow: currentData.revenue,
      outflow: totalExpenses,
      netCash: netCash,
      openingBalance: 50000000,
      closingBalance: 50000000 + netCash
    };
  };

  // Data untuk key metrics
  const getKeyMetrics = () => {
    const currentData = monthlyFinancialData[selectedYear]?.[selectedMonth];
    if (!currentData) {
      return {
        revenue: 0,
        expenses: 0,
        profit: 0,
        profitMargin: 0,
        avgOrderValue: 0,
        costPerUnit: 0,
        revenuePerEmployee: 0,
        inventoryTurnover: 0
      };
    }
    
    const totalExpenses = Object.values(currentData.expenses).reduce((a, b) => a + b, 0);
    const profit = currentData.revenue - totalExpenses;
    const profitMargin = (profit / currentData.revenue) * 100;
    const avgOrderValue = currentData.revenue / currentData.production.ordersCompleted;
    const costPerUnit = totalExpenses / currentData.production.unitsProduced;
    const revenuePerEmployee = currentData.revenue / 25; // Asumsi 25 karyawan
    const inventoryTurnover = currentData.expenses.material / 50000000; // Asumsi nilai stok rata-rata 50jt
    
    return {
      revenue: currentData.revenue,
      expenses: totalExpenses,
      profit: profit,
      profitMargin: profitMargin,
      avgOrderValue: avgOrderValue,
      costPerUnit: costPerUnit,
      revenuePerEmployee: revenuePerEmployee,
      inventoryTurnover: inventoryTurnover
    };
  };

  // Data untuk yearly summary
  const getYearlySummary = () => {
    let totalRevenue = 0;
    let totalExpenses = 0;
    let totalUnits = 0;
    let totalOrders = 0;
    
    for (let i = 1; i <= 12; i++) {
      const data = monthlyFinancialData[selectedYear]?.[i];
      if (data) {
        totalRevenue += data.revenue;
        totalExpenses += Object.values(data.expenses).reduce((a, b) => a + b, 0);
        totalUnits += data.production.unitsProduced;
        totalOrders += data.production.ordersCompleted;
      }
    }
    
    return {
      totalRevenue: totalRevenue,
      totalExpenses: totalExpenses,
      totalProfit: totalRevenue - totalExpenses,
      profitMargin: ((totalRevenue - totalExpenses) / totalRevenue) * 100,
      totalUnits: totalUnits,
      totalOrders: totalOrders,
      avgOrderValue: totalRevenue / totalOrders,
      costPerUnit: totalExpenses / totalUnits
    };
  };

  // Data untuk perbandingan tahunan
  const yearlyComparison = [
    { year: 2024, revenue: 625000000, profit: 187000000, margin: 29.9 },
    { year: 2023, revenue: 550000000, profit: 165000000, margin: 30.0 },
    { year: 2022, revenue: 480000000, profit: 145000000, margin: 30.2 },
    { year: 2021, revenue: 425000000, profit: 130000000, margin: 30.6 },
    { year: 2020, revenue: 385000000, profit: 120000000, margin: 31.2 }
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

  useEffect(() => {
    // Simulasi loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [timeRange, selectedYear, selectedMonth]);

  useEffect(() => {
    const checkScroll = () => {
      if (chartContainerRef.current) {
        const { scrollWidth, clientWidth } = chartContainerRef.current;
        setShowScrollButtons(scrollWidth > clientWidth);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [timeRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatShortCurrency = (amount) => {
    if (amount >= 1000000000) {
      return `Rp ${(amount / 1000000000).toFixed(1)}M`;
    }
    if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)}JT`;
    }
    return formatCurrency(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const scrollChart = (direction) => {
    if (chartContainerRef.current) {
      const scrollAmount = 200;
      chartContainerRef.current.scrollLeft += direction * scrollAmount;
      if (xAxisRef.current) {
        xAxisRef.current.scrollLeft += direction * scrollAmount;
      }
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const chartData = getChartData();
  const expenseBreakdown = getExpenseBreakdown();
  const productionMetrics = getProductionMetrics();
  const cashFlow = getCashFlowData();
  const keyMetrics = getKeyMetrics();
  const yearlySummary = getYearlySummary();
  
  const currentMonthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 md:space-y-6 ${isFullscreen ? 'fixed inset-0 bg-white z-50 overflow-auto p-2 md:p-4' : ''}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">Keuangan & Laporan</h2>
          <p className="text-xs md:text-sm text-gray-600">Analisis keuangan dan performa bisnis garment</p>
        </div>
        
        <div className="flex space-x-2 md:space-x-3">
          <button 
            onClick={() => alert('Ekspor data ke Excel akan segera tersedia')}
            className="flex items-center px-3 md:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs md:text-sm"
          >
            <Download size={16} className="mr-1.5" />
            Ekspor Laporan
          </button>
          {isMobile && (
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <Filter size={18} />
            </button>
          )}
          {isFullscreen && (
            <button 
              onClick={() => setIsFullscreen(false)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {isMobile && showFilters && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-4 max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800">Filter & Options</h3>
              <button onClick={() => setShowFilters(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Periode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setTimeRange('daily')} className={`px-3 py-2 rounded-lg text-sm ${timeRange === 'daily' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Harian</button>
                  <button onClick={() => setTimeRange('weekly')} className={`px-3 py-2 rounded-lg text-sm ${timeRange === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Mingguan</button>
                  <button onClick={() => setTimeRange('monthly')} className={`px-3 py-2 rounded-lg text-sm ${timeRange === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Bulanan</button>
                  <button onClick={() => setTimeRange('quarterly')} className={`px-3 py-2 rounded-lg text-sm ${timeRange === 'quarterly' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Kuartal</button>
                  <button onClick={() => setTimeRange('yearly')} className={`px-3 py-2 rounded-lg text-sm col-span-2 ${timeRange === 'yearly' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Tahunan</button>
                </div>
              </div>
              
              {timeRange !== 'yearly' && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Tahun</label>
                  <select 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value={2024}>2024</option>
                    <option value={2023}>2023</option>
                    <option value={2022}>2022</option>
                  </select>
                </div>
              )}
              
              {timeRange === 'monthly' && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Bulan</label>
                  <select 
                    value={selectedMonth} 
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    {currentMonthNames.map((month, idx) => (
                      <option key={idx} value={idx + 1}>{month}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setShowFilters(false)}
              className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg font-semibold"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      )}

      {/* ==================== DESKTOP VIEW ==================== */}
      {!isMobile ? (
        <div className="space-y-6">
          {/* Time Range Selector */}
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center">
                <Calendar size={20} className="mr-2 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Periode:</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'daily', label: 'Harian' },
                  { key: 'weekly', label: 'Mingguan' },
                  { key: 'monthly', label: 'Bulanan' },
                  { key: 'quarterly', label: 'Kuartal' },
                  { key: 'yearly', label: 'Tahunan' }
                ].map((range) => (
                  <button
                    key={range.key}
                    onClick={() => setTimeRange(range.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      timeRange === range.key
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
              
              {timeRange !== 'yearly' && (
                <div className="ml-auto flex items-center gap-2">
                  <select 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  >
                    <option value={2024}>2024</option>
                    <option value={2023}>2023</option>
                    <option value={2022}>2022</option>
                  </select>
                  
                  {timeRange === 'monthly' && (
                    <select 
                      value={selectedMonth} 
                      onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                    >
                      {currentMonthNames.map((month, idx) => (
                        <option key={idx} value={idx + 1}>{month}</option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>
            
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">+12.5%</span>
                </div>
                <p className="text-xs text-gray-600">Total Pendapatan</p>
                <p className="text-xl font-bold text-gray-800">{formatShortCurrency(keyMetrics.revenue)}</p>
              </div>
              
              <div className="bg-gradient-to-r from-red-50 to-white p-4 rounded-xl border border-red-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <CreditCard className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded-full">+8.2%</span>
                </div>
                <p className="text-xs text-gray-600">Total Pengeluaran</p>
                <p className="text-xl font-bold text-gray-800">{formatShortCurrency(keyMetrics.expenses)}</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-white p-4 rounded-xl border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Wallet className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">+15.3%</span>
                </div>
                <p className="text-xs text-gray-600">Laba Bersih</p>
                <p className="text-xl font-bold text-green-600">{formatShortCurrency(keyMetrics.profit)}</p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-white p-4 rounded-xl border border-purple-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <PieChart className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">+2.1%</span>
                </div>
                <p className="text-xs text-gray-600">Profit Margin</p>
                <p className="text-xl font-bold text-purple-600">{keyMetrics.profitMargin.toFixed(1)}%</p>
              </div>
            </div>
            
            {/* Chart Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">Grafik Performa Keuangan</h3>
                  <p className="text-sm text-gray-600">{chartData.periodLabel}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button onClick={() => setChartType('grouped')} className={`px-3 py-1.5 text-sm ${chartType === 'grouped' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}>Berjajar</button>
                    <button onClick={() => setChartType('stacked')} className={`px-3 py-1.5 text-sm ${chartType === 'stacked' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}>Bertumpuk</button>
                  </div>
                  <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg">
                    <Maximize2 size={16} />
                  </button>
                </div>
              </div>
              
              {/* Chart */}
              <div className="relative h-80">
                <div className="absolute left-0 top-0 h-full w-16 flex flex-col justify-between text-xs text-gray-500">
                  {[formatShortCurrency(80000000), formatShortCurrency(60000000), formatShortCurrency(40000000), formatShortCurrency(20000000), formatShortCurrency(0)].map((label, i) => (
                    <div key={i} className="text-right pr-2">{label}</div>
                  ))}
                </div>
                
                <div ref={chartContainerRef} className="ml-16 h-full overflow-x-auto">
                  <div className="flex h-full items-end space-x-2 min-w-max px-2">
                    {chartData.labels.map((label, index) => {
                      const maxValue = Math.max(...chartData.revenue, ...chartData.expenses);
                      const revHeight = (chartData.revenue[index] / maxValue) * 250;
                      const expHeight = (chartData.expenses[index] / maxValue) * 250;
                      
                      return (
                        <div key={index} className="flex flex-col items-center" style={{ width: '70px' }}>
                          <div className="relative w-full" style={{ height: '250px' }}>
                            {chartType === 'grouped' ? (
                              <div className="absolute bottom-0 flex w-full gap-1">
                                <div className="w-1/2 bg-blue-500 rounded-t transition-all duration-500" style={{ height: `${revHeight}px` }} title={`Revenue: ${formatCurrency(chartData.revenue[index])}`}></div>
                                <div className="w-1/2 bg-red-500 rounded-t transition-all duration-500" style={{ height: `${expHeight}px` }} title={`Expenses: ${formatCurrency(chartData.expenses[index])}`}></div>
                              </div>
                            ) : (
                              <div className="absolute bottom-0 w-full">
                                <div className="w-full bg-red-500" style={{ height: `${expHeight}px` }}></div>
                                <div className="w-full bg-blue-500 rounded-t" style={{ height: `${revHeight}px` }}></div>
                              </div>
                            )}
                          </div>
                          <div className="mt-2 text-center">
                            <div className="text-xs font-medium text-gray-700">{label}</div>
                            <div className="text-xs text-gray-500">{chartData.timeLabels[index]}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {showScrollButtons && (
                  <>
                    <button onClick={() => scrollChart(-1)} className="absolute left-20 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-1 shadow-lg">‹</button>
                    <button onClick={() => scrollChart(1)} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-1 shadow-lg">›</button>
                  </>
                )}
              </div>
              
              <div className="flex justify-center gap-6 mt-6">
                <div className="flex items-center"><div className="w-3 h-3 bg-blue-500 rounded mr-2"></div><span className="text-sm text-gray-700">Pendapatan</span></div>
                <div className="flex items-center"><div className="w-3 h-3 bg-red-500 rounded mr-2"></div><span className="text-sm text-gray-700">Pengeluaran</span></div>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expense Breakdown */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <PieChart className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Breakdown Pengeluaran</h3>
                  <p className="text-sm text-gray-600">{currentMonthNames[selectedMonth - 1]} {selectedYear}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {expenseBreakdown.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-700">{item.category}</span>
                      <span className="text-sm font-semibold text-gray-800">{formatCurrency(item.amount)} ({item.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`${item.color} h-2 rounded-full transition-all duration-500`} style={{ width: `${item.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div><span className="font-medium text-gray-800">Total Pengeluaran</span><p className="text-xs text-gray-600">{currentMonthNames[selectedMonth - 1]} {selectedYear}</p></div>
                  <span className="text-lg font-bold text-red-600">{formatCurrency(keyMetrics.expenses)}</span>
                </div>
              </div>
            </div>

            {/* Production Metrics */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-teal-100 rounded-lg mr-3">
                  <Package className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Metrik Produksi</h3>
                  <p className="text-sm text-gray-600">Performa produksi bulan ini</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600">Total Unit Diproduksi</p>
                  <p className="text-xl font-bold text-gray-800">{productionMetrics.totalUnits}</p>
                  <p className="text-xs text-green-600">+8.2% dari bulan lalu</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600">Pesanan Selesai</p>
                  <p className="text-xl font-bold text-gray-800">{productionMetrics.totalOrders}</p>
                  <p className="text-xs text-green-600">+5.7% dari bulan lalu</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600">Rata-rata Waktu</p>
                  <p className="text-xl font-bold text-gray-800">{productionMetrics.avgTimePerOrder} hari</p>
                  <p className="text-xs text-green-600">-0.3 hari</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600">On-Time Delivery</p>
                  <p className="text-xl font-bold text-green-600">{productionMetrics.onTimeDelivery}%</p>
                  <p className="text-xs text-green-600">+2% dari target</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-700">Efisiensi Produksi</span>
                  <span className="text-sm font-semibold text-gray-800">{productionMetrics.efficiency}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${productionMetrics.efficiency}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Cash Flow & Key Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cash Flow */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-cyan-100 rounded-lg mr-3">
                  <TrendingUp className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Arus Kas</h3>
                  <p className="text-sm text-gray-600">Ringkasan cash flow bulan ini</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600">Kas Masuk</p>
                  <p className="text-lg font-bold text-green-600">{formatShortCurrency(cashFlow.inflow)}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600">Kas Keluar</p>
                  <p className="text-lg font-bold text-red-600">{formatShortCurrency(cashFlow.outflow)}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-700">Saldo Awal</span>
                  <span className="text-sm font-semibold text-gray-800">{formatShortCurrency(cashFlow.openingBalance)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-700">Arus Kas Bersih</span>
                  <span className={`text-sm font-semibold ${cashFlow.netCash >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {cashFlow.netCash >= 0 ? '+' : ''}{formatShortCurrency(cashFlow.netCash)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-800">Saldo Akhir</span>
                  <span className="text-lg font-bold text-blue-600">{formatShortCurrency(cashFlow.closingBalance)}</span>
                </div>
              </div>
            </div>

            {/* Key Business Metrics */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-orange-100 rounded-lg mr-3">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Key Metrics</h3>
                  <p className="text-sm text-gray-600">Indikator performa bisnis</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-700">Rata-rata Nilai Order (AOV)</span>
                    <span className="text-sm font-semibold text-gray-800">{formatShortCurrency(keyMetrics.avgOrderValue)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-700">Biaya per Unit</span>
                    <span className="text-sm font-semibold text-gray-800">{formatShortCurrency(keyMetrics.costPerUnit)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '55%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-700">Revenue per Karyawan</span>
                    <span className="text-sm font-semibold text-gray-800">{formatShortCurrency(keyMetrics.revenuePerEmployee)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-700">Inventory Turnover</span>
                    <span className="text-sm font-semibold text-gray-800">{keyMetrics.inventoryTurnover.toFixed(1)}x</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions & Top Customers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-gray-800">Transaksi Terakhir</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800">Lihat Semua →</button>
              </div>
              
              <div className="space-y-3">
                {recentTransactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{transaction.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-600">{formatDate(transaction.date)}</p>
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">{transaction.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'income' ? '+' : '-'} {formatShortCurrency(transaction.amount)}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.status === 'completed' ? 'Selesai' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Customers */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-gray-800">Pelanggan Teratas</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800">Lihat Semua →</button>
              </div>
              
              <div className="space-y-3">
                {topCustomers.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="font-bold text-blue-600 text-sm">{customer.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{customer.name}</p>
                        <p className="text-xs text-gray-600">{customer.orders} pesanan</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-800">{formatShortCurrency(customer.totalSpent)}</p>
                      <p className="text-xs text-gray-600">{formatDate(customer.lastOrder)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">💡 80% pendapatan berasal dari 20% pelanggan teratas. Fokus retensi pelanggan ini penting!</p>
              </div>
            </div>
          </div>

          {/* Yearly Summary & Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Yearly Summary */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Ringkasan Tahunan</h3>
                  <p className="text-sm text-gray-600">Total performa {selectedYear}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600">Total Pendapatan</p>
                  <p className="text-lg font-bold text-blue-600">{formatShortCurrency(yearlySummary.totalRevenue)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600">Total Laba</p>
                  <p className="text-lg font-bold text-green-600">{formatShortCurrency(yearlySummary.totalProfit)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600">Total Unit</p>
                  <p className="text-lg font-bold text-gray-800">{yearlySummary.totalUnits.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600">Total Pesanan</p>
                  <p className="text-lg font-bold text-gray-800">{yearlySummary.totalOrders}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Profit Margin Tahunan</span>
                  <span className="text-lg font-bold text-purple-600">{yearlySummary.profitMargin.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(yearlySummary.profitMargin / 40) * 100}%` }}></div>
                </div>
              </div>
            </div>

            {/* Yearly Comparison */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Perbandingan Tahunan</h3>
                  <p className="text-sm text-gray-600">5 tahun terakhir</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {yearlyComparison.map((year) => (
                  <div key={year.year} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                    <div className="w-16 font-semibold text-gray-800">{year.year}</div>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(year.revenue / 650000000) * 100}%` }}></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-800">{formatShortCurrency(year.revenue)}</div>
                      <div className="text-xs text-green-600">Margin: {year.margin}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ==================== MOBILE VIEW ==================== */
        <div className="space-y-4">
          {/* Mobile Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-blue-50 to-white p-3 rounded-xl border border-blue-100">
              <div className="flex items-center justify-between mb-1">
                <div className="p-1.5 bg-blue-100 rounded-lg"><DollarSign size={14} className="text-blue-600" /></div>
                <span className="text-xs text-green-600">+12.5%</span>
              </div>
              <p className="text-xs text-gray-600">Pendapatan</p>
              <p className="text-sm font-bold text-gray-800">{formatShortCurrency(keyMetrics.revenue)}</p>
            </div>
            <div className="bg-gradient-to-r from-red-50 to-white p-3 rounded-xl border border-red-100">
              <div className="flex items-center justify-between mb-1">
                <div className="p-1.5 bg-red-100 rounded-lg"><CreditCard size={14} className="text-red-600" /></div>
                <span className="text-xs text-red-600">+8.2%</span>
              </div>
              <p className="text-xs text-gray-600">Pengeluaran</p>
              <p className="text-sm font-bold text-gray-800">{formatShortCurrency(keyMetrics.expenses)}</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-white p-3 rounded-xl border border-green-100">
              <div className="flex items-center justify-between mb-1">
                <div className="p-1.5 bg-green-100 rounded-lg"><Wallet size={14} className="text-green-600" /></div>
                <span className="text-xs text-green-600">+15.3%</span>
              </div>
              <p className="text-xs text-gray-600">Laba</p>
              <p className="text-sm font-bold text-green-600">{formatShortCurrency(keyMetrics.profit)}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-white p-3 rounded-xl border border-purple-100">
              <div className="flex items-center justify-between mb-1">
                <div className="p-1.5 bg-purple-100 rounded-lg"><PieChart size={14} className="text-purple-600" /></div>
                <span className="text-xs text-green-600">+2.1%</span>
              </div>
              <p className="text-xs text-gray-600">Margin</p>
              <p className="text-sm font-bold text-purple-600">{keyMetrics.profitMargin.toFixed(1)}%</p>
            </div>
          </div>

          {/* Mobile Time Range */}
          <div className="bg-white rounded-lg p-3">
            <div className="flex overflow-x-auto gap-2 pb-2">
              {['daily', 'weekly', 'monthly', 'quarterly', 'yearly'].map((range) => (
                <button key={range} onClick={() => setTimeRange(range)} className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap ${timeRange === range ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                  {range === 'daily' ? 'Harian' : range === 'weekly' ? 'Mingguan' : range === 'monthly' ? 'Bulanan' : range === 'quarterly' ? 'Kuartal' : 'Tahunan'}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Chart */}
          <div className="bg-white rounded-lg p-3">
            <h3 className="font-semibold text-gray-800 text-sm mb-3">Grafik Keuangan</h3>
            <div className="h-48 relative">
              <div className="absolute left-0 top-0 h-full w-10 flex flex-col justify-between text-[10px] text-gray-500">
                {[formatShortCurrency(80000000), formatShortCurrency(40000000), formatShortCurrency(0)].map((label, i) => (
                  <div key={i} className="text-right">{label}</div>
                ))}
              </div>
              <div className="ml-10 h-full overflow-x-auto">
                <div className="flex h-full items-end space-x-1 min-w-max">
                  {chartData.labels.slice(0, 6).map((label, index) => {
                    const maxValue = Math.max(...chartData.revenue, ...chartData.expenses);
                    const revHeight = (chartData.revenue[index] / maxValue) * 140;
                    return (
                      <div key={index} className="flex flex-col items-center" style={{ width: '45px' }}>
                        <div className="w-full bg-blue-500 rounded-t" style={{ height: `${revHeight}px` }}></div>
                        <div className="text-[10px] text-gray-600 mt-1">{label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Expense Breakdown */}
          <div className="bg-white rounded-lg p-3">
            <button onClick={() => toggleSection('expenses')} className="w-full flex justify-between items-center">
              <div className="flex items-center"><PieChart size={16} className="text-purple-600 mr-2" /><span className="font-semibold text-gray-800 text-sm">Pengeluaran</span></div>
              {expandedSection === 'expenses' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {expandedSection === 'expenses' && (
              <div className="mt-3 space-y-2">
                {expenseBreakdown.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs"><span>{item.category}</span><span>{item.percentage}%</span></div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-0.5"><div className={`${item.color} h-1.5 rounded-full`} style={{ width: `${item.percentage}%` }}></div></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Recent Transactions */}
          <div className="bg-white rounded-lg p-3">
            <button onClick={() => toggleSection('transactions')} className="w-full flex justify-between items-center">
              <span className="font-semibold text-gray-800 text-sm">Transaksi Terakhir</span>
              {expandedSection === 'transactions' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {expandedSection === 'transactions' && (
              <div className="mt-3 space-y-2">
                {recentTransactions.slice(0, 4).map((t) => (
                  <div key={t.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div><p className="text-xs font-medium text-gray-800">{t.description.substring(0, 25)}...</p><p className="text-[10px] text-gray-500">{formatDate(t.date)}</p></div>
                    <p className={`text-xs font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{t.type === 'income' ? '+' : '-'}{formatShortCurrency(t.amount)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Top Customers */}
          <div className="bg-white rounded-lg p-3">
            <button onClick={() => toggleSection('customers')} className="w-full flex justify-between items-center">
              <span className="font-semibold text-gray-800 text-sm">Pelanggan Teratas</span>
              {expandedSection === 'customers' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {expandedSection === 'customers' && (
              <div className="mt-3 space-y-2">
                {topCustomers.slice(0, 3).map((c, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div><p className="text-xs font-medium text-gray-800">{c.name}</p><p className="text-[10px] text-gray-500">{c.orders} pesanan</p></div>
                    <p className="text-xs font-semibold text-gray-800">{formatShortCurrency(c.totalSpent)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Cash Flow */}
          <div className="bg-white rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-800 text-sm">Arus Kas</span>
              <span className={`text-xs font-semibold ${cashFlow.netCash >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {cashFlow.netCash >= 0 ? '+' : ''}{formatShortCurrency(cashFlow.netCash)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-green-50 rounded-lg p-2 text-center"><p className="text-[10px] text-gray-600">Masuk</p><p className="text-xs font-bold text-green-600">{formatShortCurrency(cashFlow.inflow)}</p></div>
              <div className="bg-red-50 rounded-lg p-2 text-center"><p className="text-[10px] text-gray-600">Keluar</p><p className="text-xs font-bold text-red-600">{formatShortCurrency(cashFlow.outflow)}</p></div>
            </div>
          </div>

          {/* Mobile Insight */}
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-blue-800">💡 Profit margin meningkat 2.1% dibanding bulan lalu. Efisiensi produksi terus membaik!</p>
          </div>
        </div>
      )}
    </div>
  );
}