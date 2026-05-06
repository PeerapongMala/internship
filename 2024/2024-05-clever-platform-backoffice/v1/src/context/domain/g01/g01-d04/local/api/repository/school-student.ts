import {
  FamilyInfoResponse,
  LevelPlayLog,
  OptionInterface,
  SchoolStudentList,
  TeacherNoteRequest,
  TeacherNoteResponse,
  UpdateUserPinRequest,
} from '@domain/g01/g01-d04/local/type.ts';
import { Classroom, SeedYear } from '@domain/g01/g01-d05/local/api/type';
import {
  BasePaginationAPIQueryParams,
  DataAPIRequest,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';

export type SchoolStudentFilterQueryParams = BasePaginationAPIQueryParams & {
  search?: string;
  academic_year?: string;
  curriculum_group_id?: string;
  subject_id?: string;
  lesson_id?: string;
  class_year?: string;
};

type GetOption<T> = (
  userId: string,
  query?: SchoolStudentFilterQueryParams,
) => Promise<DataAPIResponse<T[]>>;

export interface SchoolStudentRepository {
  GetById(userId: string): Promise<DataAPIResponse<SchoolStudentList>>;
  Create(
    student: DataAPIRequest<SchoolStudentList>,
  ): Promise<DataAPIResponse<SchoolStudentList>>;
  Update(
    userId: string,
    student: DataAPIRequest<SchoolStudentList>,
  ): Promise<DataAPIResponse<SchoolStudentList>>;
  PlayLog: {
    Get(
      userId: string,
      classroomId: number,
      query: SchoolStudentFilterQueryParams,
    ): Promise<PaginationAPIResponse<LevelPlayLog>>;
    DownloadCSV(
      userId: string,
      classroomId: number,
      query?: {
        start_date?: string;
        end_date?: string;
      },
    ): Promise<Blob>;
    GetAcademicYears: GetOption<number>;
    GetCurriculumGroups: GetOption<OptionInterface>;
    getSubjects: GetOption<OptionInterface>;
    getLessons: GetOption<OptionInterface>;
    GetSubLesson: GetOption<OptionInterface>;
    getClassess(
      userId: string,
      query?: BasePaginationAPIQueryParams,
    ): Promise<PaginationAPIResponse<Classroom>>;
  };

  GetSeedYears(): Promise<DataAPIResponse<SeedYear[]>>;

  // g01-d04-a15: student list
  GetStudentsBySchoolId(
    schoolId: string,
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<SchoolStudentList>>;

  // g01-d04-a17: download students CSV
  DownloadCSV(
    schoolId: string,
    query: { start_date: string; end_date: string },
  ): Promise<Blob>;

  // g01-d04-a18: upload students CSV
  UploadCSV(schoolId: string, file: File): Promise<DataAPIResponse<any>>;

  // g01-d04-a19: disable student status
  DisableStudentStatus(userId: string): Promise<DataAPIResponse<void>>;

  // g01-d04-a19: enable student status
  EnableStudentStatus(userId: string): Promise<DataAPIResponse<void>>;

  // g01-d04-a20: user pin update
  UpdateUserPin(data: UpdateUserPinRequest): Promise<DataAPIResponse<void>>;

  // g01-d04-a27-api-student-case-list-teacher-note
  GetTeacherNote(
    userId: string,
    query: TeacherNoteRequest,
  ): Promise<PaginationAPIResponse<TeacherNoteResponse>>;

  // g01-d04-a29-api-student-case-get-family
  GetFamilyInfo(userId: string): Promise<DataAPIResponse<FamilyInfoResponse[]>>;

  // g01-d04-a52: student bulk edit
  BulkEdit(data: { id: string; status: string }[]): Promise<void>;

  // g01-d04-a44: api-user-case-delete-oauth
  UpdateOAuthProvider(userId: string, provider: string): Promise<DataAPIResponse<void>>;
}
