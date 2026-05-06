import { AcademicLevel, AcademicLevelStatus } from '../../type';
import {
  BasePaginationAPIQueryParams,
  DataAPIResponse,
  PaginationAPIResponse,
} from '../helper';

interface AcademicLevelFilterQueryParams extends BasePaginationAPIQueryParams {
  search_text?: string;
  status?: AcademicLevelStatus;
}

export interface AcademicLevelRepository {
  Gets(
    subLessonId: string,
    query: AcademicLevelFilterQueryParams,
  ): Promise<PaginationAPIResponse<AcademicLevel>>;
  GetById(id: string): Promise<DataAPIResponse<AcademicLevel>>;
  GetYearList(curriculumIdL: string): Promise<DataAPIResponse<AcademicLevel>>;
  GetSubjectGroupList(yearId: string): Promise<DataAPIResponse<AcademicLevel>>;
  GetSubjectList(curriculumGroupId: string): Promise<DataAPIResponse<AcademicLevel>>;
  GetG02D02A26(subjectId: string): Promise<DataAPIResponse<AcademicLevel>>;
  GetG02D04A07SubLessonById(subLessonId: string): Promise<DataAPIResponse<AcademicLevel>>;
  GetG00D00A01(): Promise<DataAPIResponse<AcademicLevel>>;
  DeleteG02D05A28(
    questionId: string,
    passwordObject: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>>;
  GetG02D05A29(
    levelId: string,
    query: any,
  ): Promise<PaginationAPIResponse<AcademicLevel>>;
  GetG02D05A32LessonCaseListBySubject(
    subjectId: string,
  ): Promise<DataAPIResponse<AcademicLevel>>;
  GetG02D05A33(subjectId: string): Promise<DataAPIResponse<AcademicLevel>>;
  GetG02D05A34(subjectId: string): Promise<DataAPIResponse<AcademicLevel>>;
  GetG02D05A35SubCriteriaCaseListByCurriculumGroup(
    subjectId: string,
  ): Promise<DataAPIResponse<AcademicLevel>>;
  UpdateG02D05A36(
    subLessonId: string,
    academicLevels: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>>;
  UpdateG02D05A39(
    academicLevelId: string,
    questions: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>>;
  GetG02D05A37(
    curriculumGroupId: string,
    params: object,
  ): Promise<PaginationAPIResponse<AcademicLevel>>;
  GetG02D05A41(subLessonId: string): Promise<DataAPIResponse<AcademicLevel>>;
  UpdateG02D05A46(
    academicLevels: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>>;
  Create(academicLevel: Partial<AcademicLevel>): Promise<DataAPIResponse<AcademicLevel>>;
  CreateG02D05A38(
    curriculumId: string,
    translateForm: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>>;
  CreateG02D05A08(
    question: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>>;
  UpdateG02D05A09(
    questionId: string,
    question: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>>;
  CreateG02D05A12(
    question: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>>;
  UpdateG02D05A13(
    questionId: string,
    question: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>>;
  CreateG02D05A16(
    question: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>>;
  UpdateG02D05A17(
    questionId: string,
    question: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>>;
  CreateG02D05A20(
    question: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>>;
  UpdateG02D05A21(
    questionId: string,
    question: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>>;
  CreateG02D05A24(
    question: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>>;
  UpdateG02D05A25(
    questionId: string,
    question: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>>;
  UpdateG02D05A42(
    groupId: string,
    soundForm: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>>;
  DeleteG02D05A45(
    groupId: string,
    textObject: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>>;
  CreateG02D05A47(
    textObject: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>>;
  UpdateG02D05A48(
    groupId: string,
    textObject: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>>;
  Update(
    academicLevelId: string,
    academicLevel: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>>;
  UploadCSV(subLessonId: string, file: File): Promise<DataAPIResponse<AcademicLevel>>;
  // Delete(id: string): boolean;
  CreateG02D05A51(
    questionId: string,
    textObject: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>>;
  CreateG02D05A52(
    questionId: string,
    textObject: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>>;
  CreateG02D05A53(
    questionId: string,
    textObject: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>>;
  CreateG02D05A54(
    questionId: string,
    textObject: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>>;
}
