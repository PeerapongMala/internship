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
    query: StoreItemQueryParams = {},
  ): Promise<PaginationAPIResponse<StoreItem>> {
    let url = `${BACKEND_URL}/shop/v1/shop`;
    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res) => {
        return res || [];
      });
  },
  Create: function (
    item: DataAPIRequest<StoreItem>,
  ): Promise<DataAPIResponse<StoreItem>> {
    let url = `${BACKEND_URL}/shop/v1/shop`;
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        ...item,
        stock: item.initial_stock,
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
    itemId: StoreItem['id'],
    item: DataAPIRequest<StoreItem>,
  ): Promise<DataAPIResponse<StoreItem>> {
    let url = `${BACKEND_URL}/shop/v1/shop/store_item_id/${itemId}`;
    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        ...item,
        stock: item.initial_stock,
      }),
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<StoreItem[]>) => {
        if (res.status_code === 201 && Array.isArray(res.data))
          return { ...res, data: res.data?.[0] } as DataAPIResponse<StoreItem>;
        return res as DataAPIResponse<StoreItem>;
      });
  },
  GetById: function (itemId: StoreItem['id']): Promise<DataAPIResponse<StoreItem>> {
    let url = `${BACKEND_URL}/shop/v1/shop/store_item_id/${itemId}`;
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
    let url = `${BACKEND_URL}/shop/v1/shop/status/bulk_edit`;
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
    let url = `${BACKEND_URL}/shop/v1/shop/store_item_id/${store_item_id}/status`;
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
