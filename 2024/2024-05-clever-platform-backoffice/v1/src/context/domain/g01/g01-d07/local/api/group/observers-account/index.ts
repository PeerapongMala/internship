import {
  BasePaginationAPIQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { ObserversAccountResponse, ObserverAccessResponse } from '../../../type.ts';
import { ObserversAccountRepository } from '../../repository/observers-account.ts';

const backendUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

interface GetObserverAccessesParams {
  access_name?: string;
}

const ObserversAccountRestAPI: ObserversAccountRepository = {
  Gets: async function (
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<ObserversAccountResponse>> {
    // g07-d00-a01: parents account list
    const url = `${backendUrl}/admin-user-account/v1/observers`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + `?${params.toString()}`)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<ObserversAccountResponse>) => {
        return res;
      });
  },
  Close: async function (id: string): Promise<void> {
    const url = `${backendUrl}/admin-user-account/v1/users/${id}`;

    const formData = new FormData();
    formData.append('status', 'disabled');

    const res = await fetchWithAuth(url, {
      method: 'PATCH',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Failed to update user account');
    }

    console.log('User account updated successfully');
  },
  GetById: async function (id: string): Promise<ObserversAccountResponse> {
    const url = `${backendUrl}/admin-user-account/v1/observers/${id}`;

    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error('Failed to fetch observer account');
    }

    const result = await response.json();
    return result.data[0];
  },
  GetObserverAccesses: async function (
    query?: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<ObserverAccessResponse>> {
    let url = `${backendUrl}/admin-report-permission/v1/observer-accesses`;

    if (query) {
      const filterQuery = Object.fromEntries(
        Object.entries(query).filter(([k, v]) => v !== undefined),
      );
      const params = new URLSearchParams(filterQuery as Record<string, string>);
      url += `?${params.toString()}`;
    }

    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<ObserverAccessResponse>) => res);
  },
  UpdateObserverAccesses: async function (
    userId: string,
    observer_accesses: number[],
  ): Promise<void> {
    const url = `${backendUrl}/admin-user-account/v1/observers/${userId}/observer-accesses`;

    const response = await fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ observer_accesses }),
    });

    if (!response.ok) {
      throw new Error('Failed to update observer accesses');
    }
  },
};

export default ObserversAccountRestAPI;
