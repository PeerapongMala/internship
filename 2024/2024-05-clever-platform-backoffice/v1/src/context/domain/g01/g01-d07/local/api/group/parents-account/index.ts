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
import {
  BasePaginationAPIQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import downloadCSV from '@global/utils/downloadCSV.ts';
import { getDateTime } from '@domain/g01/g01-d05/local/utils';
import { UserAccountResponse, ParentsAccountResponse } from '../../../type.ts';
import { ParentsAccountRepository } from '../../repository/parents-account.ts';

const backendUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const ParentsAccountRestAPI: ParentsAccountRepository = {
  Gets: async function (
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<ParentsAccountResponse>> {
    // g07-d00-a01: parents account list
    const url = `${backendUrl}/admin-user-account/v1/parents`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + `?${params.toString()}`)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<ParentsAccountResponse>) => {
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
  GetById: async function (id: string): Promise<ParentsAccountResponse> {
    const url = `${backendUrl}/admin-user-account/v1/parents/${id}`;

    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error('Failed to fetch parent account');
    }

    const result = await response.json();
    return result.data[0];
  },
};

export default ParentsAccountRestAPI;
