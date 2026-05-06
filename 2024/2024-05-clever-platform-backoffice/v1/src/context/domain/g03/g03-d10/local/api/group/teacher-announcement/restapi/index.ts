import { AnnouncementRepository } from '@domain/g03/g03-d10/local/api/repository/teacher-announcement.ts';
import {
  BaseAnnouncementEntity,
  AnnouncementListQueryParams,
  BulkEditRequest,
  CsvDownloadRequest,
} from '@domain/g03/g03-d10/local/type.ts';
import {
  PaginationAPIResponse,
  DataAPIRequest,
  BaseAPIResponse,
  DataAPIResponse,
  FailedAPIResponse,
} from '@global/utils/apiResponseHelper';

import fetchWithAuth from '@global/utils/fetchWithAuth';
import downloadCSV from '@global/utils/downloadCSV.ts';
import { getDateTime } from '@domain/g01/g01-d05/local/utils';

const backendUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const AnnouncementRestAPI: AnnouncementRepository = {
  Gets: async function (
    query: AnnouncementListQueryParams,
  ): Promise<PaginationAPIResponse<BaseAnnouncementEntity>> {
    const url = `${backendUrl}/teacher-announcement/v1/global/announcement`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined && v !== ''),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    const res = await fetchWithAuth(url + `?${params.toString()}`);
    if (!res.ok) {
      throw new Error('Failed to fetch all annoucnements');
    }
    return await res.json();
  },

  GetById: async function (
    announceId: number,
  ): Promise<DataAPIResponse<BaseAnnouncementEntity>> {
    const url = `${backendUrl}/teacher-announcement/v1/global/announcement/${announceId}`;

    const res = await fetchWithAuth(url);
    if (!res.ok) {
      throw new Error('Failed to fetch annoucnement');
    }
    return await res.json();
  },

  Create: async function (data: BaseAnnouncementEntity): Promise<BaseAPIResponse> {
    const url = `${backendUrl}/teacher-announcement/v1/global/announcement`;

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const res = await fetchWithAuth(url, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Failed to create announcement');
    }
    return await res.json();
  },

  Update: async function (
    announceId: number,
    data: BaseAnnouncementEntity,
  ): Promise<BaseAPIResponse> {
    const url = `${backendUrl}/teacher-announcement/v1/global/announcement/${announceId}`;

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const res = await fetchWithAuth(url, {
      method: 'PATCH',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Failed to update announcement');
    }
    console.log(res);
    return await res.json();
  },

  BulkEdit: async function (data: BulkEditRequest[]): Promise<BaseAPIResponse> {
    const url = `${backendUrl}/teacher-announcement/v1/global/announcement/bulk-edit`;

    const res = await fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error('Failed to perform bulk edit');
    }
    return await res.json();
  },

  DownloadCSV: async function (
    query: CsvDownloadRequest,
  ): Promise<Blob | FailedAPIResponse> {
    const url = `${backendUrl}/teacher-announcement/v1/global/announcement/csv/download`;

    const params = new URLSearchParams({
      start_date: query.startDate,
      end_date: query.endDate,
    });

    const res = await fetchWithAuth(url + `?${params.toString()}`, {
      method: 'GET',
    });
    if (!res.ok) {
      throw new Error('Failed to download CSV');
    }
    const blob = await res.blob();
    downloadCSV(blob, `${getDateTime()}_schools`);
    return blob;
  },

  UploadCSV: async function (file: File): Promise<BaseAPIResponse> {
    const url = `${backendUrl}/teacher-announcement/v1/global/announcement/csv/upload`;

    const formData = new FormData();
    formData.append('csv_file', file);

    const res = await fetchWithAuth(url, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      throw new Error('Failed to upload CSV');
    }
    return await res.json();
  },
};

export default AnnouncementRestAPI;
