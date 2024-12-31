import React from 'react'
import TopNavigationBar from './TopNavigationBar'
import SideNavigationBar from './SideNavigationBar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <TopNavigationBar />
      <div className='flex'>
        <SideNavigationBar />
        <div className='px-8 py-12 lg:py-20 flex-grow'>
          {children}
        </div>
      </div>
    </div>
  )
}
