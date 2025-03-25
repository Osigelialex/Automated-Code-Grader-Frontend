'use client'
import React, { useEffect } from 'react'
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  GraduationCap,
  Notebook
} from 'lucide-react'
import sidebarStore from '@/app/stores/useSidebarStore'
import { api } from '@/lib/axiosConfig'
import { AxiosError } from 'axios'
import { ErrorResponse } from '@/app/interfaces/errorInterface'
import { toast } from 'sonner'
import { useRouter, usePathname } from 'next/navigation'

interface ILink {
  name: string;
  path: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const SideNavigationBar = () => {
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const open = sidebarStore((state) => state.open);
  const toggleSidebar = sidebarStore((state) => state.toggleSidebar);
  const router = useRouter();
  const pathname = usePathname();

  // Check if we're on mobile and handle resize events
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add resize listener
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

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
    router.push(link.path);
    // Auto close sidebar on mobile after navigation
    if (isMobile && open) {
      toggleSidebar();
    }
  }

  const sideBarLinks = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard/lecturer'
    },
    {
      name: 'Courses',
      icon: BookOpen,
      path: '/dashboard/lecturer/courses'
    },
    {
      name: 'Assignments',
      icon: Notebook,
      path: '/dashboard/lecturer/assignments'
    },
    {
      name: 'Settings',
      icon: Settings,
      path: '#'
    }
  ]

  return (
    <>
      {/* Mobile Overlay - only visible when sidebar is open on mobile */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          border-r border-base-200
          transition-all duration-300 ease-in-out
          fixed md:relative
          z-30 md:z-auto
          bg-white dark:bg-base-100
          h-screen
          ${open ? 'w-64' : 'w-0 md:w-20'} 
          ${isMobile && !open ? '-translate-x-full' : 'translate-x-0'}
        `}
      >
        {/* Toggle Button - Hidden on mobile, using a mobile menu button instead */}
        <button
          className={`
            hidden md:flex
            absolute -right-3 top-6
            items-center justify-center
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
        {open && (<div className={`py-6 ${open ? 'px-8' : 'px-4'}`}>
          <div className={`flex items-center`}>
            <div className="w-8 h-8 bg-primary rounded-lg grid place-items-center">
              <GraduationCap size={20} className="text-white" />
            </div>
            <span className="px-4 text-lg font-semibold">CheckMate</span>
          </div>
        </div>)}

        {/* Navigation Links */}
        <div className="px-4 py-6 overflow-y-auto">
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
                    ${pathname === link.path ? 'font-extrabold' : 'text-gray-500'}
                    ${!open && 'md:justify-center md:px-2'}
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
              ${!open && 'md:justify-center md:px-2'}
            `}
            onClick={() => (document.getElementById('log_out_modal') as HTMLDialogElement).showModal()}
          >
            <LogOut size={20} className="min-w-[20px]" />
            {open && <span className="font-medium truncate">Logout</span>}
          </div>
        </div>
      </aside>

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
    </>
  )
}

export default SideNavigationBar