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
import { AxiosError } from 'axios';
import { ErrorResponse } from '@/app/interfaces/errorInterface';

interface LoginFormProps {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  role: string
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
      const response = await api.post<LoginResponse>('/auth/login', data);
      const role = response.data.role;
      if (role === 'LECTURER') {
        router.replace('/dashboard/lecturer');
      } else {
        router.replace('/dashboard/student');
      }
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
    <div className="sm:w-3/4 mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="sm:text-2xl text-xl font-bold">Login to your account</h1>
        <p className="sm:text-md text-sm">
          Enter your login credentials to continue. No account?{' '}
          <Link href="/signup" className="text-primary">Signup</Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email" className="block text-sm">Email</label>
          <input
            {...register('email')}
            id="email"
            type="email"
            className="input input-bordered w-full"
            autoComplete="true"
            required
          />
          <p className="text-sm text-red-400">{errors.email?.message}</p>
        </div>
        <div className="relative">
          <label htmlFor="password" className="block text-sm">Password</label>
          <Link href="/forgot-password" className="absolute right-0 top-0 text-sm text-primary">
            Forgotten password?
          </Link>
          <div className="input input-bordered flex items-center gap-2">
            <input
              {...register('password')}
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="grow"
              required
            />
            {showPassword ? (
              <Eye size={25} onClick={() => setShowPassword(value => !value)} />
            ) : (
              <EyeClosed width={25} onClick={() => setShowPassword(value => !value)} />
            )}
          </div>
          <p className="text-sm text-red-400">{errors.password?.message}</p>
        </div>
        <Button
          value="Login"
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
        />
      </form>
    </div>
  )
}