"use client";
import { useState, useEffect } from "react";
import { IPaginatedCourseList, ICourse } from "../../interfaces/course";
import Loading from "@/app/loading";
import { api } from "@/lib/axiosConfig";
import {
  BookOpen,
  Code,
  Key,
  Trophy,
  Copy,
  Check,
  Search,
  Trash2,
  Edit
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
  const [createFormData, setCreateFormData] = useState({
    title: "",
    description: "",
    course_code: "",
    course_units: 10,
  });
  const [editFormData, setEditFormData] = useState<ICourse>({
    id: "",
    title: "",
    description: "",
    course_code: "",
    course_units: 10,
    course_join_code: "",
  });
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
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
      await api.post("/courses", createFormData);
      await fetchCourses();
      setCreateFormData({ title: "", description: "", course_code: "", course_units: 10 });

      const modal = document.getElementById("create-course-modal") as HTMLDialogElement;
      modal.close();
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Failed to create course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.patch(`/courses/${editFormData.id}/edit`, {
        title: editFormData.title,
        description: editFormData.description,
        course_code: editFormData.course_code,
        course_units: editFormData.course_units
      });
      await fetchCourses();

      const modal = document.getElementById("edit-course-modal") as HTMLDialogElement;
      modal.close();
    } catch (error) {
      console.error("Error editing course:", error);
      alert("Failed to edit course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      await api.delete(`/courses/${courseToDelete}/delete`);
      await fetchCourses();

      const modal = document.getElementById("delete-confirmation-modal") as HTMLDialogElement;
      modal.close();
      setCourseToDelete(null);
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course. Please try again.");
    }
  };

  const handleCreateInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCreateFormData({
      ...createFormData,
      [name]: name === "course_units" ? parseInt(value, 10) || 0 : value,
    });
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: name === "course_units" ? parseInt(value, 10) || 0 : value,
    });
  };

  const openEditModal = (course: ICourse) => {
    setEditFormData(course);
    const modal = document.getElementById("edit-course-modal") as HTMLDialogElement;
    modal.showModal();
  };

  const openDeleteConfirmation = (courseId: string) => {
    setCourseToDelete(courseId);
    const modal = document.getElementById("delete-confirmation-modal") as HTMLDialogElement;
    modal.showModal();
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

  const filteredCourses = coursesData.results.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-3">
      {/* Header */}
      <header className="py-1">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="space-y-2">
              <h1 className="font-bold">Course Management</h1>
              <p className="text-sm text-gray-600">Manage and create your academic courses</p>
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
      <div className="mt-3 w-full md:w-1/2 px-4 md:px-8">
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="grow"
            placeholder="Search courses by title, code, or description..."
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
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 bg-base-100 relative flex flex-col justify-between"
                  >
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button
                        onClick={() => openEditModal(course)}
                        className="text-gray-500 hover:text-blue-600 transition-colors"
                        title="Edit Course"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openDeleteConfirmation(course.id)}
                        className="text-gray-500 hover:text-red-600 transition-colors"
                        title="Delete Course"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-sm font-semibold">{course.title}</h2>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                      <div className="space-y-2">
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
        {/* Create course modal */}
        <dialog id="create-course-modal" className="modal">
          <div className="modal-box">
            <form method="dialog" onSubmit={handleCreateCourse}>
              <h3 className="font-bold text-lg mb-4">Create New Course</h3>

              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text">Course Title</span>
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter course title"
                  className="input input-bordered w-full"
                  value={createFormData.title}
                  onChange={handleCreateInputChange}
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
                  value={createFormData.description}
                  onChange={handleCreateInputChange}
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
                  value={createFormData.course_code}
                  onChange={handleCreateInputChange}
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
                  value={createFormData.course_units}
                  onChange={handleCreateInputChange}
                  min="1"
                  max="20"
                  required
                />
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-soft"
                  onClick={() => {
                    const modal = document.getElementById("create-course-modal") as HTMLDialogElement;
                    modal.close();
                  }}
                >
                  Close
                </button>
                <Button
                  type="submit"
                  value="Create Course"
                  loading={isSubmitting}
                  width="w-30"
                />
              </div>
            </form>
          </div>
        </dialog>

        {/* Edit course modal */}
        <dialog id="edit-course-modal" className="modal">
          <div className="modal-box">
            <form method="dialog" onSubmit={handleEditCourse}>
              <h3 className="font-bold text-lg mb-4">Edit Course</h3>

              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text">Course Title</span>
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter course title"
                  className="input input-bordered w-full"
                  value={editFormData.title}
                  onChange={handleEditInputChange}
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
                  value={editFormData.description}
                  onChange={handleEditInputChange}
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
                  value={editFormData.course_code}
                  onChange={handleEditInputChange}
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
                  value={editFormData.course_units}
                  onChange={handleEditInputChange}
                  min="1"
                  max="20"
                  required
                />
              </div>

              <div className="modal-action">
                <button type="button" className="btn btn-soft" onClick={() => {
                  const modal = document.getElementById("edit-course-modal") as HTMLDialogElement;
                  modal.close();
                }}>
                  Close
                </button>
                <Button
                  type="submit"
                  value="Save Changes"
                  loading={isSubmitting}
                  width="w-30"
                />
              </div>
            </form>
          </div>
        </dialog>

        {/* Delete confirmation modal */}
        <dialog id="delete-confirmation-modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Confirm Course Deletion</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this course? This action cannot be undone.
            </p>
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-soft"
                onClick={() => {
                  const modal = document.getElementById("delete-confirmation-modal") as HTMLDialogElement;
                  modal.close();
                  setCourseToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-error"
                onClick={handleDeleteCourse}
              >
                Delete Course
              </button>
            </div>
          </div>
        </dialog>
      </main>
    </div>
  );
}