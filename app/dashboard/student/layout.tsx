'use client'
import React from 'react';
import SideNavigationBar from './SideNavigationBar';
import { Menu } from 'lucide-react';
import sidebarStore from '@/app/stores/useSidebarStore';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const toggleSidebar = sidebarStore((state) => state.toggleSidebar);
  
  return (
    <div className="h-screen flex flex-col md:flex-row bg-white dark:bg-base-100">
      {/* Mobile Header with Menu Button */}
      <div className="md:hidden flex items-center p-4 border-b border-base-200">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-base-200 transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center ml-3">
          <div className="w-6 h-6 bg-primary rounded-lg grid place-items-center">
            <span className="text-white text-xs font-bold">C</span>
          </div>
          <span className="ml-2 font-semibold">CheckMate</span>
        </div>
      </div>
      
      {/* Sidebar */}
      <SideNavigationBar />
      
      {/* Main Content */}
      <div className="flex-grow overflow-y-auto min-h-0 md:min-h-screen dark:bg-base-200 bg-secondary">
        {children}
      </div>
    </div>
  );
}