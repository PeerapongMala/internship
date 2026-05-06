import {
  BaseAPIResponse,
  BasePaginationAPIQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import { RecordStatus, StudentGroup } from '../../type';

export interface StudentGroupFilterQueryParams extends BasePaginationAPIQueryParams {
  subject_id?: number;
  study_group_name?: string;
  year?: string;
}

export interface StudentGroupRepository {
  Get(
    schoolId: number,
    query?: StudentGroupFilterQueryParams,
  ): Promise<PaginationAPIResponse<StudentGroup>>;
  BulkEdit(students: { id: number; status: RecordStatus }[]): Promise<BaseAPIResponse>;
}
