import { ProgressTableRepository } from '@domain/g01/g01-d01/local/api/repository/progress-table';
import {
  BasePaginationAPIQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import {
  ProgressTableResponse,
  ProgressTableQuery,
} from '@domain/g01/g01-d01/local/api/group/progress-table/type';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const ProgressTableRestAPI: ProgressTableRepository = {
  GetListProgressTable: async function (
    query: BasePaginationAPIQueryParams & ProgressTableQuery,
  ): Promise<PaginationAPIResponse<ProgressTableResponse>> {
    const url = new URL(`${BACKEND_URL}/admin-report/v1/progress`);

    for (const [key, value] of Object.entries(query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value);
      }
    }

    const res = await fetchWithAuth(decodeURIComponent(url.toString()));
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.json();
  },
  DownloadCSVProgressTable: async function (query: ProgressTableQuery): Promise<Blob> {
    const { scope, parent_scope, start_date, end_date } = query;
    const url = `${BACKEND_URL}/admin-report/v1/progress/csv?scope=${scope}&parent_scope=${parent_scope}&start_date=${start_date}&end_date=${end_date}`;
    const res = await fetchWithAuth(`${url}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.blob();
  },
};

export default ProgressTableRestAPI;
