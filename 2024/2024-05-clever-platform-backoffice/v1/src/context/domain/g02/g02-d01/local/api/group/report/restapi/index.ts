import { IReport } from '@domain/g02/g02-d01/local/type';

import { ReportRepository } from '../../../repository';
import { PaginationAPIResponse } from '../../../helper';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const ReportRestAPI: ReportRepository = {
  Gets(subCriteriaId, query) {
    return fetchWithAuth(
      `${BACKEND_URL}/academic-standard/v1/sub-criteria/${subCriteriaId}/report?limit=${query.limit}&page=${query.page}&search_text=${query.search_text}`,
    )
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<IReport>) => {
        return res;
      });
  },
};

export default ReportRestAPI;
