import fetchWithAuth from '@global/utils/fetchWithAuth';
import { Student } from '../../../type';
import { DataAPIResponse, PaginationAPIResponse } from '@global/utils/apiResponseHelper';
import { StudentFilterQueryParams, StudentRepository } from '../../../repository/student';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

function getQueryParams(query: Record<string, any>) {
  const filterQuery = Object.fromEntries(
    Object.entries(query).filter(([k, v]) => v !== undefined),
  );
  return new URLSearchParams({
    ...(filterQuery as Record<string, string>),
  });
}

const RestAPIStudent: StudentRepository = {
  Get: function (
    schoolId: number,
    query: StudentFilterQueryParams,
  ): Promise<PaginationAPIResponse<Student>> {
    let url = `${BACKEND_URL}/admin-classroom/v1/schools/${schoolId}/students`;
    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<Student>) => {
        return res;
      });
  },
  Create: function (
    classroomId: number,
    student_ids: string[],
  ): Promise<DataAPIResponse<null>> {
    let url = `${BACKEND_URL}/admin-classroom/v1/classrooms/${classroomId}/students`;
    const data = {
      student_ids,
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
    data: { student_id: string; action: 'add' | 'delete' }[],
  ): Promise<DataAPIResponse<undefined>> {
    let url = `${BACKEND_URL}/admin-classroom/v1/classrooms/${classroomId}/students/bulk-edit`;
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
    query: StudentFilterQueryParams,
  ): Promise<PaginationAPIResponse<Student>> {
    let url = `${BACKEND_URL}/admin-classroom/v1/classrooms/${classroomId}/students`;
    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<Student>) => {
        return res;
      });
  },
  DownloadCSVClassroom: function (
    classroomId: number,
    query: StudentFilterQueryParams,
  ): Promise<Blob> {
    let url = `${BACKEND_URL}/admin-classroom/v1/classrooms/${classroomId}/students/download/csv`;

    // const params = getQueryParams(query)
    // return fetchWithAuth(url + "?" + params.toString(), {
    return fetchWithAuth(url).then((res) => {
      return res.blob();
    });
  },
  Delete: function (
    classroomId: number,
    studentId: string,
  ): Promise<DataAPIResponse<undefined>> {
    let url = `${BACKEND_URL}/admin-classroom/v1/classrooms/${classroomId}/students/${studentId}`;
    return fetchWithAuth(url, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
  Move: function (
    classroomId: number,
    studentId: string,
  ): Promise<DataAPIResponse<undefined>> {
    let url = `${BACKEND_URL}/admin-classroom/v1/classrooms/${classroomId}/students/${studentId}`;
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        return res as DataAPIResponse<undefined>;
      });
  },
};

export default RestAPIStudent;
