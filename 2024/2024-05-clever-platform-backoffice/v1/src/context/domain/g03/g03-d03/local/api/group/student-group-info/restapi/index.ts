import { BaseAPIResponse, DataAPIResponse } from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { StudentGroupInfoRepository } from '../../../repository/student-group-info';
import { StudentGroupInfo } from '../type';

const backendUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const StudentGroupInfoRestAPI: StudentGroupInfoRepository = {
  GetStudyGroupById: async function (
    study_group_id: number,
  ): Promise<DataAPIResponse<StudentGroupInfo>> {
    const url = `${backendUrl}/teacher-student-group/v1/study-group/${study_group_id}`;
    const res = await fetchWithAuth(url);
    if (!res.ok) throw new Error(`Failed to fetch StudentGroupInfo: ${res.statusText}`);
    return res.json();
  },
  UpdateStudyGroupById: function (
    data: Partial<StudentGroupInfo>,
  ): Promise<BaseAPIResponse> {
    const url = `${backendUrl}/teacher-student-group/v1/study-group`;
    return fetchWithAuth(url, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
  GetDropdownSubjects: async function (): Promise<DataAPIResponse<StudentGroupInfo[]>> {
    const url = `${backendUrl}/teacher-student/v1/subjects`;
    const res = await fetchWithAuth(url);
    if (!res.ok) throw new Error(`Failed to fetch StudentGroupInfo: ${res.statusText}`);
    return res.json();
  },
  GetDropdownClasses: async function (): Promise<DataAPIResponse<StudentGroupInfo[]>> {
    const url = `${backendUrl}/teacher-student/v1/classes?page=1&limit=-1`;
    const res = await fetchWithAuth(url);
    if (!res.ok) throw new Error(`Failed to fetch StudentGroupInfo: ${res.statusText}`);
    return res.json();
  },
  GetSubjectListByTeacherIdAndAcademicYearAndYear: async function ({
    academic_year,
    year,
  }: {
    academic_year: number;
    year: string;
  }): Promise<DataAPIResponse<StudentGroupInfo[]>> {
    const url = `${backendUrl}/teacher-student/v1/academic_year/${academic_year}/years/${year}/subjects`;
    const res = await fetchWithAuth(url);
    if (!res.ok) throw new Error(`Failed to fetch StudentGroupInfo: ${res.statusText}`);
    return res.json();
  },
  GetClassListBySubjectTeacherIdAndAcademicYearAndYear: async function ({
    academic_year,
    year,
    subject_id,
  }: {
    academic_year: number;
    year: string;
    subject_id: number;
  }): Promise<DataAPIResponse<StudentGroupInfo[]>> {
    const url = `${backendUrl}/teacher-student/v1/academic_year/${academic_year}/years/${year}/subject/${subject_id}/classes`;
    const res = await fetchWithAuth(url);
    if (!res.ok) throw new Error(`Failed to fetch StudentGroupInfo: ${res.statusText}`);
    return res.json();
  },
  CreateStudyGroup: function (data: StudentGroupInfo): Promise<BaseAPIResponse> {
    const url = `${backendUrl}/teacher-student-group/v1/study-group`;
    return fetchWithAuth(url, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
};

export default StudentGroupInfoRestAPI;
