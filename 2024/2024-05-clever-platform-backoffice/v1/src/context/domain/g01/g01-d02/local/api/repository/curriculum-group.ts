import {
  BaseAPIResponse,
  BasePaginationAPIQueryParams,
  DataAPIRequest,
  DataAPIResponse,
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import { CurriculumGroup } from '../../type';

export interface CurriculumGroupFilterQueryParams extends BasePaginationAPIQueryParams {
  id?: CurriculumGroup['id'];
  name?: CurriculumGroup['name'];
  short_name?: CurriculumGroup['short_name'];
}

export interface CurriculumGroupRepository {
  Get(
    query?: CurriculumGroupFilterQueryParams,
  ): Promise<PaginationAPIResponse<CurriculumGroup>>;
  BulkEdit(
    bulk_edit_list: {
      curriculum_group_id: CurriculumGroup['id'];
      status: CurriculumGroup['status'];
    }[],
  ): Promise<
    DataAPIResponse<
      { curriculum_group_id: CurriculumGroup['id']; status: CurriculumGroup['status'] }[]
    >
  >;
  DownloadCSV(query?: {
    start_date?: string;
    end_date?: string;
  }): Promise<Blob | FailedAPIResponse>;
  UploadCSV(file: File): Promise<BaseAPIResponse>;
  Update(
    curriculumGrouopId: CurriculumGroup['id'],
    data: DataAPIRequest<CurriculumGroup>,
  ): Promise<DataAPIResponse<CurriculumGroup>>;
  Create(
    data: DataAPIRequest<CurriculumGroup>,
  ): Promise<DataAPIResponse<CurriculumGroup>>;
  GetById(
    curriculumGrouopId: CurriculumGroup['id'],
  ): Promise<DataAPIResponse<CurriculumGroup>>;
}
