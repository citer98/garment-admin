import { useState, useEffect, useRef } from 'react';
import { Bell, Search, HelpCircle, Menu, X } from 'lucide-react';

export default function Topbar({ onMenuClick }) {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchRef = useRef(null);

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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = () => {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <header className="h-14 sm:h-16 bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Menu & Brand */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={20} />
        </button>
        
        {/* Logo/Brand */}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-400 rounded-lg flex items-center justify-center lg:hidden">
            <span className="text-white font-bold text-sm">GTP</span>
          </div>
          
          <div className="hidden md:block ml-2">
            <h1 className="text-sm font-semibold text-gray-800 leading-tight">GarmentTrackPro</h1>
            <p className="text-xs text-gray-500 truncate max-w-[160px] sm:max-w-[200px]">{formatDate()}</p>
          </div>
        </div>
      </div>

      {/* Center: Search - Desktop */}
      <div className="hidden md:flex flex-1 max-w-xl mx-2 lg:mx-4">
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
      </div>

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
        <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 relative">
          <Bell size={18} />
          {notifications > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
              {notifications}
            </span>
          )}
        </button>

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