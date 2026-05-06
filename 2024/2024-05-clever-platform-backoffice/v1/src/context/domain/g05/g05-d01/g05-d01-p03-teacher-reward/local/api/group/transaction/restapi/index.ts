import {
  BaseAPIResponse,
  DataAPIRequest,
  DataAPIResponse,
  FailedAPIResponse,
  getQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { StoreItemQueryParams } from '../../../repository/store';
import { StoreItem, StoreTransaction } from '../../../types/shop';
import { StoreTransactionRepository } from '../../../repository/transaction';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const StoreTransactionRestAPI: StoreTransactionRepository = {
  Get: function (
    store_id: StoreItem['id'],
    query: StoreItemQueryParams = {},
  ): Promise<PaginationAPIResponse<StoreTransaction>> {
    let url = `${BACKEND_URL}/teacher-shop/v1/teacher/shop/store_item_id/${store_id}/transaction`;
    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res) => {
        if (res.status_code == 200) {
          res.data = res.data || [];
        }
        return res;
      });
  },
  BulkEdit: function (
    bulk_edit_list: {
      id: StoreTransaction['id'];
      status: StoreTransaction['status'];
    }[],
  ): Promise<BaseAPIResponse> {
    let url = `${BACKEND_URL}/teacher-shop/v1/teacher/shop/transaction/status/bulk_edit`;
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
    id: StoreTransaction['id'],
    status: StoreTransaction['status'],
  ): Promise<DataAPIResponse<StoreTransaction>> {
    let url = `${BACKEND_URL}/teacher-shop/v1/teacher/shop/transaction/store_transaction_id/${id}/status`;
    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<StoreTransaction[]>) => {
        if (res.status_code === 201 && Array.isArray(res.data))
          return { ...res, data: res.data?.[0] } as DataAPIResponse<StoreTransaction>;
        return res as DataAPIResponse<StoreTransaction>;
      });
  },
};

export default StoreTransactionRestAPI;
