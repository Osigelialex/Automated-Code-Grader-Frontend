import React from 'react'
import SignupFormContainer from './SignupFormContainer'
import { Stylish } from 'next/font/google'

const sytlish = Stylish({ subsets: ['latin'], weight: '400' })

export default function SignupPage() {
  return (
    <main className='min-h-screen grid lg:grid-cols-12'>
      <div className='lg:col-span-7 px-8 py-20'>
        <SignupFormContainer />
      </div>
      <div className={`bg-primary lg:col-span-5 hidden lg:block text-white ${sytlish.className}`}>
        <div className='text-center space-y-6 mx-auto py-52'>
          <h2 className='text-4xl font-bold tracking-wide mb-6'>What we offer?</h2>
          <ul className='space-y-4 mx-auto w-3/4'>
            <li className={`flex items-center gap-3`}>
              <span className='text-2xl'>✅</span> 
              <span className='text-xl font-medium'>LLM powered feedback on assignments</span>
            </li>
            <li className={`flex items-center gap-3`}>
              <span className='text-2xl'>✅</span> 
              <span className='text-xl font-medium'>Customizable test-cases</span>
            </li>
            <li className={`flex items-center gap-3`}>
              <span className='text-2xl'>✅</span> 
              <span className='text-xl font-medium'>Multiple programming language support</span>
            </li>
            <li className={`flex items-center gap-3`}>
              <span className='text-2xl'>✅</span> 
              <span className='text-xl font-medium'>Unlimited Access</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
