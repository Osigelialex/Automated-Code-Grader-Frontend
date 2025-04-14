'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { api } from '@/lib/axiosConfig'
import { AxiosError } from 'axios'
import { ErrorResponse } from '@/app/interfaces/errorInterface'
import { setCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'

export default function TokenVeriifcation() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Verifying your email...')
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const router = useRouter();

  useEffect(() => {
    const verifyActivationToken = async () => {
      if (!token) {
        setStatus('error')
        setMessage('Missing verification token')
        return
      }

      try {
        const response = await api.patch(`/auth/activate?token=${token}`);
        const access_token = response.data.tokens.access_token;
        const refresh_token = response.data.tokens.refresh_token;

        setCookie('cm_access_token', access_token);
        setCookie('cm_refresh_token', refresh_token);
        setStatus('success')
        setMessage('Email verified successfully! Redirecting you to login');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } catch (e: unknown) {
        const error = e as AxiosError<ErrorResponse>;
        setStatus('error')
        setMessage(error.response?.data?.message || 'Invalid or expired token')
      }
    }

    verifyActivationToken()
  }, [token, router])

  return (
    <>
      <div className="bg-base-100 border border-base-200 rounded-lg shadow-sm p-8 space-y-6">
        <div className="text-center">
          {status === 'loading' && (
            <div className="flex flex-col items-center space-y-4">
              <span className="loading loading-ring loading-md"></span>
              <h2 className="text-lg font-medium">{message}</h2>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-medium">{message}</h2>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-lg font-medium">{message}</h2>
            </div>
          )}
        </div>
      </div>

      <div className="text-center space-y-4">
        <p className="text-sm text-gray-500">Need help? Contact our <a href="#" className="text-blue-500 underline">support team</a>.</p>
        <p className="text-sm text-gray-500">© 2025 Checkmater. All rights reserved.</p>
      </div>
    </>
  )
}
