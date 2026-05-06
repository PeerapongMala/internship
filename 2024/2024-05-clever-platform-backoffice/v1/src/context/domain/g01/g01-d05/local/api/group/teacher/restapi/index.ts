import fetchWithAuth from '@global/utils/fetchWithAuth';
import { Classroom, Teacher } from '../../../type';
import {
  ClassroomFilterQueryParams,
  ClassroomRepository,
} from '../../../repository/classroom';
import {
  DataAPIRequest,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import { TeacherFilterQueryParams, TeacherRepository } from '../../../repository/teacher';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

function getQueryParams(query: Record<string, any>) {
  const filterQuery = Object.fromEntries(
    Object.entries(query).filter(([k, v]) => v !== undefined),
  );
  return new URLSearchParams({
    ...(filterQuery as Record<string, string>),
  });
}

const RestAPITeacher: TeacherRepository = {
  Get: function (
    schoolId: number,
    query: TeacherFilterQueryParams,
  ): Promise<PaginationAPIResponse<Teacher>> {
    let url = `${BACKEND_URL}/admin-classroom/v1/schools/${schoolId}/teachers`;
    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<Teacher>) => {
        return res;
      });
  },
  Create: function (
    classroomId: number,
    teacher_ids: string[],
  ): Promise<DataAPIResponse<null>> {
    let url = `${BACKEND_URL}/admin-classroom/v1/classrooms/${classroomId}/teachers`;
    const data = {
      teacher_ids,
    };
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<null>) => {
        return res as DataAPIResponse<null>;
      });
  },
  BulkEdit: function (
    classroomId: number,
    data: { teacher_id: string; action: 'add' | 'delete' }[],
  ): Promise<DataAPIResponse<undefined>> {
    let url = `${BACKEND_URL}/admin-classroom/v1/classrooms/${classroomId}/teachers/bulk-edit`;
    const body = JSON.stringify({
      items: data,
    });
    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body,
    })
      .then((res) => res.json())
      .then((res) => {
        return res as DataAPIResponse<undefined>;
      });
  },
  GetClassroom: function (
    classroomId: number,
    query: TeacherFilterQueryParams,
  ): Promise<PaginationAPIResponse<Teacher>> {
    let url = `${BACKEND_URL}/admin-classroom/v1/classrooms/${classroomId}/teachers`;
    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<Teacher>) => {
        return res;
      });
  },
  DownloadCSVClassroom: function (
    classroomId: number,
    query: TeacherFilterQueryParams,
  ): Promise<Blob> {
    let url = `${BACKEND_URL}/admin-classroom/v1/classrooms/${classroomId}/teachers/download/csv`;

    // const params = getQueryParams(query)
    // return fetchWithAuth(url + "?" + params.toString(), {
    return fetchWithAuth(url).then((res) => {
      return res.blob();
    });
  },
  Delete: function (
    classroomId: number,
    teacherId: string,
  ): Promise<DataAPIResponse<undefined>> {
    let url = `${BACKEND_URL}/admin-classroom/v1/classrooms/${classroomId}/teachers/${teacherId}`;
    return fetchWithAuth(url, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
};

export default RestAPITeacher;
