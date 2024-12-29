export interface IProfile {
  email: string;
  first_name: string;
  last_name: string;
  matric: string;
  level: number;
  lecturer_details?: {
    staff_id: string;
  };
}