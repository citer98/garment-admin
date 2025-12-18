import { useState, useEffect } from 'react';
import { Bell, Search, HelpCircle, Menu } from 'lucide-react';

export default function Topbar({ onMenuClick }) {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
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
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Left: Menu & Brand */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={24} />
        </button>
        <div className="hidden md:block">
          <h1 className="font-semibold text-gray-800">GarmentTrackPro</h1>
          <p className="text-xs text-gray-500">{formatDate()}</p>
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-2xl mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari pesanan, pelanggan, atau produk..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Right: User & Actions */}
      <div className="flex items-center space-x-4">
        {/* Help */}
        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
          <HelpCircle size={20} />
        </button>

        {/* Notifications */}
        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 relative">
          <Bell size={20} />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {notifications}
            </span>
          )}
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="font-medium text-gray-800">{user?.name || 'Administrator'}</p>
            <p className="text-xs text-gray-500">Status: {user?.username === 'admin' ? 'Online' : 'Active'}</p>
          </div>
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  );
}