import { SchoolRepository } from '@domain/g01/g01-d04/local/api/repository/school.ts';
import {
  BulkEditRequest,
  ContractSubjectGroupRequest,
  ContractSubjectGroupResponse,
  CsvDownloadRequest,
  CurriculumGroupResponse,
  SchoolAffiliation,
  SchoolByIdResponse,
  SchoolContract,
  SchoolCreateRequest,
  SchoolResponse,
  SchoolUpdateRequest,
  SeedYearResponse,
  SubjectListRequest,
  SubjectListResponse,
} from '@domain/g01/g01-d04/local/type.ts';
import { getDateTime } from '@domain/g01/g01-d05/local/utils';
import {
  BasePaginationAPIQueryParams,
  DataAPIResponse,
  getQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import downloadCSV from '@global/utils/downloadCSV.ts';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const backendUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const SchoolRestAPI: SchoolRepository = {
  Gets: async function (
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<SchoolResponse>> {
    // g01-d04-a01: school list
    const url = `${backendUrl}/admin-school/v1/schools`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + `?${params.toString()}`)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<SchoolResponse>) => {
        return res;
      });
  },

  BulkEdit: async function (data: BulkEditRequest[]): Promise<void> {
    // g01-d04-a02: school bulkedit
    const url = `${backendUrl}/admin-school/v1/schools/bulk-edit`;

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

    console.log('Bulk edit successfully');
  },

  DownloadCSV: async function (query: CsvDownloadRequest): Promise<void> {
    // g01-d04-a03: school CSV download
    const url = `${backendUrl}/admin-school/v1/schools/download/csv`;
    const params = getQueryParams(query);

    const res = await fetchWithAuth(`${url}?${params.toString()}`);
    if (res.status !== 200) {
      throw new Error(`Failed to download school CSV: ${res.status} - ${res.statusText}`);
    }
    const blob = await res.blob();
    downloadCSV(blob, `${getDateTime()}_schools`);
  },

  UploadCSV: async function (data: { file: File }): Promise<void> {
    // g01-d04-a04: school CSV upload
    const url = `${backendUrl}/admin-school/v1/schools/upload/csv`;

    const formData = new FormData();
    formData.append('csv_file', data.file);

    const res = await fetchWithAuth(url, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      throw new Error('Failed to upload CSV');
    }
    await res.json();
    console.log('CSV uploaded successfully');
  },

  Update: async function (schoolId: string, data: SchoolUpdateRequest): Promise<void> {
    // g01-d04-a05: school update
    const url = `${backendUrl}/admin-school/v1/schools/${schoolId}`;

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
      throw new Error('Failed to update school');
    }

    console.log('School updated successfully');
  },

  Create: async function (data: SchoolCreateRequest): Promise<void> {
    // g01-d04-a06: school create
    const url = `${backendUrl}/admin-school/v1/schools`;

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
      throw new Error('Failed to create school');
    }

    console.log('School created successfully');
  },

  GetById: async function (schoolId: string): Promise<SchoolByIdResponse> {
    // g01-d04-a07: school get by id
    const url = `${backendUrl}/admin-school/v1/schools/${schoolId}`;

    const res = await fetchWithAuth(url);
    if (!res.ok) {
      throw new Error('Failed to fetch school');
    }

    const response = await res.json();
    return response.data;
  },

  GetSchoolAffiliations: async function (
    query: BasePaginationAPIQueryParams & {
      type?: string;
      school_affiliation_group?: string;
    },
  ): Promise<PaginationAPIResponse<SchoolAffiliation>> {
    // g01-d04-a08: school affiliations list
    const url = `${backendUrl}/admin-school/v1/school-affiliations`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([_, v]) => v !== undefined),
    );

    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    const res = await fetchWithAuth(`${url}?${params.toString()}`);

    if (!res.ok) {
      throw new Error('Failed to fetch school affiliations');
    }

    return await res.json();
  },

  // g01-d04-a10: get school contracts list
  GetContractList: async function (
    schoolId: string,
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<SchoolContract>> {
    const url = `${backendUrl}/admin-school/v1/schools/${schoolId}/contracts`;
    const params = getQueryParams(query);

    const res = await fetchWithAuth(url + '?' + params.toString());
    if (!res.ok) throw new Error(`Failed to fetch GetContractList: ${res.statusText}`);
    return res.json();
  },

  // g01-d04-a11-contract-subject-group
  GetContractSubjectGroup: async function (
    schoolId: string,
    contractId: string,
    query: ContractSubjectGroupRequest,
  ): Promise<PaginationAPIResponse<ContractSubjectGroupResponse>> {
    const url = `${backendUrl}/admin-school/v1/schools/${schoolId}/contracts/${contractId}/subject-group`;
    const params = new URLSearchParams(
      Object.entries(query)
        .filter(([_, value]) => value !== undefined)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: String(value) }), {}),
    );

    const res = await fetchWithAuth(`${url}?${params}`);

    if (!res.ok) throw new Error('Failed to fetch Contract Subject Group');

    return res.json();
  },

  // g01-d04-a12-school-subject
  GetSubjectList: async function (
    schoolId: string,
    query: SubjectListRequest,
  ): Promise<PaginationAPIResponse<SubjectListResponse>> {
    const url = `${backendUrl}/admin-school/v1/schools/${schoolId}/subjects`;
    const params = new URLSearchParams(
      Object.entries(query)
        .filter(([_, value]) => value !== undefined)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: String(value) }), {}),
    );

    const res = await fetchWithAuth(`${url}?${params}`);

    if (!res.ok) throw new Error('Failed to fetch school subjects list');

    return res.json();
  },

  // a22-api-curriculum-group-list
  GetCurriculumGroup: async function (
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<CurriculumGroupResponse>> {
    const url = `${backendUrl}/school-affiliations/v1/curriculum-groups/list`;
    const params = new URLSearchParams(
      Object.entries(query)
        .filter(([_, value]) => value !== undefined)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: String(value) }), {}),
    );

    const res = await fetchWithAuth(`${url}?${params}`);

    if (!res.ok) throw new Error('Failed to fetch school subjects list');

    return res.json();
  },

  // g01-d02-a48-api-seed-year-list
  GetSeedYear: async function (
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<SeedYearResponse>> {
    const url = `${backendUrl}/school-affiliations/v1/seed-years`;
    const params = new URLSearchParams(
      Object.entries(query)
        .filter(([_, value]) => value !== undefined)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: String(value) }), {}),
    );

    const res = await fetchWithAuth(`${url}?${params}`);

    if (!res.ok) throw new Error('Failed to fetch school subjects list');

    return res.json();
  },

  // g01-d04-a65-school-provinces-list
  GetProvincesList: async function (query: BasePaginationAPIQueryParams): Promise<
    PaginationAPIResponse<{
      province: string;
    }>
  > {
    const url = `${backendUrl}/admin-school/v1/school/provinces`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([_, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    const res = await fetchWithAuth(`${url}?${params.toString()}`);

    if (!res.ok) {
      throw new Error('Failed to fetch provinces list');
    }

    return res.json();
  },

  SubjectUpdate: function (
    school_id: number,
    subject_id: number,
    is_enabled: boolean,
  ): Promise<DataAPIResponse<any>> {
    const url = `${backendUrl}/admin-school/v1/schools/${school_id}/subjects/${subject_id}`;

    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ is_enabled }),
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<any>) => {
        console.log({ resApi: res });
        return res;
      });
  },
};

export default SchoolRestAPI;
