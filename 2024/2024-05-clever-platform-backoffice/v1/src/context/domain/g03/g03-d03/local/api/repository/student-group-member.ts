import { BaseAPIResponse, PaginationAPIResponse } from '@global/utils/apiResponseHelper';
import {
  StudentGroupMember,
  StudentGroupMemberBulkEditRequest,
  StudentGroupMemberRequest,
} from '../group/student-group-member/type';

export interface StudentGroupMemberRepository {
  GetStudentGroupMember(
    query: StudentGroupMemberRequest,
  ): Promise<PaginationAPIResponse<StudentGroupMember>>;
  UpdateStudentGroupMember(
    param: StudentGroupMemberBulkEditRequest,
  ): Promise<BaseAPIResponse>;
}
