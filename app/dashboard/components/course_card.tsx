import React from 'react'
import { ICourse } from '../interfaces/course';
import { Users, Book, Info } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CourseCard({ course }:{ course: ICourse }) {
  const router = useRouter();

  return (
    <div className="bg-base-100 p-6 rounded-lg transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold">{course.title}</h3>
            <span className="badge badge-outline">{course.course_code}</span>
            <span className="badge badge-primary">{course.course_units} Units</span>
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
          <Info onClick={() => router.push(`/dashboard/student/courses/${course.id}`)} />
        </button>
      </div>
    </div>
  )
}
