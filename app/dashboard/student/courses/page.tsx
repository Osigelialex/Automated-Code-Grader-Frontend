'use client'
import { ErrorResponse } from '@/app/interfaces/errorInterface';
import Loading from '@/app/loading';
import { api } from '@/lib/axiosConfig';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { IPaginatedCourseList } from '../../interfaces/course';
import { useRouter } from 'next/navigation';
import { Search, CircleArrowRight, CircleArrowLeft } from 'lucide-react'

export default function CoursesPage() {
  const [courses, setCourses] = useState<IPaginatedCourseList>({ results: [], count: 0, next: null, previous: null });
  const [loading, setLoading] = useState(true);
  const [joinCode, setJoinCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

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
      closeModal();
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

  const filteredCourses = courses.results.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.lecturer.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchPage = async (link: string) => {
    try {
      const response = await api.get(link);
      setCourses(response.data);
      setLoading(false);
    } catch (e: unknown) {
      const error = e as AxiosError<ErrorResponse>;
      toast.error(error.response?.data.message || 'An error occurred while fetching data');
    }
  }

  const handleNext = async () => {
    if (!courses.next) return;
    await fetchPage(courses.next!);
  };

  const handlePrevious = async () => {
    if (!courses.previous) return;
    await fetchPage(courses.previous!);
  }

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
            className='btn btn-primary'
            onClick={() => openModal()}
          >
            Enroll in Course
          </button>
        </div>

        <div className="w-full md:w-1/2">
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="grow"
              placeholder="Search courses..."
            />
            <Search />
          </label>
        </div>
      </div>

      {/* Enroll Modal */}
      <dialog id="enroll_modal" className="modal">
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
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
              <button type="submit" className="btn btn-primary">
                Join Course
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {courses.results.length === 0 ? (
        <div className='flex flex-col items-center justify-center min-h-[60vh]'>
          <h1 className='font-bold text-lg'>No Courses Enrolled</h1>
          <p>When you enroll into a course, you can see them here</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className='bg-base-100'>
              <tr>
                <th>Course Code</th>
                <th>Title</th>
                <th>Units</th>
                <th>Lecturer</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr
                  key={course.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/dashboard/student/courses/${course.id}`)}>
                  <td>{course.course_code}</td>
                  <td>{course.title}</td>
                  <td>{course.course_units}</td>
                  <td>{`${course.lecturer.first_name} ${course.lecturer.last_name}`}</td>
                  <td>{course.lecturer.department}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center align-middle mt-5">
            {courses.previous && (
              <CircleArrowLeft size={24} onClick={handlePrevious} className='cursor-pointer' />
            )}
            {courses.next && (
              <CircleArrowRight size={24} onClick={handleNext} className='cursor-pointer' />
            )}
          </div>
        </div>
      )}
    </div>
  )
}