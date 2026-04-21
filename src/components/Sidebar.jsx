// src/components/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { 
  Home, 
  Package, 
  Users, 
  FileText, 
  ClipboardList,
  LogOut,
  ChevronRight,
  ChevronLeft,
  X,
  Warehouse,
  HelpCircle,
  LayoutDashboard,
  DollarSign,
  UserCog
} from 'lucide-react';

export default function Sidebar({ collapsed, onToggleCollapse, isMobile: isMobileProp }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(isMobileProp || false);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    if (isMobileProp !== undefined) {
      setIsMobile(isMobileProp);
    }
  }, [isMobileProp]);

  const isAdmin = user?.username === 'admin' || user?.role === 'Admin';
  
  const adminMenu = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, description: 'Ringkasan produksi' },
    { to: '/orders', label: 'Pesanan', icon: <Package size={20} />, description: 'Kelola pesanan' },
    { to: '/stock', label: 'Stok Material', icon: <Warehouse size={20} />, description: 'Manajemen stok' },
    { to: '/finance', label: 'Keuangan', icon: <DollarSign size={20} />, description: 'Laporan keuangan' },
    { to: '/users', label: 'Pengguna', icon: <UserCog size={20} />, description: 'Kelola pengguna' },
  ];

  const employeeMenu = [
    { to: '/joblist', label: 'Pekerjaan', icon: <ClipboardList size={20} />, description: 'Lihat tugas Anda' },
  ];

  const menuItems = isAdmin ? adminMenu : employeeMenu;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      const event = new CustomEvent('closeSidebar');
      window.dispatchEvent(event);
    }
  };

  return (
    <aside 
      className={`${collapsed ? 'w-20' : 'w-64'} bg-slate-900 text-white h-full flex flex-col transition-all duration-300 ease-in-out relative shadow-2xl`}
    >
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
      
      {/* Mobile Close Button */}
      {isMobile && (
        <button 
          onClick={closeMobileSidebar}
          className="absolute top-4 right-4 z-50 p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
        >
          <X size={20} />
        </button>
      )}

      {/* ============================================================ */}
      {/* HEADER SECTION - HANYA BERISI LOGO (BERSIH) */}
      {/* ============================================================ */}
      <div className={`
        border-b border-white/10 transition-all duration-300 w-full
        ${collapsed 
          ? 'flex flex-col items-center justify-center py-6' 
          : 'p-4'
        }
      `}>
        {!collapsed ? (
          /* ========== EXPANDED MODE: Logo dengan teks ========== */
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-bold text-sm">GP</span>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">GarmentTrackPro</h1>
              <p className="text-[9px] text-slate-400 tracking-wide">Manufacturing System</p>
            </div>
          </div>
        ) : (
          /* ========== COLLAPSED MODE: Logo saja (terpusat) ========== */
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300">
              <span className="text-white font-bold text-sm tracking-tight">GP</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-3 mt-2 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={closeMobileSidebar}
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
                className={({ isActive }) => 
                  `relative flex items-center ${collapsed ? 'justify-center px-0' : 'px-3'} py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? 'bg-blue-600/20 text-white' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <span className={`transition-all duration-200 ${collapsed ? '' : 'mr-3'} ${hoveredItem === item.label ? 'scale-110' : ''}`}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="font-medium text-sm flex-1">{item.label}</span>
                )}
                
                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap border border-white/10">
                    {item.label}
                  </div>
                )}
                
                {/* Active indicator */}
                {({ isActive }) => isActive && (
                  <div className={`absolute ${collapsed ? 'left-0 right-0' : '-left-1'} top-1/2 transform -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-full`}></div>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-white/10 mt-auto">
        {/* Help Button */}
        <button 
          className={`flex items-center ${collapsed ? 'justify-center px-0' : 'px-3'} w-full py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 group`}
        >
          <HelpCircle size={18} className={collapsed ? '' : 'mr-3'} />
          {!collapsed && <span className="text-sm">Bantuan</span>}
          {collapsed && (
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap border border-white/10">
              Bantuan
            </div>
          )}
        </button>
        
        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className={`flex items-center ${collapsed ? 'justify-center px-0' : 'px-3'} w-full py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 group mt-1`}
        >
          <LogOut size={18} className={collapsed ? '' : 'mr-3'} />
          {!collapsed && <span className="text-sm">Keluar</span>}
          {collapsed && (
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap border border-white/10">
              Keluar
            </div>
          )}
        </button>
      </div>
      
      {/* Version info */}
      {!collapsed && (
        <div className="px-4 py-2 border-t border-white/10">
          <p className="text-[9px] text-slate-500 text-center">v2.0.0</p>
        </div>
      )}

      {/* ============================================================ */}
      {/* FLOATING BORDER BUTTON - DENGAN WARNA YANG MENYATU */}
      {/* ============================================================ */}
      {!isMobile && onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="
            absolute 
            -right-3 
            top-1/2 
            -translate-y-1/2 
            bg-slate-900 
            text-slate-400 
            border 
            border-slate-800 
            rounded-full 
            p-1.5 
            shadow-md
            hover:text-blue-400 
            hover:scale-110 
            transition-all 
            duration-300 
            z-50 
            focus:outline-none 
            focus:ring-2 
            focus:ring-blue-500 
            focus:ring-offset-2 
            focus:ring-offset-slate-900
          "
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      )}
    </aside>
  );
}