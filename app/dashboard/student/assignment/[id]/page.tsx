'use client'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useParams } from 'next/navigation';
import { api } from '@/lib/axiosConfig';
import { AxiosError } from 'axios';
import { ErrorResponse } from '@/app/interfaces/errorInterface';
import { toast } from 'sonner';
import Loading from '@/app/loading';
import Image from 'next/image';
import Editor from '@monaco-editor/react';
import { ISubmissionResponse, IAssignmentDetails } from '@/app/dashboard/interfaces/assignment';
import { BrainCog, CloudUpload, Play, Trophy, Clock, Save, AlertCircle, LockIcon, Star, X } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function AssignmentDetailPage() {
  const [assignment, setAssignment] = useState<IAssignmentDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [feedbackId, setFeedbackId] = useState<string>('');
  const [feedbackLoading, setFeedbackLoading] = useState<boolean>(true);
  const [submissionResponse, setSubmissionResponse] = useState<ISubmissionResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isTestSubmissionSubmitting, setIsTestSubmissionSubmitting] = useState<boolean>(false);
  const [activeTestCase, setActiveTestCase] = useState<number>(0);
  const [solved, setSolved] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showSavedIndicator, setShowSavedIndicator] = useState<boolean>(false);
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);

  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<'visible' | 'all'>('visible');
  const { id } = useParams();
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Get storage key based on assignment ID
  const getStorageKey = useCallback(() => {
    return `assignment_code_${id}`;
  }, [id]);

  // Get rating status storage key
  const getRatingStorageKey = useCallback(() => {
    return `feedback_rated_${id}`;
  }, [id]);

  // Save code to localStorage
  const saveCodeToLocalStorage = useCallback(() => {
    if (!code || !id) {
      return;
    }

    try {
      localStorage.setItem(getStorageKey(), code);
      setLastSaved(new Date());
      setShowSavedIndicator(true);

      // Hide the indicator after 2 seconds
      setTimeout(() => {
        setShowSavedIndicator(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to save code to localStorage:', error);
    }
  }, [code, id, getStorageKey]);

  // Read code from localStorage
  const readCodeFromLocalStorage = useCallback((): string | null => {
    try {
      return localStorage.getItem(getStorageKey());
    } catch (error) {
      console.error('Failed to read code from localStorage:', error);
      return null;
    }
  }, [getStorageKey]);

  // Check if user has already rated this feedback
  const checkIfRated = useCallback((): boolean => {
    try {
      const rated = localStorage.getItem(getRatingStorageKey());
      return rated === 'true';
    } catch (error) {
      console.error('Failed to check rating status:', error);
      return false;
    }
  }, [getRatingStorageKey]);

  // Mark feedback as rated
  const markFeedbackAsRated = useCallback(() => {
    try {
      localStorage.setItem(getRatingStorageKey(), 'true');
    } catch (error) {
      console.error('Failed to save rating status:', error);
    }
  }, [getRatingStorageKey]);

  // Setup autosave timer
  useEffect(() => {
    // Clear any existing timer
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
    }

    // Set new autosave timer
    autoSaveTimerRef.current = setInterval(() => {
      if (code) {
        saveCodeToLocalStorage();
      }
    }, 7000);

    // Cleanup on unmount
    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [code, saveCodeToLocalStorage]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // First try to load code from localStorage
        const savedCode = readCodeFromLocalStorage();
        // Fetch assignment data
        const assignmentResponse = await api.get(`/assignments/${id}`);
        setAssignment(assignmentResponse.data);

        if (savedCode) {
          // Use code from localStorage if available
          setCode(savedCode);

          // Also fetch solved status
          const progressResponse = await api.get(`/assignments/${id}/progress`);
          if (progressResponse.data?.solved) {
            setSolved(progressResponse.data.solved);
          }
        } else {
          // If no localStorage code, fetch from API
          const progressResponse = await api.get(`/assignments/${id}/progress`);

          if (progressResponse.data?.code) {
            setCode(progressResponse.data.code);
          }

          if (progressResponse.data?.solved) {
            setSolved(progressResponse.data.solved);
          }
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
  }, [id, readCodeFromLocalStorage, checkIfRated]);

  function mapJudge0LanguageToMonaco(judge0Language: string): string {
    const languageMap: { [key: string]: string } = {
      "Assembly": "asm",
      "Bash": "shell",
      "Basic": "vb",
      "C": "c",
      "C++": "cpp",
      "C#": "csharp",
      "COBOL": "cobol",
      "Common Lisp": "lisp",
      "Dart": "dart",
      "D": "d",
      "Elixir": "elixir",
      "Erlang": "erlang",
      "F#": "fsharp",
      "Fortran": "fortran",
      "Go": "go",
      "Groovy": "groovy",
      "Haskell": "haskell",
      "JavaFX": "java",
      "Java": "java",
      "JavaScript": "javascript",
      "Kotlin": "kotlin",
      "Lua": "lua",
      "Objective-C": "objective-c",
      "OCaml": "ocaml",
      "Octave": "matlab",
      "Pascal": "pascal",
      "Perl": "perl",
      "PHP": "php",
      "Prolog": "prolog",
      "Python": "python",
      "R": "r",
      "Ruby": "ruby",
      "Rust": "rust",
      "Scala": "scala",
      "SQL": "sql",
      "Swift": "swift",
      "TypeScript": "typescript",
      "Visual Basic.Net": "vb"
    };

    if (!judge0Language) {
      return "plaintext";
    }

    const baseLanguage = judge0Language.split(" ")[0].trim();
    if (baseLanguage in languageMap) {
      return languageMap[baseLanguage];
    }

    return 'plaintext';
  }

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleSubmitSolution = async (is_test: boolean) => {
    if (code === '') {
      toast.error('Please write some code before submitting');
      return;
    }

    // Block submission if student already attempted
    if (!is_test && assignment?.student_attempted) {
      toast.error('You have already submitted this assignment');
      return;
    }

    // Save before submitting
    saveCodeToLocalStorage();

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

      // Update student_attempted state if this was a real submission
      if (!is_test) {
        setAssignment(prev => prev ? { ...prev, student_attempted: true } : null);
      }

      // Fetch personalized feedback from LLM
      if (is_test === false) {
        try {
          console.log("SUBMISSION DATA", response.data);
          const feedbackResponse = await api.post<{ id: string, feedback: string }>(
            `/submissions/${response.data.submission_id}/feedback`,
            {},
            { withCredentials: true }
          );
          setFeedback(feedbackResponse.data.feedback);
          setFeedbackId(feedbackResponse.data.id);
          setTimeout(() => {
            setShowRatingModal(true);
          }, 5000);
        } catch (e: unknown) {
          console.error(e);
          setFeedback('Oops...Checkmater AI is not available at the moment');
        }
      } else {
        try {
          const feedbackResponse = await api.post<{ feedback: string }>(`/feedback/test-run`, {
            code: code,
            description: assignment?.description
          },
            { withCredentials: true }
          );
          setFeedback(feedbackResponse.data.feedback);
        } catch (e: unknown) {
          console.error(e);
          setFeedback('Oops...Checkmater AI is not available at the moment');
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

  const handleRating = async (selectedRating: number) => {
    setRating(selectedRating);

    if (!feedbackId) {
      toast.error('Cannot rate feedback at this time');
      return;
    }

    try {
      await api.post(`/feedback/${feedbackId}/rate`, {
        rating: selectedRating
      });

      toast.success('Thank you for rating our feedback!');
      markFeedbackAsRated();
      setShowRatingModal(false);
    } catch (error) {
      toast.error('Failed to submit rating');
      console.error('Rating error:', error);
    }
  };

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

  const formatSavedTime = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
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
              {assignment!.student_attempted && !solved && (
                <div className="badge badge-warning gap-1">
                  <AlertCircle size={14} />
                  Submitted
                </div>
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

      {/* Submission Status Alert */}
      {assignment!.student_attempted && (
        <div className="max-w-7xl mx-auto mt-4 px-4">
          <div className="alert alert-info shadow-lg">
            <div className="flex items-center gap-3">
              <LockIcon className="h-6 w-6" />
              <div>
                <h3 className="font-bold">Submission Locked</h3>
                <div className="text-sm">You have already submitted this assignment. You can still view your code and run tests, but cannot submit again.</div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <div className="flex justify-between items-center">
                  <h2 className="card-title">Solution Editor</h2>
                  <div className={`flex items-center gap-1 text-xs transition-opacity duration-300 ${showSavedIndicator ? 'opacity-100' : 'opacity-0'}`}>
                    <Save size={14} className="text-success" />
                    <span className="text-success">Saved at {formatSavedTime(lastSaved)}</span>
                  </div>
                </div>
                <div className="h-[600px] w-full">
                  <Editor
                    width="100%"
                    height="100%"
                    defaultLanguage={mapJudge0LanguageToMonaco(assignment?.programming_language || 'plaintext')}
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
                      readOnly: assignment!.student_attempted ? true : false,
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
                    className={`px-7 py-2 flex items-center gap-2 ${assignment!.student_attempted ? 'bg-base-300 text-base-content/50' : 'bg-base-200 text-success'}`}
                    onClick={() => handleSubmitSolution(false)}
                    disabled={isSubmitting || isTestSubmissionSubmitting || assignment!.student_attempted === true}
                  >
                    {isSubmitting ? (
                      <span className="loading loading-spinner"></span>
                    ) : assignment!.student_attempted ? (
                      <>
                        <LockIcon size={18} />
                        Submitted
                      </>
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
                          <p>CheckMater AI is brewing a feedback masterpiece...</p>
                        ) : (
                          <p>Feedback from CheckMater AI will be displayed here. Stay tuned!</p>
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

      {/* Feedback Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowRatingModal(false)}
              className="absolute top-3 right-3 text-base-content/70 hover:text-base-content"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <h3 className="text-lg font-bold mb-2">How helpful was our AI feedback?</h3>
              <p className="text-base-content/70 text-sm">
                Your rating helps us improve the quality of our AI assistant.
              </p>
            </div>

            <div className="flex justify-center items-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  className="transition-all duration-200 hover:scale-110 focus:outline-none"
                >
                  <Star
                    size={36}
                    className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-base-content/30"}
                  />
                </button>
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowRatingModal(false)}
                className="btn btn-outline"
              >
                Skip
              </button>
              <button
                onClick={() => handleRating(rating)}
                className="btn btn-primary"
                disabled={rating === 0}
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}