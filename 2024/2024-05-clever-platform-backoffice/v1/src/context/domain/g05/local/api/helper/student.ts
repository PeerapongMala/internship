import {
  TBasePaginationResponse,
  TBaseResponse,
  TPaginationReq,
} from '@domain/g06/g06-d02/local/types';
import { TStudent } from '../../types/student';

export type TGetStudentInFamilyReq = TPaginationReq & {};
export type TGetStudentInFamilyRes = TBasePaginationResponse<TStudent>;

export type TGetStudentInfoReq = { userId: string };
export type TGetStudentInfoRes = TBaseResponse<TStudent>;

export interface THomeworkStatus {
  status_name: string;
  count: number;
  total: number;
}

export interface TGetHomeworkStatusReq {
  student_id: string;
  class_id: string;
}

export interface TGetHomeworkStatusRes {
  status_code: number;
  data: THomeworkStatus[];
  message: string;
}

export interface THomework {
  homework_id: number;
  homework_name: string;
  subject_name: string;
  lesson: string;
  sub_lesson: string;
  assign_to: string;
  started_at: string;
  due_at: string;
  level_count: number;
  status: string;
}

export interface TGetHomeworksReq {
  student_id: string;
  class_id: string;
}

export interface TGetHomeworksRes {
  status_code: number;
  data: THomework[];
  message: string;
}
