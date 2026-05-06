import { SchoolRepository } from '@domain/g03/g03-d04/local/api/repository/school.ts';
import { DataAPIResponse } from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { SchoolResponse } from '@domain/g03/g03-d04/local/api/group/school/type.ts';

const backendUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const SchoolRestAPI: SchoolRepository = {
  GetSchoolId: async function (): Promise<DataAPIResponse<SchoolResponse>> {
    // g03-d04-a00
    const url = `${backendUrl}/teacher-student/v1/school`;
    const res = await fetchWithAuth(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }
    return await res.json();
  },
};

export default SchoolRestAPI;
