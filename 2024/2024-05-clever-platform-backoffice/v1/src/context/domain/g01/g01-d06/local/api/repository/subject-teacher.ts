import { AcademicYear, SchoolTeacher, SubjectTeacher } from './../../type';
import {
  BasePaginationAPIQueryParams,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import { CreateSubjectTeacher, Subject } from '../../type';
import { DataAPIRequest, BaseAPIResponse } from '../helper';

export interface SubjectFilterQueryParams extends BasePaginationAPIQueryParams {
  id?: string;
  name?: string;
  curriculum_group?: string;
  year?: string;
  contract_name?: string;
  contract_status?: string;
}

export interface TeacherFilterQueryParams extends BasePaginationAPIQueryParams {
  id?: string;
  academic_year?: string;
  title?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface SubjectTeacherRepository {
  Create(data: DataAPIRequest<CreateSubjectTeacher>): Promise<BaseAPIResponse>;
  GetSubjects(
    schoolId: number,
    query: SubjectFilterQueryParams,
  ): Promise<PaginationAPIResponse<Subject>>;
  Get(
    school_id: number,
    subject_id: number,
    query: TeacherFilterQueryParams,
  ): Promise<PaginationAPIResponse<SubjectTeacher>>;
  GetAcademicYears(school_Id: number): Promise<DataAPIResponse<AcademicYear[]>>;
  BulkEdit(
    subject_id: number,
    data: { teacher_id: string; academic_year: number }[],
  ): Promise<DataAPIResponse<undefined>>;
  GetById(subject_id: Subject['id']): Promise<DataAPIResponse<Subject>>;
  GetTeachers(
    schoolId: number,
    query: TeacherFilterQueryParams,
  ): Promise<PaginationAPIResponse<SchoolTeacher>>;
}
