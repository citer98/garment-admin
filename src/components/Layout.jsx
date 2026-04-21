// src/components/Layout.jsx
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsed !== null) {
      setCollapsed(JSON.parse(savedCollapsed));
    }
  }, []);

  // Save collapsed state to localStorage when it changes
  const handleToggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      // Reset collapsed state on mobile
      if (window.innerWidth < 1024) {
        setCollapsed(false);
      }
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

  // Calculate sidebar width class based on collapsed state
  const sidebarWidthClass = collapsed ? 'w-20' : 'w-64 xl:w-72';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar - Width changes dynamically */}
      <div className={`hidden lg:block ${sidebarWidthClass} transition-all duration-300 ease-in-out flex-shrink-0`}>
        <Sidebar 
          collapsed={collapsed} 
          onToggleCollapse={handleToggleCollapse}
          isMobile={isMobile}
        />
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={handleOverlayClick}
        />
      )}
      
      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar 
          collapsed={false} 
          onToggleCollapse={() => {}}
          isMobile={true}
        />
      </div>

      {/* Main Content - Automatically expands when sidebar collapses */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden transition-all duration-300 ease-in-out">
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