import { useState, useEffect, useRef } from 'react';
import { Bell, Search, HelpCircle, Menu, X, AlertTriangle, AlertCircle, ChevronRight } from 'lucide-react';

export default function Topbar({ onMenuClick }) {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowMobileSearch(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync notifications (Shared logic moving from Dashboard)
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
      }
    ];

    setNotifications(initialNotifications);
    setUnreadCount(initialNotifications.filter(n => !n.read).length);
  }, []);

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

  const removeNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    setUnreadCount(updated.filter(n => !n.read).length);
  };

  const getNotificationIcon = (type, priority) => {
    switch (type) {
      case 'stuck':
        return <AlertTriangle size={16} className={priority === 'high' ? 'text-red-500' : 'text-yellow-500'} />;
      case 'stock':
        return <AlertCircle size={16} className="text-orange-500" />;
      default:
        return <Bell size={16} className="text-blue-500" />;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* Left: Menu & Brand Icon */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={22} />
        </button>
        
        {/* Logo/Brand Icon Only */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-base">GP</span>
          </div>
          
          <div className="ml-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider hidden xs:block">System Status</p>
            <p className="text-xs font-semibold text-gray-600 truncate max-w-[160px] sm:max-w-[200px]">{formatDate()}</p>
          </div>
        </div>
      </div>

      {/* Center: Search - Desktop */}
      {/*<div className="hidden md:flex flex-1 max-w-xl mx-2 lg:mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Cari pesanan, pelanggan, atau produk..."
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>*/}

      {/* Mobile Search Button */}
      <button 
        onClick={() => setShowMobileSearch(true)}
        className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 ml-auto mr-2"
      >
        <Search size={20} />
      </button>

      {/* Right: User & Actions */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        {/* Help - Hidden on smallest screens */}
        <button className="hidden sm:inline-flex p-1.5 hover:bg-gray-100 rounded-lg text-gray-600">
          <HelpCircle size={18} />
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 relative transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 md:w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden slide-in-top">
              <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-gray-800">Notifikasi</h3>
                  <button 
                    onClick={markAllAsRead}
                    className="text-[10px] sm:text-xs text-primary-600 hover:text-primary-700 font-bold uppercase tracking-wider"
                  >
                    Tandai semua baca
                  </button>
                </div>
              </div>

              <div className="max-h-[70vh] md:max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-3 sm:p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-primary-50/20' : ''}`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="mt-1 flex-shrink-0">
                            {getNotificationIcon(notification.type, notification.priority)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className={`text-xs sm:text-sm font-bold truncate ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                {notification.title}
                              </h4>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${getPriorityBadge(notification.priority)} ml-2`}>
                                {notification.priority}
                              </span>
                            </div>
                            <p className="text-[11px] sm:text-xs text-gray-500 line-clamp-2 mb-2">{notification.message}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-gray-400">{notification.time}</span>
                              <div className="flex items-center space-x-3">
                                {!notification.read && (
                                  <button 
                                    onClick={() => markAsRead(notification.id)}
                                    className="text-[10px] text-primary-600 font-bold hover:underline"
                                  >
                                    Baca
                                  </button>
                                )}
                                <button 
                                  onClick={() => removeNotification(notification.id)}
                                  className="text-[10px] text-gray-400 hover:text-red-600"
                                >
                                  Hapus
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-white">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Bell size={24} className="text-gray-300" />
                    </div>
                    <p className="text-xs text-gray-500">Tidak ada notifikasi baru</p>
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-gray-100 bg-gray-50 flex items-center justify-center">
                <button className="text-[11px] font-bold text-gray-500 hover:text-gray-700 flex items-center">
                  LIHAT SEMUA ALERTS <ChevronRight size={14} className="ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-800 truncate max-w-[80px] md:max-w-[120px]">
              {user?.name || 'Administrator'}
            </p>
            <p className="text-xs text-gray-500">
              {user?.username === 'admin' ? 'Online' : 'Active'}
            </p>
          </div>
          <div className="relative">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-white z-40 md:hidden">
          <div className="p-4 border-b border-gray-200 flex items-center">
            <button 
              onClick={() => setShowMobileSearch(false)}
              className="p-2 mr-3 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
            <div className="flex-1" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Cari pesanan, pelanggan, atau produk..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}