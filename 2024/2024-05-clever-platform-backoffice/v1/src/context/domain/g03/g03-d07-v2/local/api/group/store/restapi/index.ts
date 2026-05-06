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
import { CopyShop, NewStoreItem, StoreItem } from '../../../types/shop';

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
    formData: FormData,
  ): Promise<DataAPIResponse<NewStoreItem>> {
    let url = `${BACKEND_URL}/teacher-shop/v1/teacher/shop`;

    // Append subject_id to the FormData
    formData.append('subject_id', subjectId.toString());

    return fetchWithAuth(url, {
      method: 'POST',
      body: formData, // Send FormData directly
      // Don't set Content-Type header - the browser will set it automatically with the correct boundary
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<NewStoreItem[]>) => {
        if (res.status_code === 201 && Array.isArray(res.data))
          return { ...res, data: res.data?.[0] } as DataAPIResponse<NewStoreItem>;
        return res as DataAPIResponse<NewStoreItem>;
      });
  },

  Update: function (
    subjectId: number,
    store_id: StoreItem['id'],
    formData: FormData,
  ): Promise<DataAPIResponse<NewStoreItem>> {
    let url = `${BACKEND_URL}/teacher-shop/v1/teacher/shop/store_item_id/${store_id}`;

    // Append subject_id to the FormData
    formData.append('subject_id', subjectId.toString());

    return fetchWithAuth(url, {
      method: 'PATCH',
      body: formData, // Send FormData directly
      // Don't set Content-Type header - the browser will set it automatically with the correct boundary
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<NewStoreItem[]>) => {
        if (res.status_code === 201 && Array.isArray(res.data))
          return { ...res, data: res.data?.[0] } as DataAPIResponse<NewStoreItem>;
        return res as DataAPIResponse<NewStoreItem>;
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
  CopyByIdShop: async function (
    teacherShopItemId: string,
    query: any,
  ): Promise<PaginationAPIResponse<CopyShop>> {
    const url = `${BACKEND_URL}/teacher-shop/v1/teacher/shop/${teacherShopItemId}/copy`;
    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<CopyShop>) => {
        return res;
      });
  },
};

export default StoreItemRestAPI;
