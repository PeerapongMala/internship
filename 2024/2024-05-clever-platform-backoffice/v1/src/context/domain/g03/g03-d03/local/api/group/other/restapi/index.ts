import { DataAPIResponse } from '@global/utils/apiResponseHelper';
import { OtherRepository } from '../../../repository/other';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { SchoolHeader } from '@domain/g03/g03-d03/local/type';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const OtherRestAPI: OtherRepository = {
  GetAcademicYears: function (): Promise<DataAPIResponse<number[]>> {
    const url = `${BACKEND_URL}/teacher-student/v1/academic-years`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res) => {
        if (res.status_code == 200) {
          res.data = res.data || [];
        }
        return res;
      });
  },
  GetYears: function (academicYear: number): Promise<DataAPIResponse<string[]>> {
    const url = `${BACKEND_URL}/teacher-student/v1/academic-years/${academicYear}/years`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
  GetClasses: function (
    academicYear: number,
    year: string,
  ): Promise<DataAPIResponse<string[]>> {
    const url = `${BACKEND_URL}/teacher-student/v1/academic-years/${academicYear}/years/${year}/classes`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res) => {
        if (res.status_code == 200) {
          res.data = res.data || [];
        }
        return res;
      });
  },
  GetSubjects: function (): Promise<DataAPIResponse<{ id: number; name: string }[]>> {
    const url = `${BACKEND_URL}/teacher-student/v1/subjects`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res) => {
        if (res.status_code == 200) {
          res.data = res.data || [];
        }
        return res;
      });
  },
  GetSchool: function (): Promise<DataAPIResponse<SchoolHeader>> {
    const url = `${BACKEND_URL}/teacher-student/v1/school`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res) => {
        if (res.status_code == 200) {
          res.data = res.data || [];
        }
        return res;
      });
  },
  GetDropdownLessons: async function (
    subjectId: number,
  ): Promise<DataAPIResponse<{ id: number; name: string }[]>> {
    const url = `${BACKEND_URL}/teacher-student/v1/${subjectId}/lessons`;

    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res) => {
        if (res.status_code == 200) {
          res.data = res.data || [];
        }
        return res;
      });
  },
};

export default OtherRestAPI;
