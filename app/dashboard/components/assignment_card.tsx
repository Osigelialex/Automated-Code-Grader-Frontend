import React from 'react'
import { IAssignment } from '../student/courses/[id]/page'
import { Play } from 'lucide-react'

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function AssignmentCard({ assignment}: { assignment : IAssignment}) {
  return (
    <div className="card bg-base-100 transition-shadow">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <h3 className="card-title text-lg">{assignment.title}</h3>
          <Play className="h-6 w-6 text-primary cursor-pointer" />
        </div>
        <p className="text-base-content/70 text-sm">{assignment.description}</p>
        <div className="divider my-2"></div>
        <div className="flex justify-between items-center text-sm">
          <div className="badge bg-primary text-white">{assignment.programming_language}</div>
          <span>Max Score: {assignment.max_score}</span>
        </div>
        <div className="text-xs text-base-content/50 mt-2">
          Created: {formatDate(assignment.created_at)}
        </div>
      </div>
    </div>
  )
}
