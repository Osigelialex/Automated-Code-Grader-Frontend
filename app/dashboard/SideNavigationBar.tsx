'use client'
import React from 'react'
import sidebarStore from '../stores/useSidebarStore'

export default function SideNavigationBar() {
  const open = sidebarStore((state) => state.open);

  return (
    <div className={`min-h-screen border-r-2 border-r-base-200 transition-all duration-150 ease-in ${open ? 'w-64' : 'w-12'}`}>
      
    </div>
  )
}
