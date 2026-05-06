import {
  SubjectFilterQueryParams,
  SubjectTeacherRepository,
  TeacherFilterQueryParams,
} from '../../../repository/subject-teacher';
import {
  AcademicYear,
  CreateSubjectTeacher,
  SchoolTeacher,
  Subject,
  SubjectTeacher,
} from '../../../../type';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import {
  BaseAPIResponse,
  DataAPIRequest,
  DataAPIResponse,
  getQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const SubjectTeacherRestAPI: SubjectTeacherRepository = {
  Create: function (
    data: DataAPIRequest<CreateSubjectTeacher>,
  ): Promise<BaseAPIResponse> {
    let url = `${BACKEND_URL}/subject-teacher/v1/subjects/${data.subject_id}/teachers`;
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res: BaseAPIResponse) => {
        return res;
      });
  },
  GetSubjects: function (
    school_id: number,
    query: SubjectFilterQueryParams = {},
  ): Promise<PaginationAPIResponse<Subject>> {
    let url = `${BACKEND_URL}/subject-teacher/v1/${school_id}/subjects`;

    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<Subject>) => {
        return res;
      });
  },
  Get: function (
    school_id: number,
    subject_id: number,
    query: TeacherFilterQueryParams = {},
  ): Promise<PaginationAPIResponse<SubjectTeacher>> {
    let url = `${BACKEND_URL}/subject-teacher/v1/${school_id}/subjects/${subject_id}/teachers`;

    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<SubjectTeacher>) => {
        return res;
      });
  },
  GetAcademicYears: function (
    school_Id: number,
  ): Promise<DataAPIResponse<AcademicYear[]>> {
    let url = `${BACKEND_URL}/teacher-student/v1/academic-year-ranges?school_Id=${school_Id}`;

    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<AcademicYear[]>) => {
        return res;
      });
  },
  BulkEdit: function (
    subject_id: number,
    data: { teacher_id: string; academic_year: number }[],
  ): Promise<DataAPIResponse<undefined>> {
    let url = `${BACKEND_URL}/subject-teacher/v1/subjects/${subject_id}/teachers/bulk-edit`;
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        bulk_edit_list: data,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        return res as DataAPIResponse<undefined>;
      });
  },
  GetById: function (subject_id: Subject['id']): Promise<DataAPIResponse<Subject>> {
    let url = `${BACKEND_URL}/subject-teacher/v1/subjects/${subject_id}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<Subject[]>) => {
        if (res.status_code === 200 && Array.isArray(res.data))
          return { ...res, data: res.data?.[0] } as DataAPIResponse<Subject>;
        return res as DataAPIResponse<Subject>;
      });
  },
  GetTeachers: function (
    schoolId: number,
    query: TeacherFilterQueryParams = {},
  ): Promise<PaginationAPIResponse<SchoolTeacher>> {
    let url = `${BACKEND_URL}/subject-teacher/v1/${schoolId}/teachers`;

    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<SchoolTeacher>) => {
        return res;
      });
  },
};

export default SubjectTeacherRestAPI;
