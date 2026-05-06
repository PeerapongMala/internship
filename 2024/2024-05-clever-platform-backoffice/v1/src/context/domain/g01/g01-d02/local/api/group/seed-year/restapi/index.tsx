import { SeedYear } from '@domain/g01/g01-d02/local/type';
import {
  PaginationAPIResponse,
  DataAPIResponse,
  FailedAPIResponse,
  BaseAPIResponse,
  DataAPIRequest,
  getQueryParams,
} from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import {
  SeedYearFilterQueryParams,
  SeedYearRepository,
} from '../../../repository/seed-year';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const SeedYearRestAPI: SeedYearRepository = {
  BulkEdit: function (
    bulk_edit_list: {
      seed_year_id: SeedYear['id'];
      status: SeedYear['status'];
    }[],
  ): Promise<
    DataAPIResponse<{ seed_year_id: SeedYear['id']; status: SeedYear['status'] }[]>
  > {
    let url = `${BACKEND_URL}/school-affiliations/v1/seed-years/bulk-edit`;
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ bulk_edit_list }),
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
  Get: function (
    query: SeedYearFilterQueryParams = {},
  ): Promise<PaginationAPIResponse<SeedYear>> {
    let url = `${BACKEND_URL}/school-affiliations/v1/seed-years`;
    const params = getQueryParams(query);

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
  DownloadCSV: function (
    query: {
      start_date?: string;
      end_date?: string;
    } = {},
  ): Promise<Blob | FailedAPIResponse> {
    let url = `${BACKEND_URL}/school-affiliations/v1/seed-years/download/csv`;
    const params = getQueryParams(query);

    return fetchWithAuth(url + '?' + params.toString()).then((res) => {
      if (res.status == 200) {
        return res.blob();
      } else {
        return res.json();
      }
    });
  },
  UploadCSV: function (file: File): Promise<BaseAPIResponse> {
    let url = `${BACKEND_URL}/school-affiliations/v1/seed-years/upload/csv`;

    const formData = new FormData();
    formData.append('csv_file', file);

    return fetchWithAuth(url, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
  Update: function (
    seedYearId: SeedYear['id'],
    data: DataAPIRequest<SeedYear>,
  ): Promise<DataAPIResponse<SeedYear>> {
    let url = `${BACKEND_URL}/school-affiliations/v1/seed-years/${seedYearId}`;
    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<SeedYear[]>) => {
        if (res.status_code === 200 && Array.isArray(res.data))
          return { ...res, data: res.data?.at(0) } as DataAPIResponse<SeedYear>;
        return res as DataAPIResponse<SeedYear>;
      });
  },
  Create: function (data: DataAPIRequest<SeedYear>): Promise<DataAPIResponse<SeedYear>> {
    let url = `${BACKEND_URL}/school-affiliations/v1/seed-years`;
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<SeedYear[]>) => {
        if (res.status_code === 200 && Array.isArray(res.data))
          return { ...res, data: res.data?.at(0) } as DataAPIResponse<SeedYear>;
        return res as DataAPIResponse<SeedYear>;
      });
  },
  GetById: function (seedYearId: SeedYear['id']): Promise<DataAPIResponse<SeedYear>> {
    let url = `${BACKEND_URL}/school-affiliations/v1/seed-years/${seedYearId}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<SeedYear[]>) => {
        if (res.status_code === 200 && Array.isArray(res.data))
          return { ...res, data: res.data?.at(0) } as DataAPIResponse<SeedYear>;
        return res as DataAPIResponse<SeedYear>;
      });
  },
};

export default SeedYearRestAPI;
