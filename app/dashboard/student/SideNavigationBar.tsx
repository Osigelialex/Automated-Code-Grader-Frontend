'use client'
import React from 'react'
import {
  LayoutDashboard,
  BookOpen,
  FileCheck,
  Settings,
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

interface ILink {
  name: string;
  path: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const SideNavigationBar = () => {
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const open = sidebarStore((state) => state.open);
  const activeLink = sidebarStore((state) => state.activeLink);
  const setActiveLink = sidebarStore((state) => state.setActiveLink);
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

  const handleLinkClicked = (link: ILink) => {
    setActiveLink(link.name);
    router.push(link.path);
  }

  const sideBarLinks = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard/student'
    },
    {
      name: 'Courses',
      icon: BookOpen,
      path: '/dashboard/student/courses'
    },
    {
      name: 'Submissions',
      icon: FileCheck,
      path: '#'
    },
    {
      name: 'Settings',
      icon: Settings,
      path: '#'
    }
  ]

  return (
    <aside 
      className={` border-r border-base-200 h-screen transition-all duration-300 ease-in-out relative ${open ? 'w-64' : 'w-20'}`}
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
                onClick={() => handleLinkClicked(link)}
                className={`
                  group flex items-center gap-3 
                  px-4 py-3 
                  rounded-lg cursor-pointer 
                  transition-all duration-200
                  ${activeLink === link.name ? 'font-extrabold' : 'text-gray-500' }
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
      <div className="absolute bottom-0 w-full p-4 border-t border-base-200">
        <div
          className={`
            flex items-center gap-3 
            px-4 py-3 
            rounded-lg cursor-pointer 
            transition-all duration-200
            text-gray-500 hover:bg-red-400 hover:text-white
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
        <div className="modal-box bg-base-100 p-6 rounded-lg shadow-xl">
          <h3 className="text-xl font-bold">Confirm Logout</h3>
          <p className="mt-2 text-gray-600">Are you sure you want to logout of your account?</p>
          <div className="mt-6 flex justify-end gap-3">
            <button 
              onClick={() => (document.getElementById('log_out_modal') as HTMLDialogElement).close()}
              className="px-4 py-3 text-sm font-medium bg-base-200 rounded-lg focus:outline-none"
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
                  <span className="w-4 h-4 border-2 border-base-200 border-t-transparent rounded-full animate-spin"></span>
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