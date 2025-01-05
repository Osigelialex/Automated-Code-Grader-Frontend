'use client'
import { ErrorResponse } from '@/app/interfaces/errorInterface';
import Loading from '@/app/loading';
import { api } from '@/lib/axiosConfig';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import CourseCard from '../../components/course_card';

export interface ICourse {
  id: string;
  title: string;
  description: string;
  course_code: string;
  course_units: number;
  lecturer: {
    first_name: string;
    last_name: string;
    email: string;
    department: string;
  };
  course_join_code: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<ICourse[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [joinCode, setJoinCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses/enrolled');
        setCourses(response.data);
      } catch (e: unknown) {
        const error = e as AxiosError<ErrorResponse>;
        toast.error(error.response?.data.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      toast.error('Please enter a course code');
      return;
    }

    try {
      await api.post('/courses/join', { course_join_code: joinCode });
      toast.success('Successfully enrolled in course');
      const response = await api.get('/courses/enrolled');
      setCourses(response.data);
      setJoinCode('');
    } catch (e: unknown) {
      const error = e as AxiosError<ErrorResponse>;
      toast.error(error.response?.data.message || 'Failed to enroll in course');
    }
  };

  const closeModal = () => {
    (document.getElementById('enroll_modal') as HTMLDialogElement).close();
  }

  const openModal = () => {
    (document.getElementById('enroll_modal') as HTMLDialogElement).showModal();
  }

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.lecturer.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading />
  }

  return (
    <div className='min-h-screen py-8 px-4 sm:px-10 space-y-8'>
      <div className='flex flex-col gap-6'>
        <div className='flex items-center justify-between flex-wrap gap-4'>
          <div className='space-y-2'>
            <h1 className='font-bold text-xl'>My Courses</h1>
            <p className="text-sm text-gray-600">
              View your enrolled courses and manage them here.
            </p>
          </div>
          <button
            className='bg-primary px-3 py-2 text-white rounded-md'
            onClick={() => openModal()}
          >
            Enroll in Course
          </button>
        </div>

        <div className="w-full md:w-1/2">
          <label className="input input-bordered flex items-center gap-2">
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="grow" placeholder="Search" />
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

      {/* Enroll Modal */}
      <dialog id="enroll_modal" className="modal">
        <div className="modal-box bg-base-100 p-6 rounded-lg shadow-xl">
          <button
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={() => closeModal()}
          >
            ✕
          </button>
          <h3 className="font-bold text-lg mb-4">Enter Join Code</h3>
          <form onSubmit={handleEnroll}>
            <input
              type="text"
              placeholder="Enter course join code"
              className="input input-bordered w-full mb-4"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />
            <div className="modal-action">
              <button type="button" className="btn" onClick={() => closeModal()}>
                Cancel
              </button>
              <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:opacity-70">
                Join Course
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {courses.length === 0 ? (
        <div className='flex flex-col items-center justify-center min-h-[60vh]'>
          <h1 className='font-bold text-lg'>No Courses Enrolled</h1>
          <p>When you enroll into a course, you can see them here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course, key) => (
            <CourseCard key={key} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}