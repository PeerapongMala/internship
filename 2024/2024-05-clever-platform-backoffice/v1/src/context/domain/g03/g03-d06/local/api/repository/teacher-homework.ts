import { LevelPlayLogItem } from '@component/web/template/cw-t-question-view/type';
import {
  BaseAPIResponse,
  BasePaginationAPIQueryParams,
  DataAPIRequest,
  DataAPIResponse,
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import {
  AssignTargetListResponse,
  LessonListResponse,
  Subject,
  YearData,
  YearOption,
  ClassOption,
} from '../../type';
import { HomeworkTemplateListResponse } from '../../type';
import {
  CreateHomeworkRequest,
  CreateHomeworkResponse,
  DataHomeworkResponse,
} from '../../type';
import { HomeworkListResponse } from '../../type';
import { HomeworkTemplateResponse } from '../../type';
import { Status } from '../../type';
import { HomeworkSubmitDetailListResponse } from '../../type';
import { HomeworkSent } from '../../type';

export interface TeacherHomeworkRepository {
  GetLevelPlayLogs(
    levelPlayLogId: number,
  ): Promise<PaginationAPIResponse<LevelPlayLogItem>>;

  GetSubjectList(
    schoolId: number,
    page?: number,
    limit?: number,
  ): Promise<PaginationAPIResponse<Subject>>;

  GetAssignTargetList(schoolId: number): Promise<AssignTargetListResponse>;

  GetHomeworkTemplateList(
    schoolId: number,
    subjectId: number,
    page?: number,
    limit?: number,
    options?: {
      lession_name?: string;
      status?: Status;
    },
  ): Promise<HomeworkTemplateListResponse>;

  CreateHomework(data: CreateHomeworkRequest): Promise<CreateHomeworkResponse>;

  GetHomeworkList(
    schoolId: number,
    subjectId: number,
    page?: number,
    limit?: number,
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
  ): Promise<HomeworkListResponse>;

  GetHomeworkDetailList(
    homeworkId: number,
    page?: number,
    limit?: number,
  ): Promise<DataHomeworkResponse>;

  GetLessonList(subjectId: number): Promise<LessonListResponse>;

  GetSubLessonList(lessonId: number): Promise<DataAPIResponse<any[]>>;

  CreateHomeworkTemplate(data: {
    homework_template_name: string;
    subject_id: number;
    year_id: number;
    lesson_id: number;
    status: string;
    level_ids: number[];
  }): Promise<BaseAPIResponse>;

  UpdateHomeworkTemplate(
    homeworkTemplateId: number,
    data: {
      homework_template_name: string;
      subject_id: number;
      year_id: number;
      lesson_id: number;
      status: string;
      level_ids: number[];
    },
  ): Promise<BaseAPIResponse>;

  UpdateHomeworkTemplateStatus(
    homeworkTemplateId: number,
    status: 'enabled' | 'disabled',
  ): Promise<BaseAPIResponse>;

  UpdateHomeworkStatus(
    homeworkId: number,
    status: 'enabled' | 'disabled' | 'archived',
  ): Promise<BaseAPIResponse>;

  GetHomeworkTemplateById(homeworkTemplateId: number): Promise<DataAPIResponse<any>>;

  GetHomeworkSubmitDetailList(
    homeworkId: number,
    page?: number,
    limit?: number,
    statusFilter?: string,
    schoolId?: string,
  ): Promise<HomeworkSubmitDetailListResponse>;

  GetHomeworkSubmitStudentList(
    studentId: string,
    homeworkId: number,
    page?: number,
    limit?: number,
  ): Promise<DataAPIResponse<HomeworkSent[]>>;

  GetYearList(): Promise<DataAPIResponse<YearOption[]>>;

  GetClassList(yearId: number, schoolId: number): Promise<DataAPIResponse<ClassOption[]>>;
}
