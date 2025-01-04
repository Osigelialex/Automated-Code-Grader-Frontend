'use client'
import React from 'react'
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Settings,
  ChartNoAxesCombined,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react'
import sidebarStore from '@/app/stores/useSidebarStore'
import { api } from '@/lib/axiosConfig'
import { AxiosError } from 'axios'
import { ErrorResponse } from '@/app/interfaces/errorInterface'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const SideNavigationBar = () => {
  const [active, setActive] = React.useState<string>('Dashboard');
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const open = sidebarStore((state) => state.open);
  const toggleSidebar = sidebarStore((state) => state.toggleSidebar);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await api.post('/auth/logout');
      router.push('/login');
    } catch (e: unknown) {
      const error = e as AxiosError<ErrorResponse>;
      toast.error(error.response?.data.message);
    } finally {
      setIsLoggingOut(false);
      (document.getElementById('log_out_modal') as HTMLDialogElement).close();
    }
  }

  const sideBarLinks = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard'
    },
    {
      name: 'Courses',
      icon: BookOpen,
      path: '/courses'
    },
    {
      name: 'Assignments',
      icon: ClipboardList,
      path: '/assignments'
    },
    {
      name: 'Analytics',
      icon: ChartNoAxesCombined,
      path: '/analytics'
    },
    {
      name: 'Settings',
      icon: Settings,
      path: '/settings'
    }
  ]

  return (
    <aside 
      className={`bg-white border-r border-gray-200 h-screen transition-all duration-300 ease-in-out relative ${open ? 'w-64' : 'w-20'}`}
    >
      {/* Toggle Button */}
      <button 
        className={`
          absolute -right-3 top-6
          flex items-center justify-center
          w-6 h-6 
          rounded-full
          bg-primary hover:bg-primary/90
          text-white
          shadow-lg hover:shadow-xl
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        `} 
        onClick={toggleSidebar}
      >
        {open ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
      </button>

      {/* Logo Area */}
      <div className={`py-6 ${open ? 'px-8' : 'px-4'}`}>
        <div className={`flex items-center ${!open && 'justify-center'}`}>
          <div className=" w-8 h-8 bg-primary rounded-lg"></div>
          {open && <span className="px-4 text-lg font-semibold">CheckMate</span>}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="px-4 py-6">
        <nav className="space-y-2">
          {sideBarLinks.map((link, index) => {
            const Icon = link.icon
            return (
              <div
                key={index}
                onClick={() => setActive(link.name)}
                className={`
                  group flex items-center gap-3 
                  px-4 py-3 
                  rounded-lg cursor-pointer 
                  transition-all duration-200
                  ${active === link.name ? 'font-extrabold' : 'text-gray-500' }
                  ${!open && 'justify-center px-2'}
                `}
              >
                <Icon size={20} className="min-w-[20px]" />
                {open && (
                  <span className="truncate text-sm">
                    {link.name}
                  </span>
                )}
              </div>
            )
          })}
        </nav>
      </div>

      {/* Logout Section */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
        <div
          className={`
            flex items-center gap-3 
            px-4 py-3 
            rounded-lg cursor-pointer 
            transition-all duration-200
            text-gray-500 hover:bg-red-50
            ${!open && 'justify-center px-2'}
          `}
          onClick={() => (document.getElementById('log_out_modal') as HTMLDialogElement).showModal()}
        >
          <LogOut size={20} className="min-w-[20px]" />
          {open && <span className="font-medium truncate">Logout</span>}
        </div>
      </div>

      {/* Logout Modal */}
      <dialog id="log_out_modal" className="modal">
        <div className="modal-box bg-white p-6 rounded-lg shadow-xl">
          <h3 className="text-xl font-bold text-gray-900">Confirm Logout</h3>
          <p className="mt-2 text-gray-600">Are you sure you want to logout of your account?</p>
          <div className="mt-6 flex justify-end gap-3">
            <button 
              onClick={() => (document.getElementById('log_out_modal') as HTMLDialogElement).close()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button 
              onClick={handleLogout} 
              disabled={isLoggingOut}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {isLoggingOut ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Logging out...
                </span>
              ) : (
                'Logout'
              )}
            </button>
          </div>
        </div>
      </dialog>
    </aside>
  )
}

export default SideNavigationBar