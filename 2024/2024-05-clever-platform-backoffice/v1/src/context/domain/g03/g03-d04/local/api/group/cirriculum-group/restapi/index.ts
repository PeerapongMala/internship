import { CurriculumGroupsRepository } from '@domain/g03/g03-d04/local/api/repository/cirriculum-group';

import { DataAPIResponse } from '@global/utils/apiResponseHelper';

import fetchWithAuth from '@global/utils/fetchWithAuth';

import { CurriculumGroupsDropdownResponse } from '@domain/g03/g03-d04/local/api/group/cirriculum-group/type';

const backendUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const CurriculumGroupsRestAPI: CurriculumGroupsRepository = {
  GetDropdownCurriculumGroups: async function (): Promise<
    DataAPIResponse<CurriculumGroupsDropdownResponse>
  > {
    // g03-d04-a08
    const url = `${backendUrl}/teacher-student/v1/curriculum-groups`;

    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<CurriculumGroupsDropdownResponse[]>) => {
        if (res.status_code === 200 && Array.isArray(res.data)) {
          return res as unknown as DataAPIResponse<CurriculumGroupsDropdownResponse>;
        }
        throw new Error('No data found or unexpected response format');
      });
  },

  GetDropdownSubjects: async function (
    curriculumGroupId: number,
  ): Promise<DataAPIResponse<CurriculumGroupsDropdownResponse>> {
    const url = `${backendUrl}/teacher-student/v1/${curriculumGroupId}/subjects`;

    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<CurriculumGroupsDropdownResponse[]>) => {
        if (res.status_code === 200 && Array.isArray(res.data)) {
          return res as unknown as DataAPIResponse<CurriculumGroupsDropdownResponse>;
        }
        throw new Error('No data found or unexpected response format');
      });
  },

  GetDropdownLessons: async function (
    subjectId: number,
  ): Promise<DataAPIResponse<CurriculumGroupsDropdownResponse>> {
    const url = `${backendUrl}/teacher-student/v1/${subjectId}/lessons`;

    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<CurriculumGroupsDropdownResponse[]>) => {
        if (res.status_code === 200 && Array.isArray(res.data)) {
          return res as unknown as DataAPIResponse<CurriculumGroupsDropdownResponse>;
        }
        throw new Error('No data found or unexpected response format');
      });
  },

  GetDropdownSubLessons: async function (
    lessonId: number,
  ): Promise<DataAPIResponse<CurriculumGroupsDropdownResponse>> {
    const url = `${backendUrl}/teacher-student/v1/${lessonId}/sub-lessons`;

    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<CurriculumGroupsDropdownResponse[]>) => {
        if (res.status_code === 200 && Array.isArray(res.data)) {
          return res as unknown as DataAPIResponse<CurriculumGroupsDropdownResponse>;
        }
        throw new Error('No data found or unexpected response format');
      });
  },
};

export default CurriculumGroupsRestAPI;
