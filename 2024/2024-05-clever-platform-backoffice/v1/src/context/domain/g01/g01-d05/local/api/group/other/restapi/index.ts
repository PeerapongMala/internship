import fetchWithAuth from '@global/utils/fetchWithAuth';
import { School, SeedYear, User } from '../../../type';
import { DataAPIResponse } from '@global/utils/apiResponseHelper';
import { OtherRepository } from '../../../repository/other';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const RestAPIOther: OtherRepository = {
  User: {
    GetById: async function (id: string): Promise<DataAPIResponse<User>> {
      let url = `${BACKEND_URL}/admin-user-account/v1/users/${id}`;
      return fetchWithAuth(url)
        .then((res) => res.json())
        .then((res: DataAPIResponse<User[]>) => {
          if (res.status_code === 200 && Array.isArray(res.data))
            return { ...res, data: res.data?.[0] } as DataAPIResponse<User>;
          return res as DataAPIResponse<User>;
        });
    },
  },
  School: {
    GetById: function (id: string): Promise<DataAPIResponse<School>> {
      let url = `${BACKEND_URL}/admin-school/v1/schools/${id}`;
      return fetchWithAuth(url)
        .then((res) => res.json())
        .then((res: DataAPIResponse<School[]>) => {
          if (res.status_code === 200 && Array.isArray(res.data))
            return { ...res, data: res.data?.[0] } as DataAPIResponse<School>;
          return res as DataAPIResponse<School>;
        });
    },
  },
  SchoolAffiliation: {
    GetSeedYears: function (): Promise<DataAPIResponse<SeedYear[]>> {
      let url = `${BACKEND_URL}/school-affiliations/v1/seed-years`;
      return fetchWithAuth(url)
        .then((res) => res.json())
        .then((res: DataAPIResponse<SeedYear[]>) => {
          return res;
        });
    },
  },
};

export default RestAPIOther;
