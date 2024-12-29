import React from 'react'
import TopNavigationBar from './TopNavigationBar'
import SideNavigationBar from './SideNavigationBar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen'>
      <TopNavigationBar />
      <div className='grid'>
        <SideNavigationBar />
        <div className='px-8 py-12 lg:py-20'>
          {children}
        </div>
      </div>
    </div>
  )
}
