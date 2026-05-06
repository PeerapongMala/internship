import { BaseAPIResponse, DataAPIResponse } from '@global/utils/apiResponseHelper';
import { StudentGroupInfo } from '../group/student-group-info/type';

export interface StudentGroupInfoRepository {
  GetDropdownSubjects(): Promise<DataAPIResponse<StudentGroupInfo[]>>;
  GetDropdownClasses(): Promise<DataAPIResponse<StudentGroupInfo[]>>;
  GetStudyGroupById(id: number): Promise<DataAPIResponse<StudentGroupInfo>>;
  UpdateStudyGroupById(data: Partial<StudentGroupInfo>): Promise<BaseAPIResponse>;
  GetSubjectListByTeacherIdAndAcademicYearAndYear({
    academic_year,
    year,
  }: {
    academic_year: number;
    year: string;
  }): Promise<DataAPIResponse<StudentGroupInfo[]>>;
  GetClassListBySubjectTeacherIdAndAcademicYearAndYear({
    academic_year,
    year,
    subject_id,
  }: {
    academic_year: number;
    year: string;
    subject_id: number;
  }): Promise<DataAPIResponse<StudentGroupInfo[]>>;
  CreateStudyGroup(data: StudentGroupInfo): Promise<BaseAPIResponse>;
}
