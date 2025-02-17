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
import { Search, CircleArrowRight, CircleArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function CourseDetails() {
  const [course, setCourse] = React.useState<ICourse | null>(null);
  const [assignments, setAssignments] = React.useState<IPaginatedAssignmentList>({ results: [], count: 0, next: null, previous: null });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [courseResponse, assignmentsResponse] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get(`/courses/${id}/assignments`)
        ]);
        setCourse(courseResponse.data);
        setAssignments(assignmentsResponse.data);
      } catch (e: unknown) {
        const error = e as AxiosError<ErrorResponse>;
        setError(error.response?.data.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const filteredAssignments = assignments.results.filter(assignment =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchPage = async (link: string) => {
    try {
      const response = await api.get(link);
      setAssignments(response.data);
      setLoading(false);
    } catch (e: unknown) {
      const error = e as AxiosError<ErrorResponse>;
      toast.error(error.response?.data.message || 'An error occurred while fetching data');
    }
  }

  const handleNext = async () => {
    if (!assignments.next) return;
    await fetchPage(assignments.next!);
  };

  const handlePrevious = async () => {
    if (!assignments.previous) return;
    await fetchPage(assignments.previous!);
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
    );
  }

  return (
    <div className='min-h-screen py-8 px-4 sm:px-10 space-y-8'>
      <CourseDetailCard course={course!} />

      <div className="space-y-4 mx-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Assignments</h3>
          <div className="w-full md:w-1/3">
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
          <div className="text-center py-8">
            <h3 className="font-semibold text-lg">No Assignments Yet</h3>
            <p className="text-gray-600">Assignments will appear here when they are added to the course.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead className='bg-base-100'>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Max Score</th>
                  <th>Language</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-base-100 cursor-pointer" onClick={() => router.push(`/dashboard/student/assignment/${assignment.id}`)}>
                    <td className="font-medium">{assignment.title}</td>
                    <td className="max-w-md truncate">{assignment.description}</td>
                    <td>{assignment.max_score}</td>
                    <td>{assignment.programming_language || 'Not specified'}</td>
                    <td>{new Date(assignment.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-center align-middle mt-5">
              {assignments.previous && (
                <CircleArrowLeft size={24} onClick={handlePrevious} className='cursor-pointer' />
              )}
              {assignments.next && (
                <CircleArrowRight size={24} onClick={handleNext} className='cursor-pointer' />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}