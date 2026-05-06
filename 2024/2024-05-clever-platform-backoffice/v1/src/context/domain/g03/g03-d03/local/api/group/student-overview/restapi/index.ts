import downloadCSV from '@global/utils/downloadCSV';

import fetchWithAuth from '@global/utils/fetchWithAuth';

import StoreGlobalPersist from '@store/global/persist';

import {
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';

import {
  StudentGroupOverViewFilterQueryParams,
  StudentGroupOverviewRepository,
} from '../../../repository/student-overview';
import {
  LastStudentLogin,
  Lesson,
  LessonProgress,
  NotStudentLogin,
  StudentOverview,
  SubLessonProgress,
  TopStudent,
} from '../types';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const StudentGroupOverviewRestAPI: StudentGroupOverviewRepository = {
  GetA01: function (
    query: StudentGroupOverViewFilterQueryParams,
  ): Promise<PaginationAPIResponse<Lesson>> {
    const url = `${BACKEND_URL}/teacher-student-group-overview/v1/lesson-filters`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<Lesson>) => {
        return res;
      });
  },
  GetA02: function (
    query: StudentGroupOverViewFilterQueryParams,
  ): Promise<PaginationAPIResponse<Lesson>> {
    const url = `${BACKEND_URL}/teacher-student-group-overview/v1/sub-lesson-filters`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<Lesson>) => {
        return res;
      });
  },
  GetA03: function (
    query: StudentGroupOverViewFilterQueryParams,
  ): Promise<PaginationAPIResponse<StudentOverview>> {
    const url = `${BACKEND_URL}/teacher-student-group-overview/v1/overview-stats`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<StudentOverview>) => {
        return res;
      });
  },
  GetA04: function (
    query: StudentGroupOverViewFilterQueryParams,
  ): Promise<PaginationAPIResponse<any>> {
    const url = `${BACKEND_URL}/teacher-student-group-overview/v1/level-overview`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<any>) => {
        return res;
      });
  },
  GetA05: function (
    query: StudentGroupOverViewFilterQueryParams,
  ): Promise<PaginationAPIResponse<TopStudent>> {
    const url = `${BACKEND_URL}/teacher-student-group-overview/v1/top-students`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<TopStudent>) => {
        return res;
      });
  },
  GetA06: function (
    query: StudentGroupOverViewFilterQueryParams,
  ): Promise<PaginationAPIResponse<LastStudentLogin>> {
    const url = `${BACKEND_URL}/teacher-student-group-overview/v1/last-logged-in-students`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<LastStudentLogin>) => {
        return res;
      });
  },
  GetA07: function (
    query: StudentGroupOverViewFilterQueryParams,
  ): Promise<PaginationAPIResponse<NotStudentLogin>> {
    const url = `${BACKEND_URL}/teacher-student-group-overview/v1/not-participate-students`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<NotStudentLogin>) => {
        return res;
      });
  },
  GetA08: function (
    query: StudentGroupOverViewFilterQueryParams,
  ): Promise<PaginationAPIResponse<LessonProgress>> {
    const url = `${BACKEND_URL}/teacher-student-group-overview/v1/lesson-progressions`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<LessonProgress>) => {
        return res;
      });
  },
  GetA09: function (
    query: StudentGroupOverViewFilterQueryParams,
  ): Promise<PaginationAPIResponse<SubLessonProgress>> {
    const url = `${BACKEND_URL}/teacher-student-group-overview/v1/sub-lesson-progressions`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<SubLessonProgress>) => {
        return res;
      });
  },
};

export default StudentGroupOverviewRestAPI;
