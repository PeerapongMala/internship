import fetchWithAuth from '@global/utils/fetchWithAuth';
import {
  DataAPIRequest,
  DataAPIResponse,
  FailedAPIResponse,
  getQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import {
  AnnounceEventFilterQueryParams,
  AnnounceEventRepository,
} from '../../../../repository/announcement/event';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const RestAPIAnnounceEvent: AnnounceEventRepository = {
  Get: function (
    query: AnnounceEventFilterQueryParams = {},
  ): Promise<PaginationAPIResponse<AnnouceEvent>> {
    let url = `${BACKEND_URL}/gm-announcement/v1/event/announcement`;
    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<AnnouceEvent>) => {
        return res as PaginationAPIResponse<AnnouceEvent>;
      });
  },
  GetById: function (announceId: number): Promise<DataAPIResponse<AnnouceEvent>> {
    let url = `${BACKEND_URL}/gm-announcement/v1/event/announcement/${announceId}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<AnnouceEvent[]>) => {
        if (res.status_code == 200 && Array.isArray(res.data)) {
          return { ...res, data: res.data?.[0] };
        }
        return res as DataAPIResponse<AnnouceEvent>;
      });
  },
  Create: function (
    announce: DataAPIRequest<AnnouceEvent>,
  ): Promise<DataAPIResponse<undefined>> {
    let url = `${BACKEND_URL}/gm-announcement/v1/event/announcement`;
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
    announce: DataAPIRequest<AnnouceEvent>,
  ): Promise<DataAPIResponse<undefined>> {
    let url = `${BACKEND_URL}/gm-announcement/v1/event/announcement/${announceId}`;
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
    announces: Pick<AnnouceEvent, 'id' | 'status'>[],
  ): Promise<DataAPIResponse<undefined>> {
    let url = `${BACKEND_URL}/gm-announcement/v1/event/announcement/bulk-edit`;
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
    let url = `${BACKEND_URL}/gm-announcement/v1/event/announcement/download/csv`;
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
    let url = `${BACKEND_URL}/gm-announcement/v1/event/announcement/upload/csv`;
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

export default RestAPIAnnounceEvent;

function getAnnounceFormData(data: DataAPIRequest<AnnouceEvent>) {
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
    'arcade_game_id',
    'academic_year',
    'subject_id',
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
