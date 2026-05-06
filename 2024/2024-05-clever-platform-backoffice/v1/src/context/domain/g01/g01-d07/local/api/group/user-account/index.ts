import {
  BasePaginationAPIQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import downloadCSV from '@global/utils/downloadCSV.ts';
import { getDateTime } from '@domain/g01/g01-d05/local/utils';
import { AdminUserAccountRepository } from '../../repository/admin-user-account';
import {
  UserAccountResponse,
  BulkEditRequest,
  AdminUserAccountQueryParams,
} from '../../../../local/type';

const backendUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const AdminUserAccountRestAPI: AdminUserAccountRepository = {
  Gets: async function (
    query: AdminUserAccountQueryParams,
  ): Promise<PaginationAPIResponse<UserAccountResponse>> {
    // g07-d00-a01: admin user account list
    const url = `${backendUrl}/admin-user-account/v1/users`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );

    const params = new URLSearchParams();

    // Handle all query parameters
    Object.entries(filterQuery).forEach(([key, value]) => {
      if (key === 'roles' && Array.isArray(value)) {
        // Handle roles array by appending each role
        value.forEach((role) => {
          params.append('roles', role.toString());
        });
      } else {
        params.append(key, value.toString());
      }
    });

    return fetchWithAuth(url + `?${params.toString()}`)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<UserAccountResponse>) => {
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
  Open: async function (id: string): Promise<void> {
    const url = `${backendUrl}/admin-user-account/v1/users/${id}`;

    const formData = new FormData();
    formData.append('status', 'enabled');

    const res = await fetchWithAuth(url, {
      method: 'PATCH',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Failed to update user account');
    }

    console.log('User account updated successfully');
  },
  BulkEdit: async function (data: BulkEditRequest): Promise<void> {
    const url = `${backendUrl}/admin-user-account/v1/bulk-edit`;

    const res = await fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error('Failed to bulk edit user accounts');
    }

    console.log('User accounts updated successfully');
  },
  GetById: async function (id: string): Promise<UserAccountResponse> {
    const url = `${backendUrl}/admin-user-account/v1/users/${id}`;

    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error('Failed to fetch user account');
    }

    const result = await response.json();
    return result.data[0];
  },
  Update: async function (id: string, data: FormData): Promise<void> {
    const url = `${backendUrl}/admin-user-account/v1/users/${id}`;

    const response = await fetchWithAuth(url, {
      method: 'PATCH',
      body: data,
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }
  },
  UpdateRoles: async function (id: string, roles: number[]): Promise<void> {
    const url = `${backendUrl}/admin-user-account/v1/users/${id}/roles`;

    const response = await fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roles }),
    });

    if (!response.ok) {
      throw new Error('Failed to update user roles');
    }
  },
  UpdatePassword: async function (userId: string, password: string): Promise<void> {
    const url = `${backendUrl}/admin-user-account/v1/auth/email-password`;

    const response = await fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, password }),
    });

    if (!response.ok) {
      throw new Error('Failed to update password');
    }
  },
  Create: async function (data: FormData): Promise<{ id: string }> {
    const url = `${backendUrl}/admin-user-account/v1/users`;

    const response = await fetchWithAuth(url, {
      method: 'POST',
      body: data,
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }

    const result = await response.json();
    return { id: result.data[0].id };
  },
  DownloadCSV: async function (
    role: 'admin' | 'parent' | 'observer' | 'content-creator',
  ): Promise<void> {
    const url = `${backendUrl}/admin-user-account/v1/download/csv/${role}`;

    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error('Failed to download CSV');
    }

    const blob = await response.blob();
    const fileName = `user-accounts-${role}-${getDateTime()}.csv`;
    downloadCSV(blob, fileName);
  },
  UploadCSV: async function (
    role: 'admin' | 'parent' | 'observer' | 'content-creator',
    file: File,
  ): Promise<void> {
    const url = `${backendUrl}/admin-user-account/v1/upload/csv/${role}`;

    const formData = new FormData();
    formData.append('csv_file', file);

    const response = await fetchWithAuth(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload CSV');
    }
  },
};

export default AdminUserAccountRestAPI;
