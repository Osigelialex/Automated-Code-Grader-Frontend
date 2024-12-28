import React from 'react'
import ChangePasswordForm from './ChangePasswordForm'

export default function ChangePasswordPage() {
  return (
    <div  className="sm:w-3/4 mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Change Password</h1>
        <p className='sm:text-md text-sm'>Enter a new secure password for your account</p>
      </div>

      <ChangePasswordForm />
    </div>
  )
}
