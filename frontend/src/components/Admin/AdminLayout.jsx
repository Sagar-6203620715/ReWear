import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';
import { Outlet, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [location]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.sidebar-toggle')) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleSidebar}
            className="sidebar-toggle p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div 
          className={`sidebar fixed md:static inset-y-0 left-0 z-40 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <AdminSidebar onClose={closeSidebar} />
        </div>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <main className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
