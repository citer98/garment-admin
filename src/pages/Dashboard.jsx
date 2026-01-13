import StatCard from '../components/StatCard';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TrendingUp, TrendingDown, Users, Package, Clock, Bell, AlertTriangle, AlertCircle, CheckCircle, ChevronRight, X, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAllAlerts, setShowAllAlerts] = useState(false);

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
      status: 'critical',
      estimatedDays: 2
    },
    {
      id: 'MAT-002',
      material: 'Benang Polyester',
      currentStock: 12,
      minStock: 50,
      unit: 'roll',
      status: 'critical',
      estimatedDays: 1
    },
    {
      id: 'MAT-003',
      material: 'Kancing Metalik',
      currentStock: 85,
      minStock: 200,
      unit: 'pcs',
      status: 'warning',
      estimatedDays: 5
    },
    {
      id: 'MAT-004',
      material: 'Resleting Nylon',
      currentStock: 60,
      minStock: 150,
      unit: 'pcs',
      status: 'warning',
      estimatedDays: 4
    },
    {
      id: 'MAT-005',
      material: 'Label Brand',
      currentStock: 110,
      minStock: 300,
      unit: 'pcs',
      status: 'low',
      estimatedDays: 7
    }
  ];

  // Inisialisasi notifikasi
  useEffect(() => {
    const initialNotifications = [
      {
        id: 1,
        type: 'stuck',
        title: 'Item Stuck di Departemen Jahit',
        message: 'Kemeja Pria Slimfit (ORD-00120) stuck selama 3 hari',
        time: '10 menit lalu',
        read: false,
        priority: 'high'
      },
      {
        id: 2,
        type: 'stock',
        title: 'Stok Kain Katun Menipis',
        message: 'Sisa 45 meter, minimal 100 meter',
        time: '1 jam lalu',
        read: false,
        priority: 'critical'
      },
      {
        id: 3,
        type: 'stuck',
        title: 'Celana Chino Tertahan di Finishing',
        message: 'Menunggu kancing (ORD-00118)',
        time: '3 jam lalu',
        read: false,
        priority: 'medium'
      },
      {
        id: 4,
        type: 'stock',
        title: 'Benang Polyester Hampir Habis',
        message: 'Sisa 12 roll, minimal 50 roll',
        time: '5 jam lalu',
        read: true,
        priority: 'critical'
      },
      {
        id: 5,
        type: 'system',
        title: 'Maintenance Jadwal',
        message: 'Maintenance sistem hari Sabtu, 08:00-10:00',
        time: '1 hari lalu',
        read: true,
        priority: 'low'
      }
    ];
    
    setNotifications(initialNotifications);
    setUnreadCount(initialNotifications.filter(n => !n.read).length);
  }, []);

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
    switch(trend) {
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
    switch(priority) {
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

  // Helper untuk notification icon
  const getNotificationIcon = (type, priority) => {
    switch(type) {
      case 'stuck':
        return <AlertTriangle size={16} className={priority === 'high' ? 'text-red-500' : 'text-yellow-500'} />;
      case 'stock':
        return <AlertCircle size={16} className="text-orange-500" />;
      case 'system':
        return <Bell size={16} className="text-blue-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  // Mark notification as read
  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
  };

  // Mark all as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);
  };

  // Remove notification
  const removeNotification = (id) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
  };

  return (
    <div className="space-y-4 md:space-y-6 mt-2">
      {/* Header dengan Notification Bell */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-gray-800">Dashboard Produksi</h2>
          <p className="text-xs md:text-sm text-gray-600 mt-0.5">Ringkasan aktivitas produksi terkini</p>
        </div>
        <div className="flex items-center gap-3 mt-2 md:mt-0">
          {/* Notification Bell */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">Notifikasi</h3>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={markAllAsRead}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Tandai semua dibaca
                        </button>
                        <button 
                          onClick={() => setShowNotifications(false)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <X size={16} className="text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {notifications.map(notification => (
                          <div 
                            key={notification.id} 
                            className={`p-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50/50' : ''}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start">
                                <div className="mr-3 mt-0.5">
                                  {getNotificationIcon(notification.type, notification.priority)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className={`text-sm font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                      {notification.title}
                                    </h4>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityBadge(notification.priority)}`}>
                                      {notification.priority}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-gray-500">{notification.time}</span>
                                    <div className="flex items-center space-x-2">
                                      {!notification.read && (
                                        <button 
                                          onClick={() => markAsRead(notification.id)}
                                          className="text-xs text-blue-600 hover:text-blue-800"
                                        >
                                          Tandai dibaca
                                        </button>
                                      )}
                                      <button 
                                        onClick={() => removeNotification(notification.id)}
                                        className="text-xs text-gray-400 hover:text-red-600"
                                      >
                                        <X size={12} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <Bell size={32} className="text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">Tidak ada notifikasi</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <a 
                      href="/alerts" 
                      className="flex items-center justify-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Lihat semua notifikasi
                      <ChevronRight size={16} className="ml-1" />
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <Button variant="primary" size="sm">
            + Buat Pesanan Baru
          </Button>
        </div>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Stuck Items Alert */}
        <div className="bg-white border border-red-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Item Stuck</h3>
                <p className="text-xs text-gray-600">Perlu perhatian</p>
              </div>
            </div>
            <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
              {stuckItems.length}
            </span>
          </div>
          
          <div className="space-y-2">
            {stuckItems.slice(0, 2).map((item, index) => (
              <div key={index} className="p-2 bg-red-50 rounded border border-red-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.product}</p>
                    <p className="text-xs text-gray-600">{item.department}</p>
                  </div>
                  <span className="text-xs font-semibold text-red-600">{item.stuckFor}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{item.reason}</p>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => setShowAllAlerts(true)}
            className="w-full mt-3 text-center text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Lihat semua {stuckItems.length} item stuck
          </button>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white border border-yellow-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <AlertCircle size={20} className="text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Stok Menipis</h3>
                <p className="text-xs text-gray-600">Segera restock</p>
              </div>
            </div>
            <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
              {lowStockItems.filter(item => item.status === 'critical').length} kritis
            </span>
          </div>
          
          <div className="space-y-2">
            {lowStockItems
              .filter(item => item.status === 'critical')
              .slice(0, 2)
              .map((item, index) => {
                const stockStatus = getStockStatus(item.currentStock, item.minStock);
                return (
                  <div key={index} className="p-2 bg-yellow-50 rounded border border-yellow-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{item.material}</p>
                        <p className="text-xs text-gray-600">Sisa: {item.currentStock} {item.unit}</p>
                      </div>
                      <span className="text-xs font-semibold text-red-600">
                        {item.estimatedDays} hari lagi
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-red-500 h-1.5 rounded-full"
                        style={{ width: `${(item.currentStock / item.minStock) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
          
          <button className="w-full mt-3 text-center text-sm text-yellow-600 hover:text-yellow-800 font-medium">
            Lihat semua {lowStockItems.length} bahan menipis
          </button>
        </div>

        {/* Quick Stats */}
        <div className="bg-white border border-blue-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Package size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Statistik Cepat</h3>
                <p className="text-xs text-gray-600">Status produksi</p>
              </div>
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
              Live
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-lg font-bold text-gray-800">85%</div>
              <div className="text-xs text-gray-600">Efisiensi</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-lg font-bold text-green-600">92</div>
              <div className="text-xs text-gray-600">Selesai</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-lg font-bold text-yellow-600">8</div>
              <div className="text-xs text-gray-600">Pending</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-lg font-bold text-red-600">3</div>
              <div className="text-xs text-gray-600">Stuck</div>
            </div>
          </div>
          
          <button className="w-full mt-3 text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
            Refresh data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <a 
            key={index} 
            href={stat.link}
            className="block bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">{stat.title}</p>
                <div className="flex items-end mt-1">
                  <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                  <span className={`ml-1 text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`text-xl p-2 rounded-lg ${getColorClass(stat.color)}`}>
                {stat.icon}
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <Card className="p-3 lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Pesanan Terbaru</h3>
              <a href="/orders" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                Lihat semua →
              </a>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <p className="font-medium text-sm text-gray-800">{order.id}</p>
                    <p className="text-xs text-gray-600">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {order.items} item
                    </span>
                    <p className="text-xs text-gray-600 mt-1">Deadline: {order.deadline}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Production Status */}
        <Card className="p-3 lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Status Produksi</h3>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                Real-time
              </span>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {['Cutting', 'Sewing', 'Finishing', 'Packing'].map((stage) => (
                <div key={stage} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                      <span className="text-base">
                        {stage === 'Cutting' ? '✂️' : 
                         stage === 'Sewing' ? '🧵' : 
                         stage === 'Finishing' ? '✨' : '📦'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-800">{stage}</p>
                      <p className="text-xs text-gray-600">Departemen</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{Math.floor(Math.random() * 50) + 10}</p>
                    <p className="text-xs text-gray-600">item</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Department Performance Summary */}
        <Card className="p-3 lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Kinerja Departemen</h3>
              <a href="/joblist" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                Detail →
              </a>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <Users size={16} className="text-blue-600 mr-2" />
                    <span className="text-xs text-gray-600">Total Karyawan</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800 mt-1">35</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <Package size={16} className="text-green-600 mr-2" />
                    <span className="text-xs text-gray-600">Total Pekerjaan</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800 mt-1">122</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {departmentPerformance.slice(0, 3).map((dept) => (
                  <div key={dept.name} className="p-2 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <span className="mr-2 text-lg">{dept.icon}</span>
                        <span className="text-sm font-medium text-gray-800">{dept.name}</span>
                      </div>
                      <div className="flex items-center">
                        {getTrendIcon(dept.trend)}
                        <span className={`ml-1 text-xs font-bold ${
                          dept.trend === 'up' ? 'text-green-600' : 
                          dept.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {dept.efficiency}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${getProgressColor(dept.efficiency)}`}
                        style={{ width: `${dept.efficiency}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{dept.completed}/{dept.totalJobs} selesai</span>
                      <span className="flex items-center">
                        <Clock size={10} className="mr-1" />
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

      {/* Department Performance Full Chart */}
      <Card className="p-3">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-800">Analisis Kinerja per Departemen</h3>
              <p className="text-xs text-gray-600 mt-0.5">Efisiensi dan produktivitas bulan ini</p>
            </div>
            <div className="flex space-x-2">
              <button className="text-xs text-gray-600 hover:text-gray-800 font-medium">
                Bulan ini
              </button>
              <button className="text-xs text-gray-400 hover:text-gray-600 font-medium">
                Minggu ini
              </button>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {departmentPerformance.map((dept) => (
              <div key={dept.name} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClass(dept.color)}`}>
                      <span className="text-lg">{dept.icon}</span>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-gray-800 text-sm">{dept.name}</h4>
                      <div className="flex items-center text-xs text-gray-500">
                        <Users size={10} className="mr-1" />
                        {dept.employees} orang
                      </div>
                    </div>
                  </div>
                  {getTrendIcon(dept.trend)}
                </div>

                {/* Mini Bar Chart */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span className="font-bold">{dept.efficiency}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(dept.efficiency)}`}
                      style={{ width: `${dept.efficiency}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="text-xs text-blue-700">Selesai</div>
                    <div className="font-bold text-blue-800">{dept.completed}</div>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded">
                    <div className="text-xs text-yellow-700">Pending</div>
                    <div className="font-bold text-yellow-800">{dept.pending}</div>
                  </div>
                </div>

                {/* Performance Details */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center text-xs">
                    <div className="text-gray-600">Rata-rata waktu:</div>
                    <div className="font-semibold text-gray-800">{dept.avgTime}</div>
                  </div>
                  <div className="flex justify-between items-center text-xs mt-1">
                    <div className="text-gray-600">Total pekerjaan:</div>
                    <div className="font-semibold text-gray-800">{dept.totalJobs}</div>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full mt-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                  Lihat detail
                </button>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Rata-rata Efisiensi</div>
                <div className="flex items-center">
                  <div className="text-xl font-bold text-gray-800 mr-2">
                    {Math.round(departmentPerformance.reduce((sum, dept) => sum + dept.efficiency, 0) / departmentPerformance.length)}%
                  </div>
                  <TrendingUp size={16} className="text-green-500" />
                  <span className="text-xs text-green-600 ml-1">+2.4%</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Total Pekerjaan Selesai</div>
                <div className="text-xl font-bold text-gray-800">
                  {departmentPerformance.reduce((sum, dept) => sum + dept.completed, 0)}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Departemen Terbaik</div>
                <div className="flex items-center">
                  <span className="mr-2 text-lg">📦</span>
                  <div>
                    <div className="font-medium text-gray-800">Packing</div>
                    <div className="text-xs text-gray-600">95% efisiensi</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Modal untuk Alerts Lengkap */}
      {showAllAlerts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Semua Alert & Notifikasi</h3>
                  <p className="text-sm text-gray-600 mt-1">Monitoring item stuck dan stok bahan</p>
                </div>
                <button 
                  onClick={() => setShowAllAlerts(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[70vh]">
              {/* Stuck Items Section */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center mb-4">
                  <AlertTriangle size={20} className="text-red-500 mr-2" />
                  <h4 className="font-semibold text-gray-800">Item Stuck dalam Produksi</h4>
                  <span className="ml-2 bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
                    {stuckItems.length} item
                  </span>
                </div>
                
                <div className="space-y-3">
                  {stuckItems.map((item, index) => (
                    <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <span className="font-bold text-gray-800">{item.id}</span>
                            <span className="ml-3 px-2 py-1 bg-white border border-red-300 text-red-700 text-xs font-semibold rounded">
                              {item.department}
                            </span>
                          </div>
                          <p className="text-gray-800 font-medium mt-1">{item.product}</p>
                          <p className="text-sm text-gray-600 mt-1">Alasan: {item.reason}</p>
                          <div className="flex items-center mt-2 text-sm">
                            <Clock size={14} className="text-red-500 mr-1" />
                            <span className="text-red-600 font-semibold">Stuck selama {item.stuckFor}</span>
                            <span className="mx-2">•</span>
                            <span className="text-gray-600">Ditangani: {item.assignedTo}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityBadge(item.priority)}`}>
                            {item.priority.toUpperCase()}
                          </span>
                          <button className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                            Tindak Lanjut
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Section */}
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <AlertCircle size={20} className="text-yellow-500 mr-2" />
                  <h4 className="font-semibold text-gray-800">Stok Bahan Menipis</h4>
                  <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
                    {lowStockItems.filter(item => item.status === 'critical').length} kritis
                  </span>
                </div>
                
                <div className="space-y-3">
                  {lowStockItems.map((item, index) => {
                    const stockStatus = getStockStatus(item.currentStock, item.minStock);
                    return (
                      <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className="font-bold text-gray-800">{item.id}</span>
                              <span className={`ml-3 px-2 py-1 text-xs font-semibold rounded ${stockStatus.bg} ${stockStatus.color}`}>
                                {stockStatus.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-gray-800 font-medium mt-1">{item.material}</p>
                            <div className="grid grid-cols-3 gap-4 mt-3">
                              <div>
                                <div className="text-xs text-gray-600">Stok Saat Ini</div>
                                <div className="font-bold text-gray-800">{item.currentStock} {item.unit}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-600">Stok Minimal</div>
                                <div className="font-bold text-gray-800">{item.minStock} {item.unit}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-600">Estimasi Habis</div>
                                <div className="font-bold text-red-600">{item.estimatedDays} hari</div>
                              </div>
                            </div>
                            <div className="mt-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Tingkat Stok</span>
                                <span className="font-bold">{Math.round((item.currentStock / item.minStock) * 100)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${stockStatus.status === 'critical' ? 'bg-red-500' : 'bg-yellow-500'}`}
                                  style={{ width: `${(item.currentStock / item.minStock) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4">
                            <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
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

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Terakhir diperbarui: {new Date().toLocaleTimeString('id-ID')}
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setShowAllAlerts(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Tutup
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Ekspor Laporan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}