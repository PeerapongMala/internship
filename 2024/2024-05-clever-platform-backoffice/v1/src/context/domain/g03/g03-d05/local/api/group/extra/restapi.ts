import {
  DataAPIRequest,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import {
  CreateStudent,
  CreateStudyGroup,
  DeleteStudy,
  ExtraRepository,
  FilterQueryParams,
} from '../../repository/extra';
import {
  GroupUnlock,
  StudentUnlockPaginationResponse,
  UnlockedGroupPaginationResponse,
} from '../../../type';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const ExtraRestAPI: ExtraRepository = {
  //  create study group
  CreateUnlockStudyGroupA26: function (
    classId: string,
    lessonId: string,
    query: CreateStudyGroup,
  ): Promise<DataAPIResponse<any>> {
    let url = `${BACKEND_URL}/teacher-lesson/v1/classes/${classId}/lessons/${lessonId}/unlocked-study-groups`;

    const body = JSON.stringify(query);
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<any[]>) => {
        // pull it out of array
        // note: when create succesfully, it response HTTP 201 Created
        if (res.status_code === 201 && Array.isArray(res.data))
          return { ...res, data: res.data?.at(0) } as DataAPIResponse<any>;
        return res as DataAPIResponse<any>;
      });
  },
  //  get study group
  GetsUnlockStudyGroupA27: function (
    classId: string,
    lessonId: string,
    query: FilterQueryParams,
  ): Promise<UnlockedGroupPaginationResponse> {
    const url = `${BACKEND_URL}/teacher-lesson/v1/classes/${classId}/lessons/${lessonId}/unlocked-study-groups`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: UnlockedGroupPaginationResponse) => {
        return res;
      });
  },

  //  create student
  CreateUnlockStudentA29: function (
    lessonId: number,
    query: CreateStudent,
  ): Promise<DataAPIResponse<any>> {
    let url = `${BACKEND_URL}/teacher-lesson/v1/lessons/${lessonId}/unlocked-students`;

    const body = JSON.stringify(query);
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<any[]>) => {
        // pull it out of array
        // note: when create succesfully, it response HTTP 201 Created
        if (res.status_code === 201 && Array.isArray(res.data))
          return { ...res, data: res.data?.at(0) } as DataAPIResponse<any>;
        return res as DataAPIResponse<any>;
      });
  },
  // get student
  GetsUnlockStudentA30: function (
    classId: string,
    lessonId: string,
    query: FilterQueryParams,
  ): Promise<StudentUnlockPaginationResponse> {
    const url = `${BACKEND_URL}/teacher-lesson/v1/classes/${classId}/lessons/${lessonId}/unlocked-students`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: StudentUnlockPaginationResponse) => {
        return res;
      });
  },

  // delete study group

  DeleteStudyGroupA28: function (
    classId: string,
    lessonId: string,
    query: CreateStudyGroup,
  ): Promise<DataAPIResponse<any>> {
    let url = `${BACKEND_URL}/teacher-lesson/v1/classes/${classId}/lessons/${lessonId}/unlocked-study-groups/bulk-edit`;

    const body = JSON.stringify(query);
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<any[]>) => {
        // pull it out of array
        // note: when create succesfully, it response HTTP 201 Created
        if (res.status_code === 201 && Array.isArray(res.data))
          return { ...res, data: res.data?.at(0) } as DataAPIResponse<any>;
        return res as DataAPIResponse<any>;
      });
  },
  // delete student
  DeleteStudentA31: function (
    classId: string,
    lessonId: string,
    query: DeleteStudy,
  ): Promise<DataAPIResponse<any>> {
    let url = `${BACKEND_URL}/teacher-lesson/v1/classes/${classId}/lessons/${lessonId}/unlocked-students/bulk-edit`;

    const body = JSON.stringify(query);
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<any[]>) => {
        // pull it out of array
        // note: when create succesfully, it response HTTP 201 Created
        if (res.status_code === 201 && Array.isArray(res.data))
          return { ...res, data: res.data?.at(0) } as DataAPIResponse<any>;
        return res as DataAPIResponse<any>;
      });
  },
};

export default ExtraRestAPI;
