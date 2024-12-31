'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter();

  return (
    <div className='grid place-items-center h-screen'>
      <div className='text-center space-y-6 flex flex-col justify-center items-center'>
        <h1 className='text-6xl font-extrabold'>404</h1>
        <p className='text-lg'>Sorry, The page you requested could not be found</p>
        <button 
          onClick={() => router.back()}
          className='btn bg-primary text-white'
        >
          Take me back
        </button>
      </div>
    </div>
  )
}
