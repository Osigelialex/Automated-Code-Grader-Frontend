import React from 'react'
import LoginForm from './LoginForm'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div  className="sm:w-3/4 mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className='sm:text-md text-md'>Enter your login credentials to continue. No account? <Link href="/signup" className='text-primary'>Signup</Link></p>
      </div>

      <LoginForm />
    </div>
  )
}
