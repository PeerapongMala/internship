import { BaseAPIResponse, PaginationAPIResponse } from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { StudentGroupMemberRepository } from '../../../repository/student-group-member';
import {
  StudentGroupMember,
  StudentGroupMemberBulkEditRequest,
  StudentGroupMemberRequest,
} from '../type';

const backendUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const StudentGroupMemberRestAPI: StudentGroupMemberRepository = {
  GetStudentGroupMember: async function (
    query: StudentGroupMemberRequest,
  ): Promise<PaginationAPIResponse<StudentGroupMember>> {
    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([_, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    let url = `${backendUrl}/teacher-student-group/v1/student-group/member/student_group/${query?.student_group_id}/?${params.toString()}`;

    const res = await fetchWithAuth(url);
    if (!res.ok) throw new Error(`Failed to fetch StudentStatList: ${res.statusText}`);
    return res.json();
  },
  UpdateStudentGroupMember: async function (
    params: StudentGroupMemberBulkEditRequest,
  ): Promise<BaseAPIResponse> {
    const url = `${backendUrl}/teacher-student-group/v1/student-group/member/study_group/${params.student_group_id}/bulk-edit`;
    const res = await fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bulk_edit_list: params.bulk_edit_list }),
    });
    return res.json();
  },
};

export default StudentGroupMemberRestAPI;
