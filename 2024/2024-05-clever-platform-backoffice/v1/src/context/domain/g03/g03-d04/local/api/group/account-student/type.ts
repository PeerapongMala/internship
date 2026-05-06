import { BasePaginationAPIQueryParams } from '@global/utils/apiResponseHelper.ts';

interface DefaultName {
  title: string;
  first_name: string;
  last_name: string;
}

interface AccountStudent extends DefaultName {
  id: string;
  student_id: string;
  email: string;
}

interface DataResponse {
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
}

interface AuthOauthEntity {
  provider: string | null;
  user_id: string | null;
  subject_id: string | null;
}

export interface AccountStudentResponse extends AccountStudent {
  last_login: string | null;
}

export interface AccountStudentRequest extends BasePaginationAPIQueryParams {
  academic_year?: string;
  school_id?: string;
  year?: string;
  class_name?: string;
  search?: string;
  class_id?: number;
  subject_id?: number;
}

export interface AccountStudentProfileResponse extends AccountStudent, DataResponse {
  password?: string;
  id_number: string;
  image_url: string;
  status: string;
  last_login: string | null;
  school_id: number;
  year: string;
  birth_date: string;
  nationality: string;
  ethnicity: string;
  religion: string;
  father_title: string;
  father_first_name: string;
  father_last_name: string;
  mother_title: string;
  mother_first_name: string;
  mother_last_name: string;
  parent_relationship: string | null;
  parent_title: string | null;
  parent_first_name: string | null;
  parent_last_name: string | null;
  house_number: string;
  moo: string;
  district: string;
  sub_district: string;
  province: string;
  post_code: string;
  parent_marital_status: string;
  profile_image: string;
  oauth: AuthOauthEntity[];
}

interface OAuthProvider {
  provider: string;
  subject_id: string;
}

export interface AccountStudentOAuthResponse extends DataResponse {
  oauth_list: OAuthProvider[];
  status: string;
}

export interface PlayingHistoryResponse extends DataResponse {
  id: number;
  academic_year: number;
  year: string;
  name: string;
}

export interface FamilyResponse extends DefaultName {
  family_id: string;
  user_id: string;
  title: string;
  first_name: string;
  last_name: string;
  is_owner: boolean;
}
