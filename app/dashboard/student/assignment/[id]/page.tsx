'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import { api } from '@/lib/axiosConfig';
import { AxiosError } from 'axios';
import { ErrorResponse } from '@/app/interfaces/errorInterface';
import { toast } from 'sonner';
import Loading from '@/app/loading';
import { IAssignmentDetails } from '@/app/dashboard/interfaces/assignment';
import Image from 'next/image';
import Editor from '@monaco-editor/react';

export default function AssignmentDetailPage() {
  const [assignment, setAssignment] = useState<IAssignmentDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string>('# Start coding here');
  const [feedback, setFeedback] = useState<string>('');
  const [isFeedbackLoading, setIsFeedbackLoading] = useState<boolean>(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchAssignmentData = async () => {
      setLoading(true);
  
      try {
        const response = await api.get(`/assignments/${id}`);
        setAssignment(response.data);
        setLoading(false);
      } catch (e: unknown) {
        const error = e as AxiosError<ErrorResponse>;
        toast.error(error.response?.data.message, { duration: 5000 });
        setError(error.response?.data.message || "Could not fetch assignment details");
      }
    }

    fetchAssignmentData();
  }, [id]);

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setCode(value);
    }
  };

  const handleGetFeedback = async () => {
    setIsFeedbackLoading(true);
    try {
      // Simulated feedback for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFeedback("Your code is shit!, Why don't u quit coding?");
    } catch (error) {
      console.log(error);
      toast.error("Failed to get feedback");
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  if (loading) {
    return <Loading />
  }

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
            <h1 className="text-xl font-bold">{assignment!.title}</h1>
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
          {/* Editor Section */}
          <div className="lg:col-span-7">
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
                    className="btn btn-outline"
                    onClick={handleGetFeedback}
                    disabled={isFeedbackLoading}
                  >
                    {isFeedbackLoading ? 
                      <span className="loading loading-spinner"></span> : 
                      'Get Feedback'
                    }
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      toast.success('Solution submitted successfully!');
                    }}
                  >
                    Submit Solution
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Panel */}
          <div className="lg:col-span-5">
            {/* Test Cases Section */}
            <div className="card bg-base-100 shadow-xl mb-6">
              <div className="card-body">
                <h2 className="card-title">Test Cases</h2>
                <div className="space-y-4">
                  {assignment!.test_cases.map((testCase, index) => (
                    <div
                      key={index}
                      className="card bg-base-200"
                    >
                      <div className="card-body p-4">
                        <div className="mb-3">
                          <h4 className="font-semibold mb-2">
                            Input:
                          </h4>
                          <pre className="bg-base-100 p-2 rounded-lg text-sm overflow-x-auto">
                            {testCase.input}
                          </pre>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">
                            Expected Output:
                          </h4>
                          <pre className="bg-base-100 p-2 rounded-lg text-sm overflow-x-auto">
                            {testCase.output}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feedback Section */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">AI Feedback</h2>
                {feedback ? (
                  <div className="prose">
                    <p>{feedback}</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-base-content/60">
                    <p>Click &quot;Get Feedback&quot; to receive AI-powered suggestions for your code.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}