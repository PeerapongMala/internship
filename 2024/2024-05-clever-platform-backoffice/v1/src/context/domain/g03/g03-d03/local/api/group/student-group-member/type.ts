import { BasePaginationAPIQueryParams } from '@global/utils/apiResponseHelper';

export interface StudentGroupMember {
  id: number;
  academic_year: number;
  year: string;
  room: number;
  student_id: string;
  first_name: string;
  last_name: string;
  latest_login_at: string;
  is_member: boolean;
  student_last_login: string;
  title: string;
  student_user_uuid: string;
  study_groups: {
    id: number;
    name: string;
  }[];
}

export interface StudentGroupMemberRequest extends BasePaginationAPIQueryParams {
  student_group_id?: number;
  search?: string;
}

export interface StudentGroupMemberBulkEditRequest {
  student_group_id?: number;
  bulk_edit_list: { student_user_uuid: string; is_member: boolean }[];
}
