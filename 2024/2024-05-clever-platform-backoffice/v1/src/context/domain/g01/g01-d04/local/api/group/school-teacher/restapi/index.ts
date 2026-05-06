import {
  AdminLoginAsResponse,
  BulkUserUpdateRecord,
  CreatedTeacherRecord,
  TeacherAccess,
  TeacherClassLogRecord,
  TeacherRecord,
  TeacherTeachingLogRecord,
  UpdatedTeacherAccessRecord,
  UpdatedUserEntity,
  UpdatedUserResponse,
} from '@domain/g01/g01-d04/local/type';
import {
  BaseAPIResponse,
  BasePaginationAPIQueryParams,
  BulkDataAPIRequest,
  DataAPIRequest,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import downloadCSV from '@global/utils/downloadCSV';
import fetchWithAuth from '@global/utils/fetchWithAuth';

import {
  SchoolTeacherFilterQueryParams,
  SchoolTeacherRepository,
} from '../../../repository/school-teacher';

const backendUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const RestAPISchoolTeacher: SchoolTeacherRepository = {
  Gets: function (
    schoolId: string,
    query: SchoolTeacherFilterQueryParams,
  ): Promise<PaginationAPIResponse<TeacherRecord>> {
    // g01-d04-a36: api teacher list
    const url = `${backendUrl}/admin-school/v1/teachers`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
      school_id: schoolId,
    });

    return fetchWithAuth(url + `?${params.toString()}`)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<TeacherRecord>) => {
        return res;
      });
  },

  // g01-d04-a40 api-auth-case-admin-login-as
  AdminLoginAs: async function (
    targetId: string,
  ): Promise<PaginationAPIResponse<AdminLoginAsResponse>> {
    const url = `${backendUrl}/admin-school/v1/auth/login/admin-login-as`;
    const body = JSON.stringify({ target_user_id: targetId });
    const res = await fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });

    if (!res.ok) throw new Error(`Failed to admin login as: ${res.statusText}`);
    return res.json();
  },

  GetById: function (id: string): Promise<DataAPIResponse<TeacherRecord>> {
    // g01-d04-a42: api teacher get
    const url = `${backendUrl}/admin-school/v1/teachers/${id}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<TeacherRecord[]>) => {
        // we assume only get single data but backend response as a array
        // we pull it out of array, tricky but worked
        if (res.status_code === 200 && Array.isArray(res.data))
          return {
            ...res,
            data: res.data?.at(0),
          } as DataAPIResponse<TeacherRecord>;
        return res as DataAPIResponse<TeacherRecord>;
      })
      .then((res: DataAPIResponse<TeacherRecord>) => {
        return res;
      });
  },

  Create: function (
    teacher: DataAPIRequest<CreatedTeacherRecord>,
  ): Promise<DataAPIResponse<TeacherRecord>> {
    // g01-d04-a41: api teacher create
    const url = `${backendUrl}/admin-school/v1/teachers`;
    // form data
    const body = new FormData();
    // append key-value to form data
    Object.entries(teacher).forEach(([key, value]) => {
      if (value === undefined) return;
      if (Array.isArray(value)) {
        value.forEach((v) => {
          body.append(key, typeof v === 'number' ? `${v}` : v);
        });
      } else {
        body.append(key, value);
      }
    });
    return fetchWithAuth(url, {
      method: 'POST',
      body: body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<TeacherRecord[]>) => {
        // pull it out of array
        // note: when create succesfully, it response HTTP 201 Created
        if (res.status_code === 201 && Array.isArray(res.data))
          return {
            ...res,
            data: res.data?.at(0),
          } as DataAPIResponse<TeacherRecord>;
        return res as DataAPIResponse<TeacherRecord>;
      });
  },

  Update: function (
    id: string,
    teacher: DataAPIRequest<UpdatedUserEntity>,
  ): Promise<DataAPIResponse<UpdatedUserResponse>> {
    // g01-d04-a50: api teacher update
    const url = `${backendUrl}/admin-school/v1/users/${id}`;
    // form data
    const body = new FormData();
    // append key-value to form data
    Object.entries(teacher).forEach(([key, value]) => {
      if (value === undefined) return;
      if (Array.isArray(value)) {
        value.forEach((v) => {
          body.append(key, typeof v === 'number' ? `${v}` : v);
        });
      } else {
        body.append(key, value);
      }
    });
    return fetchWithAuth(url, {
      method: 'PATCH',
      body: body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<UpdatedUserResponse[]>) => {
        // pull it out of array
        // note: when create succesfully, it response HTTP 201 Created
        if (res.status_code === 201 && Array.isArray(res.data))
          return {
            ...res,
            data: res.data?.at(0),
          } as DataAPIResponse<UpdatedUserResponse>;
        return res as DataAPIResponse<UpdatedUserResponse>;
      });
  },

  AccessListGets: function (): Promise<PaginationAPIResponse<TeacherAccess>> {
    // g01-d04-a58: api teacher access list
    const url = `${backendUrl}/admin-school/v1/teacher-accesses`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<TeacherAccess>) => {
        return res;
      });
  },

  UpdateTeacherAccess: function (
    teacherId: string,
    access: DataAPIRequest<UpdatedTeacherAccessRecord>,
  ): Promise<DataAPIResponse<number[]>> {
    // g01-d04-a57: api teacher case update teacher accesses
    const url = `${backendUrl}/admin-school/v1/teachers/${teacherId}/teacher-accesses`;
    const body = JSON.stringify(access);
    return fetchWithAuth(url, {
      method: 'PATCH',
      body: body,
      headers: {
        'content-type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<number[]>) => {
        return res;
      });
  },

  BulkUpdate: function (
    data: BulkDataAPIRequest<BulkUserUpdateRecord>,
  ): Promise<BaseAPIResponse> {
    // g01-d04-a52: api user case bulk edit
    const url = `${backendUrl}/admin-school/v1/users/bulk-edit`;
    const body = JSON.stringify(data);
    return fetchWithAuth(url, {
      method: 'POST',
      body: body,
      headers: {
        'content-type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res: BaseAPIResponse) => {
        return res;
      });
  },

  DownloadCSV: function (
    schoolId: string,
    query: DataAPIRequest<{ start_date: string; end_date: string }>,
  ): Promise<Blob> {
    const url = `${backendUrl}/admin-school/v1/schools/${schoolId}/teachers/download/csv`;

    const queryString = `start_date=${query.start_date}&end_date=${query.end_date}&school_id=${schoolId}`;

    return fetchWithAuth(url + `?${queryString}`).then((res) => res.blob());
  },

  UploadCSV: function (
    schoolId: string,
    data: DataAPIRequest<{ csv_file: File }>,
  ): Promise<BaseAPIResponse> {
    // g01-d04-a38: api teacher case upload csv
    const url = `${backendUrl}/admin-school/v1/schools/${schoolId}/teachers/upload/csv`;
    // form data
    const body = new FormData();
    // append key-value to form data
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined) return;
      if (Array.isArray(value)) {
        value.forEach((v) => {
          body.append(key, typeof v === 'number' ? `${v}` : v);
        });
      } else {
        body.append(key, value);
      }
    });
    return fetchWithAuth(url, {
      method: 'POST',
      body: body,
    })
      .then((res) => res.json())
      .then((res: BaseAPIResponse) => {
        return res;
      });
  },

  ResetPassword: function (data: {
    user_id: string;
    password: string;
  }): Promise<BaseAPIResponse> {
    // g01-d04-a51: api auth email password update
    const url = `${backendUrl}/admin-school/v1/auth/email-password`;
    const body = JSON.stringify(data);
    return fetchWithAuth(url, {
      method: 'PATCH',
      body: body,
      headers: {
        'content-type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res: BaseAPIResponse) => {
        return res;
      });
  },

  ListTeachingLog: function (
    teacherId: string,
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<TeacherTeachingLogRecord>> {
    const url = `${backendUrl}/admin-school/v1/teachers/${teacherId}/teaching-log`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + `?${params.toString()}`)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<TeacherTeachingLogRecord>) => {
        return res;
      });
  },

  ListClassLog: function (
    teacherId: string,
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<TeacherClassLogRecord>> {
    const url = `${backendUrl}/admin-school/v1/teachers/${teacherId}/class-log`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + `?${params.toString()}`)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<TeacherClassLogRecord>) => {
        return res;
      });
  },
};

export default RestAPISchoolTeacher;
