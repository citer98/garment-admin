import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleOverlayClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-64 xl:w-72 transition-all duration-300">
        <Sidebar />
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={handleOverlayClick}
        />
      )}
      
      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-all duration-300 ease-in-out lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto overflow-x-hidden">
          <div className="max-w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}