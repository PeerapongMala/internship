import {
  PaginationAPIResponse,
  DataAPIResponse,
  DataAPIRequest,
  BaseAPIResponse,
  BulkDataAPIRequest,
} from '@global/utils/apiResponseHelper';
import {
  SchoolObserverFilterQueryParams,
  SchoolObserverRepository,
} from '../../../repository/school-observer';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import {
  BulkUserUpdateRecord,
  IObserverResponse,
  UpdatedUserResponse,
} from '@domain/g01/g01-d04/local/type';
import downloadCSV from '@global/utils/downloadCSV';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const RestAPISchoolObserver: SchoolObserverRepository = {
  Gets: function (
    schoolId: string,
    query: SchoolObserverFilterQueryParams,
  ): Promise<PaginationAPIResponse<any>> {
    // g01-d04-a01: school list
    const url = `${BACKEND_URL}/admin-school/v1/observers`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
      school_id: schoolId,
    });

    return fetchWithAuth(url + `?${params.toString()}`)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<any>) => {
        return res;
      });
  },
  GetById: function (id: string): Promise<DataAPIResponse<any>> {
    const url = `${BACKEND_URL}/admin-school/v1/observers/${id}`;

    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<any>) => {
        return res;
      });
  },
  Create: async function (
    observer: FormData,
  ): Promise<DataAPIResponse<IObserverResponse>> {
    const url = `${BACKEND_URL}/admin-school/v1/observers`;

    return fetchWithAuth(url, {
      method: 'POST',
      body: observer,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<IObserverResponse[]>) => {
        // pull it out of array
        // note: when create succesfully, it response HTTP 200 OK or 201 Created
        if (
          (res.status_code === 200 || res.status_code === 201) &&
          Array.isArray(res.data)
        )
          return {
            ...res,
            data: res.data?.at(0),
          } as DataAPIResponse<IObserverResponse>;
        return res as DataAPIResponse<IObserverResponse>;
      });
  },
  Update: async function (
    id: string,
    observer: FormData,
  ): Promise<DataAPIResponse<UpdatedUserResponse>> {
    const url = `${BACKEND_URL}/admin-school/v1/users/${id}`;

    return fetchWithAuth(url, {
      method: 'PATCH',
      body: observer,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<UpdatedUserResponse[]>) => {
        // pull it out of array
        // note: when create succesfully, it response HTTP 200 OK or 201 Created
        if (
          (res.status_code === 200 || res.status_code === 201) &&
          Array.isArray(res.data)
        )
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
  GetObserverAccessList: function (): Promise<PaginationAPIResponse<any>> {
    // throw new Error("Function not implemented.");
    // g01-d04-a01: school list
    const url = `${BACKEND_URL}/admin-user-account/v1/observer-accesses?page=1&limit=1000`;

    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<any>) => {
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
  DownloadCSV: function (
    schoolId: string,
    query: DataAPIRequest<{ start_date: string; end_date: string }>,
  ): Promise<Blob> {
    const url = `${BACKEND_URL}/admin-school/v1/schools/${schoolId}/observers/download/csv`;

    const queryString = `start_date=${query.start_date}&end_date=${query.end_date}&school_id=${schoolId}`;

    return fetchWithAuth(url + `?${queryString}`).then((res) => res.blob());
  },
  UploadCSV: function (
    schoolId: string,
    data: DataAPIRequest<{ csv_file: File }>,
  ): Promise<BaseAPIResponse> {
    // g01-d04-a67: api observer case upload csv
    const url = `${BACKEND_URL}/admin-school/v1/schools/${schoolId}/observers/upload/csv`;
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
  UpdateObserverAccesses: function (
    observerId: string,
    accessIds: number[],
  ): Promise<BaseAPIResponse> {
    const url = `${BACKEND_URL}/admin-user-account/v1/observers/${observerId}/observer-accesses`;
    return fetchWithAuth(url, {
      method: 'PATCH',
      body: JSON.stringify({ observer_accesses: accessIds }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res: BaseAPIResponse) => {
        return res;
      });
  },
};

export default RestAPISchoolObserver;
