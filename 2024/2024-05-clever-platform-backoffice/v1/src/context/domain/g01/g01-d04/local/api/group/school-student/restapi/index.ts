import {
  FamilyInfoResponse,
  LevelPlayLog,
  OptionInterface,
  TeacherNoteRequest,
  TeacherNoteResponse,
} from '@domain/g01/g01-d04/local/type';
import { SchoolStudentList } from '@domain/g01/g01-d04/local/type.ts';
import { Classroom, SeedYear } from '@domain/g01/g01-d05/local/api/type';
import {
  BasePaginationAPIQueryParams,
  DataAPIRequest,
  DataAPIResponse,
  getQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';

import {
  SchoolStudentFilterQueryParams,
  SchoolStudentRepository,
} from '../../../repository/school-student';

const backendUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const SchoolStudentRestAPI: SchoolStudentRepository = {
  GetStudentsBySchoolId: async function (
    schoolId: string,
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<SchoolStudentList>> {
    // g01-d04-a15: student list
    const url = `${backendUrl}/admin-school/v1/schools/${schoolId}/students`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    const res = await fetchWithAuth(`${url}?${params.toString()}`);

    if (!res.ok) {
      throw new Error('Failed to fetch students');
    }

    return await res.json();
  },

  DownloadCSV: async function (
    schoolId: string,
    query: { start_date: string; end_date: string },
  ): Promise<Blob> {
    // g01-d04-a17: download students CSV
    const url = `${backendUrl}/admin-school/v1/schools/${schoolId}/students/download/csv`;

    // ใช้ query parameters โดยตรง ไม่ผ่าน URLSearchParams
    const queryString = `start_date=${query.start_date}&end_date=${query.end_date}`;
    return fetchWithAuth(`${url}?${queryString}`).then((res) => {
      return res.blob();
    });
  },

  UploadCSV: async function (schoolId: string, file: File): Promise<any> {
    // g01-d04-a18: upload students CSV
    const url = `${backendUrl}/admin-school/v1/schools/${schoolId}/students/upload/csv`;

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

  BulkEdit: async function (data: { id: string; status: string }[]): Promise<void> {
    // g01-d04-a52: student bulk edit
    const url = `${backendUrl}/admin-school/v1/users/bulk-edit`;

    const body = {
      bulk_edit_list: data.map((record) => ({
        user_id: record.id,
        status: record.status,
      })),
    };

    const res = await fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error('Failed to perform bulk edit');
    }
  },

  DisableStudentStatus: async function (userId: string): Promise<DataAPIResponse<void>> {
    // g01-d04-a19: disable student status
    const url = `${backendUrl}/admin-school/v1/students/${userId}`;

    const formData = new FormData();
    formData.append('status', 'disabled');

    const res = await fetchWithAuth(url, {
      method: 'PATCH',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Failed to disable student status');
    }

    return res.json();
  },
  EnableStudentStatus: async function (userId: string): Promise<DataAPIResponse<void>> {
    // g01-d04-a19: disable student status
    const url = `${backendUrl}/admin-school/v1/students/${userId}`;

    const formData = new FormData();
    formData.append('status', 'enabled');

    const res = await fetchWithAuth(url, {
      method: 'PATCH',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Failed to disable student status');
    }

    return res.json();
  },

  UpdateUserPin: async function (data: {
    user_id: string;
    pin: string;
  }): Promise<DataAPIResponse<void>> {
    // g01-d04-a20: user pin edit
    const url = `${backendUrl}/admin-school/v1/auth/pin`;

    const body = {
      user_id: data.user_id,
      pin: data.pin,
    };

    const res = await fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error('Failed to update user PIN');
    }

    return res.json();
  },

  PlayLog: {
    Get: function (
      userId: string,
      classroomId: number,
      query: SchoolStudentFilterQueryParams,
    ): Promise<PaginationAPIResponse<LevelPlayLog>> {
      const url = `${backendUrl}/admin-school/v1/students/${userId}/classes/${classroomId}/lesson-play-log`;

      const params = getQueryParams(query);
      return fetchWithAuth(url + '?' + params.toString())
        .then((res) => res.json())
        .then((res: PaginationAPIResponse<LevelPlayLog>) => {
          return res;
        });
    },
    GetAcademicYears: function (
      userId: string,
      query?: SchoolStudentFilterQueryParams,
    ): Promise<DataAPIResponse<number[]>> {
      const url = `${backendUrl}/admin-school/v1/students/${userId}/academic-years`;

      const params = getQueryParams(query ?? {});

      return fetchWithAuth(url + '?' + params.toString())
        .then((res) => res.json())
        .then((res: DataAPIResponse<number[]>) => {
          return res;
        });
    },
    GetCurriculumGroups: function (
      userId: string,
      query?: SchoolStudentFilterQueryParams,
    ): Promise<DataAPIResponse<OptionInterface[]>> {
      const url = `${backendUrl}/admin-school/v1/students/${userId}/curriculum-groups`;

      const params = getQueryParams(query ?? {});

      return fetchWithAuth(url + '?' + params.toString())
        .then((res) => res.json())
        .then((res: DataAPIResponse<OptionInterface[]>) => {
          return res;
        });
    },
    getSubjects: function (
      userId: string,
      query?: SchoolStudentFilterQueryParams,
    ): Promise<DataAPIResponse<OptionInterface[]>> {
      const url = `${backendUrl}/admin-school/v1/students/${userId}/subjects`;

      const params = getQueryParams(query ?? {});

      return fetchWithAuth(url + '?' + params.toString())
        .then((res) => res.json())
        .then((res: DataAPIResponse<OptionInterface[]>) => {
          return res;
        });
    },
    getLessons: function (
      userId: string,
      query?: SchoolStudentFilterQueryParams,
    ): Promise<DataAPIResponse<OptionInterface[]>> {
      const url = `${backendUrl}/admin-school/v1/students/${userId}/lessons`;

      const params = getQueryParams(query ?? {});

      return fetchWithAuth(url + '?' + params.toString())
        .then((res) => res.json())
        .then((res: DataAPIResponse<OptionInterface[]>) => {
          return res;
        });
    },
    GetSubLesson: function (
      userId: string,
      query?: SchoolStudentFilterQueryParams,
    ): Promise<DataAPIResponse<OptionInterface[]>> {
      const url = `${backendUrl}/admin-school/v1/students/${userId}/sub-lessons`;

      const params = getQueryParams(query ?? {});

      return fetchWithAuth(url + '?' + params.toString())
        .then((res) => res.json())
        .then((res: DataAPIResponse<OptionInterface[]>) => {
          return res;
        });
    },
    DownloadCSV: function (
      userId: string,
      classroomId: number,
      query?: {
        start_date?: string;
        end_date?: string;
      },
    ): Promise<Blob> {
      const url = `${backendUrl}/admin-school/v1/students/${userId}/classes/${classroomId}/lesson-play-log/download/csv`;

      const params = getQueryParams(query ?? {});
      return fetchWithAuth(url + '?' + params.toString()).then((res) => {
        return res.blob();
      });
    },
    getClassess: function (
      userId: string,
      query: BasePaginationAPIQueryParams = {},
    ): Promise<PaginationAPIResponse<Classroom>> {
      const url = `${backendUrl}/admin-school/v1/students/${userId}/classes`;

      const params = getQueryParams(query ?? {});
      return fetchWithAuth(url + '?' + params.toString())
        .then((res) => res.json())
        .then((res: PaginationAPIResponse<Classroom>) => {
          return res;
        });
    },
  },
  GetSeedYears: function (): Promise<DataAPIResponse<SeedYear[]>> {
    // g01-d04-a68: get seed years
    const url = `${backendUrl}/admin-school/v1/seed-years`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<SeedYear[]>) => {
        return res;
      });
  },
  GetById: function (userId: string): Promise<DataAPIResponse<SchoolStudentList>> {
    // g01-d04-a21-api-student-get
    const url = `${backendUrl}/admin-school/v1/students/${userId}`;
    return fetchWithAuth(url, {
      method: 'Get',
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<SchoolStudentList[]>) => {
        if (res.status_code === 200 && Array.isArray(res.data))
          return {
            ...res,
            data: res.data?.[0],
          } as DataAPIResponse<SchoolStudentList>;
        return res as DataAPIResponse<SchoolStudentList>;
      });
  },
  Create: function (
    student: DataAPIRequest<SchoolStudentList>,
  ): Promise<DataAPIResponse<SchoolStudentList>> {
    // g01-d04-a22-api-student-create
    const url = `${backendUrl}/admin-school/v1/students`;

    const formData = new FormData();
    for (const [key, value] of Object.entries(student)) {
      if (value && (typeof value == 'string' || value instanceof File))
        formData.append(key, value);
    }

    return fetchWithAuth(url, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<SchoolStudentList[]>) => {
        if (res.status_code === 201 && Array.isArray(res.data))
          return {
            ...res,
            data: res.data?.[0],
          } as DataAPIResponse<SchoolStudentList>;
        return res as DataAPIResponse<SchoolStudentList>;
      });
  },
  Update: function (
    userId: string,
    student: DataAPIRequest<SchoolStudentList>,
  ): Promise<DataAPIResponse<SchoolStudentList>> {
    // g01-d04-a19: student update
    const url = `${backendUrl}/admin-school/v1/students/${userId}`;

    const formData = new FormData();
    for (const [key, value] of Object.entries(student)) {
      if (value && (typeof value == 'string' || value instanceof File))
        formData.append(key, value);
    }

    return fetchWithAuth(url, {
      method: 'PATCH',
      body: formData,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<SchoolStudentList[]>) => {
        if (res.status_code === 201 && Array.isArray(res.data))
          return {
            ...res,
            data: res.data?.[0],
          } as DataAPIResponse<SchoolStudentList>;
        return res as DataAPIResponse<SchoolStudentList>;
      });
  },

  // g01-d04-a27-api-student-case-list-teacher-note
  GetTeacherNote: async function (
    userId: string,
    query: TeacherNoteRequest,
  ): Promise<PaginationAPIResponse<TeacherNoteResponse>> {
    const url = `${backendUrl}/admin-school/v1/students/${userId}/teacher-notes`;
    const params = getQueryParams(query);

    const res = await fetchWithAuth(`${url}?${params.toString()}`);
    if (!res.ok)
      throw new Error(`Failed to fetch teacher notes for user: ${res.statusText}`);
    return res.json();
  },

  // g01-d04-a29-api-student-case-get-family
  GetFamilyInfo: async function (
    userId: string,
  ): Promise<DataAPIResponse<FamilyInfoResponse[]>> {
    const url = `${backendUrl}/admin-school/v1/students/${userId}/family`;
    const res = await fetchWithAuth(url);
    if (!res.ok) {
      throw new Error('Failed to update OAuth provider');
    }
    return res.json();
  },

  UpdateOAuthProvider: async function (
    userId: string,
    provider: string,
  ): Promise<DataAPIResponse<void>> {
    // g01-d04-a44: api-user-case-delete-oauth
    const url = `${backendUrl}/admin-school/v1/users/${userId}/oauth`;

    const res = await fetchWithAuth(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider }),
    });

    if (!res.ok) {
      throw new Error('Failed to update OAuth provider');
    }

    return res.json();
  },
};

export default SchoolStudentRestAPI;
