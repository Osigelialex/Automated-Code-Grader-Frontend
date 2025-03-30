'use client'
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/lib/axiosConfig'
import { AxiosError } from 'axios'
import { ErrorResponse } from '@/app/interfaces/errorInterface'
import Loading from '@/app/loading'
import CourseDetailCard from '@/app/dashboard/components/course_detail_card'
import { IPaginatedAssignmentList } from '@/app/dashboard/interfaces/assignment'
import { ICourse } from '@/app/dashboard/interfaces/course'
import Image from 'next/image'
import { Search, NotebookPen, Calendar, Clock, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function CourseDetails() {
  const [course, setCourse] = React.useState<ICourse | null>(null)
  const [assignments, setAssignments] = React.useState<IPaginatedAssignmentList>({ results: [], count: 0, next: null, previous: null })
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [searchTerm, setSearchTerm] = React.useState('')
  const router = useRouter()
  const { id } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [courseResponse, assignmentsResponse] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get(`/courses/${id}/assignments`)
        ])
        setCourse(courseResponse.data)
        setAssignments(assignmentsResponse.data)
      } catch (e: unknown) {
        const error = e as AxiosError<ErrorResponse>
        setError(error.response?.data.message || 'An error occurred while fetching data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const filteredAssignments = assignments.results.filter(assignment =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const fetchPage = async (link: string) => {
    try {
      setLoading(true)
      const response = await api.get(link)
      setAssignments(response.data)
    } catch (e: unknown) {
      const error = e as AxiosError<ErrorResponse>
      toast.error(error.response?.data.message || 'An error occurred while fetching data')
    } finally {
      setLoading(false)
    }
  }

  const handleNext = async () => {
    if (!assignments.next) return
    await fetchPage(assignments.next!)
  }

  const handlePrevious = async () => {
    if (!assignments.previous) return
    await fetchPage(assignments.previous!)
  }

  // Function to check if a deadline is approaching (within 3 days)
  const isDeadlineApproaching = (deadline: string): boolean => {
    const dueDate = new Date(deadline)
    const today = new Date()
    const differenceInDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return differenceInDays >= 0 && differenceInDays <= 3
  }

  // Function to check if a deadline has passed
  const isDeadlinePassed = (deadline: string): boolean => {
    const dueDate = new Date(deadline)
    const today = new Date()
    return dueDate < today
  }

  // Function to format the date in a more readable format
  const formatDueDate = (dateString: string): string => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }

  // Function to get time from date
  const formatDueTime = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="alert alert-error">
          <Image src='/error.svg' alt='Error' width={50} height={50} />
          <span>{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen py-8 px-4 sm:px-10 space-y-8'>
      <CourseDetailCard course={course!} />

      <div className="space-y-4 mx-3">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div className='space-y-2'>
            <h3 className="text-lg font-bold">Assignments</h3>
            <p className="text-sm text-gray-600">View and manage assignments for this course</p>
          </div>
          <div className="w-full sm:w-1/3">
            <label className="input input-bordered flex items-center gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="grow"
                placeholder="Search assignments..."
              />
              <Search />
            </label>
          </div>
        </div>

        {assignments.results.length === 0 ? (
          <div className="min-h-[40vh] grid place-items-center">
            <div className='grid place-items-center space-y-5'>
              <NotebookPen size={100} className="text-gray-400" />
              <div className='text-center'>
                <p>There are no assignments yet, enjoy the silence</p>
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
                  <th>Max Score</th>
                  <th>Language</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map((assignment) => (
                  <tr
                    key={assignment.id}
                    className='hover:cursor-pointer hover:bg-base-200'
                    onClick={() => router.push(`/dashboard/student/assignment/${assignment.id}`)}
                  >
                    <td className="font-medium">{assignment.title}</td>
                    <td>
                      {assignment.description.length > 30
                        ? assignment.description.substring(0, 30) + '...'
                        : assignment.description}
                    </td>
                    <td>{assignment.max_score}</td>
                    <td>{assignment.programming_language || 'Not specified'}</td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <div
                          className={`flex items-center gap-2 rounded-md px-2 py-1 ${
                            isDeadlinePassed(assignment.deadline)
                              ? 'text-red-600'
                              : isDeadlineApproaching(assignment.deadline)
                              ? 'text-amber-600'
                              : 'text-blue-600'
                          }`}
                        >
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
                    onClick={handlePrevious}
                    className="join-item btn btn-outline"
                  >
                    Prev
                  </button>
                )}
                {assignments.next && (
                  <button
                    onClick={handleNext}
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
    </div>
  )
}