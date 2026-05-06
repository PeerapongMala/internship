import downloadCSV from '@global/utils/downloadCSV';

import fetchWithAuth from '@global/utils/fetchWithAuth';
import { DashboardRepository, FilterQueryParams } from '../../../repository';
import StoreGlobalPersist from '@store/global/persist';

import {
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import {
  Academicyear,
  Classroom,
  LatestHomework,
  Lesson,
  Level,
  questionOverview,
  resLesson,
  resSubLesson,
  Score,
  ScoreMax,
  ScoreMin,
  Subject,
  TotalStudent,
  Year,
} from '@domain/g03/g03-d01/local/type';
import { ResHomework } from '../../../../type';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const RestAPIDashboard: DashboardRepository = {
  GetA01: function (
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<Academicyear>> {
    const url = `${BACKEND_URL}/teacher-dashboard/v1/academic-year-filters`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<Academicyear>) => {
        return res;
      });
  },
  GetA02: function (query: FilterQueryParams): Promise<PaginationAPIResponse<Year>> {
    const url = `${BACKEND_URL}/teacher-dashboard/v1/year-filters`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<Year>) => {
        return res;
      });
  },
  GetA03: function (query: FilterQueryParams): Promise<PaginationAPIResponse<Classroom>> {
    const url = `${BACKEND_URL}/teacher-dashboard/v1/class-filters`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<Classroom>) => {
        return res;
      });
  },
  GetA04: function (
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<TotalStudent>> {
    const url = `${BACKEND_URL}/teacher-dashboard/v1/total-students`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<TotalStudent>) => {
        return res;
      });
  },
  GetA05: function (
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<LatestHomework>> {
    const url = `${BACKEND_URL}/teacher-dashboard/v1/latest-homework-overview`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<LatestHomework>) => {
        return res;
      });
  },
  GetA06: function (query: FilterQueryParams): Promise<PaginationAPIResponse<Level>> {
    const url = `${BACKEND_URL}/teacher-dashboard/v1/level-overview`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<Level>) => {
        return res;
      });
  },
  GetA07: function (query: FilterQueryParams): Promise<PaginationAPIResponse<Score>> {
    const url = `${BACKEND_URL}/teacher-dashboard/v1/score-overview`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<Score>) => {
        return res;
      });
  },
  GetA08: function (
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<questionOverview>> {
    const url = `${BACKEND_URL}/teacher-dashboard/v1/question-overview`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<questionOverview>) => {
        return res;
      });
  },
  GetA09: function (query: FilterQueryParams): Promise<PaginationAPIResponse<Subject>> {
    const url = `${BACKEND_URL}/teacher-dashboard/v1/subject-filters`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<Subject>) => {
        return res;
      });
  },
  GetA10: function (query: FilterQueryParams): Promise<PaginationAPIResponse<Lesson>> {
    const url = `${BACKEND_URL}/teacher-dashboard/v1/lesson-filters`;

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
  GetA11: function (query: FilterQueryParams): Promise<PaginationAPIResponse<ScoreMax>> {
    const url = `${BACKEND_URL}/teacher-dashboard/v1/top-students`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<ScoreMax>) => {
        return res;
      });
  },
  GetA12: function (query: FilterQueryParams): Promise<PaginationAPIResponse<ScoreMin>> {
    const url = `${BACKEND_URL}/teacher-dashboard/v1/bottom-students`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<ScoreMin>) => {
        return res;
      });
  },
  GetA13: function (query: FilterQueryParams): Promise<PaginationAPIResponse<resLesson>> {
    const url = `${BACKEND_URL}/teacher-dashboard/v1/lesson-overview`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<resLesson>) => {
        return res;
      });
  },
  GetA14: function (
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<resSubLesson>> {
    const url = `${BACKEND_URL}/teacher-dashboard/v1/sub-lesson-overview`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<resSubLesson>) => {
        return res;
      });
  },
  GetA15: function (
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<ResHomework>> {
    const url = `${BACKEND_URL}/teacher-dashboard/v1/homework-overview`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<ResHomework>) => {
        return res;
      });
  },
};

export default RestAPIDashboard;
