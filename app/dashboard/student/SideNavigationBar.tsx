'use client'
import React from 'react'
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Settings,
  ChartNoAxesCombined,
  LogOut
} from 'lucide-react'
import sidebarStore from '@/app/stores/useSidebarStore'
import { api } from '@/lib/axiosConfig'
import { AxiosError } from 'axios'
import { ErrorResponse } from '@/app/interfaces/errorInterface'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const SideNavigationBar = () => {
  const [active, setActive] = React.useState<string>('Dashboard');
  const open = sidebarStore((state) => state.open);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      router.push('/login');
      await api.post('/auth/logout');
    } catch (e: unknown) {
      const error = e as AxiosError<ErrorResponse>;
      toast.error(error.response?.data.message)
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
    <aside className={`border-r border-r-base-200 shadow-lg h-[calc(100vh-3.5rem)] transition-all duration-300 ease-in-out ${open ? 'w-60' : 'w-16'}`}>
      <div className="p-4">
        {/* Main navigation links */}
        <div className="flex flex-col space-y-2">
          {sideBarLinks.map((link, index) => {
            const Icon = link.icon
            return (
              <div
                key={index}
                onClick={() => setActive(link.name)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer
                          transition-colors duration-200
                          hover:bg-primary hover:text-white ${!open && 'justify-center'} ${active === link.name && 'bg-primary text-white'}`}
              >
                <Icon size={20} className="min-w-[20px]" />
                <span className={`truncate font-medium ${!open && 'hidden'}`}>
                  {link.name}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="p-4 border-t border-base-200">
        <div
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer
                    transition-colors duration-200 text-red-500
                    hover:bg-red-500 hover:text-white ${!open && 'justify-center'}`}
          onClick={() => (document.getElementById('my_modal_1') as HTMLDialogElement).showModal()}
        >
          <LogOut size={20} className="min-w-[20px] text-md" />
          <span className={`truncate ${!open && 'hidden'}`}>
            Logout
          </span>
        </div>
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Are you sure you want to logout?</h3>
            <p className="py-4">Click the button below to logout of your account</p>
            <div className="modal-action">
              <form method="dialog">
                <button onClick={handleLogout} className="btn btn-error text-white">Log out</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </aside>
  )
}

export default SideNavigationBar