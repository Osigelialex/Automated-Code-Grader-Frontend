"use client"
import React from 'react'
import { api } from '@/lib/axiosConfig';
import Loading from '@/app/loading';
import { NotebookPen, Calendar, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

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

  const publishAssignment = async (id: string) => {
    const confirmPublish = window.confirm("Are you sure you want to publish this assignment?");
    if (confirmPublish) {
      try {
        setLoading(true);
        await api.patch(`/assignments/${id}/publish`);
        await fetchAssignments();
      } catch (error) {
        console.error("Error publishing assignment: ", error);
        alert("Failed to publish assignment. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  }

  const isDeadlineApproaching = (deadline: string): boolean => {
    const dueDate = new Date(deadline);
    const today = new Date();
    const differenceInDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return differenceInDays >= 0 && differenceInDays <= 3;
  }

  const isDeadlinePassed = (deadline: string): boolean => {
    const dueDate = new Date(deadline);
    const today = new Date();
    return dueDate < today;
  }

  const formatDueDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  const formatDueTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className='min-h-screen p-4'>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div className='space-y-2'>
          <h2 className='font-bold text-lg'>Assignment Management</h2>
          <p className="text-sm text-base-content/70">Create and manage your programming assignments</p>
          <p className="text-sm text-base-content/70">
            Create New assignment
            <Link className='text-primary ml-1 hover:underline' href='assignments/create-assignment'>
              Here
            </Link>
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loading />
        </div>
      ) : assignments.count === 0 ? (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className='text-center space-y-5'>
            <NotebookPen size={100} className="text-base-content/30 mx-auto" />
            <div>
              <p className="text-base-content/70">Oops, looks like you haven&quot;t created any assignments yet</p>
              <button className="btn btn-primary mt-4">
                Create your first assignment
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className='mt-10 overflow-x-auto'>
          <table className='table table-zebra w-full'>
            <thead>
              <tr>
                <th className="text-base">Title</th>
                <th className="text-base">Description</th>
                <th className="text-base">Status</th>
                <th className="text-base">Language</th>
                <th className="text-base">Due Date</th>
                <th className="text-base">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.results.map((assignment) => (
                <tr key={assignment.id}>
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
                      <span className='badge badge-warning badge-outline'>
                        Draft
                      </span>
                    ) : (
                      <span className='badge badge-success badge-outline'>
                        Published
                      </span>
                    )}
                  </td>
                  <td>{assignment.programming_language}</td>
                  <td>
                    <div className="space-y-1">
                      <div className={`flex items-center gap-2 ${isDeadlinePassed(assignment.deadline)
                        ? 'text-error'
                        : isDeadlineApproaching(assignment.deadline)
                          ? 'text-warning'
                          : 'text-info'
                        }`}>
                        <Calendar size={16} />
                        <span className="font-medium">{formatDueDate(assignment.deadline)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-base-content/70">
                        <Clock size={14} />
                        <span>{formatDueTime(assignment.deadline)}</span>
                      </div>
                      {isDeadlinePassed(assignment.deadline) ? (
                        <div className="flex items-center gap-1 text-xs text-error">
                          <AlertCircle size={14} />
                          <span>Overdue</span>
                        </div>
                      ) : isDeadlineApproaching(assignment.deadline) ? (
                        <div className="flex items-center gap-1 text-xs text-warning">
                          <AlertCircle size={14} />
                          <span>Due soon</span>
                        </div>
                      ) : null}
                    </div>
                  </td>
                  <td>
                    {assignment.is_draft && (
                      <button
                        className="btn btn-outline btn-sm btn-success"
                        onClick={() => publishAssignment(assignment.id)}
                      >
                        Publish
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='py-4 flex justify-center'>
            <div className="join">
              {assignments.previous && (
                <button
                  onClick={() => fetchAssignments(assignments.previous!)}
                  className="join-Item btn btn-outline"
                >
                  Prev
                </button>
              )}
              {assignments.next && (
                <button
                  onClick={() => fetchAssignments(assignments.next!)}
                  className="join-item btn btn-outline"
                >
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