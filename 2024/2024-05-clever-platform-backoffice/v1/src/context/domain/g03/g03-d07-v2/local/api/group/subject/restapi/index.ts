import {
  BaseAPIResponse,
  BasePaginationAPIQueryParams,
  DataAPIRequest,
  DataAPIResponse,
  getQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { SubjectRepository } from '../../../repository/subject';
import { SubjectShop } from '../../../types/shop';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const SubjectRestAPI: SubjectRepository = {
  Get: function (
    query: BasePaginationAPIQueryParams = {},
  ): Promise<PaginationAPIResponse<SubjectShop>> {
    let url = `${BACKEND_URL}/teacher-shop/v1/teacher/shop/subject`;
    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<SubjectShop>) => {
        return res as PaginationAPIResponse<SubjectShop>;
      });
  },
  GetById: function (
    subjectId: SubjectShop['subject_id'],
  ): Promise<DataAPIResponse<SubjectShop>> {
    let url = `${BACKEND_URL}/teacher-shop/v1/teacher/shop/subject/subject_id/${subjectId}`;

    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
};

export default SubjectRestAPI;
