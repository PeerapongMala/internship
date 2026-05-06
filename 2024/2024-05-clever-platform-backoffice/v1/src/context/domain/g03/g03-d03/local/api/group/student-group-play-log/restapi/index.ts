import { StudentGroupPlayLog } from '@domain/g03/g03-d03/local/type';
import {
  FailedAPIResponse,
  getQueryParams,
  DataAPIResponse,
} from '@global/utils/apiResponseHelper';
import {
  StudentGroupPlayLogFilterQueryParams,
  StudentGroupPlayLogRepository,
} from '../../../repository/student-group-play-log';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export const StudentGroupPlayLogRestAPI: StudentGroupPlayLogRepository = {
  Get: function (
    studentGroupId: number,
    query: StudentGroupPlayLogFilterQueryParams,
  ): Promise<DataAPIResponse<StudentGroupPlayLog[]>> {
    let url = `${BACKEND_URL}/teacher-student-group/v1/study-group/${studentGroupId}/play-stat/list`;
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
  DownloadCSV: function (
    studyGroupId: number,
    query: StudentGroupPlayLogFilterQueryParams,
  ): Promise<Blob | FailedAPIResponse> {
    let url = `${BACKEND_URL}/teacher-student-group/v1/study-group/${studyGroupId}/play-stat/csv`;
    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString()).then((res) => {
      if (res.status == 200) {
        return res.blob();
      } else {
        return res.json();
      }
    });
  },
};
