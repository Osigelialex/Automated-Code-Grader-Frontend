'use client'
import { api } from '@/lib/axiosConfig';
import React, { useEffect } from 'react';
import Image from 'next/image';
import Loading from '@/app/loading';

interface Course {
  id: string;
  title: string;
  description: string;
  course_code: string;
  course_unit: number;
  course_join_code: string;
}

export default function Dashboard() {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await api.get('/courses/enrolled');
      setCourses(response.data);
      setLoading(false);
    }

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-full">
      {courses.length === 0 ? (
        <>
          <Image
            src='/not-found.gif'
            width={150}
            height={150}
            alt='not-found'
            priority
          />
          <h2 className='text-xl font-bold mb-4'>No courses enrolled.</h2>
          <p>Click the <span className='text-2xl font-bold'>+</span> icon to enroll for a course</p>
        </>
    ) : (
      courses.map((course, id) => (
        <div key={id} className="card w-80">
          <h2 className="text-lg font-bold">{course.title}</h2>
          <p>{course.description}</p>
        </div>
      ))
    )}
  </div>
  )
}