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
import { BrainCog, CloudUpload, Play, Trophy, Clock } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function AssignmentDetailPage() {
  const [assignment, setAssignment] = useState<IAssignmentDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string>('# Start coding here');
  const [feedback, setFeedback] = useState<string>('');
  const [feedbackLoading, setFeedbackLoading] = useState<boolean>(true);
  const [submissionResponse, setSubmissionResponse] = useState<ISubmissionResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isTestSubmissionSubmitting, setIsTestSubmissionSubmitting] = useState<boolean>(false);
  const [activeTestCase, setActiveTestCase] = useState<number>(0);
  const [solved, setSolved] = useState<boolean>(false);

  const { theme } = useTheme();
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

  const handleSubmitSolution = async (is_test: boolean) => {
    if (code === '# Start coding here') {
      toast.error('Please write some code before submitting');
      return;
    }

    setFeedback('');
    if (is_test === true) {
      setIsTestSubmissionSubmitting(true)
    } else {
      setIsSubmitting(true);
    }

    try {
      const response = await api.post<ISubmissionResponse>(`/assignments/${id}/submit?is_test=${is_test}`, { code });
      setSubmissionResponse(response.data);
      setIsTestSubmissionSubmitting(false);
      setFeedbackLoading(true);

      // Fetch personalized feedback from LLM
      if (is_test === false) {
        try {
          const feedbackResponse = await api.post<{ feedback: string }>(
            `/submissions/${response.data.submission_id}/feedback`,
            {},
            { withCredentials: true }
          );
          setFeedback(feedbackResponse.data.feedback);
        } catch (e: unknown) {
          console.error(e);
          setFeedback('Oops...Checkmate AI is not available at the moment');
        }
      } else {
        try {
          const feedbackResponse = await api.post<{ feedback: string }>(`/feedback/test-run`, {
            code: code,
            description: assignment?.description
          },
            { withCredentials: true }
          );
          setFeedback(feedbackResponse.data.feedback)
        } catch (e: unknown) {
          console.error(e);
          setFeedback('Oops...Checkmate AI is not available at the moment');
        }
      }
    } catch (e: unknown) {
      const error = e as AxiosError<ErrorResponse>;
      toast.error(error.response?.data.message || 'An error occurred during submission');
    } finally {
      setIsTestSubmissionSubmitting(false);
      setIsSubmitting(false);
      setFeedbackLoading(false);
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
        <div className="max-w-7xl mx-auto py-3 px-4">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-md font-bold">{assignment!.title}</h1>
              {solved && (
                <p className='text-md text-success font-bold'>
                  Solved
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="badge badge-lg gap-2">
                <Trophy size={15} />
                {assignment!.max_score} points
              </div>
              <div className="badge badge-lg gap-2">
                <Clock size={15} />
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
      <div className="max-w-7xl mx-auto py-3 px-4">
        <div className="mb-2">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <p className='text-red-400'>Be sure of your solution before submitting!!</p>
              <p className='text-sm'>{assignment!.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-7 space-y-2">
            {/* Editor Section */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Solution Editor</h2>
                <div className="h-[600px] w-full">
                  <Editor
                    width="100%"
                    height="100%"
                    defaultLanguage='python'
                    defaultValue={code}
                    onChange={handleEditorChange}
                    theme={theme === 'light' ? 'light' : 'vs-dark'}
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
                    className="bg-base-200 px-7 py-2 flex items-center gap-2"
                    onClick={() => handleSubmitSolution(true)}
                    disabled={isSubmitting || isTestSubmissionSubmitting}
                  >
                    {isTestSubmissionSubmitting ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      <>
                        <Play size={18} />
                        Run
                      </>
                    )}
                  </button>
                  <button
                    className="bg-base-200 px-7 py-2 text-success flex items-center gap-2"
                    onClick={() => handleSubmitSolution(false)}
                    disabled={isSubmitting || isTestSubmissionSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      <>
                        <CloudUpload size={18} />
                        Submit
                      </>
                    )}
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
                        {feedbackLoading ? (
                          <p>CheckMate AI is brewing a feedback masterpiece...</p>
                        ) : (
                          <p>Feedback from CheckMate AI will be displayed here. Stay tuned!</p>
                        )}
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
                  <div className="space-y-2">
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
              <div className="card bg-base-100 shadow-xl mb-2">
                <div className="card-body">
                  <div className="flex justify-between items-center mb-2">
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
                          <div
                            className={`collapse-title font-medium flex items-center gap-2
                              ${result.status === 'Accepted' ? 'text-success' : 'text-error'
                              }`}>
                            <p className={`${result.status === 'Accepted' ? 'text-success' : 'text-red-400'
                              }`}>
                              {result.status === 'Accepted' ? 'Accepted' : 'Failed'}
                            </p>
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
              <div className="card bg-base-100 shadow-xl mb-2">
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