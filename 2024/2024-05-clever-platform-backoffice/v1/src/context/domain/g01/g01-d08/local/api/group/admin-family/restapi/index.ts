import {
  FamilyListResponse,
  FamilyMemberListByParentResponse,
  FamilyMemberListByStudentResponse,
  ParamsDownloadCsv,
  ParamsSaveAdminFamily,
  ParamsFamilyMemberListByParent,
  ParamsBulkEditMemberListByParent,
  ParamsFamilyMemberListByStudent,
  FamilyMemberResponse,
  ParamsStudentList,
  DropdownSchoolListResponse,
  DropdownYearListRequest,
  DropdownClassListRequest,
  DropdownClassListResponse,
} from '@domain/g01/g01-d08/local/api/group/admin-family/type.ts';
import { AdminFamilyRepository } from '@domain/g01/g01-d08/local/api/repository/admin-family.ts';
import {
  BaseAPIResponse,
  BasePaginationAPIQueryParams,
  DataAPIResponse,
  FailedAPIResponse,
  getQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper.ts';
import fetchWithAuth from '@global/utils/fetchWithAuth.ts';
import { BulkEditRequest } from '@domain/g01/g01-d04/local/type.ts';

const backendUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const AdminFamilyRestAPI: AdminFamilyRepository = {
  // g01-d08-a01 // TODO: search option
  GetFamilyList: async function (
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<FamilyListResponse>> {
    const url = `${backendUrl}/admin-family/v1/info/families`;
    const params = getQueryParams(query);
    const res = await fetchWithAuth(url + '?' + params.toString());
    if (!res.ok) throw new Error(`Failed to fetch GetFamilyList: ${res.statusText}`);
    return res.json();
  },

  // g01-d08-a02
  GetFamilyInfo: async function (
    family_id: number,
  ): Promise<DataAPIResponse<FamilyListResponse>> {
    const url = `${backendUrl}/admin-family/v1/info/family/${family_id}`;
    const res = await fetchWithAuth(url);
    if (!res.ok) throw new Error(`Failed to fetch GetFamilyInfo: ${res.statusText}`);
    return res.json();
  },

  // g01-d08-a03
  GetFamilyMemberOwner: async function (
    family_id: number,
  ): Promise<PaginationAPIResponse<FamilyListResponse>> {
    const url = `${backendUrl}/admin-family/v1/info/family/${family_id}/members`;
    const res = await fetchWithAuth(url);
    if (!res.ok)
      throw new Error(`Failed to fetch GetFamilyMemberOwner: ${res.statusText}`);
    return res.json();
  },

  // g01-d08-a04
  UpdateFamilyOwner: async function (
    family_id: number,
    user_id: string,
  ): Promise<BaseAPIResponse> {
    const url = `${backendUrl}/admin-family/v1/info/family/${family_id}/owner`;
    const res = await fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ user_id }),
    });
    if (!res.ok) throw new Error(`Failed to edit family status: ${res.statusText}`);
    return res.json();
  },

  // g01-d08-a08
  PatchFamilyStatus: async function (
    family_id: number,
    status: string,
  ): Promise<BaseAPIResponse> {
    const url = `${backendUrl}/admin-family/v1/family/${family_id}/${status}`;
    const res = await fetchWithAuth(url, {
      method: 'PATCH',
    });
    if (!res.ok) throw new Error(`Failed to edit family status: ${res.statusText}`);
    return res.json();
  },

  // g01-d08-a09 download csv
  DownloadFamilyList: async function (
    family_id: string,
    query: ParamsDownloadCsv,
  ): Promise<Blob | FailedAPIResponse> {
    const url = `${backendUrl}/admin-family/v1/family/${family_id}/download/csv`;
    const params = getQueryParams(query);

    const res = await fetchWithAuth(`${url}?${params.toString()}`);
    if (res.status !== 200) {
      throw new Error(`Failed to download Reward CSV: ${res.status} - ${res.statusText}`);
    }
    return res.blob();
  },

  // g01-d08-a11
  GetFamilyMemberListByParent: async function (
    family_id: number,
    query?: ParamsFamilyMemberListByParent,
  ): Promise<PaginationAPIResponse<FamilyMemberListByParentResponse>> {
    const url = `${backendUrl}/admin-family/v1/family/${family_id}/parent`;
    const params = (query && getQueryParams(query)) || new URLSearchParams();
    const res = await fetchWithAuth(url + '?' + params.toString());
    if (!res.ok) throw new Error(`Failed to fetch GetFamilyList: ${res.statusText}`);
    return res.json();
  },

  GetFamilyMemberListByStudent: async function (
    family_id: number,
    query?: ParamsFamilyMemberListByStudent,
  ): Promise<PaginationAPIResponse<FamilyMemberListByStudentResponse>> {
    const url = `${backendUrl}/admin-family/v1/family/${family_id}/student`;
    const params = (query && getQueryParams(query)) || new URLSearchParams();
    const res = await fetchWithAuth(url + '?' + params.toString());
    if (!res.ok) throw new Error(`Failed to fetch GetFamilyList: ${res.statusText}`);
    return res.json();
  },

  // g01-d08-a12
  GetParentList: async function (
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<FamilyMemberListByParentResponse>> {
    const url = `${backendUrl}/admin-family/v1/parents`;
    const params = getQueryParams(query);
    const res = await fetchWithAuth(url + '?' + params.toString());
    if (!res.ok) throw new Error(`Failed to fetch GetParentList: ${res.statusText}`);
    return res.json();
  },

  // g01-d08-a10
  SaveAdminFamily: async function (
    data: ParamsSaveAdminFamily,
  ): Promise<BaseAPIResponse> {
    const url = `${backendUrl}/admin-family/v1/family`;

    const res = await fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error('Failed to SaveAdminFamily');
    } else {
      return res.json();
    }
  },

  // g01-d08-a07
  AddFamilyMember: async function (
    users_id: string[],
    family_id: string,
  ): Promise<BaseAPIResponse> {
    const url = `${backendUrl}/admin-family/v1/family/${family_id}/member`;

    const res = await fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ users_id }),
    });

    if (!res.ok) {
      throw new Error('Failed to AddFamilyMember');
    } else {
      return res.json();
    }
  },

  // g01-d08-a15
  DeleteMemberListByParent: async function (
    family_id: number,
    user_id: string,
  ): Promise<BaseAPIResponse> {
    const url = `${backendUrl}/admin-family/v1/${family_id}/member`;
    const params = getQueryParams({ user_id });

    const res = await fetchWithAuth(url + '?' + params.toString(), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('Failed to delete member');
    } else {
      return res.json();
    }
  },

  // g01-d08-a13
  GetStudentList: async function (
    query: BasePaginationAPIQueryParams & ParamsStudentList,
  ): Promise<PaginationAPIResponse<FamilyMemberResponse>> {
    const url = `${backendUrl}/admin-family/v1/students`;
    const params = getQueryParams(query);
    const res = await fetchWithAuth(url + '?' + params.toString());
    if (!res.ok) throw new Error(`Failed to fetch GetParentList: ${res.statusText}`);
    return res.json();
  },

  // g01-d08-a16
  GetDropdownSchoolList: async function (): Promise<
    PaginationAPIResponse<DropdownSchoolListResponse>
  > {
    const url = `${backendUrl}/admin-family/v1/dropdown/school?page=1&limit=-1`;
    const res = await fetchWithAuth(url);
    if (!res.ok)
      throw new Error(`Failed to fetch GetDropdownSchoolList: ${res.statusText}`);
    return res.json();
  },

  // g01-d08-a17
  GetDropdownAcademicYearList: async function (): Promise<
    PaginationAPIResponse<number[]>
  > {
    const url = `${backendUrl}/admin-family/v1/dropdown/academic-year?page=1&limit=-1`;
    const res = await fetchWithAuth(url);
    if (!res.ok)
      throw new Error(`Failed to fetch GetDropdownAcademicYearList: ${res.statusText}`);
    return res.json();
  },

  // g01-d08-a18
  GetDropdownYearList: async function (
    query: DropdownYearListRequest,
  ): Promise<PaginationAPIResponse<string[]>> {
    const url = `${backendUrl}/admin-family/v1/dropdown/year`;
    const params = getQueryParams({ ...query, page: 1, limit: -1 });
    const res = await fetchWithAuth(url + '?' + params.toString());
    if (!res.ok)
      throw new Error(`Failed to fetch GetDropdownYearList: ${res.statusText}`);
    return res.json();
  },

  // g01-d08-a19
  GetDropdownClassList: async function (
    query: DropdownClassListRequest,
  ): Promise<PaginationAPIResponse<DropdownClassListResponse>> {
    const url = `${backendUrl}/admin-family/v1/dropdown/class`;
    const params = getQueryParams({ ...query, page: 1, limit: -1 });
    const res = await fetchWithAuth(url + '?' + params.toString());
    if (!res.ok)
      throw new Error(`Failed to fetch GetDropdownClassList: ${res.statusText}`);
    return res.json();
  },

  // g01-d08-a20
  BulkEditMemberListByParent: async function (
    family_id: number,
    data: ParamsBulkEditMemberListByParent,
  ): Promise<BaseAPIResponse> {
    const url = `${backendUrl}/admin-family/v1/bulk-edit/user/${family_id}`;
    const body = {
      users: data.users,
    };

    const res = await fetchWithAuth(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error('Failed to perform bulk edit');
    } else {
      return res.json();
    }
  },

  // a14-api-family-bulk-edit
  BulkEditFamilyList: async function (family_ids: number[]): Promise<BaseAPIResponse> {
    const url = `${backendUrl}/admin-family/v1/bulk-edit`;

    const body = {
      family_ids: family_ids,
    };

    return fetchWithAuth(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },

  // g01-d08-a21
  DeleteFamily: async function (
    family_id: number,
    password: string,
  ): Promise<BaseAPIResponse> {
    const url = `${backendUrl}/admin-family/v1/family`;
    const body = {
      family_id,
      password,
    };

    return fetchWithAuth(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
};

export default AdminFamilyRestAPI;
