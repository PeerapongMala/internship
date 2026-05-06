import {
  LessonOptions,
  LessonStatList,
  ParamsLessonStat,
} from '@domain/g03/g03-d03/local/api/group/student-group-lesson/type.ts';
import { StudentGroupLessonRepository } from '@domain/g03/g03-d03/local/api/repository/student-group-lesson.ts';
import {
  FailedAPIResponse,
  getQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper.ts';
import fetchWithAuth from '@global/utils/fetchWithAuth.ts';

const backendUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const StudentGroupLessonRestAPI: StudentGroupLessonRepository = {
  GetLessonStatList: async function (
    studyGroupId: string,
    query: ParamsLessonStat,
  ): Promise<PaginationAPIResponse<LessonStatList>> {
    const url = `${backendUrl}/teacher-student-group/v1/study-group/${studyGroupId}/lesson-stat/list`;
    const params = getQueryParams(query);
    const res = await fetchWithAuth(url + '?' + params.toString());
    if (!res.ok) throw new Error(`Failed to fetch GetFamilyList: ${res.statusText}`);
    return res.json();
  },

  DownloadLessonStatCsv: async function (
    studyGroupId: string,
    query: ParamsLessonStat,
  ): Promise<Blob | FailedAPIResponse> {
    const url = `${backendUrl}/teacher-student-group/v1/study-group/${studyGroupId}/lesson-stat/csv`;
    const params = getQueryParams(query);

    const res = await fetchWithAuth(`${url}?${params.toString()}`);
    return res.status === 200 ? res.blob() : res.json();
  },

  GetLessonParams: async function (
    studyGroupId: string,
    query: ParamsLessonStat,
  ): Promise<PaginationAPIResponse<LessonOptions>> {
    const url = `${backendUrl}/teacher-student-group/v1/study-group/${studyGroupId}/params/lesson`;
    const params = getQueryParams(query);
    const res = await fetchWithAuth(url + '?' + params.toString());
    if (!res.ok) throw new Error(`Failed to fetch GetFamilyList: ${res.statusText}`);
    return res.json();
  },

  GetSubLessonParams: async function (
    studyGroupId: string,
    lesson_id: string,
  ): Promise<PaginationAPIResponse<LessonOptions>> {
    const url = `${backendUrl}/teacher-student-group/v1/study-group/${studyGroupId}/params/sub-lesson?lesson_id=${lesson_id}`;
    const res = await fetchWithAuth(url);
    if (!res.ok) throw new Error(`Failed to fetch GetFamilyList: ${res.statusText}`);
    return res.json();
  },
};

export default StudentGroupLessonRestAPI;
