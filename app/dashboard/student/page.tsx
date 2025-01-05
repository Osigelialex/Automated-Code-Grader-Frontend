'use client'
import { api } from '@/lib/axiosConfig';
import React, { useEffect } from 'react';
import { IProfile } from '@/app/interfaces/profileInterface'
import Loading from '@/app/loading';
import { AxiosError } from 'axios';
import { ErrorResponse } from '@/app/interfaces/errorInterface';
import { toast } from 'sonner';
import ScoreStatistic from '../components/score_statistic';
import QuickStatistic from '../components/quick_statistic';
import { Bell} from 'lucide-react';

export default function Dashboard() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [profile, setProfile] = React.useState<IProfile | null>();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profile = await api.get<IProfile>('/auth/profile');
        setProfile(profile.data);
      } catch (e: unknown) {
        const error = e as AxiosError<ErrorResponse>;
        const errorMessage = error.response?.data.message || 'Failed to load profile';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) {
    return <Loading />
  }

  return (
    <div className="py-8 sm:px-10 space-y-8">
      <div className='flex justify-between items-center'>
        <div className='space-y-2'>
          <h1 className='font-bold text-xl'>Welcome, {profile?.first_name}</h1>
          <p className="text-sm">
            Let’s ace those code submissions!
          </p>
        </div>

        <div className='flex items-center gap-5'>
          <Bell size={18}/>
          <div className='bg-primary w-8 h-8 grid place-items-center text-white text-lg cursor-pointer'>
            {profile?.first_name[0]}
          </div>
        </div>
      </div>
      <div className='grid sm:grid-cols-4 gap-3'>
        <QuickStatistic heading='Total Submissions' value={10} />
        <QuickStatistic heading='Average Score' value={80} trend={5} />
        <QuickStatistic heading='Pending Assignments' value={2} />
        <QuickStatistic heading='Failed Assignments' value={2} trend={-10}/>
      </div>
      <ScoreStatistic />
    </div>
  )
}