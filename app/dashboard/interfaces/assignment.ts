import { ICourse } from "./course";

export interface ISubmissionResponse {
  submission_id: string;
  score: number;
  submission_result: [
    {
      output: string;
      time: string;
      status: string;
    }
  ]
}

export interface IAssignment {
  id: string;
  title: string;
  description: string;
  max_score: 100;
  programming_language: string;
  language_id: number;
  is_draft: boolean;
  created_at: string;
  updated_at: string;
}

export interface IAssignmentDetails {
  id: string;
  title: string;
  description: string;
  deadline: string;
  created_at: string;
  updated_at: string;
  max_score: number;
  programming_language: string;
  language_id: number;
  is_draft: boolean;
  course: ICourse;
  test_cases: [
    {
      input: string;
      output: string;
    }
  ]
}

export interface ITestCase {
  input: string;
  output: string;
}

export interface IProgress {
  code: string;
  solved: string;
}