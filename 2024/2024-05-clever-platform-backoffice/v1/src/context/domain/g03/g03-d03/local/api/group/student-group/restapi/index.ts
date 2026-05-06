import { StudentGroup, RecordStatus } from '@domain/g03/g03-d03/local/type';
import {
  PaginationAPIResponse,
  BaseAPIResponse,
  getQueryParams,
} from '@global/utils/apiResponseHelper';
import {
  StudentGroupFilterQueryParams,
  StudentGroupRepository,
} from '../../../repository/student-group';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const StudentGroupRestAPI: StudentGroupRepository = {
  Get: function (
    schoolId: number,
    query: StudentGroupFilterQueryParams = {},
  ): Promise<PaginationAPIResponse<StudentGroup>> {
    let url = `${BACKEND_URL}/teacher-student-group/v1/study-group/school/${schoolId}`;
    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res) => {
        if (res.status_code == 200) {
          res.data = res.data || [];
        }
        return res;
      });
  },
  BulkEdit: function (
    bulk_edit_list: {
      id: number;
      status: RecordStatus;
    }[],
  ): Promise<BaseAPIResponse> {
    let url = `${BACKEND_URL}/teacher-student-group/v1/study-group/status/bulk-edit`;
    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ bulk_edit_list }),
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
};

export default StudentGroupRestAPI;
