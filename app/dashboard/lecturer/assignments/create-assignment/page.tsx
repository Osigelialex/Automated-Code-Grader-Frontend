"use client"
import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, Code, Info, Loader2, Eye, EyeOff } from 'lucide-react'
import { api } from '@/lib/axiosConfig'
import Loading from '@/app/loading'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ErrorResponse } from '@/app/interfaces/errorInterface'
import { AxiosError } from 'axios'

interface Language {
  id: number;
  name: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  course_code: string;
  course_units: number;
  course_join_code: string;
}

interface TestCase {
  input: string;
  output: string;
  is_hidden: boolean;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface AssignmentFormValues {
  title: string;
  description: string;
  deadline: string;
  max_score: number;
  language_id: number;
  course_id: string;
  test_cases: TestCase[];
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters'
  }),
  description: z.string().min(20, {
    message: 'Please make your description more explanatory'
  }),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Please provide a valid date and time'
  }),
  max_score: z.number().min(1, {
    message: 'Maximum score must be at least 1 point'
  }).max(1000, {
    message: 'Maximum score cannot exceed 1000 points'
  }),
  language_id: z.number({
    required_error: 'Please select a programming language'
  }),
  course_id: z.string({
    required_error: 'Please select a course'
  }),
  test_cases: z.array(z.object({
    input: z.string(),
    output: z.string(),
    is_hidden: z.boolean().default(false)
  })).min(1, {
    message: 'At least one test case is required'
  })
})

