import {
  IAddManageYear,
  IDownloadCsvFilter,
  IManageYear,
  IUpdateManageYear,
} from '../../type';
import {
  BasePaginationAPIQueryParams,
  DataAPIRequest,
  DataAPIResponse,
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';

export interface ManageYearRepository {
  GetAll(
    platformId: number,
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<IManageYear>>;
  GetById(yearId: number): Promise<DataAPIResponse<IManageYear>>;
  Create(data: DataAPIRequest<IManageYear>): Promise<DataAPIResponse<IManageYear>>;
  Update(
    id: number,
    data: DataAPIRequest<IManageYear>,
  ): Promise<DataAPIResponse<IManageYear>>;
  DownloadCsv(
    platformId: number,
    filter: IDownloadCsvFilter,
  ): Promise<void | FailedAPIResponse>;
  UploadCsv(
    platformId: number,
    file: File | null,
  ): Promise<DataAPIResponse<IManageYear[]>>;
  BulkEdit(
    years: Pick<IManageYear, 'id' | 'status'>[],
    admin_login_as?: IManageYear['admin_login_as'],
  ): Promise<DataAPIResponse<undefined>>;
}
