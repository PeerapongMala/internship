import {
  FailedAPIResponse,
  getQueryParams,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';

import { StudentGroupResearchRepository } from '@domain/g03/g03-d03/local/api/repository/student-group-research';

import fetchWithAuth from '@global/utils/fetchWithAuth';

import {
  TTestPairModelStatListResponse,
  StudentGroupResearchQueryParams,
  TTestPairModelStatResponse,
  LessonResponse,
  SubLessonResponse,
  LevelResponse,
  DDRScoreResultResponse,
  DDRSummaryResultResponse,
} from '../type';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const StudentGroupResearchRestAPI: StudentGroupResearchRepository = {
  GetResearchTTestPairModelStatCSV: async function (
    studyGroupId: number,
    params: StudentGroupResearchQueryParams,
  ): Promise<Blob | FailedAPIResponse> {
    const url = `${BACKEND_URL}/teacher-student-group/v1/study-group/${studyGroupId}/research-t-test-pair-model-stat/csv`;

    const queryParams = getQueryParams(params);

    return fetchWithAuth(`${url}?${queryParams.toString()}`).then((res) => {
      if (res.status === 200) {
        return res.blob();
      } else {
        throw new Error('Failed to fetch GetResearchTTestPairModelStatCSV');
      }
    });
  },

  GetTTestPairModelStatList: async function (
    studentGroupId: number,
    query: StudentGroupResearchQueryParams,
  ): Promise<PaginationAPIResponse<TTestPairModelStatListResponse>> {
    const url = `${BACKEND_URL}/teacher-student-group/v1/study-group/${studentGroupId}/research-t-test-pair-model-stat/list`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([_, v]) => v !== undefined),
    );

    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    const res = await fetchWithAuth(`${url}?${params.toString()}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch GetTTestPairModelStatList: ${res.statusText}`);
    }
    return await res.json();
  },

  GetTTestPairModelStatResult: async function (
    studentGroupId: number,
    query: StudentGroupResearchQueryParams,
  ): Promise<DataAPIResponse<TTestPairModelStatResponse>> {
    const url = `${BACKEND_URL}/teacher-student-group/v1/study-group/${studentGroupId}/research-t-test-pair-model-stat/result`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([_, v]) => v !== undefined),
    );

    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    const res = await fetchWithAuth(`${url}?${params.toString()}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch GetTTestPairModelStatResult: ${res.statusText}`);
    }
    return await res.json();
  },

  GetLessonParams: async function (
    studentGroupId: number,
  ): Promise<PaginationAPIResponse<LessonResponse>> {
    const url = `${BACKEND_URL}/teacher-student-group/v1/study-group/${studentGroupId}/params/lesson`;

    const res = await fetchWithAuth(`${url}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch GetLessonParams: ${res.statusText}`);
    }
    return await res.json();
  },

  GetSubLessonParams: async function (
    studentGroupId: number,
    lesson_id: string,
  ): Promise<PaginationAPIResponse<SubLessonResponse>> {
    const url = `${BACKEND_URL}/teacher-student-group/v1/study-group/${studentGroupId}/params/sub-lesson`;

    const params = getQueryParams({ lesson_id });

    const res = await fetchWithAuth(`${url}?${params.toString()}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch GetSubLessonParams: ${res.statusText}`);
    }
    return await res.json();
  },
  GetLevelParams: async function (
    studentGroupId: number,
    sub_lesson_id: string,
  ): Promise<PaginationAPIResponse<LevelResponse>> {
    const url = `${BACKEND_URL}/teacher-student-group/v1/study-group/${studentGroupId}/params/level`;

    const params = getQueryParams({ sub_lesson_id });

    const res = await fetchWithAuth(`${url}?${params.toString()}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch GetLevelParams: ${res.statusText}`);
    }
    return await res.json();
  },

  GetDDRScoreResultCsv: async function (
    studyGroupId: number,
    params: {
      search?: string;
      level_id?: string;
    },
  ): Promise<Blob | FailedAPIResponse> {
    const url = `${BACKEND_URL}/teacher-student-group/v1/study-group/${studyGroupId}/ddr/score/csv`;

    const queryParams = getQueryParams(params);

    return fetchWithAuth(`${url}?${queryParams.toString()}`).then((res) => {
      if (res.status === 200) {
        return res.blob();
      } else {
        throw new Error('Failed to fetch GetDDRScoreResultCsv');
      }
    });
  },

  GetDDRSummaryResultCsv: async function (
    studyGroupId: number,
    params: {
      level_id?: string;
    },
  ): Promise<Blob | FailedAPIResponse> {
    const url = `${BACKEND_URL}/teacher-student-group/v1/study-group/${studyGroupId}/ddr/summary/csv`;

    const queryParams = getQueryParams(params);

    return fetchWithAuth(`${url}?${queryParams.toString()}`).then((res) => {
      if (res.status === 200) {
        return res.blob();
      } else {
        throw new Error('Failed to fetch GetDDRSummaryResultCsv');
      }
    });
  },

  GetDDRScoreResult: async function (
    studentGroupId: number,
    query: StudentGroupResearchQueryParams,
  ): Promise<PaginationAPIResponse<DDRScoreResultResponse>> {
    const url = `${BACKEND_URL}/teacher-student-group/v1/study-group/${studentGroupId}/ddr/score`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([_, v]) => v !== undefined),
    );

    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    const res = await fetchWithAuth(`${url}?${params.toString()}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch GetDDRScoreResult: ${res.statusText}`);
    }
    return await res.json();
  },

  GetDDRSummaryResult: async function (
    studentGroupId: number,
    params: {
      level_id?: string;
    },
  ): Promise<PaginationAPIResponse<DDRSummaryResultResponse>> {
    const url = `${BACKEND_URL}/teacher-student-group/v1/study-group/${studentGroupId}/ddr/summary`;

    // const queryParams = getQueryParams(params);

    // const res = await fetchWithAuth(`${url}?${queryParams.toString()}`);

    const filterQuery = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined),
    );

    const req = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    const res = await fetchWithAuth(`${url}?${req.toString()}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch GetDDRSummaryResult: ${res.statusText}`);
    }
    return await res.json();
  },
};

export default StudentGroupResearchRestAPI;
