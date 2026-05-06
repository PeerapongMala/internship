import {
  IDownloadCsvFilter,
  IManageYear,
  IUpdateManageYear,
} from '@domain/g02/g02-d02/local/type';
import { ManageYearRepository } from '../../../repository/manage-year';
import {
  DataAPIRequest,
  DataAPIResponse,
  FailedAPIResponse,
  getQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import downloadCSV from '@global/utils/downloadCSV';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const ManageYearRestAPI: ManageYearRepository = {
  GetAll: function (
    platformId: number,
    query,
  ): Promise<PaginationAPIResponse<IManageYear>> {
    const url = `${BACKEND_URL}/academic-courses/v1/${platformId}/years`;

    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<IManageYear>) => {
        return res;
      });
  },
  GetById: function (yearId: number): Promise<DataAPIResponse<IManageYear>> {
    const url = `${BACKEND_URL}/academic-courses/v1/years/${yearId}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<IManageYear[]>) => {
        if (res.status_code === 200 && Array.isArray(res.data))
          return { ...res, data: res.data?.[0] } as DataAPIResponse<IManageYear>;
        return res as DataAPIResponse<IManageYear>;
      });
  },
  Create: function (
    data: DataAPIRequest<IManageYear>,
  ): Promise<DataAPIResponse<IManageYear>> {
    const url = `${BACKEND_URL}/academic-courses/v1/years`;
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<IManageYear[]>) => {
        if (
          (res.status_code === 201 || res.status_code == 200) &&
          Array.isArray(res.data)
        )
          return { ...res, data: res.data?.[0] } as DataAPIResponse<IManageYear>;
        return res as DataAPIResponse<IManageYear>;
      });
  },
  Update: function (
    id: number,
    data: DataAPIRequest<IManageYear>,
  ): Promise<DataAPIResponse<IManageYear>> {
    const url = `${BACKEND_URL}/academic-courses/v1/years/${id}`;
    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<IManageYear[]>) => {
        if (
          (res.status_code === 201 || res.status_code == 200) &&
          Array.isArray(res.data)
        )
          return { ...res, data: res.data?.[0] } as DataAPIResponse<IManageYear>;
        return res as DataAPIResponse<IManageYear>;
      });
  },
  DownloadCsv: function (
    platformId: number,
    filter: IDownloadCsvFilter,
  ): Promise<void | FailedAPIResponse> {
    const url = `${BACKEND_URL}/academic-courses/v1/${platformId}/years/download/csv`;

    const params = getQueryParams(filter);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => {
        if (res.status === 200) {
          return res.blob();
        } else {
          return res.json();
        }
      })
      .then((res) => {
        // check if res is a blob
        if (res instanceof Blob) {
          downloadCSV(res, 'year.csv');
        } else {
          return res as FailedAPIResponse;
        }
      });
  },
  UploadCsv: function (
    platformId: number,
    file: File | null,
  ): Promise<DataAPIResponse<IManageYear[]>> {
    const url = `${BACKEND_URL}/academic-courses/v1/${platformId}/years/upload/csv`;

    const formData = new FormData();
    formData.append('csv_file', file!);

    return fetchWithAuth(url, {
      method: 'POST',
      body: formData,
    })
      .then((res) => {
        return res.json();
      })
      .then((res: DataAPIResponse<IManageYear[]>) => {
        return res;
      });
  },
  BulkEdit: function (
    years: Pick<IManageYear, 'id' | 'status'>[],
    admin_login_as: IManageYear['admin_login_as'],
  ): Promise<DataAPIResponse<undefined>> {
    const url = `${BACKEND_URL}/academic-courses/v1/years/bulk-edit`;

    const data = {
      bulk_edit_list: years.map((year) => ({
        year_id: year.id,
        status: year.status,
      })),
      admin_login_as,
    };

    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<undefined>) => {
        return res;
      });
  },
};

export default ManageYearRestAPI;
