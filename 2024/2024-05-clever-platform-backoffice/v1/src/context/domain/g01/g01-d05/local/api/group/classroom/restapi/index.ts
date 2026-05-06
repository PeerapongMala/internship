import fetchWithAuth from '@global/utils/fetchWithAuth';
import { Classroom, TMoveStudentCsvReq } from '../../../type';
import {
  ClassroomFilterQueryParams,
  ClassroomRepository,
} from '../../../repository/classroom';
import {
  DataAPIRequest,
  DataAPIResponse,
  getQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import { TBaseResponse } from '@global/types/api';
import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosResponse } from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const RestAPIClassroom: ClassroomRepository = {
  Get: async function (schoolId, query): Promise<PaginationAPIResponse<Classroom>> {
    let url = `${BACKEND_URL}/admin-classroom/v1/schools/${schoolId}/classrooms`;

    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<Classroom>) => {
        return res;
      });
  },
  GetById: async function (id: number): Promise<DataAPIResponse<Classroom>> {
    let url = `${BACKEND_URL}/admin-classroom/v1/classrooms/${id}`;
    return fetchWithAuth(url, {
      method: 'Get',
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<Classroom[]>) => {
        if (res.status_code === 200 && Array.isArray(res.data))
          return { ...res, data: res.data?.[0] } as DataAPIResponse<Classroom>;
        return res as DataAPIResponse<Classroom>;
      });
  },
  Create: async function (
    classroom: DataAPIRequest<Classroom>,
  ): Promise<DataAPIResponse<Classroom>> {
    let url = `${BACKEND_URL}/admin-classroom/v1/classrooms`;
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify(classroom),
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<Classroom[]>) => {
        if (res.status_code === 201 && Array.isArray(res.data))
          return { ...res, data: res.data?.[0] } as DataAPIResponse<Classroom>;
        return res as DataAPIResponse<Classroom>;
      });
  },
  Update: async function (
    id: number,
    classroom: DataAPIRequest<Classroom>,
  ): Promise<DataAPIResponse<Classroom>> {
    let url = `${BACKEND_URL}/admin-classroom/v1/classrooms/${id}`;
    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify(classroom),
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<Classroom[]>) => {
        if (res.status_code === 201 && Array.isArray(res.data))
          return { ...res, data: res.data?.[0] } as DataAPIResponse<Classroom>;
        return res as DataAPIResponse<Classroom>;
      });
  },
  BulkEdit: function (
    schoolId: number,
    classrooms: DataAPIRequest<Classroom>[],
  ): Promise<DataAPIResponse<Classroom[]>> {
    let url = `${BACKEND_URL}/admin-classroom/v1/schools/${schoolId}/classrooms/bulk-edit`;
    const body = JSON.stringify({
      items: classrooms,
    });
    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body,
    })
      .then((res) => res.json())
      .then((res) => {
        return res as DataAPIResponse<Classroom[]>;
      });
  },
  DownloadCSV: function (
    schoolId: number,
    query: ClassroomFilterQueryParams,
  ): Promise<Blob> {
    let url = `${BACKEND_URL}/admin-classroom/v1/schools/${schoolId}/classrooms/download/csv`;

    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString()).then((res) => {
      return res.blob();
    });
  },
  UploadCSV: function (
    schoolId: number,
    file: File,
    query: ClassroomFilterQueryParams,
  ): Promise<DataAPIResponse<Classroom>> {
    let url = `${BACKEND_URL}/admin-classroom/v1/schools/${schoolId}/classrooms/upload/csv`;
    const formData = new FormData();
    formData.append('csv_file', file);

    return fetchWithAuth(url, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<Classroom[]>) => {
        if (res.status_code === 201 && Array.isArray(res.data))
          return { ...res, data: res.data?.[0] } as DataAPIResponse<Classroom>;
        return res as DataAPIResponse<Classroom>;
      });
  },
  GetAcademicYears: function (schoolId: number): Promise<DataAPIResponse<number[]>> {
    let url = `${BACKEND_URL}/admin-classroom/v1/schools/${schoolId}/classrooms/academic-year`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<{ academic_year: number[] }>) => {
        if (res.status_code === 200 && Array.isArray(res.data?.academic_year)) {
          return { ...res, data: res.data?.academic_year ?? [] };
        }
        return { ...res, data: [] };
      });
  },
  GetYears: function (schoolId: number): Promise<DataAPIResponse<string[]>> {
    let url = `${BACKEND_URL}/admin-classroom/v1/schools/${schoolId}/classrooms/year`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<{ year: string[] }>) => {
        if (res.status_code === 200 && Array.isArray(res.data?.year)) {
          return { ...res, data: res.data?.year ?? [] };
        }
        return { ...res, data: [] };
      });
  },
  Clone: function (
    id: number,
    classroom: DataAPIRequest<Classroom>,
  ): Promise<DataAPIResponse<Classroom>> {
    let url = `${BACKEND_URL}/admin-classroom/v1/classrooms/${id}/clone`;
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify(classroom),
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<Classroom[]>) => {
        if (res.status_code === 201 && Array.isArray(res.data))
          return { ...res, data: res.data?.[0] } as DataAPIResponse<Classroom>;
        return res as DataAPIResponse<Classroom>;
      });
  },
  MoveStudentCSV: async function (
    schoolID: string,
    body: TMoveStudentCsvReq,
    onError?: (error: unknown) => void,
  ): Promise<AxiosResponse<TBaseResponse>> {
    const url = `/admin-classroom/v1/schools/${schoolID}/move-student`;
    let response: AxiosResponse<TBaseResponse>;

    try {
      response = await axiosWithAuth.post(url, body, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      onError?.(error);
      throw error;
    }

    return response;
  },
};

export default RestAPIClassroom;
