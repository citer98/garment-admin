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
  Maximize2
} from 'lucide-react';

export default function Finance() {
  const [timeRange, setTimeRange] = useState('monthly');
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('stacked'); // Default to stacked
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
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
      
      // Sync x-axis scroll
      if (xAxisRef.current) {
        xAxisRef.current.scrollLeft += direction * scrollAmount;
      }
    }
  };

  const TimeRangeSelector = () => (
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
            className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 time-range-btn ${
              timeRange === range.key
                ? 'bg-blue-600 text-white shadow-lg transform scale-105 pulse-active'
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

  const ChartContainer = ({ children, labels, timeLabels }) => {
    const groupSpacing = timeRange === 'daily' ? 60 : timeRange === 'weekly' ? 80 : timeRange === 'monthly' ? 70 : 100;
    
    return (
      <div className="relative">
        {/* Chart Area with Scroll Sync */}
        <div className="flex">
          {/* Y-axis Labels */}
          <div className="w-24 flex-shrink-0 pr-4">
            <div className="text-xs text-gray-500 font-medium mb-2 text-center">Jumlah (Rp)</div>
            <div className="flex flex-col justify-between h-64">
              {[58000000, 43500000, 29000000, 14500000, 0].map((value, index) => (
                <div 
                  key={index} 
                  className="text-xs text-gray-500 text-right border-r border-gray-300 pr-2 flex items-center justify-end h-full"
                  style={{ 
                    borderBottom: index === 4 ? 'none' : '1px solid #e5e7eb',
                    paddingBottom: index === 4 ? '0' : '1px',
                    height: '25%'
                  }}
                >
                  <div className="transform translate-y-1/2">
                    {formatCurrency(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Chart Area */}
          <div className="flex-1">
            {/* Chart Bars Container */}
            <div 
              ref={chartContainerRef}
              className="relative h-64 overflow-x-auto chart-scroll-container mb-2"
              style={{ scrollbarWidth: 'thin' }}
              onScroll={(e) => {
                if (xAxisRef.current) {
                  xAxisRef.current.scrollLeft = e.target.scrollLeft;
                }
              }}
            >
              <div 
                className="relative h-full"
                style={{ 
                  minWidth: `${labels.length * groupSpacing}px`,
                  paddingRight: '20px'
                }}
              >
                {/* Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className="border-t border-gray-200"
                      style={{
                        borderStyle: i === 4 ? 'solid' : 'dashed',
                        borderWidth: i === 4 ? '1px' : '1px'
                      }}
                    ></div>
                  ))}
                </div>

                {children}
              </div>
            </div>

            {/* X-axis Labels Container - SYNCED with chart scroll */}
            <div 
              ref={xAxisRef}
              className="overflow-x-auto chart-scroll-container"
              style={{ scrollbarWidth: 'thin' }}
              onScroll={(e) => {
                if (chartContainerRef.current) {
                  chartContainerRef.current.scrollLeft = e.target.scrollLeft;
                }
              }}
            >
              <div 
                className="flex border-t border-gray-300 pt-2"
                style={{ 
                  minWidth: `${labels.length * groupSpacing}px`,
                  paddingRight: '20px'
                }}
              >
                {labels.map((label, index) => (
                  <div 
                    key={index}
                    className="flex flex-col items-center justify-center text-center"
                    style={{ 
                      width: `${groupSpacing}px`,
                      flexShrink: 0
                    }}
                  >
                    <div className="font-medium text-gray-700 text-sm mb-1">{label}</div>
                    <div className="text-gray-500 text-xs">{timeLabels[index]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* X-axis Label */}
        <div className="text-center mt-4">
          <span className="text-xs text-gray-500 font-medium">
            Waktu ({timeRange === 'daily' ? 'Hari' : timeRange === 'weekly' ? 'Minggu' : timeRange === 'monthly' ? 'Bulan' : 'Tahun'})
          </span>
        </div>

        {/* Scroll Buttons */}
        {showScrollButtons && (
          <>
            <button
              onClick={() => scrollChart(-1)}
              className="absolute left-24 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2 shadow-lg hover:bg-gray-50 z-20 scroll-button"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <button
              onClick={() => scrollChart(1)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2 shadow-lg hover:bg-gray-50 z-20 scroll-button"
            >
              <ChevronRightIcon size={20} className="text-gray-600" />
            </button>
          </>
        )}
      </div>
    );
  };

  const renderGroupedBarChart = () => {
    if (!financialData?.chartData) return null;

    const { labels, timeLabels, fullTimeLabels, revenue, expenses, profit } = financialData.chartData;
    const maxValue = Math.max(...revenue, ...expenses, ...profit);
    const chartHeight = 240;
    const groupSpacing = timeRange === 'daily' ? 60 : timeRange === 'weekly' ? 80 : timeRange === 'monthly' ? 70 : 100;
    const barWidth = 16;
    const barSpacing = 6;

    return (
      <ChartContainer labels={labels} timeLabels={timeLabels}>
        {/* Chart Bars */}
        {labels.map((_, index) => {
          const revHeight = (revenue[index] / maxValue) * chartHeight;
          const expHeight = (expenses[index] / maxValue) * chartHeight;
          const profitHeight = (profit[index] / maxValue) * chartHeight;
          const groupLeft = index * groupSpacing;
          const barGroupLeft = groupLeft + (groupSpacing - (barWidth * 3 + barSpacing * 2)) / 2;

          return (
            <div 
              key={index}
              className="absolute bottom-0"
              style={{ left: `${barGroupLeft}px` }}
            >
              {/* Revenue Bar */}
              <div 
                className="relative group inline-block mr-2"
                style={{ 
                  height: `${revHeight}px`,
                  width: `${barWidth}px`
                }}
              >
                <div 
                  className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-all duration-300 cursor-pointer animate-bar-rise absolute bottom-0"
                  style={{ 
                    height: '100%',
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-50 whitespace-nowrap">
                    <div className="font-semibold">Revenue</div>
                    <div>{formatCurrency(revenue[index])}</div>
                    <div className="text-gray-300 text-xs mt-1">{fullTimeLabels[index]}</div>
                  </div>
                </div>
              </div>

              {/* Expenses Bar */}
              <div 
                className="relative group inline-block mr-2"
                style={{ 
                  height: `${expHeight}px`,
                  width: `${barWidth}px`
                }}
              >
                <div 
                  className="w-full bg-red-500 rounded-t hover:bg-red-600 transition-all duration-300 cursor-pointer animate-bar-rise absolute bottom-0"
                  style={{ 
                    height: '100%',
                    animationDelay: `${index * 0.1 + 0.05}s`
                  }}
                >
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-50 whitespace-nowrap">
                    <div className="font-semibold">Expenses</div>
                    <div>{formatCurrency(expenses[index])}</div>
                    <div className="text-gray-300 text-xs mt-1">{fullTimeLabels[index]}</div>
                  </div>
                </div>
              </div>

              {/* Profit Bar */}
              <div 
                className="relative group inline-block"
                style={{ 
                  height: `${profitHeight}px`,
                  width: `${barWidth}px`
                }}
              >
                <div 
                  className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-all duration-300 cursor-pointer animate-bar-rise absolute bottom-0"
                  style={{ 
                    height: '100%',
                    animationDelay: `${index * 0.1 + 0.1}s`
                  }}
                >
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-50 whitespace-nowrap">
                    <div className="font-semibold">Profit</div>
                    <div>{formatCurrency(profit[index])}</div>
                    <div className="text-gray-300 text-xs mt-1">{fullTimeLabels[index]}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </ChartContainer>
    );
  };

  const renderSeparatedStackedBarChart = () => {
    if (!financialData?.chartData) return null;

    const { labels, timeLabels, fullTimeLabels, revenue, expenses, profit } = financialData.chartData;
    const maxValue = 58000000; // Fixed max value as shown in image
    const chartHeight = 240;
    const groupSpacing = timeRange === 'daily' ? 60 : timeRange === 'weekly' ? 80 : timeRange === 'monthly' ? 70 : 100;
    const barWidth = 40;
    const separation = 4; // Separation between stacked segments

    return (
      <ChartContainer labels={labels} timeLabels={timeLabels}>
        {/* Chart Bars with Separations */}
        {labels.map((_, index) => {
          const revHeight = (revenue[index] / maxValue) * chartHeight;
          const expHeight = (expenses[index] / maxValue) * chartHeight;
          const profitHeight = (profit[index] / maxValue) * chartHeight;
          const groupLeft = index * groupSpacing;
          const barLeft = groupLeft + (groupSpacing - barWidth) / 2;

          const totalHeight = profitHeight + expHeight + revHeight;
          const profitBottom = 0;
          const expensesBottom = profitHeight;
          const revenueBottom = profitHeight + expHeight;

          return (
            <div 
              key={index}
              className="absolute bottom-0 group"
              style={{ 
                left: `${barLeft}px`,
                width: `${barWidth}px`,
                height: `${totalHeight}px`
              }}
            >
              {/* Profit Bar (Bottom) with border */}
              <div 
                className="absolute bottom-0 w-full bg-green-500 hover:bg-green-600 transition-all duration-300 animate-bar-rise"
                style={{ 
                  height: `${profitHeight}px`,
                  animationDelay: `${index * 0.1}s`,
                  borderTop: '2px solid white',
                  borderTopLeftRadius: '6px',
                  borderTopRightRadius: '6px'
                }}
              >
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-50 whitespace-nowrap">
                  <div className="font-semibold">Profit</div>
                  <div>{formatCurrency(profit[index])}</div>
                  <div className="text-gray-300 text-xs mt-1">{fullTimeLabels[index]}</div>
                </div>
              </div>
              
              {/* Separator Line between Profit and Expenses */}
              {profitHeight > 0 && expHeight > 0 && (
                <div 
                  className="absolute w-full border-t-2 border-white z-10"
                  style={{ 
                    bottom: `${profitHeight}px`,
                    height: `${separation}px`,
                    backgroundColor: 'transparent'
                  }}
                />
              )}
              
              {/* Expenses Bar (Middle) with border */}
              <div 
                className="absolute w-full bg-red-500 hover:bg-red-600 transition-all duration-300 animate-bar-rise"
                style={{ 
                  bottom: `${profitHeight + separation}px`,
                  height: `${expHeight}px`,
                  animationDelay: `${index * 0.1 + 0.05}s`,
                  borderTop: '2px solid white',
                  borderBottom: '2px solid white'
                }}
              >
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-50 whitespace-nowrap">
                  <div className="font-semibold">Expenses</div>
                  <div>{formatCurrency(expenses[index])}</div>
                  <div className="text-gray-300 text-xs mt-1">{fullTimeLabels[index]}</div>
                </div>
              </div>
              
              {/* Separator Line between Expenses and Revenue */}
              {expHeight > 0 && revHeight > 0 && (
                <div 
                  className="absolute w-full border-t-2 border-white z-10"
                  style={{ 
                    bottom: `${profitHeight + expHeight + separation}px`,
                    height: `${separation}px`,
                    backgroundColor: 'transparent'
                  }}
                />
              )}
              
              {/* Revenue Bar (Top) with border */}
              <div 
                className="absolute w-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 animate-bar-rise"
                style={{ 
                  bottom: `${profitHeight + expHeight + separation * 2}px`,
                  height: `${revHeight}px`,
                  animationDelay: `${index * 0.1 + 0.1}s`,
                  borderBottom: '2px solid white',
                  borderBottomLeftRadius: '6px',
                  borderBottomRightRadius: '6px'
                }}
              >
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-50 whitespace-nowrap">
                  <div className="font-semibold">Revenue</div>
                  <div>{formatCurrency(revenue[index])}</div>
                  <div className="text-gray-300 text-xs mt-1">{fullTimeLabels[index]}</div>
                </div>
              </div>

              {/* Bar Outline */}
              <div 
                className="absolute inset-0 border-2 border-gray-300 rounded-lg pointer-events-none"
                style={{ 
                  height: `${totalHeight + separation * 2}px`
                }}
              />
            </div>
          );
        })}
      </ChartContainer>
    );
  };

  const renderStackedBarChart = () => {
    if (!financialData?.chartData) return null;

    const { labels, timeLabels, fullTimeLabels, revenue, expenses, profit } = financialData.chartData;
    const maxValue = 58000000; // Fixed max value
    const chartHeight = 240;
    const groupSpacing = timeRange === 'daily' ? 60 : timeRange === 'weekly' ? 80 : timeRange === 'monthly' ? 70 : 100;
    const barWidth = 40;

    return (
      <ChartContainer labels={labels} timeLabels={timeLabels}>
        {/* Chart Bars */}
        {labels.map((_, index) => {
          const revHeight = (revenue[index] / maxValue) * chartHeight;
          const expHeight = (expenses[index] / maxValue) * chartHeight;
          const profitHeight = (profit[index] / maxValue) * chartHeight;
          const groupLeft = index * groupSpacing;
          const barLeft = groupLeft + (groupSpacing - barWidth) / 2;

          return (
            <div 
              key={index}
              className="absolute bottom-0 group"
              style={{ 
                left: `${barLeft}px`,
                width: `${barWidth}px`
              }}
            >
              {/* Profit Bar (Bottom) */}
              <div 
                className="absolute bottom-0 w-full bg-green-500 hover:bg-green-600 transition-all duration-300 animate-bar-rise rounded-t"
                style={{ 
                  height: `${profitHeight}px`,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-50 whitespace-nowrap">
                  <div className="font-semibold">Profit</div>
                  <div>{formatCurrency(profit[index])}</div>
                  <div className="text-gray-300 text-xs mt-1">{fullTimeLabels[index]}</div>
                </div>
              </div>
              
              {/* Expenses Bar (Middle) */}
              <div 
                className="absolute w-full bg-red-500 hover:bg-red-600 transition-all duration-300 animate-bar-rise"
                style={{ 
                  bottom: `${profitHeight}px`,
                  height: `${expHeight}px`,
                  animationDelay: `${index * 0.1 + 0.05}s`
                }}
              >
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-50 whitespace-nowrap">
                  <div className="font-semibold">Expenses</div>
                  <div>{formatCurrency(expenses[index])}</div>
                  <div className="text-gray-300 text-xs mt-1">{fullTimeLabels[index]}</div>
                </div>
              </div>
              
              {/* Revenue Bar (Top) */}
              <div 
                className="absolute w-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 animate-bar-rise"
                style={{ 
                  bottom: `${profitHeight + expHeight}px`,
                  height: `${revHeight}px`,
                  animationDelay: `${index * 0.1 + 0.1}s`
                }}
              >
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-100 whitespace-nowrap">
                  <div className="font-semibold">Revenue</div>
                  <div>{formatCurrency(revenue[index])}</div>
                  <div className="text-gray-300 text-xs mt-1">{fullTimeLabels[index]}</div>
                </div>
              </div>
            </div>
          );
        })}
      </ChartContainer>
    );
  };

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Keuangan & Laporan</h2>
          <p className="text-gray-600">Analisis keuangan dan performa bisnis</p>
        </div>
        
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            <Download size={18} className="mr-2" />
            Export
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            <Filter size={18} className="mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Time Range Selector - Sumbu X */}
      <div className="bg-white rounded-xl shadow p-4">
        <TimeRangeSelector />
        
        {/* Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Revenue Card */}
          <div className="bg-gradient-to-r from-blue-50 to-white p-5 rounded-xl border border-blue-100 finance-card">
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
          <div className="bg-gradient-to-r from-red-50 to-white p-5 rounded-xl border border-red-100 finance-card">
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
          <div className="bg-gradient-to-r from-green-50 to-white p-5 rounded-xl border border-green-100 finance-card">
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

        {/* Chart Section */}
        <div className={`bg-white border border-gray-200 rounded-xl p-6 ${isFullscreen ? 'fixed inset-4 z-50 bg-white p-8 overflow-auto' : ''}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h3 className="font-semibold text-gray-800">Grafik Performa Keuangan</h3>
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
          
          {/* Chart Display */}
          <div className="relative fade-in-up">
            {chartType === 'grouped' ? renderGroupedBarChart() : 
             chartType === 'separated' ? renderSeparatedStackedBarChart() : 
             renderStackedBarChart()}
            
            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg hover-lift">
                <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                <span className="text-sm font-medium text-gray-700">Revenue</span>
              </div>
              <div className="flex items-center bg-red-50 px-4 py-2 rounded-lg hover-lift">
                <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                <span className="text-sm font-medium text-gray-700">Expenses</span>
              </div>
              <div className="flex items-center bg-green-50 px-4 py-2 rounded-lg hover-lift">
                <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                <span className="text-sm font-medium text-gray-700">Profit</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the component remains the same */}
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
        <div className="bg-white rounded-xl shadow p-6 finance-card">
          <h4 className="font-semibold text-gray-800 mb-4">Rata-rata Nilai Order</h4>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(financialMetrics.avgOrderValue)}
          </p>
          <p className="text-sm text-gray-600 mt-2">+5.3% dari periode lalu</p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 finance-card">
          <h4 className="font-semibold text-gray-800 mb-4">Profit Margin</h4>
          <p className="text-2xl font-bold text-green-600">
            {financialMetrics.profitMargin}%
          </p>
          <p className="text-sm text-gray-600 mt-2">Industri rata-rata: 28%</p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 finance-card">
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
  );
}