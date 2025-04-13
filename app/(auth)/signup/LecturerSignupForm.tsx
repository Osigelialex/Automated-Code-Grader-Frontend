'use client'
import React from 'react'
import { useForm } from 'react-hook-form';
import { LecturerSingupFormSchema } from './validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/app/components/ui/button';
import { EyeClosed, Eye } from 'lucide-react';
import { api } from '@/lib/axiosConfig';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { ErrorResponse } from '@/app/interfaces/errorInterface';

interface LecturerSignupFormProps {
  email: string;
  password: string;
  confirmPassword?: string;
  first_name: string;
  last_name: string;
  department: string;
  staff_id: string;
}

export default function LecturerSignupForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<LecturerSignupFormProps>({
    resolver: zodResolver(LecturerSingupFormSchema),
  });

  const onSubmit = async (data: LecturerSignupFormProps) => {
    delete data.confirmPassword;

    try {
      await api.post('/auth/register-lecturer', data);
      router.push('/verification');
    } catch (e: unknown) {
      const error = e as AxiosError<ErrorResponse>;
      console.log(error.response?.data);
      if (error.response?.data.message) {
        toast.error(error.response.data.message, { duration: 5000 });
        return;
      }

      Object.entries(error.response?.data ?? {}).forEach(([field, messages]) => {
        setError(field as keyof LecturerSignupFormProps, {
          type: 'server',
          message: Array.isArray(messages) ? messages[0] : messages
        });
      });
    }
  };

  const handleStaffIdInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Remove any non-digit characters
    value = value.replace(/\D/g, '');

    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }

    e.target.value = value;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 mx-auto'>
      <div className='grid lg:grid-cols-2 gap-4'>
        <div>
          <label htmlFor="firstName" className='block text-sm'>FirstName</label>
          <input {...register('first_name')} id='firstName' type="text" className="input input-bordered w-full" />
          <p className='text-sm text-red-400'>{errors.first_name?.message}</p>
        </div>
        <div>
          <label htmlFor="lastName" className='block text-sm'>LastName</label>
          <input {...register('last_name')} id='lastName' type="text" className="input input-bordered w-full" />
          <p className='text-sm text-red-400'>{errors.last_name?.message}</p>
        </div>
      </div>
      <div>
        <label htmlFor="email" className='block text-sm'>Email</label>
        <input {...register('email')} id='email' type="email" className="input input-bordered w-full" autoComplete='true' />
        <p className='text-sm text-red-400'>{errors.email?.message}</p>
      </div>
      <div>
        <label htmlFor="department" className='block text-sm'>Department</label>
        <select {...register('department')} id='department' className="input input-bordered bg-base-100 w-full">
          <option value="" disabled>Department</option>
          <option value={"Computer Science"}>Computer Science</option>
          <option value={"Software Engineering"}>Software Engineering</option>
          <option value={"Computer Information Systems"}>Computer Information Systems</option>
          <option value={"Cybersecurity"}>Cybersecurity</option>
          <option value={"Information Technology"}>Information Technology</option>
          <option value={"Computer Engineering"}>Computer Engineering</option>
        </select>
        <p className='text-sm text-red-400'>{errors.department?.message}</p>
      </div>
      <div>
        <label htmlFor="staff_id" className='block text-sm'>Staff id</label>
        <input
          {...register('staff_id')}
          id='staff_id'
          type="text"
          maxLength={7}
          className="input input-bordered w-full"
          onChange={(e) => {
            handleStaffIdInput(e);
            register('staff_id').onChange(e);
          }}
        />
        <p className='text-sm text-red-400'>{errors.staff_id?.message}</p>
      </div>

      <div>
        <label htmlFor='password' className='block text-sm'>Password</label>
        <div className="input input-bordered flex items-center gap-2">
          <input {...register('password')} id='password' type={showPassword ? 'text' : 'password'} className="grow" />
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
        value='Create Account'
        type='submit'
        loading={isSubmitting}
        disabled={isSubmitting}
      />
    </form>
  )
}
