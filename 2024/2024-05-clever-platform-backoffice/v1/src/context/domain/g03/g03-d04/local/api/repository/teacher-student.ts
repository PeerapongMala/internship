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
import {
  BaseAPIResponse,
  BasePaginationAPIQueryParams,
  DataAPIResponse,
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import { FilterQueryParams } from '../group/teacher-student/restapi';

export interface TeacherStudentRepository {
  GetListStat(
    query: FilterQueryParams & {
      startDate?: string;
      endDate?: string;
      curriculum_group_id?: number;
      subject_id?: number;
      lesson_id?: number;
      sub_lesson_id?: number;
    },
  ): Promise<PaginationAPIResponse<TeacherStudentResponse>>;

  GetStudentStatListByTeacherId(
    query: StudentStatRequest,
  ): Promise<PaginationAPIResponse<StudentStatResponse>>;

  GetStatListOption(
    studentId: string,
    academicYear: string,
    option_type: string,
  ): Promise<PaginationAPIResponse<OptionsResponse>>;

  GetLessonStatListByStudentIdAndAcademicYear(
    studentId: string,
    academicYear: string,
    query: ParamsTeacherStudent,
  ): Promise<PaginationAPIResponse<LessonStatResponse>>;

  GetLevelLogList(
    studentId: string,
    levelId: number,
    query: ParamsTeacherStudentBySubLesson,
  ): Promise<PaginationAPIResponse<LevelPlayLogResponse>>;

  DownloadLessonStatCsv(
    studentId: string,
    academicYear: string,
    query?: ParamsDownloadCsv,
  ): Promise<Blob | FailedAPIResponse>;

  DownloadStudyGroupCsv(
    studentId: string,
    academicYear: string,
    query?: ParamsDownloadCsv,
  ): Promise<Blob | FailedAPIResponse>;

  DownloadRewardCsv(
    studentId: string,
    academicYear: string,
    query?: ParamsDownloadCsv,
  ): Promise<Blob | FailedAPIResponse>;

  DownloadLevelStatByLessonCsv(
    studentId: string,
    lessonId: number,
    query?: ParamsDownloadCsv,
  ): Promise<Blob | FailedAPIResponse>;

  DownloadLevelStatBySubLessonCsv(
    studentId: string,
    subLessonId: number,
    query?: ParamsTeacherStudentBySubLesson,
  ): Promise<Blob | FailedAPIResponse>;

  DownloadLevelStatByLevelCsv(
    studentId: string,
    levelId: number,
    query?: ParamsTeacherStudentBySubLesson,
  ): Promise<Blob | FailedAPIResponse>;

  GetStudyGroupListByStudentIdAndAcademicYear(
    studentId: string,
    academicYear: string,
    search: string,
  ): Promise<PaginationAPIResponse<StudyGroupListResponse>>;

  GetOptions(
    studentId: string,
    academicYear: string,
    option: string,
  ): Promise<DataAPIResponse<OptionsResponse>>;

  GetRewardList(
    studentId: string,
    academicYear: string,
    query: ParamsTeacherStudent,
  ): Promise<PaginationAPIResponse<RewardListResponse>>;

  GetCommentOption(
    studentId: string,
    option_type: string,
    query: ParamsTeacherStudent,
  ): Promise<DataAPIResponse<CommentOption>>;

  GetCommentList(
    studentId: string,
    academicYear: string,
    query: ParamsTeacherStudent,
  ): Promise<PaginationAPIResponse<CommentListResponse>>;

  CreateComment(body: CreateCommentRequest): Promise<BaseAPIResponse>;

  UpdateComment(commentId: number, body: UpdateCommentRequest): Promise<BaseAPIResponse>;

  DeleteComment(commentId: number): Promise<BaseAPIResponse>;

  GetSubLessonStat(
    studentId: string,
    lessonId: number,
    query: ParamsTeacherStudent,
  ): Promise<PaginationAPIResponse<SubLessonStatResponse>>;

  GetLevelStat(
    studentId: string,
    subLessonId: number,
    query: ParamsTeacherStudentBySubLesson,
  ): Promise<PaginationAPIResponse<LevelStatResponse>>;

  GetStudentStatCsvByTeacherId(
    subject_id: number,
    academic_year: number,
  ): Promise<Blob | FailedAPIResponse>;
}