export default function CreateAssignment() {
  const [testCases, setTestCases] = useState<TestCase[]>([{ input: '', output: '', is_hidden: false }])
  const [showHint, setShowHint] = useState<boolean>(false)
  const [languages, setLanguages] = useState<Language[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, reset } = useForm<AssignmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      max_score: 100,
      language_id: 0,
      course_id: '',
      test_cases: [{ input: '', output: '', is_hidden: false }]
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const languagesResponse = await api.get<Language[]>('/languages')

        const coursesResponse = await api.get<PaginatedResponse<Course>>('/courses')

        setLanguages(languagesResponse.data);
        setCourses(coursesResponse.data.results)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load necessary data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const addTestCase = () => {
    const newTestCase = { input: '', output: '', is_hidden: false }
    setTestCases([...testCases, newTestCase])
    setValue('test_cases', [...testCases, newTestCase])
  }

  const removeTestCase = (index: number) => {
    if (testCases.length > 1) {
      const updatedTestCases = [...testCases]
      updatedTestCases.splice(index, 1)
      setTestCases(updatedTestCases)
      setValue('test_cases', updatedTestCases)
    }
  }

  const updateTestCase = (index: number, field: keyof TestCase, value: string | boolean) => {
    const updatedTestCases = [...testCases];

    if (field === 'is_hidden') {
      updatedTestCases[index].is_hidden = value as boolean;
    } else if (field === 'input' || field === 'output') {
      updatedTestCases[index][field] = value as string;
    }

    setTestCases(updatedTestCases);
    setValue('test_cases', updatedTestCases);
  }

  const onSubmit = async (data: AssignmentFormValues) => {
    try {
      const selectedLanguage = languages.find(lang => lang.id === data.language_id);

      const payload = {
        title: data.title,
        description: data.description,
        deadline: new Date(data.deadline).toISOString(),
        max_score: data.max_score,
        language_id: data.language_id,
        programming_language: selectedLanguage ? selectedLanguage.name : "",
        test_cases: data.test_cases
      }

      await api.post(`/courses/${data.course_id}/assignments/create`, payload)

      // Reset form on success
      reset()
      setTestCases([{ input: '', output: '', is_hidden: false }])

      toast.success('Assignment created successfully!');
      router.replace('/dashboard/lecturer/assignments');
    } catch (err: unknown) {
      console.log(err);
      const error = err as AxiosError<ErrorResponse>;

      if (error.response?.data.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data.non_field_errors) {
        for (const errorMessage of error.response?.data.non_field_errors) {
          toast.error(errorMessage);
        }
      }
    }
  }

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <div>
          <span>{error}</span>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="card bg-base-100">
        <div className="card-body">
          <header className='space-y-2 mb-6'>
            <h1 className='font-bold'>Assignment Creation Tool</h1>
            <p className='text-sm text-base-content/70'>Create a new programming assignment for your students</p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Course selection */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Course</span>
              </label>
              <select
                className={`select select-bordered w-full ${errors.course_id ? 'select-error' : ''}`}
                {...register('course_id')}
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title} ({course.course_code})
                  </option>
                ))}
              </select>
              {errors.course_id && <span className="text-error text-sm mt-1">{errors.course_id.message}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title field */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Assignment Title</span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
                  placeholder="Enter a descriptive title"
                  {...register('title')}
                />
                {errors.title && <span className="text-error text-sm mt-1">{errors.title.message}</span>}
              </div>

              {/* Max Score field */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Maximum Score</span>
                </label>
                <input
                  type="number"
                  className={`input input-bordered w-full ${errors.max_score ? 'input-error' : ''}`}
                  placeholder="100"
                  {...register('max_score', { valueAsNumber: true })}
                />
                {errors.max_score && <span className="text-error text-sm mt-1">{errors.max_score.message}</span>}
              </div>
            </div>

            {/* Description field */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Assignment Description</span>
              </label>
              <textarea
                className={`textarea textarea-bordered h-32 ${errors.description ? 'textarea-error' : ''}`}
                placeholder="Provide detailed instructions for the assignment"
                {...register('description')}
              ></textarea>
              {errors.description && <span className="text-error text-sm mt-1">{errors.description.message}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Deadline field */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Deadline</span>
                </label>
                <input
                  type="datetime-local"
                  className={`input input-bordered w-full ${errors.deadline ? 'input-error' : ''}`}
                  {...register('deadline')}
                />
                {errors.deadline && <span className="text-error text-sm mt-1">{errors.deadline.message}</span>}
              </div>

              {/* Programming Language field */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Programming Language</span>
                </label>
                <select
                  className={`select select-bordered w-full ${errors.language_id ? 'select-error' : ''}`}
                  {...register('language_id', { valueAsNumber: true })}
                >
                  <option value="">Select a language</option>
                  {languages.map(lang => (
                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                  ))}
                </select>
                {errors.language_id && <span className="text-error text-sm mt-1">{errors.language_id.message}</span>}
              </div>
            </div>

            {/* Test Cases section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-semibold flex items-center gap-2">
                    <Code size={18} />
                    Test Cases
                  </h2>
                  <p className="text-sm text-base-content/70">Add test cases to verify student submissions</p>
                  <p className='text-sm text-base-content/70'>At least 5 test cases should be created with two being hidden</p>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline btn-info"
                  onClick={() => setShowHint(!showHint)}
                >
                  <Info size={16} />
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </button>
              </div>

              {showHint && (
                <div className="bg-info/10 p-4 rounded-lg text-sm space-y-2">
                  <h3 className="font-semibold mb-2">Test Case Tips:</h3>
                  <p className="font-semibold">Please follow these tips strictly to avoid creating invalid assignments</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Input: String matching stdin—use spaces for same-line values (e.g., <code>&quot;5 7&quot;</code>), <code>&quot;\n&quot;</code> for new lines (e.g., <code>&quot;5\n7&quot;</code>).</li>
                    <li>Output: String matching stdout exactly, including newlines (e.g., <code>&quot;12&quot;</code> or <code>&quot;12\n&quot;</code>) and spaces.</li>
                    <li>Test edge cases: min/max values (e.g., <code>&quot;0 0&quot;</code>, <code>&quot;-100 100&quot;</code>), empty inputs (e.g., <code>&quot;&quot;</code>), special characters.</li>
                    <li>Example (sum program): Input <code>&quot;5 7&quot;</code> → Output <code>&quot;12&quot;</code> (no newline) or <code>&quot;12\n&quot;</code> (with newline, per program).</li>
                    <li><strong>Hidden Tests:</strong> Mark tests as hidden if you don&apos;t want students to see the inputs/outputs. These will be used to validate submissions but students won&apos;t be able to see the test data.</li>
                  </ul>
                </div>
              )}

              {errors.test_cases && !Array.isArray(errors.test_cases) && (
                <span className="text-error text-sm">{errors.test_cases.message}</span>
              )}

              <div className="space-y-4">
                {testCases.map((testCase, index) => (
                  <div key={index} className="card bg-base-200 shadow-sm">
                    <div className="card-body p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">Test Case #{index + 1}</h3>
                          {testCase.is_hidden ? (
                            <span className="badge badge-secondary badge-sm flex items-center gap-1">
                              <EyeOff size={12} />
                              Hidden
                            </span>
                          ) : (
                            <span className="badge badge-outline badge-sm flex items-center gap-1">
                              <Eye size={12} />
                              Visible
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-ghost text-error"
                          onClick={() => removeTestCase(index)}
                          disabled={testCases.length <= 1}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Input</span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered h-24 font-mono text-sm"
                            placeholder="Enter input data"
                            value={testCase.input}
                            onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                          ></textarea>
                          {Array.isArray(errors.test_cases) && errors.test_cases[index]?.input && (
                            <span className="text-error text-sm mt-1">{errors.test_cases[index].input.message}</span>
                          )}
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Expected Output</span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered h-24 font-mono text-sm"
                            placeholder="Enter expected output"
                            value={testCase.output}
                            onChange={(e) => updateTestCase(index, 'output', e.target.value)}
                          ></textarea>
                          {Array.isArray(errors.test_cases) && errors.test_cases[index]?.output && (
                            <span className="text-error text-sm mt-1">{errors.test_cases[index].output.message}</span>
                          )}
                        </div>
                      </div>

                      <div className="form-control mt-2">
                        <label className="cursor-pointer label justify-start gap-2">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-sm"
                            checked={testCase.is_hidden}
                            onChange={(e) => updateTestCase(index, 'is_hidden', e.target.checked)}
                          />
                          <span className="label-text flex items-center gap-1">
                            {testCase.is_hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                            {testCase.is_hidden
                              ? "Hidden test case (students won't see this test data)"
                              : "Visible test case (students will see this test data)"}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={addTestCase}
              >
                <Plus size={16} />
                Add Test Case
              </button>
            </div>

            <div className="card-actions justify-end mt-8">
              <button type="button" className="btn btn-outline">Cancel</button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : 'Create Assignment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}