'use client'
import React from 'react'
import StudentSignupForm from './StudentSignupForm';
import LecturerSignupForm from './LecturerSignupForm';
import Link from 'next/link';

export default function SignupPage() {
  const [isStudent, setIsStudent] = React.useState(true);

  return (
    <div className='space-y-8 mx-auto sm:w-3/4'>
      <div>
        <h1 className='lg:text-2xl text-xl font-bold mb-2'>Welcome to CheckMater</h1>
        <p className='sm:text-md text-sm'>Create your CheckMater account. Already signed up <Link className='text-primary' href="/login">Login</Link></p>
      </div>

      {/* Toggle between student and teacher signup  */}
      <div className='flex space-x-10 mt-7'>
        <div
          className={`text-sm sm:text-md cursor-pointer transition-all duration-100 ease-in ${isStudent ? 'font-semibold border-b-2 border-primary' : ''}`}
          onClick={() => setIsStudent(true)}
        >
          Student Signup
        </div>
        <div
          className={`text-sm sm:text-md cursor-pointer transition-all duration-100 ease-in ${!isStudent ? 'font-semibold border-b-2 border-primary' : ''}`}
          onClick={() => setIsStudent(false)}
        >
          Lecturer Signup
        </div>
      </div>

      {/* Display Form based on the users signup type */}
      {isStudent ? <StudentSignupForm /> : <LecturerSignupForm />}
    </div>
  )
}
