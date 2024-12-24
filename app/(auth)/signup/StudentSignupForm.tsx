import React from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StudentSingupFormSchema } from './validators';
import { Button } from '@/app/components/ui/button';

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
  const { register, handleSubmit, formState: { errors } } = useForm<StudentSignupFormProps>({
    resolver: zodResolver(StudentSingupFormSchema),
  });

  const onSubmit = (data: StudentSignupFormProps) => console.log(data);

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
      <div className='grid lg:grid-cols-2 gap-4'>
        <div>
          <label htmlFor="matric" className='block text-sm'>Matric</label>
          <input {...register('matric')} type="text" className="input w-full p-2 rounded-md focus:ring ring-primary outline-none border border-gray-300 bg-transparent" />
          <p className='text-sm text-red-400'>{errors.matric?.message}</p>
        </div>
        <div>
          <label htmlFor="level" className='block text-sm'>Level</label>
          <select {...register('level')} className="input w-full p-2 rounded-md focus:ring ring-primary outline-none border border-gray-300 bg-transparent">
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
