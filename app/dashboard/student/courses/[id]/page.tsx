'use client'
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/lib/axiosConfig'
import { AxiosError } from 'axios'
import { ErrorResponse } from '@/app/interfaces/errorInterface'
import Loading from '@/app/loading'
import CourseDetailCard from '@/app/dashboard/components/course_detail_card'
import { IAssignment } from '@/app/dashboard/interfaces/assignment'
import { ICourse } from '@/app/dashboard/interfaces/course'
import Image from 'next/image'

const ITEMS_PER_PAGE = 10;

export default function CourseDetails() {
  const [course, setCourse] = React.useState<ICourse | null>(null);
  const [assignments, setAssignments] = React.useState<IAssignment[] | []>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
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
        setAssignments(assignmentsResponse.data['results']);
      } catch (e: unknown) {
        const error = e as AxiosError<ErrorResponse>;
        setError(error.response?.data.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const filteredAssignments = assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredAssignments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentAssignments = filteredAssignments.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
      
      <div className="space-y-4">
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70">
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd" />
              </svg>
            </label>
          </div>
        </div>

        {assignments.length === 0 ? (
          <div className="text-center py-8">
            <h3 className="font-semibold text-lg">No Assignments Yet</h3>
            <p className="text-gray-600">Assignments will appear here when they are added to the course.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Max Score</th>
                  <th>Language</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {currentAssignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-base-200 cursor-pointer">
                    <td className="font-medium">{assignment.title}</td>
                    <td className="max-w-md truncate">{assignment.description}</td>
                    <td>{assignment.max_score}</td>
                    <td>{assignment.programming_language || 'Not specified'}</td>
                    <td>
                      <div className={`badge ${assignment.is_draft ? 'badge-warning' : 'badge-success'}`}>
                        {assignment.is_draft ? 'Draft' : 'Published'}
                      </div>
                    </td>
                    <td>{new Date(assignment.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="join mt-4 flex justify-center">
                <button
                  className="join-item btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`join-item btn ${currentPage === page ? 'btn-active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="join-item btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}