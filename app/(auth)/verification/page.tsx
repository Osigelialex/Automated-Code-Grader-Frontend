'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/app/components/ui/button'
import Image from 'next/image'
import { api } from '@/lib/axiosConfig'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { ErrorResponse } from '@/app/interfaces/errorInterface'

export default function AccountVerificationPage() {
  const [isResending, setIsResending] = React.useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [counterValue, setCounterValue] = useState(30);

  useEffect(() => {
    if (!timerActive) return;

    const intervalId = setInterval(() => {
      setCounterValue(value => value - 1);
    }, 1000);

    if (counterValue === 0) {
      setTimerActive(false);
    }

    return () => clearInterval(intervalId);
  }, [timerActive, counterValue]);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      const response = await api.post('/auth/send-activation-token');
      toast.success(response.data.message, { duration: 5000 });
      setTimerActive(true);
    } catch (e: unknown) {
      const error = e as AxiosError<ErrorResponse>;
      toast.error(error.response?.data.message, { duration: 5000 });
    }
    finally {
      setIsResending(false)
    }
  }

  return (
    <div className="sm:w-3/4 mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <h1 className="sm:text-2xl text-lg font-bold">Account Activation</h1>
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
          disabled={isResending || timerActive}
          loading={isResending}
          value={timerActive ? `Resend in ${counterValue}` : 'Resend Email'}
          width='w-full'
          type='button'
        />
      </div>
    </div>
  )
}
