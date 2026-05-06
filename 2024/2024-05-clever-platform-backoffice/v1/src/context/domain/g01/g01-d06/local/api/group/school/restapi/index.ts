import { School } from '../../../../type';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { DataAPIResponse } from '@global/utils/apiResponseHelper';
import { SchoolRepository } from '../../../repository/school';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const SchoolRestAPI: SchoolRepository = {
  GetById: function (schoolId: number): Promise<DataAPIResponse<School>> {
    let url = `${BACKEND_URL}/admin-school/v1/schools/${schoolId}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<School[]>) => {
        if (res.status_code === 200 && Array.isArray(res.data))
          return { ...res, data: res.data?.[0] } as DataAPIResponse<School>;
        return res as DataAPIResponse<School>;
      });
  },
};

export default SchoolRestAPI;
