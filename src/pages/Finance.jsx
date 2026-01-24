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
  ChevronUp
} from 'lucide-react';

export default function Finance() {
  const [timeRange, setTimeRange] = useState('monthly');
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('stacked'); // 'stacked', 'grouped', 'separated'
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  
  const chartContainerRef = useRef(null);
  const xAxisRef = useRef(null);

  // Data dummy untuk financial metrics
  const financialMetrics = {
    revenue: 48560000,
    expenses: 32450000,
    profit: 16110000,
    profitMargin: 33.2,
    avgOrderValue: 1250000,
    pendingPayments: 12300000
  };

  // Data lengkap untuk semua time range
  const getChartData = (range) => {
    const data = {
      daily: {
        labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
        timeLabels: ['15 Jan', '16 Jan', '17 Jan', '18 Jan', '19 Jan', '20 Jan', '21 Jan'],
        fullTimeLabels: ['Senin, 15 Jan 2024', 'Selasa, 16 Jan 2024', 'Rabu, 17 Jan 2024', 'Kamis, 18 Jan 2024', 'Jumat, 19 Jan 2024', 'Sabtu, 20 Jan 2024', 'Minggu, 21 Jan 2024'],
        revenue: [4500000, 5200000, 4800000, 6100000, 5800000, 4200000, 3900000],
        expenses: [3200000, 3800000, 3500000, 4200000, 4000000, 3000000, 2800000],
        profit: [1300000, 1400000, 1300000, 1900000, 1800000, 1200000, 1100000],
        periodLabel: 'Periode: 15-21 Januari 2024'
      },
      weekly: {
        labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
        timeLabels: ['1-7 Jan', '8-14 Jan', '15-21 Jan', '22-31 Jan'],
        fullTimeLabels: ['Minggu 1: 1-7 Jan 2024', 'Minggu 2: 8-14 Jan 2024', 'Minggu 3: 15-21 Jan 2024', 'Minggu 4: 22-31 Jan 2024'],
        revenue: [18500000, 20500000, 19200000, 17800000],
        expenses: [12500000, 13800000, 13000000, 12100000],
        profit: [6000000, 6700000, 6200000, 5700000],
        periodLabel: 'Periode: Januari 2024'
      },
      monthly: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
        timeLabels: ['Jan 24', 'Feb 24', 'Mar 24', 'Apr 24', 'Mei 24', 'Jun 24', 'Jul 24', 'Agu 24', 'Sep 24', 'Okt 24', 'Nov 24', 'Des 24'],
        fullTimeLabels: ['Januari 2024', 'Februari 2024', 'Maret 2024', 'April 2024', 'Mei 2024', 'Juni 2024', 'Juli 2024', 'Agustus 2024', 'September 2024', 'Oktober 2024', 'November 2024', 'Desember 2024'],
        revenue: [42000000, 45000000, 48560000, 46000000, 51000000, 48000000, 52000000, 49000000, 53000000, 51000000, 55000000, 58000000],
        expenses: [30000000, 31500000, 32450000, 31000000, 34000000, 32000000, 35000000, 33000000, 36000000, 34500000, 38000000, 40000000],
        profit: [12000000, 13500000, 16110000, 15000000, 17000000, 16000000, 17000000, 16000000, 17000000, 16500000, 17000000, 18000000],
        periodLabel: 'Periode: Tahun 2024'
      },
      yearly: {
        labels: ['2020', '2021', '2022', '2023', '2024'],
        timeLabels: ['2020', '2021', '2022', '2023', '2024'],
        fullTimeLabels: ['Tahun 2020', 'Tahun 2021', 'Tahun 2022', 'Tahun 2023', 'Tahun 2024'],
        revenue: [385000000, 425000000, 480000000, 550000000, 610000000],
        expenses: [275000000, 305000000, 345000000, 390000000, 430000000],
        profit: [110000000, 120000000, 135000000, 160000000, 180000000],
        periodLabel: 'Periode: 5 Tahun Terakhir'
      }
    };
    return data[range] || data.monthly;
  };

  // Data untuk expense breakdown
  const expenseBreakdown = [
    { category: 'Bahan Baku', amount: 18500000, percentage: 57, color: 'bg-blue-500' },
    { category: 'Tenaga Kerja', amount: 8500000, percentage: 26, color: 'bg-green-500' },
    { category: 'Operasional', amount: 3200000, percentage: 10, color: 'bg-yellow-500' },
    { category: 'Lain-lain', amount: 2250000, percentage: 7, color: 'bg-purple-500' }
  ];

  // Data untuk recent transactions
  const recentTransactions = [
    { id: 'TRX-001', date: '2024-01-15', description: 'Pembayaran Order #ORD-00124', amount: 4500000, type: 'income', status: 'completed' },
    { id: 'TRX-002', date: '2024-01-14', description: 'Pembelian Kain Denim', amount: 3200000, type: 'expense', status: 'completed' },
    { id: 'TRX-003', date: '2024-01-13', description: 'Pembayaran Order #ORD-00123', amount: 2800000, type: 'income', status: 'pending' },
    { id: 'TRX-004', date: '2024-01-12', description: 'Gaji Karyawan Januari', amount: 8500000, type: 'expense', status: 'completed' },
    { id: 'TRX-005', date: '2024-01-11', description: 'Pembayaran Order #ORD-00122', amount: 6100000, type: 'income', status: 'completed' }
  ];

  // Data untuk top customers
  const topCustomers = [
    { name: 'Toko Baju Maju Jaya', totalSpent: 28500000, orders: 24, lastOrder: '2024-01-15' },
    { name: 'Butik Modern', totalSpent: 24500000, orders: 18, lastOrder: '2024-01-14' },
    { name: 'Konveksi Sejahtera', totalSpent: 19800000, orders: 15, lastOrder: '2024-01-12' },
    { name: 'Distro Urban', totalSpent: 15600000, orders: 12, lastOrder: '2024-01-10' }
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
    // Simulasi loading data
    setTimeout(() => {
      setFinancialData({
        metrics: financialMetrics,
        chartData: getChartData(timeRange),
        expenses: expenseBreakdown,
        transactions: recentTransactions,
        customers: topCustomers
      });
      setLoading(false);
    }, 800);
  }, [timeRange]);

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
  }, [timeRange, financialData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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

  // Mobile Time Range Selector
  const MobileTimeRangeSelector = () => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Calendar size={18} className="text-gray-600 mr-2" />
          <span className="text-sm font-medium text-gray-700">Sumbu X:</span>
        </div>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {timeRange === 'daily' ? 'Harian' : 
           timeRange === 'weekly' ? 'Mingguan' : 
           timeRange === 'monthly' ? 'Bulanan' : 'Tahunan'}
        </span>
      </div>
      
      <div className="flex overflow-x-auto pb-2 space-x-2">
        {[
          { key: 'daily', label: 'Harian', icon: '📅' },
          { key: 'weekly', label: 'Mingguan', icon: '📆' },
          { key: 'monthly', label: 'Bulanan', icon: '📊' },
          { key: 'yearly', label: 'Tahunan', icon: '📈' }
        ].map((range) => (
          <button
            key={range.key}
            onClick={() => setTimeRange(range.key)}
            className={`flex-shrink-0 px-3 py-2 rounded-lg transition-all ${timeRange === range.key
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <span className="mr-1.5">{range.icon}</span>
              <span className="text-xs font-medium">{range.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Mobile Chart Type Selector
  const MobileChartTypeSelector = () => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Tipe Grafik:</span>
        <span className="text-xs text-gray-500">
          {chartType === 'grouped' ? 'Berjajar' : chartType === 'separated' ? 'Terpisah' : 'Bertumpuk'}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setChartType('grouped')}
          className={`p-2 rounded-lg flex flex-col items-center justify-center ${chartType === 'grouped'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <BarChart3 size={16} />
          <span className="text-xs mt-1">Berjajar</span>
        </button>
        <button
          onClick={() => setChartType('stacked')}
          className={`p-2 rounded-lg flex flex-col items-center justify-center ${chartType === 'stacked'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Grid size={16} />
          <span className="text-xs mt-1">Bertumpuk</span>
        </button>
        <button
          onClick={() => setChartType('separated')}
          className={`p-2 rounded-lg flex flex-col items-center justify-center ${chartType === 'separated'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <div className="w-4 h-4 flex flex-col justify-between">
            <div className="w-full h-0.5 bg-current rounded"></div>
            <div className="w-full h-0.5 bg-current rounded"></div>
            <div className="w-full h-0.5 bg-current rounded"></div>
          </div>
          <span className="text-xs mt-1">Terpisah</span>
        </button>
      </div>
    </div>
  );

  // Mobile Financial Metrics Cards
  const MobileFinancialMetrics = () => (
    <div className="space-y-3 mb-4">
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gradient-to-r from-blue-50 to-white p-3 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <DollarSign size={16} className="text-blue-600" />
            </div>
            <div className="flex items-center text-green-600 text-xs">
              <TrendingUp size={12} className="mr-0.5" />
              <span className="font-semibold">+12.5%</span>
            </div>
          </div>
          <p className="text-xs text-gray-600">Pendapatan</p>
          <p className="text-sm font-bold text-gray-800 mt-0.5">
            {formatCurrency(financialMetrics.revenue)}
          </p>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-white p-3 rounded-lg border border-red-100">
          <div className="flex items-center justify-between mb-2">
            <div className="p-1.5 bg-red-100 rounded-lg">
              <CreditCard size={16} className="text-red-600" />
            </div>
            <div className="flex items-center text-red-600 text-xs">
              <TrendingDown size={12} className="mr-0.5" />
              <span className="font-semibold">+8.2%</span>
            </div>
          </div>
          <p className="text-xs text-gray-600">Pengeluaran</p>
          <p className="text-sm font-bold text-gray-800 mt-0.5">
            {formatCurrency(financialMetrics.expenses)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gradient-to-r from-green-50 to-white p-3 rounded-lg border border-green-100">
          <div className="flex items-center justify-between mb-2">
            <div className="p-1.5 bg-green-100 rounded-lg">
              <Wallet size={16} className="text-green-600" />
            </div>
            <div className="text-xs text-gray-600">
              Margin
            </div>
          </div>
          <p className="text-xs text-gray-600">Laba Bersih</p>
          <p className="text-sm font-bold text-gray-800 mt-0.5">
            {formatCurrency(financialMetrics.profit)}
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-white p-3 rounded-lg border border-purple-100">
          <div className="flex items-center justify-between mb-2">
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <PieChart size={16} className="text-purple-600" />
            </div>
            <div className="flex items-center text-green-600 text-xs">
              <TrendingUp size={12} className="mr-0.5" />
              <span className="font-semibold">{financialMetrics.profitMargin}%</span>
            </div>
          </div>
          <p className="text-xs text-gray-600">Profit Margin</p>
          <p className="text-sm font-bold text-gray-800 mt-0.5">
            {financialMetrics.profitMargin}%
          </p>
        </div>
      </div>
    </div>
  );

  // Mobile Chart Container
  const MobileChartContainer = () => {
    if (!financialData?.chartData) return null;

    const { labels, revenue, expenses, profit } = financialData.chartData;
    const maxValue = Math.max(...revenue, ...expenses, ...profit);
    const chartHeight = 200;
    const barWidth = isMobile ? 40 : 60;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">Grafik Performa Keuangan</h3>
            <p className="text-xs text-gray-600">
              {timeRange === 'daily' ? 'Data harian' : 
               timeRange === 'weekly' ? 'Data mingguan' : 
               timeRange === 'monthly' ? 'Data bulanan' : 'Data tahunan'}
            </p>
          </div>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg"
          >
            <Maximize2 size={16} />
          </button>
        </div>

        <div className="relative h-64">
          {/* Y-axis Labels */}
          <div className="absolute left-0 top-0 h-full w-12 flex flex-col justify-between py-4">
            {[58000000, 43500000, 29000000, 14500000, 0].map((value, index) => (
              <div key={index} className="text-xs text-gray-500 text-right pr-1">
                {formatCurrency(value).replace('Rp', '')}
              </div>
            ))}
          </div>

          {/* Chart Area */}
          <div 
            ref={chartContainerRef}
            className="ml-12 h-full overflow-x-auto"
          >
            <div className="flex h-full items-end space-x-2 min-w-max px-2">
              {labels.slice(0, isMobile ? 5 : labels.length).map((label, index) => {
                const revHeight = (revenue[index] / maxValue) * chartHeight;
                const expHeight = (expenses[index] / maxValue) * chartHeight;
                const profitHeight = (profit[index] / maxValue) * chartHeight;

                return (
                  <div key={index} className="flex flex-col items-center" style={{ width: `${barWidth}px` }}>
                    {/* Chart Bars */}
                    <div className="relative w-full" style={{ height: `${chartHeight}px` }}>
                      {chartType === 'grouped' ? (
                        // Grouped bars
                        <div className="absolute bottom-0 flex space-x-1 w-full">
                          <div 
                            className="w-1/3 bg-blue-500 rounded-t"
                            style={{ height: `${revHeight}px` }}
                            title={`Revenue: ${formatCurrency(revenue[index])}`}
                          ></div>
                          <div 
                            className="w-1/3 bg-red-500 rounded-t"
                            style={{ height: `${expHeight}px` }}
                            title={`Expenses: ${formatCurrency(expenses[index])}`}
                          ></div>
                          <div 
                            className="w-1/3 bg-green-500 rounded-t"
                            style={{ height: `${profitHeight}px` }}
                            title={`Profit: ${formatCurrency(profit[index])}`}
                          ></div>
                        </div>
                      ) : chartType === 'separated' ? (
                        // Separated bars with gaps
                        <div className="absolute bottom-0 w-full">
                          <div 
                            className="w-full bg-green-500 rounded-t absolute"
                            style={{ 
                              height: `${profitHeight}px`,
                              bottom: '0'
                            }}
                          ></div>
                          <div 
                            className="w-full bg-red-500 rounded-t absolute"
                            style={{ 
                              height: `${expHeight}px`,
                              bottom: `${profitHeight + 4}px`
                            }}
                          ></div>
                          <div 
                            className="w-full bg-blue-500 rounded-t absolute"
                            style={{ 
                              height: `${revHeight}px`,
                              bottom: `${profitHeight + expHeight + 8}px`
                            }}
                          ></div>
                        </div>
                      ) : (
                        // Stacked bars
                        <div className="absolute bottom-0 w-full">
                          <div 
                            className="w-full bg-green-500 rounded-t"
                            style={{ height: `${profitHeight}px` }}
                          ></div>
                          <div 
                            className="w-full bg-red-500"
                            style={{ height: `${expHeight}px` }}
                          ></div>
                          <div 
                            className="w-full bg-blue-500 rounded-b"
                            style={{ height: `${revHeight}px` }}
                          ></div>
                        </div>
                      )}
                    </div>

                    {/* X-axis Label */}
                    <div className="mt-2 text-center">
                      <div className="text-xs font-medium text-gray-700">{label}</div>
                      <div className="text-xs text-gray-500">
                        {financialData.chartData.timeLabels[index]}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scroll Buttons */}
          {showScrollButtons && labels.length > 5 && (
            <>
              <button
                onClick={() => scrollChart(-1)}
                className="absolute left-14 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-1 shadow-lg hover:bg-gray-50 z-10"
              >
                <ChevronLeft size={16} className="text-gray-600" />
              </button>
              <button
                onClick={() => scrollChart(1)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-1 shadow-lg hover:bg-gray-50 z-10"
              >
                <ChevronRightIcon size={16} className="text-gray-600" />
              </button>
            </>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-1.5"></div>
            <span className="text-xs text-gray-700">Revenue</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-1.5"></div>
            <span className="text-xs text-gray-700">Expenses</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-1.5"></div>
            <span className="text-xs text-gray-700">Profit</span>
          </div>
        </div>
      </div>
    );
  };

  // Mobile Expense Breakdown
  const MobileExpenseBreakdown = () => (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-1.5 bg-purple-100 rounded-lg mr-2">
            <PieChart size={16} className="text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-800 text-sm">Breakdown Pengeluaran</h3>
        </div>
        <button
          onClick={() => toggleSection('expenses')}
          className="text-gray-500 hover:text-gray-700"
        >
          {expandedSection === 'expenses' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      
      {expandedSection === 'expenses' && (
        <div className="space-y-3">
          {expenseBreakdown.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">{item.category}</span>
                <span className="text-xs font-semibold text-gray-800">
                  {formatCurrency(item.amount)} ({item.percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`${item.color} h-1.5 rounded-full transition-all duration-500`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs font-medium text-gray-800">Total Pengeluaran</span>
            <p className="text-xs text-gray-600">Bulan Januari 2024</p>
          </div>
          <span className="text-sm font-bold text-red-600">
            {formatCurrency(financialMetrics.expenses)}
          </span>
        </div>
      </div>
    </div>
  );

  // Mobile Recent Transactions
  const MobileRecentTransactions = () => (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 text-sm">Transaksi Terakhir</h3>
        <button
          onClick={() => toggleSection('transactions')}
          className="text-gray-500 hover:text-gray-700"
        >
          {expandedSection === 'transactions' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      
      {expandedSection === 'transactions' && (
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800 text-xs">{transaction.description}</p>
                <p className="text-xs text-gray-600">{formatDate(transaction.date)}</p>
              </div>
              <div className="text-right">
                <p className={`text-xs font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                  transaction.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {transaction.status === 'completed' ? 'Selesai' : 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-600">Pending Payments</p>
        <p className="text-sm font-bold text-yellow-600">
          {formatCurrency(financialMetrics.pendingPayments)}
        </p>
      </div>
    </div>
  );

  // Mobile Top Customers
  const MobileTopCustomers = () => (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 text-sm">Pelanggan Teratas</h3>
        <button
          onClick={() => toggleSection('customers')}
          className="text-gray-500 hover:text-gray-700"
        >
          {expandedSection === 'customers' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      
      {expandedSection === 'customers' && (
        <div className="space-y-3">
          {topCustomers.map((customer, index) => (
            <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                  <span className="font-bold text-blue-600 text-xs">
                    {customer.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-xs">{customer.name}</p>
                  <p className="text-xs text-gray-600">{customer.orders} order</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-800">
                  {formatCurrency(customer.totalSpent)}
                </p>
                <p className="text-xs text-gray-600">{formatDate(customer.lastOrder)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-xs text-blue-800">
          💡 <span className="font-semibold">Insight:</span> 80% pendapatan berasal dari 20% pelanggan teratas.
        </p>
      </div>
    </div>
  );

  // Mobile Financial Summary
  const MobileFinancialSummary = () => (
    <div className="grid grid-cols-2 gap-3 mt-4">
      <div className="bg-white rounded-lg shadow p-3">
        <h4 className="text-xs font-semibold text-gray-800 mb-2">Rata-rata Nilai Order</h4>
        <p className="text-sm font-bold text-blue-600">
          {formatCurrency(financialMetrics.avgOrderValue)}
        </p>
        <p className="text-xs text-gray-600 mt-1">+5.3%</p>
      </div>

      <div className="bg-white rounded-lg shadow p-3">
        <h4 className="text-xs font-semibold text-gray-800 mb-2">Profit Margin</h4>
        <p className="text-sm font-bold text-green-600">
          {financialMetrics.profitMargin}%
        </p>
        <p className="text-xs text-gray-600 mt-1">Industri: 28%</p>
      </div>
    </div>
  );

  // Desktop Time Range Selector
  const DesktopTimeRangeSelector = () => (
    <div className="flex flex-wrap items-center gap-2 mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center">
        <Calendar size={20} className="mr-2 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Sumbu X:</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'daily', label: 'Harian', icon: '📅', description: 'Data per hari' },
          { key: 'weekly', label: 'Mingguan', icon: '📆', description: 'Data per minggu' },
          { key: 'monthly', label: 'Bulanan', icon: '📊', description: 'Data per bulan' },
          { key: 'yearly', label: 'Tahunan', icon: '📈', description: 'Data per tahun' }
        ].map((range) => (
          <button
            key={range.key}
            onClick={() => setTimeRange(range.key)}
            className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
              timeRange === range.key
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-md border border-gray-200'
            }`}
          >
            <span className="text-lg mr-2">{range.icon}</span>
            <div className="text-left">
              <div className="font-medium">{range.label}</div>
              <div className={`text-xs ${timeRange === range.key ? 'text-blue-100' : 'text-gray-500'}`}>
                {range.description}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center">
        <div className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
          {getChartData(timeRange).periodLabel}
        </div>
      </div>
    </div>
  );

  // Desktop Financial Metrics
  const DesktopFinancialMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {/* Revenue Card */}
      <div className="bg-gradient-to-r from-blue-50 to-white p-5 rounded-xl border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-600">vs periode lalu</span>
            <div className="flex items-center text-green-600">
              <TrendingUp size={16} className="mr-1" />
              <span className="font-semibold">+12.5%</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600">Total Pendapatan</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">
          {formatCurrency(financialMetrics.revenue)}
        </p>
      </div>

      {/* Expenses Card */}
      <div className="bg-gradient-to-r from-red-50 to-white p-5 rounded-xl border border-red-100">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <CreditCard className="w-6 h-6 text-red-600" />
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-600">vs periode lalu</span>
            <div className="flex items-center text-red-600">
              <TrendingDown size={16} className="mr-1" />
              <span className="font-semibold">+8.2%</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600">Total Pengeluaran</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">
          {formatCurrency(financialMetrics.expenses)}
        </p>
      </div>

      {/* Profit Card */}
      <div className="bg-gradient-to-r from-green-50 to-white p-5 rounded-xl border border-green-100">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Wallet className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-600">Profit Margin</span>
            <div className="flex items-center text-green-600">
              <TrendingUp size={16} className="mr-1" />
              <span className="font-semibold">{financialMetrics.profitMargin}%</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600">Total Laba Bersih</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">
          {formatCurrency(financialMetrics.profit)}
        </p>
      </div>
    </div>
  );

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
          <p className="text-xs md:text-sm text-gray-600">Analisis keuangan dan performa bisnis</p>
        </div>
        
        <div className="flex space-x-2 md:space-x-3">
          {isMobile && (
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <Filter size={18} />
            </button>
          )}
          <button className="flex items-center px-3 md:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs md:text-sm">
            <Download size={16} className="mr-1.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
          {!isMobile && (
            <button className="flex items-center px-3 md:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs md:text-sm">
              <Filter size={16} className="mr-1.5" />
              Filter
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
              <button 
                onClick={() => setShowFilters(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            
            <MobileTimeRangeSelector />
            <MobileChartTypeSelector />
            
            <div className="mt-6">
              <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold">
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {isMobile ? (
        /* Mobile View */
        <div className="space-y-4">
          <MobileFinancialMetrics />
          <MobileTimeRangeSelector />
          <MobileChartTypeSelector />
          <MobileChartContainer />
          <MobileExpenseBreakdown />
          <MobileRecentTransactions />
          <MobileTopCustomers />
          <MobileFinancialSummary />
        </div>
      ) : (
        /* Desktop View */
        <div className="space-y-6">
          {/* Time Range Selector */}
          <div className="bg-white rounded-xl shadow p-4">
            <DesktopTimeRangeSelector />
            
            {/* Financial Metrics */}
            <DesktopFinancialMetrics />
            
            {/* Chart Section */}
            <div className={`bg-white border border-gray-200 rounded-xl p-6 ${isFullscreen ? 'fixed inset-4 z-50 bg-white p-8 overflow-auto' : ''}`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">Grafik Performa Keuangan</h3>
                  <p className="text-sm text-gray-600">
                    Data ditampilkan dalam periode {timeRange === 'daily' ? 'harian' : timeRange === 'weekly' ? 'mingguan' : timeRange === 'monthly' ? 'bulanan' : 'tahunan'}
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setChartType('grouped')}
                      className={`px-4 py-2 text-sm font-medium flex items-center transition-colors ${
                        chartType === 'grouped'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <BarChart3 size={16} className="mr-2" />
                      Berjajar
                    </button>
                    <button
                      onClick={() => setChartType('stacked')}
                      className={`px-4 py-2 text-sm font-medium flex items-center transition-colors ${
                        chartType === 'stacked'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Grid size={16} className="mr-2" />
                      Bertumpuk
                    </button>
                    <button
                      onClick={() => setChartType('separated')}
                      className={`px-4 py-2 text-sm font-medium flex items-center transition-colors ${
                        chartType === 'separated'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="w-4 h-4 mr-2 flex flex-col justify-between">
                        <div className="w-full h-1 bg-current rounded"></div>
                        <div className="w-full h-1 bg-current rounded"></div>
                        <div className="w-full h-1 bg-current rounded"></div>
                      </div>
                      Terpisah
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="flex items-center text-gray-600 hover:text-blue-600 text-sm transition-colors p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Maximize2 size={16} />
                  </button>
                  
                  <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm transition-colors">
                    <RefreshCw size={16} className="mr-2" />
                    Refresh
                  </button>
                </div>
              </div>
              
              {/* Chart Display (using same mobile chart for simplicity) */}
              <MobileChartContainer />
            </div>
          </div>

          {/* Expense Breakdown & Recent Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expense Breakdown */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <PieChart className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Breakdown Pengeluaran</h3>
                  <p className="text-sm text-gray-600">Distribusi biaya operasional</p>
                </div>
              </div>

              <div className="space-y-4">
                {expenseBreakdown.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{item.category}</span>
                      <span className="text-sm font-semibold text-gray-800">
                        {formatCurrency(item.amount)} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${item.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-800">Total Pengeluaran</span>
                    <p className="text-sm text-gray-600">Bulan Januari 2024</p>
                  </div>
                  <span className="text-lg font-bold text-red-600">
                    {formatCurrency(financialMetrics.expenses)}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-gray-800">Transaksi Terakhir</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
                  Lihat Semua <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
              
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div>
                      <p className="font-medium text-gray-800">{transaction.description}</p>
                      <p className="text-sm text-gray-600">{formatDate(transaction.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.status === 'completed' ? 'Selesai' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">Pending Payments</p>
                <p className="text-xl font-bold text-yellow-600">
                  {formatCurrency(financialMetrics.pendingPayments)}
                </p>
              </div>
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-gray-800">Pelanggan Teratas</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
                Lihat Semua <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
            
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Nama Pelanggan</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Total Belanja</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Jumlah Order</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Order Terakhir</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomers.map((customer, index) => (
                    <tr key={index} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <span className="font-bold text-blue-600 text-sm">
                              {customer.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-gray-800 truncate">{customer.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-800">
                          {formatCurrency(customer.totalSpent)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium whitespace-nowrap">
                          {customer.orders} order
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600 whitespace-nowrap">
                        {formatDate(customer.lastOrder)}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium whitespace-nowrap">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800 flex items-start">
                <span className="mr-2">💡</span>
                <span>
                  <strong className="font-semibold">Insight:</strong> 80% pendapatan berasal dari 20% pelanggan teratas. 
                  Fokus pada retensi pelanggan ini dapat meningkatkan pendapatan secara signifikan.
                </span>
              </p>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h4 className="font-semibold text-gray-800 mb-4">Rata-rata Nilai Order</h4>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(financialMetrics.avgOrderValue)}
              </p>
              <p className="text-sm text-gray-600 mt-2">+5.3% dari periode lalu</p>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h4 className="font-semibold text-gray-800 mb-4">Profit Margin</h4>
              <p className="text-2xl font-bold text-green-600">
                {financialMetrics.profitMargin}%
              </p>
              <p className="text-sm text-gray-600 mt-2">Industri rata-rata: 28%</p>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h4 className="font-semibold text-gray-800 mb-4">ROI (Return on Investment)</h4>
              <p className="text-2xl font-bold text-purple-600">
                42.5%
              </p>
              <p className="text-sm text-gray-600 mt-2">Sangat baik untuk industri garmen</p>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}