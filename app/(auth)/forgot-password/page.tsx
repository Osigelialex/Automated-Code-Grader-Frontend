'use client'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { Button } from '@/app/components/ui/button';
import { api } from '@/lib/axiosConfig';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { ForgotPasswordSchema } from './validators';
import { AxiosError } from 'axios';
import { ErrorResponse } from '@/app/interfaces/errorInterface';

interface ForgotPasswordProps {
  email: string;
}

export default function ForgotPasswordForm() {
  const [timerActive, setTimerActive] = useState(false);
  const [counterValue, setCounterValue] = useState(30);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordProps>({
    resolver: zodResolver(ForgotPasswordSchema)
  });

  useEffect(() => {
    if (!timerActive) return;

    const intervalId = setInterval(() => {
      setCounterValue(value => value - 1);
    }, 1000);

    if (counterValue === 0) {
      setTimerActive(false);
    }

    return () => clearInterval(intervalId);
  }, [timerActive, counterValue]);

  const onSubmit = async (data: ForgotPasswordProps) => {
    try {
      const response = await api.post('/auth/request-password-reset', data);
      toast.success(response.data.message, { duration: 5000 });

      setTimerActive(true);
    } catch (e: unknown) {
      const error = e as AxiosError<ErrorResponse>
      if (error.response?.data.message) {
        toast.error(error.response.data.message, { duration: 5000 });
        return;
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 sm:w-3/4 mx-auto'>
      <div className="space-y-4">
        <h1 className="sm:text-2xl text-xl font-bold">Reset your password</h1>
        <p className='sm:text-md text-sm'>Enter the email associated with your account to receive a password reset link</p>
      </div>

      <div>
        <label htmlFor="email" className='block text-sm'>Email</label>
        <input {...register('email')} id='email' type="email" className="input input-bordered w-full" autoComplete='true' required />
        <p className='text-sm text-red-400'>{errors.email?.message}</p>
      </div>

      <Button
        value={timerActive ? `Resend in ${counterValue}` : 'Send reset link'}
        type='submit'
        loading={isSubmitting}
        disabled={isSubmitting || timerActive}
      />
    </form>
  )
}