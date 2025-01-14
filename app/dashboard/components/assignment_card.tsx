import React, { useState } from 'react';
import { IAssignment } from '../interfaces/assignment';
import { Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function AssignmentCard({ assignment }: { assignment: IAssignment }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePlayClick = () => {
    setLoading(true);
    router.push(`/dashboard/student/assignment/${assignment.id}`);
  };

  return (
    <div className="card bg-base-100 transition-shadow">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <h3 className="card-title text-lg">{assignment.title}</h3>
          <Play
            className={`h-5 w-5 text-primary cursor-pointer ${loading ? 'animate-pulse' : ''}`}
            onClick={handlePlayClick}
          />
        </div>
        <p className="text-base-content/70 text-sm">{assignment.description}</p>
        <div className="divider my-2"></div>
        <div className="flex justify-between items-center text-sm">
          <div className="badge badge-primary">{assignment.programming_language}</div>
          <span>Max Score: {assignment.max_score}</span>
        </div>
        <div className="text-xs text-base-content/50 mt-2">
          Created: {formatDate(assignment.created_at)}
        </div>
      </div>
    </div>
  );
}