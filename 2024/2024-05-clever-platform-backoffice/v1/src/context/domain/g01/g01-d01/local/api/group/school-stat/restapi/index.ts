import { SchoolStatRepository } from '@domain/g01/g01-d01/local/api/repository/school-stat';
import {
  BasePaginationAPIQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import fetchWithAuth, { FetchOptions } from '@global/utils/fetchWithAuth';
import {
  SchoolStatTableResponse,
  SchoolStatTableQuery,
  SchoolStatClassTableQuery,
  SchoolStatClassTableResponse,
  SchoolStatStudentTableQuery,
  SchoolStatStudentTableResponse,
  LessonDropdownFilterResponse,
  LessonDropdownFilterQuery,
  SchoolStatLessonTableQuery,
  SchoolStatLessonTableResponse,
  SchoolStatSubLessonTableQuery,
  SchoolStatSubLessonTableResponse,
  SubLessonDropdownFilterQuery,
  SubLessonDropdownFilterResponse,
  SchoolStatLevelTableQuery,
  SchoolStatLevelTableResponse,
  AcademicYearDropdownFilterQuery,
  SchoolStatPlayLogTableQuery,
  SchoolStatPlayLogTableResponse,
  GetLevelQuery,
  GetPlayLogQuery,
} from '@domain/g01/g01-d01/local/api/group/school-stat/type';
import { getDateTime } from '@domain/g01/g01-d05/local/utils';
import downloadCSV from '@global/utils/downloadCSV';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const SchoolStatRestAPI: SchoolStatRepository = {
  GetSchoolTable: async function (
    query: BasePaginationAPIQueryParams & SchoolStatTableQuery,
    options,
  ): Promise<PaginationAPIResponse<SchoolStatTableResponse>> {
    const url = new URL(`${BACKEND_URL}/admin-report/v1/school-reports`);

    for (const [key, value] of Object.entries(query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value);
      }
    }
    // Workaround for BE not accept encodeURI
    const res = await fetchWithAuth(decodeURIComponent(url.toString()), options);
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.json();
  },
  GetClassTable: async function (
    query: BasePaginationAPIQueryParams & SchoolStatClassTableQuery,
    options,
  ): Promise<PaginationAPIResponse<SchoolStatClassTableResponse>> {
    const { school_id, search_text, ...rest_query } = query;

    const url = new URL(
      `${BACKEND_URL}/admin-report/v1/schools/${school_id}/class-reports`,
    );

    for (const [key, value] of Object.entries(rest_query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value.toString());
      }
    }

    if (search_text != '' && typeof search_text != 'undefined') {
      const SEARCHABLE_KEYS = ['academic_year'];
      for (const key of SEARCHABLE_KEYS) {
        url.searchParams.set(key, search_text);
      }
    }

    const res = await fetchWithAuth(decodeURIComponent(url.toString()), options);
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.json();
  },
  GetStudentTable: async function (
    query: BasePaginationAPIQueryParams & SchoolStatStudentTableQuery,
    options,
  ): Promise<PaginationAPIResponse<SchoolStatStudentTableResponse>> {
    const { class_id, search_text, ...rest_query } = query;

    const url = new URL(
      `${BACKEND_URL}/admin-report/v1/classes/${class_id}/student-reports`,
    );

    for (const [key, value] of Object.entries(rest_query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value.toString());
      }
    }

    if (search_text != '' && typeof search_text != 'undefined') {
      const SEARCHABLE_KEYS = ['student_id'];
      for (const key of SEARCHABLE_KEYS) {
        url.searchParams.set(key, search_text);
      }
    }

    const res = await fetchWithAuth(decodeURIComponent(url.toString()), options);
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.json();
  },
  GetLessonTable: async function (
    query: BasePaginationAPIQueryParams & SchoolStatLessonTableQuery,
    options?: FetchOptions,
  ): Promise<PaginationAPIResponse<SchoolStatLessonTableResponse>> {
    const { student_user_id, search_text, ...rest_query } = query;

    const url = new URL(
      `${BACKEND_URL}/admin-report/v1/users/${student_user_id}/lesson-reports`,
    );

    for (const [key, value] of Object.entries(rest_query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value.toString());
      }
    }

    if (search_text != '' && typeof search_text != 'undefined') {
      const SEARCHABLE_KEYS = ['curriculum_group_name'];
      for (const key of SEARCHABLE_KEYS) {
        url.searchParams.set(key, search_text);
      }
    }

    const res = await fetchWithAuth(decodeURIComponent(url.toString()), options);
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.json();
  },
  GetSubLessonTable: async function (
    query: BasePaginationAPIQueryParams & SchoolStatSubLessonTableQuery,
  ): Promise<PaginationAPIResponse<SchoolStatSubLessonTableResponse>> {
    const { student_user_id, lesson_id, search_text, ...rest_query } = query;

    const url = new URL(
      `${BACKEND_URL}/admin-report/v1/users/${student_user_id}/lessons/${lesson_id}/sub-lesson-reports`,
    );

    for (const [key, value] of Object.entries(rest_query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value.toString());
      }
    }

    if (search_text != '' && typeof search_text != 'undefined') {
      const SEARCHABLE_KEYS = ['sub_lesson_name'];
      for (const key of SEARCHABLE_KEYS) {
        url.searchParams.set(key, search_text);
      }
    }

    const res = await fetchWithAuth(decodeURIComponent(url.toString()));
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.json();
  },
  GetLevelTable: async function (
    query: BasePaginationAPIQueryParams & SchoolStatLevelTableQuery,
  ): Promise<PaginationAPIResponse<SchoolStatLevelTableResponse>> {
    const { student_user_id, sub_lesson_id, search_text, ...rest_query } = query;

    const url = new URL(
      `${BACKEND_URL}/admin-report/v1/users/${student_user_id}/sub-lessons/${sub_lesson_id}/level-reports`,
    );

    for (const [key, value] of Object.entries(rest_query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value.toString());
      }
    }

    if (search_text != '' && typeof search_text != 'undefined') {
      // No search key
      const SEARCHABLE_KEYS = ['level_index'];
      for (const key of SEARCHABLE_KEYS) {
        url.searchParams.set(key, search_text);
      }
    }

    const res = await fetchWithAuth(decodeURIComponent(url.toString()));
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.json();
  },
  GetPlayLogTable: async function (
    query: BasePaginationAPIQueryParams & SchoolStatPlayLogTableQuery,
  ): Promise<PaginationAPIResponse<SchoolStatPlayLogTableResponse>> {
    const { student_user_id, level_id, ...rest_query } = query;

    const url = new URL(
      `${BACKEND_URL}/admin-report/v1/users/${student_user_id}/level/${level_id}/level-play-logs`,
    );

    for (const [key, value] of Object.entries(rest_query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value.toString());
      }
    }

    const res = await fetchWithAuth(decodeURIComponent(url.toString()));
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.json();
  },
  DownloadSchoolCSV: async function (
    query: BasePaginationAPIQueryParams & SchoolStatTableQuery,
  ): Promise<void> {
    const url = new URL(`${BACKEND_URL}/admin-report/v1/school-reports/csv`);

    for (const [key, value] of Object.entries(query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value);
      }
    }

    const res = await fetchWithAuth(decodeURIComponent(url.toString()));

    if (!res.ok) {
      throw new Error('Failed to download CSV');
    }
    const blob = await res.blob();
    downloadCSV(blob, `${getDateTime()}_school-stats-school`);
  },
  DownloadClassCSV: async function (
    query: BasePaginationAPIQueryParams & SchoolStatClassTableQuery,
  ): Promise<void> {
    const { school_id, ...queryWithoutSchoolId } = query;

    const url = new URL(`${BACKEND_URL}/admin-report/v1/${school_id}/class-reports/csv`);

    for (const [key, value] of Object.entries(queryWithoutSchoolId)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, String(value));
      }
    }

    const res = await fetchWithAuth(decodeURIComponent(url.toString()));

    if (!res.ok) {
      throw new Error('Failed to download CSV');
    }
    const blob = await res.blob();
    downloadCSV(blob, `${getDateTime()}_school-stats-class`);
  },
  DownloadStudentCSV: async function (
    query: BasePaginationAPIQueryParams & SchoolStatStudentTableQuery,
  ): Promise<void> {
    const { class_id } = query;

    const url = new URL(`${BACKEND_URL}/admin-report/v1/${class_id}/student-reports/csv`);

    for (const [key, value] of Object.entries(query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value);
      }
    }

    const res = await fetchWithAuth(decodeURIComponent(url.toString()));

    if (!res.ok) {
      throw new Error('Failed to download CSV');
    }
    const blob = await res.blob();
    downloadCSV(blob, `${getDateTime()}_school-stats-student`);
  },
  DownloadLessonCSV: async function (
    query: BasePaginationAPIQueryParams & SchoolStatLessonTableQuery,
  ): Promise<void> {
    const { student_user_id, ...rest_query } = query;

    const url = new URL(
      `${BACKEND_URL}/admin-report/v1/${student_user_id}/lesson-reports/csv`,
    );

    for (const [key, value] of Object.entries(rest_query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value.toString());
      }
    }

    const res = await fetchWithAuth(decodeURIComponent(url.toString()));

    if (!res.ok) {
      throw new Error('Failed to download CSV');
    }
    const blob = await res.blob();
    downloadCSV(blob, `${getDateTime()}_school-stats-lesson`);
  },
  DownloadSubLessonCSV: async function (
    query: BasePaginationAPIQueryParams & SchoolStatSubLessonTableQuery,
  ): Promise<void> {
    const { student_user_id, lesson_id, ...rest_query } = query;

    const url = new URL(
      `${BACKEND_URL}/admin-report/v1/users/${student_user_id}/lessons/${lesson_id}/sub-lesson-reports/csv`,
    );

    for (const [key, value] of Object.entries(rest_query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value.toString());
      }
    }

    const res = await fetchWithAuth(decodeURIComponent(url.toString()));

    if (!res.ok) {
      throw new Error('Failed to download CSV');
    }
    const blob = await res.blob();
    downloadCSV(blob, `${getDateTime()}_school-stats-sublesson`);
  },
  DownloadLevelCSV: async function (
    query: BasePaginationAPIQueryParams & SchoolStatLevelTableQuery,
  ): Promise<void> {
    const { student_user_id, sub_lesson_id, ...rest_query } = query;

    const url = new URL(
      `${BACKEND_URL}/admin-report/v1/users/${student_user_id}/sub-lessons/${sub_lesson_id}/level-reports/csv`,
    );

    for (const [key, value] of Object.entries(rest_query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value.toString());
      }
    }

    const res = await fetchWithAuth(decodeURIComponent(url.toString()));

    if (!res.ok) {
      throw new Error('Failed to download CSV');
    }
    const blob = await res.blob();
    downloadCSV(blob, `${getDateTime()}_school-stats-level`);
  },
  DownloadPlayLogCSV: async function (
    query: BasePaginationAPIQueryParams & SchoolStatPlayLogTableQuery,
  ): Promise<void> {
    const { student_user_id, level_id, ...rest_query } = query;

    const url = new URL(
      `${BACKEND_URL}/admin-report/v1/users/${student_user_id}/level/${level_id}/level-play-logs/csv`,
    );

    for (const [key, value] of Object.entries(rest_query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value.toString());
      }
    }

    const res = await fetchWithAuth(decodeURIComponent(url.toString()));

    if (!res.ok) {
      throw new Error('Failed to download CSV');
    }
    const blob = await res.blob();
    downloadCSV(blob, `${getDateTime()}_school-stats-level`);
  },
  DropdownCurriculumGroups: async function (
    query: BasePaginationAPIQueryParams & LessonDropdownFilterQuery,
    options,
  ): Promise<PaginationAPIResponse<LessonDropdownFilterResponse>> {
    const { student_user_id, ...rest_query } = query;

    const url = new URL(
      `${BACKEND_URL}/admin-report/v1/users/${student_user_id}/curriculum-groups`,
    );

    for (const [key, value] of Object.entries(rest_query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value.toString());
      }
    }

    const res = await fetchWithAuth(decodeURIComponent(url.toString()), options);
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.json();
  },
  DropdownSubjectList: async function (
    query: BasePaginationAPIQueryParams & LessonDropdownFilterQuery,
    options,
  ): Promise<PaginationAPIResponse<LessonDropdownFilterResponse>> {
    const { student_user_id, ...rest_query } = query;

    const url = new URL(
      `${BACKEND_URL}/admin-report/v1/users/${student_user_id}/subjects`,
    );

    for (const [key, value] of Object.entries(rest_query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value.toString());
      }
    }

    const res = await fetchWithAuth(decodeURIComponent(url.toString()), options);
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.json();
  },
  DropdownLessonList: async function (
    query: BasePaginationAPIQueryParams & LessonDropdownFilterQuery,
    options,
  ): Promise<PaginationAPIResponse<LessonDropdownFilterResponse>> {
    const { student_user_id, ...rest_query } = query;

    const url = new URL(
      `${BACKEND_URL}/admin-report/v1/users/${student_user_id}/lessons`,
    );

    for (const [key, value] of Object.entries(rest_query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value.toString());
      }
    }

    const res = await fetchWithAuth(decodeURIComponent(url.toString()), options);
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.json();
  },
  DropdownSubLessonList: async function (
    query: BasePaginationAPIQueryParams & SubLessonDropdownFilterQuery,
  ): Promise<PaginationAPIResponse<SubLessonDropdownFilterResponse>> {
    const { student_user_id, lesson_id, ...rest_query } = query;

    const url = new URL(
      `${BACKEND_URL}/admin-report/v1/users/${student_user_id}/lessons/${lesson_id}`,
    );

    for (const [key, value] of Object.entries(rest_query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value.toString());
      }
    }

    const res = await fetchWithAuth(decodeURIComponent(url.toString()));
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.json();
  },
  DropdownAcademicYearList: async function (
    query: BasePaginationAPIQueryParams & AcademicYearDropdownFilterQuery,
  ): Promise<PaginationAPIResponse<number[]>> {
    const { student_user_id, ...rest_query } = query;

    const url = new URL(
      `${BACKEND_URL}/admin-report/v1/users/${student_user_id}/academic-years`,
    );

    for (const [key, value] of Object.entries(rest_query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value.toString());
      }
    }

    const res = await fetchWithAuth(decodeURIComponent(url.toString()));
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.json();
  },
  GetLevel: async function (
    query: BasePaginationAPIQueryParams & GetLevelQuery,
  ): Promise<any> {
    const { level_id, ...rest_query } = query;

    const url = new URL(`${BACKEND_URL}/admin-report/v1/levels/${level_id}`);

    for (const [key, value] of Object.entries(rest_query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value.toString());
      }
    }

    const res = await fetchWithAuth(decodeURIComponent(url.toString()));
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.json();
  },
  GetPlayLog: async function (
    query: BasePaginationAPIQueryParams & GetPlayLogQuery,
  ): Promise<any> {
    const { play_log_id, ...rest_query } = query;

    const url = new URL(`${BACKEND_URL}/admin-report/v1/level-play-logs/${play_log_id}`);

    for (const [key, value] of Object.entries(rest_query)) {
      if (value != '' && typeof value != 'undefined') {
        url.searchParams.set(key, value.toString());
      }
    }

    const res = await fetchWithAuth(decodeURIComponent(url.toString()));
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.json();
  },
};

export default SchoolStatRestAPI;
