import { DataAPIResponse } from '@global/utils/apiResponseHelper';
import { OtherRepository } from '../../../repository/other';
import { SchoolHeader } from '../../../types/shop';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export const OtherRestAPI: OtherRepository = {
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
};
