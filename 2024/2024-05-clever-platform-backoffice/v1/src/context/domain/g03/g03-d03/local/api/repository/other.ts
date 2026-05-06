import { DataAPIResponse } from '@global/utils/apiResponseHelper';
import { SchoolHeader } from '../../type';

export interface OtherRepository {
  GetAcademicYears(): Promise<DataAPIResponse<number[]>>;
  GetYears(academicYear: number): Promise<DataAPIResponse<string[]>>;
  GetClasses(academicYear: number, year: string): Promise<DataAPIResponse<string[]>>;
  GetSubjects(): Promise<DataAPIResponse<{ id: number; name: string }[]>>;
  GetSchool(): Promise<DataAPIResponse<SchoolHeader>>;
  GetDropdownLessons(
    subjectId: number,
  ): Promise<DataAPIResponse<{ id: number; name: string }[]>>;
}
