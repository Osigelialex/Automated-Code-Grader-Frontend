'use client'
import React, { useEffect } from 'react'
import { Menu, Plus, Bell } from 'lucide-react'
import { IProfile } from '../interfaces/profileInterface'
import { api } from '@/lib/axiosConfig'
import { AxiosError } from 'axios'
import { ErrorResponse } from '../interfaces/errorInterface'
import sidebarStore from '../stores/useSidebarStore'

export default function TopNavigationBar() {
  const [profile, setProfile] = React.useState<IProfile | null>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const toggleSidebar = sidebarStore((state) => state.toggleSidebar);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const profile = await api.get<IProfile>('/auth/profile');
        setProfile(profile.data);
      } catch (e: unknown) {
        const error = e as AxiosError<ErrorResponse>;
        const errorMessage = error.response?.data.message || 'Failed to load profile';
        setError(errorMessage);
        console.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, []);

  return (
    <div className='flex justify-between items-center py-5 px-8 border-b-2 border-b-base-200'>
      <div className='flex items-center gap-5'>
        <button className='btn btn-circle btn-ghost'>
          <Menu size='24' onClick={toggleSidebar} />
        </button>
        <h1 className='text-xl font-bold'>CheckMate</h1>
      </div>
      <div className='flex items-center gap-5'>
        <div className='tooltip tooltip-left' data-tip="Join a course">
          <button className='btn btn-circle btn-md'>
            <Plus size='20' />
          </button>
        </div>

        <Bell size='24' className='cursor-pointer' />

        {isLoading ? (
          <div className="skeleton h-10 w-10 shrink-0 rounded-full"></div>
        ) : error ? (
          <div className="avatar placeholder">
            <div className="bg-error text-error-content w-12 rounded-full">
              <span>!</span>
            </div>
          </div>
        ) : (
          <div className="avatar placeholder">
            <div className="w-10 rounded-full bg-primary text-white">
              <span>{profile?.first_name[0]}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}