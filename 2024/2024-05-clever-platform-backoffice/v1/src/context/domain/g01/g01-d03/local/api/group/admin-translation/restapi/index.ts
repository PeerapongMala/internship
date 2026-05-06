import {
  AdminTranslationFilterQueryParams,
  AdminTranslationRepository,
} from '../../../repository/adminTranslation';

import { DataAPIResponse, PaginationAPIResponse } from '../../../helper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { ICurriculum } from '@domain/g01/g01-d03/local/type';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const RestAPITranslation: AdminTranslationRepository = {
  GetG00D00A01: function (
    query: AdminTranslationFilterQueryParams,
  ): Promise<PaginationAPIResponse<ICurriculum>> {
    const url = `${BACKEND_URL}/arriving/v1/curriculum-groups`;
    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res) => {
        if (res.status_code === 200) {
          return {
            ...res,
            _pagination: res._pagination || {
              limit: 0,
              page: 0,
              total_count: 0,
            },
          } as PaginationAPIResponse<ICurriculum>;
        }
        return res;
      });
  },
};

export default RestAPITranslation;
