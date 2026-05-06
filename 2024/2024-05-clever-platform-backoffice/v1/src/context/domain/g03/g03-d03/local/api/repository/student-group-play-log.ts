import {
  BasePaginationAPIQueryParams,
  DataAPIResponse,
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import { StudentGroupPlayLog } from '../../type';

export interface StudentGroupPlayLogFilterQueryParams
  extends BasePaginationAPIQueryParams {
  academic_year: string;
  start_date?: string;
  end_date?: string;
  search?: string;
}

export interface StudentGroupPlayLogRepository {
  Get(
    studentGroupId: number,
    query: StudentGroupPlayLogFilterQueryParams,
  ): Promise<DataAPIResponse<StudentGroupPlayLog[]>>;
  DownloadCSV(
    studyGroupId: number,
    query: StudentGroupPlayLogFilterQueryParams,
  ): Promise<Blob | FailedAPIResponse>;
}
