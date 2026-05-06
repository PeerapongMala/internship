import { BasePaginationAPIQueryParams } from '@global/utils/apiResponseHelper.ts';

export interface FamilyListResponse {
  family_id: number;
  user_id: string;
  first_name: string;
  last_name: string;
  line_id: string | null;
  member_count: number;
  status: 'enabled' | 'disabled' | 'draft';
  created_at: string; // ISO timestamp format
  is_owner: boolean;
  id?: number;
}

export interface FamilyMemberResponse {
  family_id: number;
  user_id: string;
  title: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

export interface FamilyMemberListByParentResponse extends FamilyMemberResponse {
  line_id: string | null;
}

export interface FamilyMemberListByStudentResponse extends FamilyMemberResponse {
  school: string;
}

export interface ParamsDownloadCsv extends BasePaginationAPIQueryParams {
  start_date?: string;
  end_date?: string;
}

export interface ParamsBulkEdit {
  id: number;
  status: string;
}
export interface ParamsSaveAdminFamily {
  users: {
    user_id: string;
    is_owner: boolean;
  }[];
  status: string;
}

export interface ParamsFamilyMemberListByParent {
  user_id?: string;
}

export interface ParamsBulkEditMemberListByParent {
  users: string[];
}

export interface ParamsFamilyMemberListByStudent {
  school_name?: string;
}

export interface ParamsStudentList {
  search?: string;
  school_id?: number;
  academic_year?: number;
  year?: string;
  class_name?: number;
  year_index?: number;
}

export interface DropdownSchoolListResponse {
  school_id: number;
  school_name: string;
}

export interface DropdownYearListRequest {
  school_id: number;
  academic_year: number;
}

export interface DropdownClassListRequest {
  school_id: number;
  academic_year: number;
  year: string;
}

export interface DropdownClassListResponse {
  class_id: number;
  class_name: string;
}
