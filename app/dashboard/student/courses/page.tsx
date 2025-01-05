'use client'
import { ErrorResponse } from '@/app/interfaces/errorInterface';
import Loading from '@/app/loading';
import { api } from '@/lib/axiosConfig';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Book, Users } from 'lucide-react';

interface ICourse {
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
  const [selectedView, setSelectedView] = useState<'grid' | 'list'>('list');

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
          <div className='flex items-center gap-4'>
            <div className='flex gap-2 bg-base-100 p-2 rounded-lg'>
              <button
                className={`p-2 rounded ${selectedView === 'grid' ? 'bg-primary text-white' : ''}`}
                onClick={() => setSelectedView('grid')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                className={`p-2 rounded ${selectedView === 'list' ? 'bg-primary text-white' : ''}`}
                onClick={() => setSelectedView('list')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <button
              className='bg-primary px-3 py-2 text-white rounded-md'
              onClick={() => openModal()}
            >
              Enroll in Course
            </button>
          </div>
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
      ) : selectedView === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="card bg-base-100">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div className='space-y-2'>
                    <h2 className="card-title text-lg">{course.title}</h2>
                    <div className='space-x-2'>
                      <span className="text-sm badge badge-outline">{course.course_code}</span>
                      <span className="badge bg-primary text-white">{course.course_units} Units</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mt-2 line-clamp-2">{course.description}</p>
                <div className="divider"></div>
                <div className="text-sm space-y-2">
                  <p className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-semibold">Lecturer:</span>
                    {course.lecturer.first_name} {course.lecturer.last_name}
                  </p>
                </div>
                <div className="card-actions mt-4">
                  <button className="bg-primary text-white px-3 py-2 rounded-md">
                    View Course
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-base-100 p-6 rounded-lg transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold">{course.title}</h3>
                    <span className="badge badge-outline">{course.course_code}</span>
                    <span className="badge bg-primary text-white">{course.course_units} Units</span>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">{course.description}</p>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-sm">
                        <span className="font-semibold">Lecturer:</span> {course.lecturer.first_name} {course.lecturer.last_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Book className="h-4 w-4 text-primary" />
                      <span className="text-sm">
                        <span className="font-semibold">Department:</span> {course.lecturer.department}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="bg-primary text-white px-4 py-2 rounded-md">
                  View Course
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}