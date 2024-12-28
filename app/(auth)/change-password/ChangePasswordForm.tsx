'use client'
import React from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangePasswordFormSchema } from './validators';
import { Button } from '@/app/components/ui/button';
import { EyeClosed, Eye } from 'lucide-react';
import { api } from '@/lib/axiosConfig';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { AxiosError } from 'axios';
import { ErrorResponse } from '@/app/interfaces/errorInterface';

interface ChangePasswordFormProps {
  password: string;
  confirmPassword?: string;
}

export default function ChangePasswordForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ChangePasswordFormProps>({
    resolver: zodResolver(ChangePasswordFormSchema),
  });

  const onSubmit = async (data: ChangePasswordFormProps) => {
    delete data.confirmPassword;

    try {
      const token = searchParams.get('token');
      if (!token) toast.error('Password reset link is invalid', { duration: 5000 });

      await api.post(`/auth/${token}/reset-password`, data);
      router.replace('/login');
    } catch (e: unknown) {
      const error = e as AxiosError<ErrorResponse>;
      if (error.response?.data.message === "Account not activated") {
        router.push('/verification');
      }
      if (error.response?.data.message) {
        toast.error(error.response.data.message, { duration: 5000 });
        return;
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div>
        <label htmlFor='password' className='block text-sm'>Password</label>
        <div className="input input-bordered flex items-center gap-2">
          <input {...register('password')} id='password' type={showPassword ? 'text' : 'password'} className="grow" required />
          {showPassword ? (
            <Eye size={25} onClick={() => setShowPassword(value => !value)} />
          ) : (
            <EyeClosed width={25} onClick={() => setShowPassword(value => !value)} />
          )}
        </div>
        <small>Should contain at least 8 characters, one uppercase, one lowercase and a special character</small>
        <p className='text-sm text-red-400'>{errors.password?.message}</p>
      </div>
      <div>
        <label htmlFor='confirmPassword' className='block text-sm'>Confirm password</label>
        <div className="input input-bordered flex items-center gap-2">
          <input {...register('confirmPassword')} id='confirmPassword' type={showConfirmPassword ? 'text' : 'password'} className="grow" />
          {showConfirmPassword ? (
            <Eye size={25} onClick={() => setShowConfirmPassword(value => !value)} />
          ) : (
            <EyeClosed width={25} onClick={() => setShowConfirmPassword(value => !value)} />
          )}
        </div>
        <p className='text-sm text-red-400'>{errors.confirmPassword?.message}</p>
      </div>
      <Button
        value='Change Password'
        type='submit'
        loading={isSubmitting}
        disabled={isSubmitting}
      />
    </form>
  )
}