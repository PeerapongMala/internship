import { SheetRepository } from '../../../repository/sheet';
import { PaginationAPIResponse } from '@global/utils/apiResponseHelper';

import fetchWithAuth from '@global/utils/fetchWithAuth';
import { DropdownRepository } from '../../../repository/dropdown';
import { IGetHistoryList } from '@domain/g06/g06-d03/local/type';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const DropdownRestAPI: DropdownRepository = {
  GetClassList: async (schoolId, seedYear, academicYear) => {
    //

    const response = await fetchWithAuth(
      `${BACKEND_URL}/data-entry/v1/classes?school_id=${schoolId}&seed_year=${seedYear}&academic_year=${academicYear}`,
    );
    return response.json() as Promise<PaginationAPIResponse<string>>;
  },
  GetSeedAcaDemicYearList: async () => {
    const response = await fetchWithAuth(
      `${BACKEND_URL}/data-entry/v1/seed-academic-years`,
    );
    return response.json() as Promise<PaginationAPIResponse<number>>;
  },
  GetSeedYearList: async () => {
    const response = await fetchWithAuth(`${BACKEND_URL}/data-entry/v1/seed-years`);
    return response.json() as Promise<PaginationAPIResponse<string>>;
  },
  GetSubjectList: async (schoolId, academicYear: number) => {
    const response = await fetchWithAuth(
      `${BACKEND_URL}/data-entry/v1/subjects?school_id=${schoolId}&academic_year=${academicYear}`,
    );
    return response.json() as Promise<PaginationAPIResponse<string>>;
  },
  GetHistoryList(evaluationSheetId, options) {
    let url = `${BACKEND_URL}/data-entry/v1/evaluation-sheet/edit-history/${evaluationSheetId}`;
    const params = new URLSearchParams();
    params.append('no_details', String(true));

    for (const [key, value] of Object.entries(options ?? {})) {
      if (!value) continue;
      params.append(key, String(value));
    }

    url += `?${params.toString()}`;

    return fetchWithAuth(url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((res: PaginationAPIResponse<IGetHistoryList>) => res);
  },
};

export default DropdownRestAPI;
