export interface ICourse {
  id: string;
  title: string;
  description: string;
  course_code: string;
  course_units: number;
  lecturer?: {
    first_name: string;
    last_name: string;
    email: string;
    department: string;
  };
  course_join_code: string;
}

export interface IPaginatedCourseList {
  count: number;
  next: string | null;
  previous: string | null;
  results: ICourse[] | [];
}