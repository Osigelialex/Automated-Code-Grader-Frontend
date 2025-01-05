import React from 'react'

export default function NoAssignmentCard() {
  return (
    <div className="card bg-base-100">
      <div className="card-body items-center text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <h3 className="text-lg font-medium">No Assignments Yet</h3>
        <p className="text-base-content/70">Check back later for new assignments.</p>
      </div>
    </div>
  )
}
