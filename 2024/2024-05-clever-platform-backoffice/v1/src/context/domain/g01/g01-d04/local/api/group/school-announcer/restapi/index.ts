import {
  PaginationAPIResponse,
  DataAPIResponse,
  BaseAPIResponse,
  DataAPIRequest,
  BulkDataAPIRequest,
} from '@global/utils/apiResponseHelper';
import {
  SchoolAnnouncerFilterQueryParams,
  SchoolAnnouncerRepository,
} from '../../../repository/school-announcer';
import {
  BulkUserUpdateRecord,
  CreatedSchoolAnnouncer,
  SchoolAnnouncer,
  UpdatedUserEntity,
  UpdatedUserResponse,
} from '@domain/g01/g01-d04/local/type';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import downloadCSV from '@global/utils/downloadCSV';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const RestAPISchoolAnnouncer: SchoolAnnouncerRepository = {
  Gets: function (
    schoolId: string,
    query: SchoolAnnouncerFilterQueryParams,
  ): Promise<PaginationAPIResponse<SchoolAnnouncer>> {
    // g01-d04-a48: api announcer list
    const url = `${BACKEND_URL}/admin-school/v1/announcers`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
      school_id: schoolId,
    });

    return fetchWithAuth(url + `?${params.toString()}`)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<SchoolAnnouncer>) => {
        return res;
      });
  },
  GetById: function (announcerId: string): Promise<DataAPIResponse<SchoolAnnouncer>> {
    // g01-d04-a56: api user get
    const url = `${BACKEND_URL}/admin-school/v1/users/${announcerId}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<SchoolAnnouncer[]>) => {
        // we assume only get single data but backend response as a array
        // we pull it out of array, tricky but worked
        if (res.status_code === 200 && Array.isArray(res.data))
          return {
            ...res,
            data: res.data?.at(0),
          } as DataAPIResponse<SchoolAnnouncer>;
        return res as DataAPIResponse<SchoolAnnouncer>;
      })
      .then((res: DataAPIResponse<SchoolAnnouncer>) => {
        return res;
      });
  },
  BulkEdit: function (
    data: BulkDataAPIRequest<BulkUserUpdateRecord>,
  ): Promise<BaseAPIResponse> {
    // g01-d04-a52: api user case bulk edit
    const url = `${BACKEND_URL}/admin-school/v1/users/bulk-edit`;
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
  Create: function (
    data: DataAPIRequest<CreatedSchoolAnnouncer>,
  ): Promise<DataAPIResponse<SchoolAnnouncer>> {
    // g01-d04-a49: api announcer create
    const url = `${BACKEND_URL}/admin-school/v1/announcers`;
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
      .then((res: DataAPIResponse<SchoolAnnouncer[]>) => {
        // pull it out of array
        // note: when create succesfully, it response HTTP 201 Created
        if (res.status_code === 201 && Array.isArray(res.data))
          return {
            ...res,
            data: res.data?.at(0),
          } as DataAPIResponse<SchoolAnnouncer>;
        return res as DataAPIResponse<SchoolAnnouncer>;
      });
  },
  Update: function (
    announcerId: string,
    data: DataAPIRequest<UpdatedUserEntity>,
  ): Promise<DataAPIResponse<UpdatedUserResponse>> {
    // g01-d04-a50: api user update
    const url = `${BACKEND_URL}/admin-school/v1/users/${announcerId}`;
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
  UpdatePassword: function (data: {
    user_id: string;
    password: string;
  }): Promise<BaseAPIResponse> {
    // g01-d04-a51: api auth email password update
    const url = `${BACKEND_URL}/admin-school/v1/auth/email-password`;
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
  DownloadCSV: function (
    schoolId: string,
    query: DataAPIRequest<{ start_date: string; end_date: string }>,
  ): Promise<Blob> {
    const url = `${BACKEND_URL}/admin-school/v1/schools/${schoolId}/announcers/download/csv`;

    const queryString = `start_date=${query.start_date}&end_date=${query.end_date}&school_id=${schoolId}`;

    return fetchWithAuth(url + `?${queryString}`).then((res) => res.blob());
  },
  UploadCSV: function (
    schoolId: string,
    data: DataAPIRequest<{ csv_file: File }>,
  ): Promise<BaseAPIResponse> {
    // g01-d04-a65: api announcer case upload csv
    const url = `${BACKEND_URL}/admin-school/v1/schools/${schoolId}/announcers/upload/csv`;
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
};

export default RestAPISchoolAnnouncer;
