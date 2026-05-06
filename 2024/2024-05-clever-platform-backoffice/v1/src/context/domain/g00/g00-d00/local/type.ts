// export interface AffiliationBase {
//     id: string | number;
//     name: string;
//     short_name: string;
//     created_at?: string;
//     created_by?: string;
//     updated_at?: string;
//     updated_by?: string;

import { TUserSubject } from '@global/types/user';

// }
export interface IPagination {
  page: number;
  limit: number;
  total_count: number;
}
export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  access_token: string;
  roles: number[];
}

export interface ICurriculum {
  id: number;
  name: string;
  short_name: string;
  status: string;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
}

export interface IUserData {
  id: string;
  title: string;
  first_name: string;
  last_name: string;
  school_id: string;
  school_name: string | null;
  school_code: string | null;
  school_image_url: string | null;
  image_url: string | null;
  access_token: string;
  roles: number[];
  teacher_roles: number[];
  is_subject_teacher: boolean;
  subject: TUserSubject[];
  academic_year: number | null;
}
