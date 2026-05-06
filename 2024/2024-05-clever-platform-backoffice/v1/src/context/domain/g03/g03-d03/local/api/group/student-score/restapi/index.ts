import {
  FailedAPIResponse,
  getQueryParams,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';

import { StudentGroupScoreRepository } from '@domain/g03/g03-d03/local/api/repository/student-group-score';

import fetchWithAuth from '@global/utils/fetchWithAuth';
import {
  GetStudyGroupStatListRequest,
  GetStudyGroupStatOptionsResponse,
  GetStudyGroupStatListResponse,
} from '../type';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const StudentGroupScoreRestAPI: StudentGroupScoreRepository = {
  GetStatOptions: async function (
    optionType: string,
    studyGroupId: number,
  ): Promise<DataAPIResponse<GetStudyGroupStatOptionsResponse>> {
    const url = `${BACKEND_URL}/teacher-student-group/v1/study-group/${studyGroupId}/stat/options?option_type=${optionType}`;

    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<GetStudyGroupStatOptionsResponse[]>) => {
        if (res.status_code === 200) {
          return res as unknown as DataAPIResponse<GetStudyGroupStatOptionsResponse>;
        }
        throw new Error('No data found or unexpected response format');
      });
  },
  GetLessonStatList: async function (
    studentGroupId: number,
    query: GetStudyGroupStatListRequest,
  ): Promise<PaginationAPIResponse<GetStudyGroupStatListResponse>> {
    const url = `${BACKEND_URL}/teacher-student-group/v1/study-group/${studentGroupId}/stat/list`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([_, v]) => v !== undefined),
    );

    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    const res = await fetchWithAuth(`${url}?${params.toString()}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch GetListStat: ${res.statusText}`);
    }
    return await res.json();
  },

  DownloadStatCSV: function (
    studyGroupId: number,
    query: GetStudyGroupStatListRequest,
  ): Promise<Blob | FailedAPIResponse> {
    let url = `${BACKEND_URL}/teacher-student-group/v1/study-group/${studyGroupId}/stat/csv`;
    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString()).then((res) => {
      if (res.status == 200) {
        return res.blob();
      } else {
        return res.json();
      }
    });
  },

  GetSubLessonStatOptions: async function (
    optionType: string,
    studyGroupId: number,
    lessonId: number,
  ): Promise<DataAPIResponse<GetStudyGroupStatOptionsResponse>> {
    const url = `${BACKEND_URL}/teacher-student-group/v1/study-group/${studyGroupId}/stat/options?option_type=${optionType}&lesson_id=${lessonId}`;

    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<GetStudyGroupStatOptionsResponse[]>) => {
        if (res.status_code === 200) {
          return res as unknown as DataAPIResponse<GetStudyGroupStatOptionsResponse>;
        }
        throw new Error('No data found or unexpected response format');
      });
  },

  GetStatSubLessonList: async function (
    studentGroupId: number,
    query: GetStudyGroupStatListRequest,
  ): Promise<PaginationAPIResponse<GetStudyGroupStatListResponse>> {
    const url = `${BACKEND_URL}/teacher-student-group/v1/study-group/${studentGroupId}/stat/lessonId/${query.lesson_id}/list`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([_, v]) => v !== undefined),
    );

    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    const res = await fetchWithAuth(`${url}?${params.toString()}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch GetListStat: ${res.statusText}`);
    }
    return await res.json();
  },

  DownloadSubLessonStatCSV: function (
    studyGroupId: number,
    query: GetStudyGroupStatListRequest,
  ): Promise<Blob | FailedAPIResponse> {
    let url = `${BACKEND_URL}/teacher-student-group/v1/study-group/${studyGroupId}/stat/lessonId/${query.lesson_id}/csv`;
    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString()).then((res) => {
      if (res.status == 200) {
        return res.blob();
      } else {
        return res.json();
      }
    });
  },

  GetLevelStatList: async function (
    studentGroupId: number,
    query: GetStudyGroupStatListRequest,
  ): Promise<PaginationAPIResponse<GetStudyGroupStatListResponse>> {
    const url = `${BACKEND_URL}/teacher-student-group/v1/study-group/${studentGroupId}/stat/subLessonId/${query.sub_lesson_id}/list`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([_, v]) => v !== undefined),
    );

    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    const res = await fetchWithAuth(`${url}?${params.toString()}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch GetListStat: ${res.statusText}`);
    }
    return await res.json();
  },

  DownloadLevelStatCSV: function (
    studyGroupId: number,
    query: GetStudyGroupStatListRequest,
  ): Promise<Blob | FailedAPIResponse> {
    let url = `${BACKEND_URL}/teacher-student-group/v1/study-group/${studyGroupId}/stat/subLessonId/${query.sub_lesson_id}/csv`;
    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString()).then((res) => {
      if (res.status == 200) {
        return res.blob();
      } else {
        return res.json();
      }
    });
  },
};

export default StudentGroupScoreRestAPI;
