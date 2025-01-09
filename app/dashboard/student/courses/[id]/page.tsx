'use client'
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/lib/axiosConfig'
import { AxiosError } from 'axios'
import { ErrorResponse } from '@/app/interfaces/errorInterface'
import Loading from '@/app/loading'
import AssignmentCard from '@/app/dashboard/components/assignment_card'
import CourseDetailCard from '@/app/dashboard/components/course_detail_card'
import NoAssignmentCard from '@/app/dashboard/components/no_assignment_card'
import { IAssignment } from '@/app/dashboard/interfaces/assignment'
import { ICourse } from '@/app/dashboard/interfaces/course'
import Image from 'next/image'

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
          <Image src='/error.svg' alt='Error' width={50} height={50} />
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