import {
  BasePaginationAPIQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import {
  ProgressTableQuery,
  ProgressTableResponse,
} from '@domain/g01/g01-d01/local/api/group/progress-table/type.ts';

export interface ProgressTableRepository {
  GetListProgressTable(
    query: BasePaginationAPIQueryParams & ProgressTableQuery,
  ): Promise<PaginationAPIResponse<ProgressTableResponse>>;
  DownloadCSVProgressTable(query: ProgressTableQuery): Promise<Blob>;
}
