import React from 'react';
import SideNavigationBar from './SideNavigationBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex">
      <SideNavigationBar />
      
      <div className="flex-grow overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
