"use client"
import React from 'react'
import { api } from '@/lib/axiosConfig';
import Loading from '@/app/loading';
import { NotebookPen, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface IAssignment {
  id: string;
  title: string;
  description: string;
  is_draft: boolean;
  programming_language: string;
  deadline: string;
}

interface IPaginatedAssignmentList {
  count: number;
  next: string | null;
  previous: string | null;
  results: IAssignment[];
}

export default function AssignmentPage() {
  const [assignments, setAssignments] = React.useState<IPaginatedAssignmentList>({} as IPaginatedAssignmentList);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async (url = '/assignments/teacher') => {
    setLoading(true);
    try {
      const response = await api.get<IPaginatedAssignmentList>(url);
      setAssignments(response.data);
    } catch (error) {
      console.error("Error fetching assignments: ", error);
    } finally {
      setLoading(false);
    }
  }

  // Function to check if a deadline is approaching (within 3 days)
  const isDeadlineApproaching = (deadline: string): boolean => {
    const dueDate = new Date(deadline);
    const today = new Date();
    const differenceInDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return differenceInDays >= 0 && differenceInDays <= 3;
  }

  // Function to check if a deadline has passed
  const isDeadlinePassed = (deadline: string): boolean => {
    const dueDate = new Date(deadline);
    const today = new Date();
    return dueDate < today;
  }

  // Function to format the date in a more readable format
  const formatDueDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  // Function to get time from date
  const formatDueTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className='min-h-screen p-4'>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div className='space-y-2'>
          <h2 className='font-bold'>Assignment Management</h2>
          <p className="text-sm text-gray-600">Create and manage your programming assignments</p>
          <p className="text-sm text-gray-600">Create New assignment <span className='text-primary cursor-pointer'>Here</span></p>
        </div>
      </div>

      {loading ? (
        <div>
          <Loading />
        </div>
      ) : assignments.count === 0 ? (
        <div className="min-h-[60vh] grid place-items-center">
          <div className='grid place-items-center space-y-5'>
            <NotebookPen size={100} className="text-gray-400" />
            <div className='text-center'>
              <p>Oops, looks like you haven&apos;t created any assignments yet</p>
              <Button
                value='Create your first assignment'
                variant='primary'
                type='button'
                width="w-auto"
                className="mt-4"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className='mt-10 overflow-x-auto rounded-box border border-base-content/5 bg-base-100'>
          <table className='table'>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Language</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {assignments.results.map((assignment) => (
                <tr key={assignment.id} className='hover:cursor-pointer hover:bg-base-200'>
                  <td>{assignment.title}</td>
                  <td>
                    {assignment.description.length > 30 ? (
                      assignment.description.substring(0, 30) + '...'
                    ) : (
                      assignment.description
                    )}
                  </td>
                  <td>
                    {assignment.is_draft ? (
                      <div className='badge badge-outline badge-warning'>
                        Draft
                      </div>
                    ) : (
                      <div className='badge badge-outline badge-accent'>
                        Published
                      </div>
                    )}
                  </td>
                  <td>{assignment.programming_language}</td>
                  <td>
                    <div className="flex flex-col gap-1">
                      <div className={`flex items-center gap-2 rounded-md px-2 py-1 ${isDeadlinePassed(assignment.deadline)
                        ? ' text-red-600'
                        : isDeadlineApproaching(assignment.deadline)
                          ? 'text-amber-600'
                          : 'text-blue-600'
                        }`}>
                        <Calendar size={16} />
                        <span className="font-medium">{formatDueDate(assignment.deadline)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock size={14} />
                        <span>{formatDueTime(assignment.deadline)}</span>
                      </div>
                      {isDeadlinePassed(assignment.deadline) ? (
                        <div className="flex items-center gap-1 text-xs text-red-600">
                          <AlertCircle size={14} />
                          <span>Overdue</span>
                        </div>
                      ) : isDeadlineApproaching(assignment.deadline) ? (
                        <div className="flex items-center gap-1 text-xs text-amber-600">
                          <AlertCircle size={14} />
                          <span>Due soon</span>
                        </div>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='py-4 grid place-items-center'>
            <div className="join grid grid-cols-2">
              {assignments.previous && (
                <button
                  onClick={() => fetchAssignments(assignments.previous!)}
                  className="join-item btn btn-outline"
                >
                  Prev
                </button>
              )}

              {assignments.next && (
                <button
                  onClick={() => fetchAssignments(assignments.next!)}
                  className="join-item btn btn-outline">
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}