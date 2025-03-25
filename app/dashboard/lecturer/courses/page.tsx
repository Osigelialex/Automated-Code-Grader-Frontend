"use client";
import { useState, useEffect } from "react";
import { IPaginatedCourseList } from "../../interfaces/course";
import Loading from "@/app/loading";
import { api } from "@/lib/axiosConfig";
import {
  X,
  BookOpen,
  Code,
  Key,
  Trophy,
  Copy,
  Check,
  Search
} from "lucide-react";
import { Button } from "@/app/components/ui/button";


export default function CoursesPage() {
  const [coursesData, setCoursesData] = useState<IPaginatedCourseList>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course_code: "",
    course_units: 10,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (copiedCode) {
      const timer = setTimeout(() => {
        setCopiedCode(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedCode]);

  const fetchCourses = async (url = "/courses") => {
    setIsLoading(true);
    try {
      const response = await api.get(url);
      setCoursesData(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/courses", formData);
      await fetchCourses();
      setFormData({ title: "", description: "", course_code: "", course_units: 10 });

      // close course creation modal
      const modal = document.getElementById("create-course-modal") as HTMLDialogElement;
      modal.close();
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Failed to create course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "course_units" ? parseInt(value, 10) || 0 : value,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedCode(text);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  const filteredCourses = () => {
    return coursesData.results.filter(course => course.title === searchTerm);
  }

  return (
    <div className="min-h-screen p-3">
      {/* Header */}
      <header className="py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-xl font-bold">Course Dashboard</h1>
              <p className="text-xs sm:text-sm text-gray-600">Manage and create your academic courses</p>
            </div>
            <div className="self-start sm:self-auto">
              <Button
                type="button"
                value="Create Course"
                width="flex items-center gap-2"
                onClick={() => {
                  const modal = document.getElementById("create-course-modal") as HTMLDialogElement;
                  modal.showModal();
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Search bar */}
      <div className="w-full md:w-1/2 px-4 md:px-8">
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {/* No Courses */}
            {coursesData.results.length === 0 ? (
              <div className="p-10 rounded-xl text-center shadow-sm my-8">
                <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Found</h3>
                <p className="mb-6">Start by creating your first course.</p>
                <div className="max-w-xs mx-auto">
                  <Button
                    type="button"
                    value="Create Your First Course"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {coursesData.results.map((course) => (
                  <div
                    key={course.id}
                    className="rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 bg-base-100"
                  >
                    <div className="flex justify-between items-start">
                      <h2 className="text-sm font-semibold">{course.title}</h2>
                    </div>
                    <p className="text-sm mt-2 line-clamp-2">{course.description}</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm">
                        <Code className="w-4 h-4 mr-2 text-primary" />
                        <span className="font-medium mr-1">Code:</span>
                        <span>{course.course_code}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Trophy className="w-4 h-4 mr-2 text-primary" />
                        <span className="font-medium mr-1">Course Units:</span>
                        <span>{course.course_units}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Key className="w-4 h-4 mr-2 text-primary" />
                        <span className="font-medium mr-1">Join Code:</span>
                        <span className="font-mono">{course.course_join_code}</span>
                        <button
                          className="ml-2 p-1 hover:bg-gray-100 rounded-md transition-colors"
                          onClick={() => copyToClipboard(course.course_join_code)}
                          title="Copy code"
                        >
                          {copiedCode === course.course_join_code ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button className="btn btn-sm btn-outline mt-4 w-full">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {(coursesData.next || coursesData.previous) && (
              <div className="flex justify-center my-8 gap-2">
                <Button
                  type="button"
                  value="Previous"
                  onClick={() => coursesData.previous && fetchCourses(coursesData.previous)}
                  disabled={!coursesData.previous}
                  width="w-32"
                />
                <Button
                  type="button"
                  value="Next"
                  onClick={() => coursesData.next && fetchCourses(coursesData.next)}
                  disabled={!coursesData.next}
                  width="w-32"
                />
              </div>
            )}
          </>
        )}

        {/* Course creation modal */}
        <dialog id="create-course-modal" className="modal">
          <div className="modal-box">
            <form method="dialog" onSubmit={handleCreateCourse}>
              <h3 className="font-bold text-lg mb-4">Create Course</h3>

              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text">Course Title</span>
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter course title"
                  className="input input-bordered w-full"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Enter course description"
                  className="textarea textarea-bordered w-full"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text">Course Code</span>
                </label>
                <input
                  type="text"
                  name="course_code"
                  placeholder="Enter course code"
                  className="input input-bordered w-full"
                  value={formData.course_code}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text">Course Units</span>
                </label>
                <input
                  type="number"
                  name="course_units"
                  placeholder="Enter course units"
                  className="input input-bordered w-full"
                  value={formData.course_units}
                  onChange={handleInputChange}
                  min="1"
                  max="20"
                  required
                />
              </div>

              <div className="modal-action">
                <button type="button" className="btn btn-soft" onClick={() => {
                  const modal = document.getElementById("create-course-modal") as HTMLDialogElement;
                  modal.close();
                }}>
                  Close
                </button>
                <Button
                  type="submit"
                  value={isSubmitting ? "Creating..." : "Create"}
                  onClick={() => handleCreateCourse}
                  disabled={isSubmitting}
                  width="w-20"
                />
              </div>
            </form>
          </div>
        </dialog>
      </main>
    </div>
  );
}