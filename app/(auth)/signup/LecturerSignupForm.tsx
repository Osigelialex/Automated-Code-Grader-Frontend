import React from 'react'
import { useForm } from 'react-hook-form';
import { LecturerSingupFormSchema } from './validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/app/components/ui/button';

interface LecturerSignupFormProps {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  department: string;
  staffid: string;
}

export default function LecturerSignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LecturerSignupFormProps>({
    resolver: zodResolver(LecturerSingupFormSchema),
  });

  const onSubmit = (data: LecturerSignupFormProps) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='grid lg:grid-cols-2 gap-4'>
        <div>
          <label htmlFor="firstName" className='block text-sm'>FirstName</label>
          <input {...register('firstName')} type="text" className="input w-full p-2 rounded-md focus:ring ring-primary outline-none border border-gray-300 bg-transparent" />
          <p className='text-sm text-red-400'>{errors.firstName?.message}</p>
        </div>
        <div>
          <label htmlFor="lastName" className='block text-sm'>LastName</label>
          <input {...register('lastName')} type="text" className="input w-full p-2 rounded-md focus:ring ring-primary outline-none border border-gray-300 bg-transparent" />
          <p className='text-sm text-red-400'>{errors.lastName?.message}</p>
        </div>
      </div>
      <div>
        <label htmlFor="email" className='block text-sm'>Email</label>
        <input {...register('email')} type="email" className="input w-full p-2 rounded-md focus:ring ring-primary outline-none border border-gray-300 bg-transparent" />
        <p className='text-sm text-red-400'>{errors.email?.message}</p>
      </div>
      <div>
        <label htmlFor="department" className='block text-sm'>Department</label>
        <select {...register('department')} className="input w-full p-2 rounded-md focus:ring ring-primary outline-none border border-gray-300 bg-transparent">
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
        <label htmlFor="staffid" className='block text-sm'>Staff id</label>
        <input {...register('staffid')} type="text" className="input w-full p-2 rounded-md focus:ring ring-primary outline-none border border-gray-300 bg-transparent" />
        <p className='text-sm text-red-400'>{errors.password?.message}</p>
      </div>
      <div>
        <label htmlFor="password" className='block text-sm'>Password</label>
        <input {...register('password')} type="password" className="input w-full p-2 rounded-md focus:ring ring-primary outline-none border border-gray-300 bg-transparent" />
        <p className='text-sm text-red-400'>{errors.password?.message}</p>
      </div>
      <div>
        <label htmlFor="confirm" className='block text-sm'>Confirm password</label>
        <input {...register('confirmPassword')} type="password" className="input w-full p-2 rounded-md focus:ring ring-primary outline-none border border-gray-300 bg-transparent" />
        <p className='text-sm text-red-400'>{errors.confirmPassword?.message}</p>
      </div>
      <Button value='Create Account' type='submit' onClick={() => {}} />
    </form>
  )
}
