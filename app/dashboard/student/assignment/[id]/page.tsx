'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import { api } from '@/lib/axiosConfig';
import { AxiosError } from 'axios';
import { ErrorResponse } from '@/app/interfaces/errorInterface';
import { toast } from 'sonner';
import Loading from '@/app/loading';
import Image from 'next/image';
import Editor from '@monaco-editor/react';
import { ISubmissionResponse, IAssignmentDetails } from '@/app/dashboard/interfaces/assignment';
import { BrainCog } from 'lucide-react';

export default function AssignmentDetailPage() {
  const [assignment, setAssignment] = useState<IAssignmentDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string>('# Start coding here');
  const [feedback, setFeedback] = useState<string>('');
  const [submissionResponse, setSubmissionResponse] = useState<ISubmissionResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeTestCase, setActiveTestCase] = useState<number>(0);
  const [solved, setSolved] = useState<boolean>(false);

  const [viewMode, setViewMode] = useState<'visible' | 'all'>('visible');
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [assignmentResponse, progressResponse] = await Promise.all([
          api.get(`/assignments/${id}`),
          api.get(`/assignments/${id}/progress`)
        ]);

        setAssignment(assignmentResponse.data);

        if (progressResponse.data?.code) {
          setCode(progressResponse.data.code);
        }

        if (progressResponse.data?.solved) {
          setSolved(progressResponse.data.solved);
        }
        setLoading(false);
      } catch (e: unknown) {
        const error = e as AxiosError<ErrorResponse>;
        toast.error(error.response?.data.message, { duration: 5000 });
        setError(error.response?.data.message || "Could not fetch assignment details");
        setLoading(false);
      }
    }

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setCode(value);
    }
  };

  const handleSubmitSolution = async () => {
    if (code === '# Start coding here') {
      toast.error('Please write some code before submitting');
      return;
    }
  
    setFeedback('');
    setIsSubmitting(true);
    try {
      const response = await api.post<ISubmissionResponse>(`/assignments/${id}/submit`, { code });
      
      setSubmissionResponse(response.data);
  
      if (response.data.score !== 100) {
        const feedbackResponse = await api.post<{ feedback: string }>(
          `/submissions/${response.data.submission_id}/feedback`,
          {},
          { withCredentials: true }
        );
        setFeedback(feedbackResponse.data.feedback);
      }
    } catch (e: unknown) {
      const error = e as AxiosError<ErrorResponse>;
      console.error('Submission error:', error);
      toast.error(error.response?.data.message || 'An error occurred during submission');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) return <Loading />;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header Section */}
      <div className="bg-base-100 shadow-sm mx-4">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">{assignment!.title}</h1>
              {solved && (
                <div className='badge bade-lg badge-success'>
                  Solved
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="badge badge-lg gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                </svg>
                {assignment!.max_score} points
              </div>
              <div className="badge badge-lg gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Due {formatDate(assignment!.deadline)}
              </div>
              <div className="badge badge-lg badge-primary">
                {assignment!.programming_language}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="mb-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <p>{assignment!.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            {/* Editor Section */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Solution Editor</h2>
                <div className="h-[600px] w-full">
                  <Editor
                    height="100%"
                    defaultLanguage='python'
                    defaultValue={code}
                    onChange={handleEditorChange}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      tabSize: 2,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      lineNumbers: 'on',
                      roundedSelection: false,
                      scrollbar: {
                        vertical: 'visible',
                        horizontal: 'visible',
                        useShadows: false,
                        verticalScrollbarSize: 10,
                        horizontalScrollbarSize: 10
                      }
                    }}
                  />
                </div>
                <div className="card-actions justify-end mt-4 gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={handleSubmitSolution}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ?
                      <span className="loading loading-spinner"></span> :
                      'Submit Solution'
                    }
                  </button>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body p-0">
                <div className="collapse collapse-arrow">
                  <input type="checkbox" defaultChecked />
                  <div className="collapse-title text-xl font-medium p-6">
                    <div className="flex items-center gap-2">
                      <BrainCog />
                      <span className="text-xl font-medium">AI Feedback</span>
                    </div>
                  </div>
                  <div className="collapse-content">
                    {feedback ? (
                      <div className="prose p-6 rounded-lg bg-base-200">
                        <p>{feedback}</p>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-base-content/60">
                        <p>Feedback from CheckMate AI will be displayed here. Stay tuned!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Panel */}
          <div className="lg:col-span-5">
            {/* Test Cases Section */}
            <div className="card bg-base-100 shadow-xl mb-6">
              <div className="card-body p-0">
                <div className="tabs tabs-bordered">
                  {assignment!.test_cases.map((_, index) => (
                    <button
                      key={index}
                      className={`tab tab-lifted ${activeTestCase === index ? 'tab-active' : ''}`}
                      onClick={() => setActiveTestCase(index)}
                    >
                      Test {index + 1}
                    </button>
                  ))}
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {/* Test Case Section */}
                    <div className="collapse collapse-arrow bg-base-200">
                      <input type="checkbox" defaultChecked />
                      <div className="collapse-title font-medium">
                        Sample Test Case
                      </div>
                      <div className="collapse-content space-y-4">
                        <div className="bg-base-300 p-4 rounded-lg">
                          <h3 className="text-sm font-medium mb-2">Input:</h3>
                          <pre className="overflow-x-auto">
                            <code>{assignment!.test_cases[activeTestCase].input}</code>
                          </pre>
                        </div>
                        <div className="bg-base-300 p-4 rounded-lg">
                          <h3 className="text-sm font-medium mb-2">Expected Output:</h3>
                          <pre className="overflow-x-auto">
                            <code>{assignment!.test_cases[activeTestCase].output}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Result Section */}
            {submissionResponse && (
              <div className="card bg-base-100 shadow-xl mb-6">
                <div className="card-body">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="card-title">Test Results</h2>
                    <div className="tabs tabs-boxed">
                      <button
                        className={`tab ${viewMode === 'visible' ? 'tab-active' : ''}`}
                        onClick={() => setViewMode('visible')}
                      >
                        Sample Tests
                      </button>
                      <button
                        className={`tab ${viewMode === 'all' ? 'tab-active' : ''}`}
                        onClick={() => setViewMode('all')}
                      >
                        All Tests
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {submissionResponse.submission_result
                      .filter((_, index) =>
                        viewMode === 'all' ||
                        index < assignment!.test_cases.length
                      )
                      .map((result, index) => (
                        <div key={index} className="collapse collapse-arrow bg-base-200">
                          <input type="checkbox" />
                          <div className={`collapse-title font-medium flex items-center gap-2 ${result.status === 'Accepted' ? 'text-success' : 'text-error'
                            }`}>
                            <div className={`badge ${result.status === 'Accepted' ? 'badge-success' : 'badge-error'
                              }`}>
                              {result.status}
                            </div>
                            Test {index + 1}
                            {index >= assignment!.test_cases.length && (
                              <span className="badge badge-neutral">Hidden</span>
                            )}
                            <span className="text-base-content/60 text-sm ml-auto">
                              Time: {result.time}
                            </span>
                          </div>
                          <div className="collapse-content space-y-4">
                            <div className="bg-base-300 p-4 rounded-lg">
                              <h3 className="text-sm font-medium mb-2">Your Output:</h3>
                              <pre className="overflow-x-auto">
                                <code>{result.output}</code>
                              </pre>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Score Display */}
            {submissionResponse && (
              <div className="card bg-base-100 shadow-xl mb-6">
                <div className="card-body">
                  <h2 className="card-title">Submission Summary</h2>
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Score</div>
                      <div className="stat-value">{submissionResponse.score}</div>
                    </div>
                    <div className="stat">
                      <div className="stat-title">Tests Passed</div>
                      <div className="stat-value text-success">
                        {submissionResponse.submission_result.filter(r => r.status === 'Accepted').length}
                        <span className="text-base">/{submissionResponse.submission_result.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}