// src/components/Topbar.jsx
import { useState, useEffect, useRef } from 'react';
import { Bell, Menu, X, AlertTriangle, AlertCircle, ChevronRight, User, Settings, LogOut, Moon, Sun, Package, Clock, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDate as formatDateUtil } from '../utils/formatters';

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showAllAlertsModal, setShowAllAlertsModal] = useState(false);
  
  // Data untuk modal gabungan
  const [stuckItems, setStuckItems] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  // Load data untuk modal gabungan
  const loadStuckItems = () => {
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
            stuckFor: `${overdueDays} hari`,
            priority: priority,
            dueDate: dueDate
          });
        }
      });
      
      setStuckItems(stuck);
    } catch (error) {
      console.error('Error loading stuck items:', error);
    }
  };

  const loadLowStockItems = () => {
    try {
      const savedStock = localStorage.getItem('stockItems');
      if (savedStock) {
        const stock = JSON.parse(savedStock);
        const criticalAndWarning = stock.filter(item => 
          item.status === 'critical' || item.status === 'warning'
        );
        setLowStockItems(criticalAndWarning);
      }
    } catch (error) {
      console.error('Error loading low stock items:', error);
    }
  };

  const loadAllData = () => {
    setIsRefreshing(true);
    loadStuckItems();
    loadLowStockItems();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Helper untuk priority badge
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Helper untuk stock status
  const getStockStatus = (currentStock, minStock) => {
    const ratio = currentStock / minStock;
    if (ratio <= 0.3) {
      return { status: 'critical', bg: 'bg-red-100', color: 'text-red-800', label: 'Kritis' };
    } else if (ratio <= 0.6) {
      return { status: 'warning', bg: 'bg-yellow-100', color: 'text-yellow-800', label: 'Menipis' };
    } else {
      return { status: 'normal', bg: 'bg-green-100', color: 'text-green-800', label: 'Normal' };
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    loadAllData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    // Event listener untuk realtime update
    const handleOrdersUpdated = () => {
      loadStuckItems();
    };
    const handleStockUpdated = () => {
      loadLowStockItems();
    };
    
    window.addEventListener('ordersUpdated', handleOrdersUpdated);
    window.addEventListener('stockUpdated', handleStockUpdated);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('ordersUpdated', handleOrdersUpdated);
      window.removeEventListener('stockUpdated', handleStockUpdated);
    };
  }, []);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Load notifications for dropdown
  useEffect(() => {
    const loadNotifications = () => {
      const newNotifications = [
        ...stuckItems.slice(0, 2).map(item => ({
          id: `stuck-${item.id}`,
          type: 'stuck',
          title: 'Item Stuck',
          message: `${item.product} - Terlambat ${item.stuckFor}`,
          time: 'Baru saja',
          read: false,
          priority: item.priority,
          link: `/orders/${item.orderId}`
        })),
        ...lowStockItems.filter(item => item.status === 'critical').slice(0, 2).map(item => ({
          id: `stock-${item.id}`,
          type: 'stock',
          title: 'Stok Kritis',
          message: `${item.material} tersisa ${item.currentStock} ${item.unit}`,
          time: 'Baru saja',
          read: false,
          priority: 'critical',
          link: '/stock'
        }))
      ];
      
      setNotifications(newNotifications);
      setUnreadCount(newNotifications.filter(n => !n.read).length);
    };
    
    loadNotifications();
  }, [stuckItems, lowStockItems]);

  const markAsRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    setUnreadCount(updated.filter(n => !n.read).length);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    setUnreadCount(0);
  };

  const getNotificationIcon = (type, priority) => {
    switch (type) {
      case 'stuck':
        return <AlertTriangle size={14} className={priority === 'critical' ? 'text-red-500' : priority === 'high' ? 'text-orange-500' : 'text-yellow-500'} />;
      case 'stock':
        return <AlertCircle size={14} className="text-orange-500" />;
      default:
        return <Bell size={14} className="text-blue-500" />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  return (
    <>
      <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        {/* Left: Menu & Brand */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
          >
            <Menu size={20} />
          </button>
          
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xs">GP</span>
            </div>
            
            <div className="ml-3 hidden sm:block">
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">System Status</p>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate max-w-[160px]">{formatDate()}</p>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 transition-colors"
            title={darkMode ? 'Mode Terang' : 'Mode Gelap'}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 relative transition-colors"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 dark:text-white text-sm">Notifikasi</h3>
                    <button 
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium"
                    >
                      Baca semua
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                      {notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50/30 dark:bg-blue-900/20' : ''}`}
                          onClick={() => {
                            if (notification.link) navigate(notification.link);
                            markAsRead(notification.id);
                            setShowNotifications(false);
                          }}
                        >
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type, notification.priority)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <p className={`text-xs font-medium ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                  {notification.title}
                                </p>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${getPriorityBadge(notification.priority)} flex-shrink-0`}>
                                  {notification.priority}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">{notification.message}</p>
                              <p className="text-[10px] text-gray-400 dark:text-gray-500">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Bell size={18} className="text-gray-400 dark:text-gray-500" />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Tidak ada notifikasi</p>
                    </div>
                  )}
                </div>

                <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <button 
                    onClick={() => {
                      setShowNotifications(false);
                      setShowAllAlertsModal(true);
                    }}
                    className="w-full text-center text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700"
                  >
                    Lihat semua alert
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-800 dark:text-white truncate max-w-[100px]">
                  {user?.name || 'User'}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  {user?.username === 'admin' ? 'Admin' : 'Karyawan'}
                </p>
              </div>
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm uppercase">
                    {user?.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
              </div>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <p className="font-medium text-gray-800 dark:text-white text-sm">{user?.name || 'User'}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{user?.username || 'user'}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User size={14} />
                    Profil
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings size={14} />
                    Pengaturan
                  </Link>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-colors"
                  >
                    <LogOut size={14} />
                    Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ================== MODAL GABUNGAN ALERT & NOTIFIKASI ================== */}
      {showAllAlertsModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm md:max-w-md max-h-[85vh] overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-red-50 to-yellow-50 dark:from-gray-800 dark:to-gray-800 sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-white">Semua Alert & Notifikasi</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Monitoring item stuck dan stok bahan</p>
                </div>
                <button onClick={() => setShowAllAlertsModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Tombol Refresh */}
              <div className="flex justify-end">
                <button 
                  onClick={loadAllData}
                  disabled={isRefreshing}
                  className={`text-blue-600 dark:text-blue-400 text-xs flex items-center gap-1 hover:text-blue-700 ${isRefreshing ? 'animate-spin' : ''}`}
                >
                  <RefreshCw size={12} /> Refresh
                </button>
              </div>

              {/* Section Item Stuck */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={16} className="text-red-500" />
                  <h4 className="font-semibold text-gray-800 dark:text-white text-sm">Item Stuck dalam Produksi</h4>
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {stuckItems.length} item
                  </span>
                </div>
                <div className="space-y-2">
                  {stuckItems.length > 0 ? (
                    stuckItems.map((item, index) => (
                      <div 
                        key={index} 
                        className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg cursor-pointer hover:shadow-sm transition-shadow"
                        onClick={() => {
                          setShowAllAlertsModal(false);
                          navigate(`/orders/${item.orderId}`);
                        }}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-gray-800 dark:text-white text-xs">{item.orderId}</span>
                          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${getPriorityBadge(item.priority)}`}>
                            {item.priority?.toUpperCase() || 'MEDIUM'}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">{item.product}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Pelanggan: {item.customerName}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs">
                          <Clock size={12} className="text-red-500" />
                          <span className="text-red-600 dark:text-red-400 font-semibold">Terlambat {item.stuckFor}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500 dark:text-gray-500">Deadline: {formatShortDate(item.dueDate)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      Tidak ada item stuck
                    </div>
                  )}
                </div>
              </div>

              {/* Section Stok Menipis */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle size={16} className="text-yellow-500" />
                  <h4 className="font-semibold text-gray-800 dark:text-white text-sm">Stok Bahan Menipis</h4>
                  <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {lowStockItems.filter(item => item.status === 'critical').length} kritis
                  </span>
                  <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {lowStockItems.filter(item => item.status === 'warning').length} menipis
                  </span>
                </div>
                <div className="space-y-2">
                  {lowStockItems.length > 0 ? (
                    [...lowStockItems]
                      .sort((a, b) => {
                        const statusOrder = { 'critical': 3, 'warning': 2, 'normal': 1 };
                        return (statusOrder[b.status] || 0) - (statusOrder[a.status] || 0);
                      })
                      .map((item, index) => {
                        const stockStatus = getStockStatus(item.currentStock, item.minStock);
                        const percentage = Math.min(100, Math.round((item.currentStock / item.minStock) * 100));
                        const isCritical = stockStatus.status === 'critical';
                        
                        return (
                          <div key={index} className={`p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow ${isCritical ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'}`}
                            onClick={() => {
                              setShowAllAlertsModal(false);
                              navigate('/stock');
                            }}>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="font-bold text-gray-800 dark:text-white text-sm">{item.code}</span>
                                <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded ${isCritical ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200' : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'}`}>
                                  {stockStatus.label.toUpperCase()}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{item.unit}</span>
                            </div>
                            
                            <p className="font-medium text-gray-800 dark:text-white text-sm mb-2">{item.material}</p>
                            
                            <div className="grid grid-cols-2 gap-3 mt-2 text-xs">
                              <div className="bg-white/50 dark:bg-gray-900/50 rounded p-1.5">
                                <span className="text-gray-500 dark:text-gray-400">Stok Saat Ini</span>
                                <p className="font-bold text-gray-800 dark:text-white">{item.currentStock}</p>
                              </div>
                              <div className="bg-white/50 dark:bg-gray-900/50 rounded p-1.5">
                                <span className="text-gray-500 dark:text-gray-400">Stok Minimal</span>
                                <p className="font-bold text-gray-800 dark:text-white">{item.minStock}</p>
                              </div>
                            </div>
                            
                            <div className="mt-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-500 dark:text-gray-400">Tingkat Stok</span>
                                <span className={`font-bold ${isCritical ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`}>{percentage}%</span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${isCritical ? 'bg-red-500' : 'bg-yellow-500'}`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      Semua stok dalam kondisi normal
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Total {stuckItems.length + lowStockItems.length} masalah terdeteksi
              </div>
              <button 
                onClick={() => setShowAllAlertsModal(false)} 
                className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}