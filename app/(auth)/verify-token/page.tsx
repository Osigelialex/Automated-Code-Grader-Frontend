import React from 'react'
import { Suspense } from 'react'
import TokenVeriifcation from './TokenVerification'

export default function VerifyTokenPage() {
  return (
    <div className="sm:w-3/4 mx-auto p-6 space-y-8">
      <div className="max-w-xl w-full space-y-8">
        <div className="space-y-4 sm:w-3/4 mx-auto">
          <h1 className="sm:text-2xl text-lg font-bold">Account Activation</h1>
          <p className="text-base">We are verifying the activation link you clicked to complete your signup.</p>
        </div>

        <Suspense fallback={<div className="flex items-center justify-center h-screen"><span className="loading loading-lg"></span></div>}>
          <TokenVeriifcation />
        </Suspense>
      </div>
    </div>
  )
}
