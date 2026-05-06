import { TBasePaginationResponse, TPaginationReq } from '../../types';
import { TTeacherUser } from '../../types/admin';

export type TTeacherListGetReq = TPaginationReq & {
  schoolID: string;
  search: string;
  grade_subject_id?: number;
  teacher_access?: number;
};
export type TTeacherListGetRes = TBasePaginationResponse<TTeacherUser>;
