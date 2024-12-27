'use client'
import React from 'react'
import { Button } from '@/app/components/ui/button'
import Image from 'next/image'

export default function AccountVerification() {
  const [isResending, setIsResending] = React.useState(false);

  const handleResendEmail = async () => {
    setIsResending(true)
    try {
      // TODO: Resend email logic
      await new Promise(resolve => setTimeout(resolve, 3000))
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="sm:w-3/4 mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Account Activation</h1>
        <p>Please check your inbox for a verification link to complete your signup.</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mx-auto">
        <a 
          href="https://mail.google.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col items-center p-4 hover:bg-base-200 rounded-lg transition-colors"
        >
          <Image src="/gmail.svg" alt="Gmail" width={48} height={48} />
          <span className="text-sm font-medium">Open Gmail</span>
        </a>

        <a 
          href="https://outlook.live.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col items-center p-4 hover:bg-base-200 rounded-lg transition-colors"
        >
          <Image src='/outlook.svg' alt="Outlook" width={48} height={48} />
          <span className="text-sm font-medium">Open Outlook</span>
        </a>
      </div>

      <p className="text-sm text-center text-gray-500">
        Using another email provider? Please check your inbox directly or spam folder.
      </p>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Haven&apos;t received the verification email?</p>
        <Button 
          onClick={handleResendEmail} 
          disabled={isResending}
          loading={isResending}
          value='Resend Email'
          width='w-full'
          type='button'
        />
      </div>
    </div>
  )
}