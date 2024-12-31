'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

export default function Unauthorized() {
  const router = useRouter();

  return (
    <div className='grid place-items-center h-screen'>
      <div className='text-center space-y-6 flex flex-col justify-center items-center'>
        <h1 className='text-6xl font-extrabold'>401</h1>
        <p className='text-lg'>Sorry, You are not authorized to view this page</p>
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
