'use client'
import React from 'react'
import { Button } from '@/app/components/ui/button'

export default function AccountVerification() {
  const [isResending, setIsResending] = React.useState(false)
  const email = "osigelialex@gmail.com"

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
        <p>Check your inbox at <strong>{email}</strong> for a verification link to complete your signup.</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mx-auto">
        <a 
          href="https://mail.google.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col items-center p-4 hover:bg-base-200 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-12 h-12 mb-2">
            <path fill="#e0e0e0" d="M5.5,40.5h37c1.933,0,3.5-1.567,3.5-3.5V11c0-1.933-1.567-3.5-3.5-3.5h-37C3.567,7.5,2,9.067,2,11v26C2,38.933,3.567,40.5,5.5,40.5z"></path><path fill="#d9d9d9" d="M26,40.5h16.5c1.933,0,3.5-1.567,3.5-3.5V11c0-1.933-1.567-3.5-3.5-3.5h-37C3.567,7.5,2,9.067,2,11L26,40.5z"></path><path fill="#eee" d="M6.745,40.5H42.5c1.933,0,3.5-1.567,3.5-3.5V11.5L6.745,40.5z"></path><path fill="#e0e0e0" d="M25.745,40.5H42.5c1.933,0,3.5-1.567,3.5-3.5V11.5L18.771,31.616L25.745,40.5z"></path><path fill="#ca3737" d="M42.5,9.5h-37C3.567,9.5,2,9.067,2,11v26c0,1.933,1.567,3.5,3.5,3.5H7V12h34v28.5h1.5c1.933,0,3.5-1.567,3.5-3.5V11C46,9.067,44.433,9.5,42.5,9.5z"></path><path fill="#f5f5f5" d="M42.5,7.5H24H5.5C3.567,7.5,2,9.036,2,11c0,1.206,1.518,2.258,1.518,2.258L24,27.756l20.482-14.497c0,0,1.518-1.053,1.518-2.258C46,9.036,44.433,7.5,42.5,7.5z"></path><path fill="#e84f4b" d="M43.246,7.582L24,21L4.754,7.582C3.18,7.919,2,9.297,2,11c0,1.206,1.518,2.258,1.518,2.258L24,27.756l20.482-14.497c0,0,1.518-1.053,1.518-2.258C46,9.297,44.82,7.919,43.246,7.582z"></path>
          </svg>
          <span className="text-sm font-medium">Open Gmail</span>
        </a>

        <a 
          href="https://outlook.live.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col items-center p-4 hover:bg-base-200 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-12 h-12 mb-2">
            <path fill="#1a237e" d="M43.607,23.752l-7.162-4.172v11.594H44v-6.738C44,24.155,43.85,23.894,43.607,23.752z"></path><path fill="#0c4999" d="M33.919,8.84h9.046V7.732C42.965,6.775,42.19,6,41.234,6H17.667c-0.956,0-1.732,0.775-1.732,1.732 V8.84h9.005H33.919z"></path><path fill="#0f73d9" d="M33.919,33.522h7.314c0.956,0,1.732-0.775,1.732-1.732v-6.827h-9.046V33.522z"></path><path fill="#0f439d" d="M15.936,24.964v6.827c0,0.956,0.775,1.732,1.732,1.732h7.273v-8.558H15.936z"></path><path fill="#2ecdfd" d="M33.919 8.84H42.964999999999996V16.866999999999997H33.919z"></path><path fill="#1c5fb0" d="M15.936 8.84H24.941000000000003V16.866999999999997H15.936z"></path><path fill="#1467c7" d="M24.94 24.964H33.919V33.522H24.94z"></path><path fill="#1690d5" d="M24.94 8.84H33.919V16.866999999999997H24.94z"></path><path fill="#1bb4ff" d="M33.919 16.867H42.964999999999996V24.963H33.919z"></path><path fill="#074daf" d="M15.936 16.867H24.941000000000003V24.963H15.936z"></path><path fill="#2076d4" d="M24.94 16.867H33.919V24.963H24.94z"></path><path fill="#2ed0ff" d="M15.441,42c0.463,0,26.87,0,26.87,0C43.244,42,44,41.244,44,40.311V24.438 c0,0-0.03,0.658-1.751,1.617c-1.3,0.724-27.505,15.511-27.505,15.511S14.978,42,15.441,42z"></path><path fill="#139fe2" d="M42.279,41.997c-0.161,0-26.59,0.003-26.59,0.003C14.756,42,14,41.244,14,40.311V25.067 l29.363,16.562C43.118,41.825,42.807,41.997,42.279,41.997z"></path><path fill="#00488d" d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z"></path><path fill="#fff" d="M13.914,18.734c-3.131,0-5.017,2.392-5.017,5.343c0,2.951,1.879,5.342,5.017,5.342 c3.139,0,5.017-2.392,5.017-5.342C18.931,21.126,17.045,18.734,13.914,18.734z M13.914,27.616c-1.776,0-2.838-1.584-2.838-3.539 s1.067-3.539,2.838-3.539c1.771,0,2.839,1.585,2.839,3.539S15.689,27.616,13.914,27.616z"></path>
          </svg>
          <span className="text-sm font-medium">Open Outlook</span>
        </a>
      </div>

      <p className="text-sm text-center text-gray-500">
        Using another email provider? Please check your inbox directly at {email}
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