import {
  CommentListResponse,
  CommentOption,
  CreateCommentRequest,
  LessonStatResponse,
  LevelPlayLogResponse,
  LevelStatResponse,
  OptionsResponse,
  ParamsDownloadCsv,
  ParamsTeacherStudent,
  ParamsTeacherStudentBySubLesson,
  RewardListResponse,
  StudentStatRequest,
  StudentStatResponse,
  StudyGroupListResponse,
  SubLessonStatResponse,
  TeacherStudentResponse,
  UpdateCommentRequest,
} from '@domain/g03/g03-d04/local/api/group/teacher-student/type.ts';
import { TeacherStudentRepository } from '@domain/g03/g03-d04/local/api/repository/teacher-student';
import {
  BaseAPIResponse,
  BasePaginationAPIQueryParams,
  DataAPIResponse,
  FailedAPIResponse,
  getQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const backendUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
export interface FilterQueryParams extends BasePaginationAPIQueryParams {
  school_id?: number;
}
const TeacherStudentRestAPI: TeacherStudentRepository = {
  GetListStat: async function (
    query: FilterQueryParams & {
      startDate?: string;
      endDate?: string;
    },
  ): Promise<PaginationAPIResponse<TeacherStudentResponse>> {
    const url = `${backendUrl}/teacher-student/v1/class/level-stat`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([_, v]) => v !== undefined),
    );

    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    const res = await fetchWithAuth(`${url}?${params.toString()}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch GetListStat: ${res.status} - ${res.statusText}`);
    }
    return await res.json();
  },

  GetStudentStatListByTeacherId: async function (
    query: StudentStatRequest,
  ): Promise<PaginationAPIResponse<StudentStatResponse>> {
    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([_, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });
    const url = `${backendUrl}/teacher-student/v1/class/level-stat?${params.toString()}`;
    const res = await fetchWithAuth(url);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch StudentStatList: ${res.status} - ${res.statusText}`,
      );
    }
    return res.json();
  },

  GetStatListOption: async function (
    studentId: string,
    academicYear: string,
    option_type: string,
  ): Promise<PaginationAPIResponse<OptionsResponse>> {
    const url = `${backendUrl}/teacher-student/v1/student/${studentId}/options/academicYear/${academicYear}?option_type=${option_type}`;
    const res = await fetchWithAuth(url);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch stat list option: ${res.status} - ${res.statusText}`,
      );
    }
    return res.json();
  },

  GetLessonStatListByStudentIdAndAcademicYear: async function (
    studentId: string,
    academicYear: string,
    query: ParamsTeacherStudent,
  ): Promise<PaginationAPIResponse<LessonStatResponse>> {
    const url = `${backendUrl}/teacher-student/v1/student/${studentId}/level-stat/academicYear/${academicYear}`;
    const params = getQueryParams(query);

    const res = await fetchWithAuth(`${url}?${params.toString()}`);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch LessonStatList: ${res.status} - ${res.statusText}`,
      );
    }
    return res.json();
  },

  GetLevelLogList: async function (
    studentId: string,
    levelId: number,
    query: ParamsTeacherStudentBySubLesson,
  ): Promise<PaginationAPIResponse<LevelPlayLogResponse>> {
    const url = `${backendUrl}/teacher-student/v1/student/${studentId}/level-stat/level/${levelId}`;
    const params = getQueryParams(query);

    const res = await fetchWithAuth(`${url}?${params.toString()}`);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch GetLevelLogList: ${res.status} - ${res.statusText}`,
      );
    }
    return res.json();
  },

  DownloadLessonStatCsv: async function (
    studentId: string,
    academicYear: string,
    query: ParamsDownloadCsv,
  ): Promise<Blob | FailedAPIResponse> {
    const url = `${backendUrl}/teacher-student/v1/student/${studentId}/level-stat/academicYear/${academicYear}/download/csv`;
    const params = getQueryParams(query);

    const res = await fetchWithAuth(`${url}?${params.toString()}`);
    if (res.status !== 200) {
      throw new Error(
        `Failed to download LessonStat CSV: ${res.status} - ${res.statusText}`,
      );
    }
    return res.blob();
  },

  DownloadStudyGroupCsv: async function (
    studentId: string,
    academicYear: string,
    query: ParamsDownloadCsv,
  ): Promise<Blob | FailedAPIResponse> {
    const url = `${backendUrl}/teacher-student/v1/student/${studentId}/groups/academicYear/${academicYear}/download/csv`;
    const params = getQueryParams(query);

    const res = await fetchWithAuth(`${url}?${params.toString()}`);
    if (res.status !== 200) {
      throw new Error(
        `Failed to download StudyGroup CSV: ${res.status} - ${res.statusText}`,
      );
    }
    return res.blob();
  },

  DownloadRewardCsv: async function (
    studentId: string,
    academicYear: string,
    query: ParamsDownloadCsv,
  ): Promise<Blob | FailedAPIResponse> {
    const url = `${backendUrl}/teacher-student/v1/student/${studentId}/rewards/academicYear/${academicYear}/download/csv`;
    const params = getQueryParams(query);

    const res = await fetchWithAuth(`${url}?${params.toString()}`);
    if (res.status !== 200) {
      throw new Error(`Failed to download Reward CSV: ${res.status} - ${res.statusText}`);
    }
    return res.blob();
  },

  DownloadLevelStatByLessonCsv: async function (
    studentId: string,
    lessonId: number,
    query: ParamsDownloadCsv,
  ): Promise<Blob | FailedAPIResponse> {
    const url = `${backendUrl}/teacher-student/v1/student/${studentId}/level-stat/lessonId/${lessonId}/download/csv`;
    const params = getQueryParams(query);

    const res = await fetchWithAuth(`${url}?${params.toString()}`);
    if (res.status !== 200) {
      throw new Error(
        `Failed to download LevelStatByLesson CSV: ${res.status} - ${res.statusText}`,
      );
    }
    return res.blob();
  },

  DownloadLevelStatBySubLessonCsv: async function (
    studentId: string,
    subLessonId: number,
    query: ParamsTeacherStudentBySubLesson,
  ): Promise<Blob | FailedAPIResponse> {
    const url = `${backendUrl}/teacher-student/v1/student/${studentId}/level-stat/subLesson/${subLessonId}/download/csv`;
    const params = getQueryParams(query);

    const res = await fetchWithAuth(`${url}?${params.toString()}`);
    if (res.status !== 200) {
      throw new Error(
        `Failed to download LevelStatBySubLesson CSV: ${res.status} - ${res.statusText}`,
      );
    }
    return res.blob();
  },

  DownloadLevelStatByLevelCsv: async function (
    studentId: string,
    levelId: number,
    query: ParamsDownloadCsv,
  ): Promise<Blob | FailedAPIResponse> {
    const url = `${backendUrl}/teacher-student/v1/student/${studentId}/level-stat/level/${levelId}/download/csv`;
    const params = getQueryParams(query);

    const res = await fetchWithAuth(`${url}?${params.toString()}`);
    if (res.status !== 200) {
      throw new Error(
        `Failed to download LevelStatByLevel CSV: ${res.status} - ${res.statusText}`,
      );
    }
    return res.blob();
  },

  GetStudyGroupListByStudentIdAndAcademicYear: async function (
    studentId: string,
    academicYear: string,
    search: string,
  ): Promise<PaginationAPIResponse<StudyGroupListResponse>> {
    const url = `${backendUrl}/teacher-student/v1/student/${studentId}/groups/academicYear/${academicYear}?search=${search}`;
    const res = await fetchWithAuth(url);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch StudyGroupList: ${res.status} - ${res.statusText}`,
      );
    }
    return res.json();
  },

  GetOptions: async function (
    studentId: string,
    academicYear: string,
    option: string,
  ): Promise<DataAPIResponse<OptionsResponse>> {
    const url = `${backendUrl}/teacher-student/v1/student/${studentId}/options/academicYear/${academicYear}?option_type=${option}`;
    const res = await fetchWithAuth(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch Options: ${res.status} - ${res.statusText}`);
    }
    return res.json();
  },

  GetRewardList: async function (
    studentId: string,
    academicYear: string,
    query: ParamsTeacherStudent,
  ): Promise<PaginationAPIResponse<RewardListResponse>> {
    const url = `${backendUrl}/teacher-student/v1/student/${studentId}/rewards/academicYear/${academicYear}`;
    const params = getQueryParams(query);

    const res = await fetchWithAuth(`${url}?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch RewardList: ${res.status} - ${res.statusText}`);
    }
    return res.json();
  },

  GetCommentOption: async function (
    studentId: string,
    option_type: string,
    query: ParamsTeacherStudent,
  ): Promise<DataAPIResponse<CommentOption>> {
    const baseUrl = `${backendUrl}/teacher-student/v1/student/${studentId}/comment/options`;
    const params = new URLSearchParams();

    params.append('option_type', option_type);

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const url = `${baseUrl}?${params.toString()}`;

    const res = await fetchWithAuth(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch CommentOption: ${res.status} - ${res.statusText}`);
    }
    return res.json();
  },

  GetCommentList: async function (
    studentId: string,
    academicYear: string,
    query: ParamsTeacherStudent,
  ): Promise<PaginationAPIResponse<CommentListResponse>> {
    const url = `${backendUrl}/teacher-student/v1/student/${studentId}/comments/academicYear/${academicYear}`;
    const params = getQueryParams(query);

    const res = await fetchWithAuth(`${url}?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch CommentList: ${res.status} - ${res.statusText}`);
    }
    return res.json();
  },

  CreateComment: async function (body: CreateCommentRequest): Promise<BaseAPIResponse> {
    const url = `${backendUrl}/teacher-student/v1/student/comment/new`;
    const res = await fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Failed to create new comment: ${res.status} - ${res.statusText}`);
    }
    return res.json();
  },

  UpdateComment: async function (
    commentId: number,
    body: UpdateCommentRequest,
  ): Promise<BaseAPIResponse> {
    const url = `${backendUrl}/teacher-student/v1/student/comment/${commentId}`;
    const res = await fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Failed to update comment: ${res.status} - ${res.statusText}`);
    }
    return res.json();
  },

  DeleteComment: async function (commentId: number): Promise<BaseAPIResponse> {
    const url = `${backendUrl}/teacher-student/v1/student/comment/${commentId}`;
    const res = await fetchWithAuth(url, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error(`Failed to delete comment: ${res.status} - ${res.statusText}`);
    }
    return res.json();
  },

  GetSubLessonStat: async function (
    studentId: string,
    lessonId: number,
    query: ParamsTeacherStudent,
  ): Promise<PaginationAPIResponse<SubLessonStatResponse>> {
    const url = `${backendUrl}/teacher-student/v1/student/${studentId}/level-stat/lessonId/${lessonId}`;
    const params = getQueryParams(query);

    const res = await fetchWithAuth(`${url}?${params.toString()}`);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch GetSubLessonStat: ${res.status} - ${res.statusText}`,
      );
    }
    return res.json();
  },

  GetLevelStat: async function (
    studentId: string,
    subLessonId: number,
    query: ParamsTeacherStudentBySubLesson,
  ): Promise<PaginationAPIResponse<LevelStatResponse>> {
    const url = `${backendUrl}/teacher-student/v1/student/${studentId}/level-stat/subLesson/${subLessonId}`;
    const params = getQueryParams(query);

    const res = await fetchWithAuth(`${url}?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch GetLevelStat: ${res.status} - ${res.statusText}`);
    }
    return res.json();
  },

  GetStudentStatCsvByTeacherId: async function (
    subject_id: number,
    academic_year: number,
  ): Promise<Blob | FailedAPIResponse> {
    const url = `${backendUrl}/teacher-student/v1/class/level-stat/download/csv`;

    const params = new URLSearchParams({
      subject_id: subject_id.toString(),
      academic_year: academic_year.toString(),
    });

    const res = await fetchWithAuth(`${url}?${params.toString()}`);
    if (res.status !== 200) {
      throw new Error(
        `Failed to download LevelStatByClass CSV: ${res.status} - ${res.statusText}`,
      );
    }

    return res.blob();
  },
};

export default TeacherStudentRestAPI;
