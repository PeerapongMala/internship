import fetchWithAuth from '@global/utils/fetchWithAuth';
import {
  DataAPIRequest,
  DataAPIResponse,
  FailedAPIResponse,
  getQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import {
  AnnounceGlobalFilterQueryParams,
  AnnounceGlobalRepository,
} from '../../../../repository/announcement/global';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const RestAPIAnnounceGlobal: AnnounceGlobalRepository = {
  Get: function (
    query: AnnounceGlobalFilterQueryParams = {},
  ): Promise<PaginationAPIResponse<AnnouceSystem>> {
    let url = `${BACKEND_URL}/gm-announcement/v1/global/announcement`;
    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<AnnouceSystem>) => {
        return res as PaginationAPIResponse<AnnouceSystem>;
      });
  },
  GetById: function (announceId: number): Promise<DataAPIResponse<AnnouceSystem>> {
    let url = `${BACKEND_URL}/gm-announcement/v1/global/announcement/${announceId}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<AnnouceSystem[]>) => {
        if (res.status_code == 200 && Array.isArray(res.data)) {
          return { ...res, data: res.data?.[0] };
        }
        return res as DataAPIResponse<AnnouceSystem>;
      });
  },
  Create: function (
    announce: DataAPIRequest<AnnouceSystem>,
  ): Promise<DataAPIResponse<undefined>> {
    let url = `${BACKEND_URL}/gm-announcement/v1/global/announcement`;
    const formData = getAnnounceFormData(announce);
    return fetchWithAuth(url, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<undefined>) => {
        return res;
      });
  },
  Update: function (
    announceId: number,
    announce: DataAPIRequest<AnnouceSystem>,
  ): Promise<DataAPIResponse<undefined>> {
    let url = `${BACKEND_URL}/gm-announcement/v1/global/announcement/${announceId}`;
    const formData = getAnnounceFormData(announce);
    return fetchWithAuth(url, {
      method: 'PATCH',
      body: formData,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<undefined>) => {
        return res;
      });
  },
  BulkEdit: function (
    announces: Pick<AnnouceSystem, 'id' | 'status'>[],
  ): Promise<DataAPIResponse<undefined>> {
    let url = `${BACKEND_URL}/gm-announcement/v1/global/announcement/bulk-edit`;
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(announces),
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
  DownloadCSV: function (query: {
    start_date: string;
    end_date: string;
  }): Promise<Blob | FailedAPIResponse> {
    let url = `${BACKEND_URL}/gm-announcement/v1/global/announcement/download/csv`;
    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString()).then((res) => {
      if (res.status == 200) {
        return res.blob();
      } else {
        return res.json();
      }
    });
  },
  UploadCSV: function (file: File): Promise<DataAPIResponse<undefined>> {
    let url = `${BACKEND_URL}/gm-announcement/v1/global/announcement/upload/csv`;
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
};

export default RestAPIAnnounceGlobal;

function getAnnounceFormData(data: DataAPIRequest<AnnouceSystem>) {
  const formData = new FormData();
  const keys = [
    'school_id',
    'scope',
    'type',
    'started_at',
    'ended_at',
    'title',
    'description',
    'announcement_image',
    'status',
  ] as const;

  for (let key of keys) {
    if (data[key] != undefined) {
      if (typeof data[key] == 'object') {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key].toString());
      }
    }
  }
  return formData;
}
