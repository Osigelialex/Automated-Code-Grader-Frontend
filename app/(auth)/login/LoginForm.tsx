'use client'
import React from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormSchema } from './validators';
import { Button } from '@/app/components/ui/button';
import { EyeClosed, Eye } from 'lucide-react';
import { api } from '@/lib/axiosConfig';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LoginFormProps {
  email: string;
  password: string;
}

export default function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormProps>({
    resolver: zodResolver(LoginFormSchema),
  });

  const onSubmit = async (data: LoginFormProps) => {
    try {
      await api.post('/auth/login', data);
      router.replace('/dashboard');
    } catch (e: any) {
      if (e.response?.data.message === "Account not activated") {
        router.push('/verification');
      }
      if (e.response?.data.message) {
        toast.error(e.response.data.message, { duration: 5000 });
        return;
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div>
        <label htmlFor="email" className='block text-sm'>Email</label>
        <input {...register('email')} id='email' type="email" className="input input-bordered w-full" autoComplete='true' required />
        <p className='text-sm text-red-400'>{errors.email?.message}</p>
      </div>
      <div className='relative'>
        <label htmlFor='password' className='block text-sm'>Password</label>
        <Link href="forgot-password" className='absolute right-0 top-0 text-sm text-primary'>Forgotten password?</Link>
        <div className="input input-bordered flex items-center gap-2">
          <input {...register('password')} id='password' type={showPassword ? 'text' : 'password'} className="grow" required />
          {showPassword ? (
            <Eye size={25} onClick={() => setShowPassword(value => !value)} />
          ) : (
            <EyeClosed width={25} onClick={() => setShowPassword(value => !value)} />
          )}
        </div>
        <p className='text-sm text-red-400'>{errors.password?.message}</p>
      </div>
      <Button
        value='Login'
        type='submit'
        loading={isSubmitting}
        disabled={isSubmitting}
      />
    </form>
  )
}