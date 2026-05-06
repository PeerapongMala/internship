import { DataAPIResponse } from '@global/utils/apiResponseHelper';

import { CurriculumGroupsDropdownResponse } from '@domain/g03/g03-d04/local/api/group/cirriculum-group/type.ts';

export interface CurriculumGroupsRepository {
  GetDropdownCurriculumGroups(): Promise<
    DataAPIResponse<CurriculumGroupsDropdownResponse>
  >;
  GetDropdownSubjects(
    curriculumGroupId: number,
  ): Promise<DataAPIResponse<CurriculumGroupsDropdownResponse>>;

  GetDropdownLessons(
    subjectId: number,
  ): Promise<DataAPIResponse<CurriculumGroupsDropdownResponse>>;

  GetDropdownSubLessons(
    lessonId: number,
  ): Promise<DataAPIResponse<CurriculumGroupsDropdownResponse>>;
}
