import {
  BaseAPIResponse,
  BasePaginationAPIQueryParams,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth.ts';

import { AccountStudentRepository } from '../../../repository/account-student';
import {
  AccountStudentOAuthResponse,
  AccountStudentProfileResponse,
  AccountStudentRequest,
  AccountStudentResponse,
  FamilyResponse,
  PlayingHistoryResponse,
} from '../type';

const backendUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const AccountStudentRestAPI: AccountStudentRepository = {
  // g03-d04-a01
  GetAccountStudent: async function (
    query: AccountStudentRequest,
  ): Promise<PaginationAPIResponse<AccountStudentResponse>> {
    const queryParams = new URLSearchParams(query as Record<string, string>);
    const url = `${backendUrl}/teacher-student/v1/students?${queryParams.toString()}`;
    const res = await fetchWithAuth(url);
    if (!res.ok) throw new Error(`Failed to fetch AccountStudent: ${res.statusText}`);
    return res.json();
  },

  // g03-d04-a02
  UpdateStudentPin: async function (
    studentId: string,
    newPin: string,
  ): Promise<BaseAPIResponse> {
    const url = `${backendUrl}/teacher-student/v1/students/${studentId}/pin`;
    const body = { new_pin: newPin };
    const res = await fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Failed to update PIN: ${res.statusText}`);
    return res.json();
  },

  // g03-d04-a03
  GetAccountStudentProfile: async function (
    studentId: string,
  ): Promise<DataAPIResponse<AccountStudentProfileResponse>> {
    const url = `${backendUrl}/teacher-student/v1/students/${studentId}/profile`;
    const res = await fetchWithAuth(url);
    if (!res.ok)
      throw new Error(`Failed to fetch AccountStudentProfile: ${res.statusText}`);
    return res.json();
  },

  // g03-d04-a04
  GetStudentOAuth: async function (
    studentId: string,
  ): Promise<PaginationAPIResponse<AccountStudentOAuthResponse>> {
    const url = `${backendUrl}/teacher-student/v1/students/${studentId}/oauth`;
    const res = await fetchWithAuth(url);
    if (!res.ok) throw new Error(`Failed to fetch OAuth details: ${res.statusText}`);
    return res.json();
  },

  // g03-d04-axx
  GetPlayingHistory: async function (
    studentId: string,
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<PlayingHistoryResponse>> {
    const url = `${backendUrl}/teacher-student/v1/students/${studentId}/levels/classes`;
    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([_, v]) => v !== undefined),
    );

    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    const res = await fetchWithAuth(`${url}?${params.toString()}`);
    if (!res.ok) throw new Error(`Failed to fetch playing history: ${res.statusText}`);
    return res.json();
  },

  // g03-d04-a07
  GetFamily: async function (
    studentId: string,
  ): Promise<PaginationAPIResponse<FamilyResponse>> {
    const url = `${backendUrl}/teacher-student/v1/students/${studentId}/family`;
    const res = await fetchWithAuth(url);
    if (!res.ok) throw new Error(`Failed to fetch family info: ${res.statusText}`);
    return res.json();
  },
};

export default AccountStudentRestAPI;
