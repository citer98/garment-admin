import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { 
  Home, 
  Package, 
  Search, 
  Users, 
  FileText, 
  ClipboardList,
  LogOut,
  ChevronRight,
  PlusCircle
} from 'lucide-react';

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const isAdmin = user?.username === 'admin';
  
  const adminMenu = [
    { to: '/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { to: '/orders', label: 'Daftar Pesanan', icon: <Package size={20} /> },
    { to: '/tracking', label: 'Pelacakan', icon: <Search size={20} /> },
    { to: '/finance', label: 'Keuangan', icon: <FileText size={20} /> },
    { to: '/users', label: 'Manajemen User', icon: <Users size={20} /> },
  ];

  const employeeMenu = [
    { to: '/joblist', label: 'Daftar Pekerjaan', icon: <ClipboardList size={20} /> },
  ];

  const menuItems = isAdmin ? adminMenu : employeeMenu;

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 flex flex-col h-full`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        {!collapsed && (
          <div>
            <h1 className="text-xl font-bold">GarmentTrackPro</h1>
            <p className="text-xs text-slate-400">Manufacturing System</p>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-slate-700 rounded-lg"
        >
          <ChevronRight className={`transform transition-transform ${collapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => 
                  `flex items-center ${collapsed ? 'justify-center' : ''} p-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`
                }
              >
                <span className={collapsed ? '' : 'mr-3'}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-700">
        <div className={`flex items-center ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="font-bold">{user?.name?.charAt(0) || 'U'}</span>
          </div>
          {!collapsed && (
            <div className="ml-3 flex-1">
              <p className="font-medium truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-400">
                {isAdmin ? 'Administrator' : 'Karyawan'}
              </p>
            </div>
          )}
        </div>
        
        <button 
          onClick={() => {
            localStorage.removeItem('user');
            window.location.href = '/';
          }}
          className={`flex items-center ${collapsed ? 'justify-center' : ''} w-full mt-4 p-2 text-red-300 hover:bg-slate-700 rounded-lg`}
        >
          <LogOut size={20} />
          {!collapsed && <span className="ml-2">Keluar</span>}
        </button>
      </div>
    </aside>
  );
}