'use client'
import React from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StudentSingupFormSchema } from './validators';
import { Button } from '@/app/components/ui/button';
import { EyeClosed, Eye } from 'lucide-react';

interface StudentSignupFormProps {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  matric: string;
  department: string;
  level: number; 
}

export default function StudentSignupForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<StudentSignupFormProps>({
    resolver: zodResolver(StudentSingupFormSchema),
  });

  const onSubmit = (data: StudentSignupFormProps) => console.log(data);

  const handleMatricInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove any non-digit characters
    value = value.replace(/\D/g, '');
    
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    
    e.target.value = value;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='grid lg:grid-cols-2 gap-4'>
        <div>
          <label htmlFor="firstName" className='block text-sm'>FirstName</label>
          <input {...register('firstName')} id='firstName' type="text" className="input input-bordered w-full" />
          <p className='text-sm text-red-400'>{errors.firstName?.message}</p>
        </div>
        <div>
          <label htmlFor="lastName" className='block text-sm'>LastName</label>
          <input {...register('lastName')} id='lastName' type="text" className="input input-bordered w-full" />
          <p className='text-sm text-red-400'>{errors.lastName?.message}</p>
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
      <div className='grid lg:grid-cols-2 gap-4'>
        <div>
          <label htmlFor="matric" className='block text-sm'>Matric</label>
          <input 
            {...register('matric')}
            id='matric'
            type="text"
            maxLength={7}
            className="input input-bordered bg-base-100 w-full"
            onChange={(e) => {
              handleMatricInput(e);
              register('matric').onChange(e);
            }} />
          <p className='text-sm text-red-400'>{errors.matric?.message}</p>
        </div>
        <div>
          <label htmlFor="level" className='block text-sm'>Level</label>
          <select {...register('level')} id='level' className="input input-bordered w-full">
            <option value="" disabled>Select level</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
            <option value={300}>300</option>
            <option value={400}>400</option>
            <option value={500}>500</option>
          </select>
          <p className='text-sm text-red-400'>{errors.level?.message}</p>
        </div>
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
      <Button value='Create Account' type='submit' onClick={() => {}} />
    </form>
  )
}
