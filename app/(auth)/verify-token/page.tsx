import React from 'react'
import { SideBanner } from '@/app/components/ui/sideBanner'
import { VerifyToken } from './VerifyToken'

export default function VerificationPage() {
  return (
    <main className="min-h-screen">
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 px-8 py-12 lg:py-20">
          <VerifyToken />
        </div>
        
        <SideBanner />
      </div>
    </main>
  )
}