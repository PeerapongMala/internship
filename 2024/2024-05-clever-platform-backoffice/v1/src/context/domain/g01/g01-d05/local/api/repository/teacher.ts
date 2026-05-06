import {
  BasePaginationAPIQueryParams,
  DataAPIRequest,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import { Teacher } from '../type';

export interface TeacherFilterQueryParams extends BasePaginationAPIQueryParams {
  search?: string;
}

export interface TeacherRepository {
  Get(
    schoolId: number,
    query: TeacherFilterQueryParams,
  ): Promise<PaginationAPIResponse<Teacher>>;
  Create(classroomId: number, teacher_ids: string[]): Promise<DataAPIResponse<null>>;
  BulkEdit(
    classroomId: number,
    data: { teacher_id: string; action: 'add' | 'delete' }[],
  ): Promise<DataAPIResponse<undefined>>;
  GetClassroom(
    classroomId: number,
    query: TeacherFilterQueryParams,
  ): Promise<PaginationAPIResponse<Teacher>>;
  DownloadCSVClassroom(
    classroomId: number,
    query: TeacherFilterQueryParams,
  ): Promise<Blob>;
  Delete(classroomId: number, teacherId: string): Promise<DataAPIResponse<undefined>>;
}
