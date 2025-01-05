'use client'
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/lib/axiosConfig'
import { ICourse } from '../page'
import { AxiosError } from 'axios'
import { ErrorResponse } from '@/app/interfaces/errorInterface'
import Loading from '@/app/loading'
import AssignmentCard from '@/app/dashboard/components/assignment_card'
import CourseDetailCard from '@/app/dashboard/components/course_detail_card'
import NoAssignmentCard from '@/app/dashboard/components/no_assignment_card'

export interface IAssignment {
  id: string;
  title: string;
  description: string;
  max_score: 100;
  programming_language: string;
  language_id: number;
  is_draft: boolean;
  created_at: string;
  updated_at: string;
}

export default function CourseDetails() {
  const [course, setCourse] = React.useState<ICourse | null>(null);
  const [assignments, setAssignments] = React.useState<IAssignment[] | []>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
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
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen py-8 px-4 sm:px-10'>
      <CourseDetailCard course={course!} />

      <h3 className="text-lg ml-3 font-bold mb-6">Assignments</h3>

      {assignments.length === 0 ? (
        <NoAssignmentCard />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map((assignment, key) => (
            <AssignmentCard key={key} assignment={assignment} />
          ))}
        </div>
      )}
    </div>
  )
}