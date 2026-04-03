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
  ChevronLeft,
  X,
  Warehouse,        // TAMBAHKAN: Icon untuk Stok Material
  ShoppingCart      // TAMBAHKAN: Icon alternatif (opsional)
} from 'lucide-react';

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setCollapsed(false); // Sidebar full di mobile
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isAdmin = user?.username === 'admin';
  
  const adminMenu = [
    { to: '/dashboard', label: 'Dashboard', icon: <Home size={22} /> },
    { to: '/orders', label: 'Daftar Pesanan', icon: <Package size={22} /> },
    //{ to: '/tracking', label: 'Pelacakan', icon: <Search size={22} /> },
    { to: '/stock', label: 'Stok Material', icon: <Warehouse size={22} /> },      // TAMBAHKAN: Menu Stok Material
    { to: '/finance', label: 'Keuangan', icon: <FileText size={22} /> },
    { to: '/users', label: 'Manajemen User', icon: <Users size={22} /> },
  ];

  const employeeMenu = [
    { to: '/joblist', label: 'Daftar Pekerjaan', icon: <ClipboardList size={22} /> },
  ];

  const menuItems = isAdmin ? adminMenu : employeeMenu;

  const closeMobileSidebar = () => {
    if (isMobile) {
      // Dispatch event untuk menutup sidebar di mobile
      const event = new CustomEvent('closeSidebar');
      window.dispatchEvent(event);
    }
  };

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-gradient-to-b from-slate-900 to-slate-800 text-white h-full flex flex-col transition-all duration-300 relative`}>
      {/* Mobile Close Button */}
      {isMobile && (
        <button 
          onClick={closeMobileSidebar}
          className="absolute top-4 right-4 z-50 p-2 hover:bg-slate-700 rounded-lg lg:hidden"
        >
          <X size={20} />
        </button>
      )}

      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        {!collapsed && (
          <div className="flex-1">
            <h1 className="text-xl font-bold truncate">GarmentTrackPro</h1>
            <p className="text-xs text-slate-400 truncate">Manufacturing System</p>
          </div>
        )}
        
        {/* Desktop Toggle Button */}
        {!isMobile && (
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-transform duration-300"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={closeMobileSidebar}
                className={({ isActive }) => 
                  `flex items-center ${collapsed ? 'justify-center px-3' : 'px-4'} py-3 rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white hover:shadow-md'
                  }`
                }
              >
                <span className={`transition-transform duration-200 ${collapsed ? '' : 'mr-4'}`}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <>
                    <span className="font-medium">{item.label}</span>
                    <ChevronRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200" size={16} />
                  </>
                )}
                
                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-700 mt-auto">
        <button 
          onClick={() => {
            localStorage.removeItem('user');
            window.location.href = '/';
          }}
          className={`flex items-center ${collapsed ? 'justify-center px-3' : 'px-4'} w-full py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 group border border-transparent hover:border-red-500/20`}
        >
          <LogOut size={22} />
          {!collapsed && (
            <>
              <span className="ml-4 font-medium italic">Keluar</span>
              <ChevronRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200" size={16} />
            </>
          )}
        </button>
      </div>
    </aside>
  );
}