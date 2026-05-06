import {
  BaseAPIResponse,
  DataAPIRequest,
  DataAPIResponse,
  FailedAPIResponse,
  getQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { TeacherHomeworkRepository } from '../../../repository/teacher-homework';
import { LevelPlayLogItem } from '@component/web/template/cw-t-question-view/type';
import {
  AssignTargetListResponse,
  Subject,
  HomeworkTemplateListResponse,
  CreateHomeworkRequest,
  CreateHomeworkResponse,
  HomeworkListResponse,
  DataHomeworkResponse,
  HomeworkTemplateResponse,
  LessonListResponse,
  HomeworkSubmitDetailListResponse,
  HomeworkSent,
  YearOption,
  ClassOption,
} from '../../../../type';
import { Status } from '../../../../type';
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const StoreItemRestAPI: TeacherHomeworkRepository = {
  GetLevelPlayLogs: function (
    levelPlayLogId: number,
  ): Promise<PaginationAPIResponse<LevelPlayLogItem>> {
    let url = `${BACKEND_URL}/teacher-homework/v1/level-play-logs/${levelPlayLogId}`;

    const params = getQueryParams({ limit: -1 });
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<LevelPlayLogItem>) => {
        return res as PaginationAPIResponse<LevelPlayLogItem>;
      });
  },

  GetSubjectList: function (
    schoolId: number,
    page?: number,
    limit?: number,
  ): Promise<PaginationAPIResponse<Subject>> {
    const url = `${BACKEND_URL}/teacher-homework/v1/subject-list/${schoolId}`;

    const params = getQueryParams({ page, limit });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<Subject>) => {
        return res;
      });
  },

  GetAssignTargetList: function (schoolId: number): Promise<AssignTargetListResponse> {
    const url = `${BACKEND_URL}/teacher-homework/v1/assign-to-target-list/${schoolId}`;

    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: AssignTargetListResponse) => {
        return res;
      });
  },

  CreateHomework: function (
    data: CreateHomeworkRequest,
  ): Promise<CreateHomeworkResponse> {
    const url = `${BACKEND_URL}/teacher-homework/v1/homework`;

    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res: CreateHomeworkResponse) => {
        return res;
      });
  },

  GetHomeworkList: function (
    schoolId: number,
    subjectId: number,
    page: number = 1,
    limit: number = 10,
    options?: {
      search?: string;
      started_at_start?: string;
      started_at_end?: string;
      due_at_start?: string;
      due_at_end?: string;
      close_at_start?: string;
      close_at_end?: string;
      year_id?: number;
      room_id?: number;
      study_group_id?: number;
    },
    homework_type?: 'must_send' | 'pre-ahead' | 'archived',
  ): Promise<HomeworkListResponse> {
    const url = `${BACKEND_URL}/teacher-homework/v1/homework-list/${schoolId}/${subjectId}`;

    const params = getQueryParams({
      page,
      limit,
      ...options,
      homework_type,
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: HomeworkListResponse) => {
        return res;
      });
  },

  GetHomeworkDetailList: function (
    homeworkId: number,
    page?: number,
    limit?: number,
  ): Promise<DataHomeworkResponse> {
    const url = `${BACKEND_URL}/teacher-homework/v1/homework-detail-list/${homeworkId}`;

    const params = getQueryParams({ page, limit });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: DataHomeworkResponse) => {
        return res;
      });
  },

  GetHomeworkTemplateList: function (
    schoolId: number,
    subjectId: number,
    page: number = 1,
    limit: number = 10,
    options?: {
      lession_name?: string;
      status?: Status;
    },
  ): Promise<HomeworkTemplateResponse> {
    const url = `${BACKEND_URL}/teacher-homework/v1/homework-template-list/${schoolId}/${subjectId}`;

    const convertStatusForAPI = (status: Status): string => {
      switch (status) {
        case Status.IN_USE:
          return 'enabled';
        case Status.DRAFT:
          return 'draft';
        case Status.NOT_IN_USE:
          return 'disabled';
        default:
          return 'disabled';
      }
    };

    const params = getQueryParams({
      page,
      limit,
      lession_name: options?.lession_name,
      status: options?.status ? convertStatusForAPI(options.status) : undefined,
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: HomeworkTemplateResponse) => {
        return res;
      });
  },

  GetLessonList: function (subjectId: number): Promise<LessonListResponse> {
    const url = `${BACKEND_URL}/teacher-homework/v1/drop-down/lesson-list/${subjectId}`;

    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: LessonListResponse) => {
        return res;
      });
  },

  GetSubLessonList: function (lessonId: number): Promise<DataAPIResponse<any[]>> {
    const url = `${BACKEND_URL}/teacher-homework/v1/homework-template/sub-lesson-level/${lessonId}`;

    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<any[]>) => {
        return res;
      });
  },

  CreateHomeworkTemplate: function (data: {
    homework_template_name: string;
    subject_id: number;
    year_id: number;
    lesson_id: number;
    status: string;
    level_ids: number[];
  }): Promise<BaseAPIResponse> {
    const url = `${BACKEND_URL}/teacher-homework/v1/homework-template`;

    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res: BaseAPIResponse) => {
        return res;
      });
  },

  UpdateHomeworkTemplate: function (
    homeworkTemplateId: number,
    data: {
      homework_template_name: string;
      subject_id: number;
      year_id: number;
      lesson_id: number;
      status: string;
      level_ids: number[];
    },
  ): Promise<BaseAPIResponse> {
    const url = `${BACKEND_URL}/teacher-homework/v1/homework-template/${homeworkTemplateId}`;

    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res: BaseAPIResponse) => {
        return res;
      });
  },

  UpdateHomeworkTemplateStatus: function (
    homeworkTemplateId: number,
    status: 'enabled' | 'disabled',
  ): Promise<BaseAPIResponse> {
    const url = `${BACKEND_URL}/teacher-homework/v1/homework-template/${homeworkTemplateId}`;

    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then((res: BaseAPIResponse) => {
        return res;
      });
  },

  UpdateHomeworkStatus: function (
    homeworkId: number,
    status: 'enabled' | 'disabled',
  ): Promise<BaseAPIResponse> {
    const url = `${BACKEND_URL}/teacher-homework/v1/homework/${homeworkId}`;

    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then((res: BaseAPIResponse) => {
        return res;
      });
  },

  GetHomeworkTemplateById: function (
    homeworkTemplateId: number,
  ): Promise<DataAPIResponse<any>> {
    const url = `${BACKEND_URL}/teacher-homework/v1/homework-template/${homeworkTemplateId}`;

    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<any>) => {
        return res;
      });
  },

  GetHomeworkSubmitDetailList: function (
    homeworkId: number,
    page?: number,
    limit?: number,
    statusFilter?: string,
    schoolId?: string,
  ): Promise<HomeworkSubmitDetailListResponse> {
    const url = `${BACKEND_URL}/teacher-homework/v1/homework-submit-detail-list/${homeworkId}`;

    const params = getQueryParams({
      page,
      limit,
      status_filter: statusFilter,
      school_id: schoolId,
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: HomeworkSubmitDetailListResponse) => {
        return res;
      });
  },

  GetHomeworkSubmitStudentList: function (
    studentId: string,
    homeworkId: number,
    page?: number,
    limit?: number,
  ): Promise<DataAPIResponse<HomeworkSent[]>> {
    const url = `${BACKEND_URL}/teacher-homework/v1/homework-submit-student-list/${studentId}/${homeworkId}`;

    const params = getQueryParams({ page, limit });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: DataAPIResponse<HomeworkSent[]>) => {
        return res;
      });
  },

  GetYearList: function (): Promise<DataAPIResponse<YearOption[]>> {
    const url = `${BACKEND_URL}/teacher-homework/v1/drop-down/year-list`;

    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<YearOption[]>) => {
        return res;
      });
  },

  GetClassList: function (
    yearId: number,
    schoolId: number,
  ): Promise<DataAPIResponse<ClassOption[]>> {
    const url = `${BACKEND_URL}/teacher-homework/v1/drop-down/class-list`;

    const params = getQueryParams({ year_id: yearId, school_id: schoolId });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: DataAPIResponse<ClassOption[]>) => {
        return res;
      });
  },
};

export default StoreItemRestAPI;
