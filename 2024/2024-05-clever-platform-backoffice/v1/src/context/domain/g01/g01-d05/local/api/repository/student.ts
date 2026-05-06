import {
  BasePaginationAPIQueryParams,
  DataAPIRequest,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import { Student } from '../type';

export interface StudentFilterQueryParams extends BasePaginationAPIQueryParams {
  search?: string;
}

export interface StudentRepository {
  Get(
    schoolId: number,
    query: StudentFilterQueryParams,
  ): Promise<PaginationAPIResponse<Student>>;
  Create(classroomId: number, student_ids: string[]): Promise<DataAPIResponse<null>>;
  BulkEdit(
    classroomId: number,
    data: { student_id: string; action: 'add' | 'delete' }[],
  ): Promise<DataAPIResponse<undefined>>;
  GetClassroom(
    classroomId: number,
    query: StudentFilterQueryParams,
  ): Promise<PaginationAPIResponse<Student>>;
  DownloadCSVClassroom(
    classroomId: number,
    query: StudentFilterQueryParams,
  ): Promise<Blob>;
  Delete(classroomId: number, teacherId: string): Promise<DataAPIResponse<undefined>>;
  Move(classroomId: number, studentId: string): Promise<DataAPIResponse<undefined>>;
}
