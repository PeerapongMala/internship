import {
  BasePaginationAPIQueryParams,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import {
  GroupUnlock,
  Level,
  StudentUnlock,
  UnlockedGroup,
  ClassResponse,
  ClassPaginationResponse,
  StudentUnlockResponse,
} from '../../type';

export interface StudentUnlockPaginationResponse {
  _pagination: {
    page: number;
    limit: number;
    total_count: number;
  };
  data: StudentUnlock[];
}
export interface UnlockedGroupPaginationResponse {
  _pagination: {
    page: number;
    limit: number;
    total_count: number;
  };
  data: UnlockedGroup[];
}
export interface FilterQueryParams extends BasePaginationAPIQueryParams {
  [key: string]: any;
  classId?: string;
  levelId?: number;
}
export interface CreateStudyGroup {
  study_group_ids?: number[];
}
export interface DeleteStudy {
  student_ids?: string[];
}
export interface CreateStudent {
  class_id?: number;
  student_ids?: string[];
}

export interface ExtraRepository {
  CreateUnlockStudyGroupA26(
    classId: string,
    lessonId: string,
    query: CreateStudyGroup,
  ): Promise<DataAPIResponse<UnlockedGroup>>;
  GetsUnlockStudyGroupA27(
    classId: string,
    lessonId: string,
    query: FilterQueryParams,
  ): Promise<UnlockedGroupPaginationResponse>;
  CreateUnlockStudentA29(
    lessonId: number,
    query: CreateStudent,
  ): Promise<DataAPIResponse<any>>;
  GetsUnlockStudentA30(
    classId: string,
    lessonId: string,
    query: FilterQueryParams,
  ): Promise<StudentUnlockPaginationResponse>;
  DeleteStudyGroupA28(
    classId: string,
    lessonId: string,
    query: CreateStudyGroup,
  ): Promise<DataAPIResponse<UnlockedGroup>>;
  DeleteStudentA31(
    classId: string,
    lessonId: string,
    query: DeleteStudy,
  ): Promise<DataAPIResponse<any>>;
}
