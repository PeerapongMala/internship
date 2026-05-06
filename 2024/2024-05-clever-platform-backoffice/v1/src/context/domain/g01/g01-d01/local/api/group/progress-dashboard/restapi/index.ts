import {
  SchoolListQueryParams,
  TeacherClassStatFilterQueryParams,
  TeacherStatFilterQueryParams,
  TeacherDataResponse,
  TeacherClassStatResponse,
  FilterSchoolResponse,
  SchoolClassStatFilterQueryParams,
  SchoolTermFilterQueryParams,
  SchoolTermResponse,
  TBestStudentQueryParams,
} from './type';

import { ProgressDashboardRepository } from '../../../repository/progress-dashboard';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { PaginationAPIResponse } from '@global/utils/apiResponseHelper';
import { ICurriculum } from '@domain/g00/g00-d00/local/type';
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const ProgressDashboardRestAPI: ProgressDashboardRepository = {
  // Rest
  GetTeacher: async function (
    query: TeacherStatFilterQueryParams,
  ): Promise<PaginationAPIResponse<TeacherDataResponse>> {
    const { schoolId } = query;

    const url = new URL(
      `${BACKEND_URL}/admin-report/v1/dasboard/progress/school/${schoolId}/teachers`,
    );
    for (const [key, value] of Object.entries(query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value);
      }
    }
    // Workaround for BE not accept encodeURI
    const res = await fetchWithAuth(decodeURIComponent(url.toString()));
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.json();
  },
  GetFilterSchool: async function (
    query: SchoolListQueryParams,
  ): Promise<PaginationAPIResponse<FilterSchoolResponse>> {
    const url = new URL(`${BACKEND_URL}/admin-report/v1/dasboard/progress/schools`);

    for (const [key, value] of Object.entries(query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value);
      }
    }
    // Workaround for BE not accept encodeURI
    const res = await fetchWithAuth(decodeURIComponent(url.toString()));
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.json();
  },
  GetTeacherClassStat: async function (
    query: TeacherClassStatFilterQueryParams,
  ): Promise<PaginationAPIResponse<TeacherClassStatResponse>> {
    const { schoolId, teacherId, ...rest_query } = query;
    const url = new URL(
      `${BACKEND_URL}/admin-report/v1/dasboard/progress/school/${schoolId}/teachers/${teacherId}`,
    );

    for (const [key, value] of Object.entries(rest_query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value.toString());
      }
    }
    // Workaround for BE not accept encodeURI
    const res = await fetchWithAuth(decodeURIComponent(url.toString()));
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.json();
  },
  GetSchoolClassStat: async function (
    query: SchoolClassStatFilterQueryParams,
  ): Promise<PaginationAPIResponse<TeacherClassStatResponse>> {
    const { schoolId, ...rest_query } = query;
    const url = new URL(
      `${BACKEND_URL}/admin-report/v1/dasboard/progress/school/${schoolId}/classes`,
    );

    for (const [key, value] of Object.entries(rest_query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value.toString());
      }
    }
    // Workaround for BE not accept encodeURI
    const res = await fetchWithAuth(decodeURIComponent(url.toString()));
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.json();
  },
  GetClassLevel: async function (): Promise<PaginationAPIResponse<ICurriculum>> {
    const url = new URL(`${BACKEND_URL}/school-affiliations/v1/seed-years`);

    url.searchParams.set('page', '-1');
    url.searchParams.set('limit', '-1');

    const res = await fetchWithAuth(decodeURIComponent(url.toString()));
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.json();
  },
  GetAcademicYearRange: async function (
    query: SchoolTermFilterQueryParams,
  ): Promise<PaginationAPIResponse<SchoolTermResponse>> {
    const url = new URL(`${BACKEND_URL}/teacher-student/v1/academic-year-ranges`);

    for (const [key, value] of Object.entries(query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value.toString());
      }
    }
    // Workaround for BE not accept encodeURI
    const res = await fetchWithAuth(decodeURIComponent(url.toString()));
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.json();
  },
  GetBestStudentCSV: async function (query) {
    const url = new URL(`${BACKEND_URL}/admin-report/v1/best-students`);

    for (const [key, value] of Object.entries(query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value.toString());
      }
    }

    const res = await fetchWithAuth(decodeURIComponent(url.toString()));
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.text();
  },
  GetBestTeacherListByClassStar: async function (query) {
    const url = new URL(`${BACKEND_URL}/admin-report/v1/best-teachers/class-stars`);

    for (const [key, value] of Object.entries(query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value.toString());
      }
    }

    const res = await fetchWithAuth(decodeURIComponent(url.toString()));
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.text();
  },
  GetBestTeacherListByStudyGroupStar: async function (query) {
    const url = new URL(`${BACKEND_URL}/admin-report/v1/best-teachers/study-group-stars`);

    for (const [key, value] of Object.entries(query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value.toString());
      }
    }

    const res = await fetchWithAuth(decodeURIComponent(url.toString()));
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.text();
  },
  GetBestTeacherListByHomework: async function (query) {
    const url = new URL(`${BACKEND_URL}/admin-report/v1/best-teachers/homework`);

    for (const [key, value] of Object.entries(query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value.toString());
      }
    }

    const res = await fetchWithAuth(decodeURIComponent(url.toString()));
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.text();
  },
  GetBestTeacherListByLesson: async function (query) {
    const url = new URL(`${BACKEND_URL}/admin-report/v1/best-teachers/lesson`);

    for (const [key, value] of Object.entries(query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value.toString());
      }
    }

    const res = await fetchWithAuth(decodeURIComponent(url.toString()));
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.text();
  },
  GetBestSchoolByAvgClassStar: async function (query) {
    const url = new URL(`${BACKEND_URL}/admin-report/v1/best-schools/avg-class-stars`);

    for (const [key, value] of Object.entries(query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value.toString());
      }
    }

    const res = await fetchWithAuth(decodeURIComponent(url.toString()));
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.text();
  },
};

export default ProgressDashboardRestAPI;
