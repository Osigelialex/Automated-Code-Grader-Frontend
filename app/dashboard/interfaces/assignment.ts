import { ICourse } from "./course";

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