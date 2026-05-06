import {
  BaseAPIResponse,
  DataAPIRequest,
  DataAPIResponse,
  FailedAPIResponse,
  getQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { StoreItemQueryParams, StoreItemRepository } from '../../../repository/store';
import { StoreItem } from '../../../type';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const StoreItemRestAPI: StoreItemRepository = {
  Get: function (
    subjectId: number,
    query: StoreItemQueryParams = {},
  ): Promise<PaginationAPIResponse<StoreItem>> {
    let url = `${BACKEND_URL}/teacher-shop/v1/teacher/shop/subject_id/${subjectId}`;
    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res) => {
        if (res.status_code == 200) {
          res.data = res.data || [];
        }
        return res || [];
      });
  },
  Create: function (
    subjectId: number,
    item: DataAPIRequest<StoreItem>,
  ): Promise<DataAPIResponse<StoreItem>> {
    let url = `${BACKEND_URL}/teacher-shop/v1/teacher/shop`;
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        ...item,
        stock: item.initial_stock,
        subject_id: subjectId,
      }),
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<StoreItem[]>) => {
        if (res.status_code === 201 && Array.isArray(res.data))
          return { ...res, data: res.data?.[0] } as DataAPIResponse<StoreItem>;
        return res as DataAPIResponse<StoreItem>;
      });
  },
  Update: function (
    subjectId: number,
    store_id: StoreItem['id'],
    store: DataAPIRequest<StoreItem>,
  ): Promise<DataAPIResponse<StoreItem>> {
    let url = `${BACKEND_URL}/teacher-shop/v1/teacher/shop/store_item_id/${store_id}`;
    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        ...store,
        subject_id: subjectId,
      }),
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<StoreItem[]>) => {
        if (res.status_code === 201 && Array.isArray(res.data))
          return { ...res, data: res.data?.[0] } as DataAPIResponse<StoreItem>;
        return res as DataAPIResponse<StoreItem>;
      });
  },
  GetById: function (
    subjectId: number,
    store_id: StoreItem['id'],
  ): Promise<DataAPIResponse<StoreItem>> {
    let url = `${BACKEND_URL}/teacher-shop/v1/teacher/shop/subject_id/${subjectId}/store_item_id/${store_id}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<StoreItem[]>) => {
        if (res.status_code == 200 && Array.isArray(res.data)) {
          return { ...res, data: res.data?.[0] };
        }
        return res as DataAPIResponse<StoreItem>;
      });
  },
  BulkEdit: function (
    bulk_edit_list: { id: StoreItem['id']; status: StoreItem['status'] }[],
  ): Promise<BaseAPIResponse> {
    let url = `${BACKEND_URL}/teacher-shop/v1/teacher/shop/status/bulk_edit`;
    return fetchWithAuth(url, {
      method: 'PATCH',
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
  UpdateStatus: function (
    store_item_id: StoreItem['id'],
    status: StoreItem['status'],
  ): Promise<DataAPIResponse<StoreItem>> {
    let url = `${BACKEND_URL}/teacher-shop/v1/teacher/shop/store_item_id/${store_item_id}/status`;
    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<StoreItem[]>) => {
        if (res.status_code === 201 && Array.isArray(res.data))
          return { ...res, data: res.data?.[0] } as DataAPIResponse<StoreItem>;
        return res as DataAPIResponse<StoreItem>;
      });
  },
};

export default StoreItemRestAPI;
