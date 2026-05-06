import {
  BasePaginationAPIQueryParams,
  DataAPIRequest,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import { Classroom, TMoveStudentCsvReq } from '../type';
import { AxiosResponse } from 'axios';
import { TBaseResponse } from '@global/types/api';

export interface ClassroomFilterQueryParams extends BasePaginationAPIQueryParams {
  search?: string;
  status?: string;
  year?: string;
  academic_year?: number;
  start_updated_at?: string;
  end_updated_at?: string;
}

export interface ClassroomRepository {
  Create(classroom: DataAPIRequest<Classroom>): Promise<DataAPIResponse<Classroom>>;
  Update(
    id: number,
    classroom: DataAPIRequest<Classroom>,
  ): Promise<DataAPIResponse<Classroom>>;
  Get(
    schoolId: number,
    query: ClassroomFilterQueryParams,
  ): Promise<PaginationAPIResponse<Classroom>>;
  BulkEdit(
    schoolId: number,
    classrooms: DataAPIRequest<Classroom>[],
  ): Promise<DataAPIResponse<Classroom[]>>;
  DownloadCSV(schoolId: number, query: ClassroomFilterQueryParams): Promise<Blob>;
  UploadCSV(
    schoolId: number,
    file: File,
    query: ClassroomFilterQueryParams,
  ): Promise<DataAPIResponse<Classroom>>;
  GetById(id: number): Promise<DataAPIResponse<Classroom>>;
  GetAcademicYears(schoolId: number): Promise<DataAPIResponse<number[]>>;
  GetYears(schoolId: number): Promise<DataAPIResponse<string[]>>;
  Clone(
    id: number,
    classroom: DataAPIRequest<Classroom>,
  ): Promise<DataAPIResponse<Classroom>>;
  MoveStudentCSV: (
    schoolID: string,
    body: TMoveStudentCsvReq,
    onError?: (error: unknown) => void,
  ) => Promise<AxiosResponse<TBaseResponse>>;
}
