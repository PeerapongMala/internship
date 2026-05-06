import fetchWithAuth from '@global/utils/fetchWithAuth';
import {
  BaseAPIResponse,
  DataAPIRequest,
  DataAPIResponse,
  FailedAPIResponse,
  getQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import {
  AnnounceRewardFilterQueryParams,
  AnnounceRewardRepository,
} from '../../../../repository/announcement/reward';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const RestAPIAnnounceReward: AnnounceRewardRepository = {
  Get: function (
    query: AnnounceRewardFilterQueryParams = {},
  ): Promise<PaginationAPIResponse<AnnouceReward>> {
    let url = `${BACKEND_URL}/gm-announcement/v1/reward/announcement`;
    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<AnnouceReward>) => {
        return res as PaginationAPIResponse<AnnouceReward>;
      });
  },
  GetById: function (announceId: number): Promise<DataAPIResponse<AnnouceReward>> {
    let url = `${BACKEND_URL}/gm-announcement/v1/reward/announcement/${announceId}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<AnnouceReward[]>) => {
        if (res.status_code == 200 && Array.isArray(res.data)) {
          return { ...res, data: res.data?.[0] };
        }
        return res as DataAPIResponse<AnnouceReward>;
      });
  },
  Create: function (
    announce: DataAPIRequest<AnnouceReward>,
  ): Promise<DataAPIResponse<undefined>> {
    let url = `${BACKEND_URL}/gm-announcement/v1/reward/announcement`;
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
    announce: DataAPIRequest<AnnouceRewardUpdate>,
  ): Promise<DataAPIResponse<undefined>> {
    let url = `${BACKEND_URL}/gm-announcement/v1/reward/announcement/${announceId}`;
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
    announces: Pick<AnnouceReward, 'id' | 'status'>[],
  ): Promise<DataAPIResponse<undefined>> {
    let url = `${BACKEND_URL}/gm-announcement/v1/reward/announcement/bulk-edit`;
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
    let url = `${BACKEND_URL}/gm-announcement/v1/reward/announcement/download/csv`;
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
    let url = `${BACKEND_URL}/gm-announcement/v1/reward/announcement/upload/csv`;
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
  DeleteItem: function (
    announceId: AnnouceReward['id'],
    itemId: AnnounceRewardItem['item_id'],
  ): Promise<BaseAPIResponse> {
    let url = `${BACKEND_URL}/gm-announcement/v1/reward/announcement/${announceId}/item/${itemId}`;

    return fetchWithAuth(url, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
  DeleteCoin: function (
    announceId: AnnouceReward['id'],
    coin_type: string,
  ): Promise<BaseAPIResponse> {
    let url = `${BACKEND_URL}/gm-announcement/v1/reward/announcement/${announceId}/coin?coin_type=${coin_type}`;

    return fetchWithAuth(url, {
      method: 'PATCH',
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
};

export default RestAPIAnnounceReward;

function getAnnounceFormData(data: DataAPIRequest<AnnouceRewardUpdate>) {
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
    'academic_year',
    'subject_id',
    'gold_coin',
    'arcade_coin',
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

  for (let [index, item] of Object.entries(data.item_list ?? [])) {
    if (item.item_id !== undefined && item.amount !== undefined) {
      formData.append(`item_list[${index}][item_id]`, item.item_id.toString());
      formData.append(`item_list[${index}][amount]`, item.amount.toString());
      if (item.expired_at)
        formData.append(`item_list[${index}][expired_at]`, item.expired_at);
    }
  }
  return formData;
}
