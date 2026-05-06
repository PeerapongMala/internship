import { ContentCreator, CurriculumGroup } from '@domain/g01/g01-d02/local/type';
import {
  PaginationAPIResponse,
  DataAPIResponse,
  FailedAPIResponse,
  BaseAPIResponse,
  DataAPIRequest,
  getQueryParams,
} from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import {
  ContentCreatorFilterQueryParams,
  ContentCreatorRepository,
} from '../../../repository/content-creator';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const ContentCreatorRestAPI: ContentCreatorRepository = {
  Get: function (
    query: ContentCreatorFilterQueryParams = {},
  ): Promise<PaginationAPIResponse<ContentCreator>> {
    let url = `${BACKEND_URL}/school-affiliations/v1/content-creators`;
    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
  Update: function (
    curriculumGrouopId: CurriculumGroup['id'],
    action: 'add' | 'remove',
    content_creator_ids: ContentCreator['id'][],
  ): Promise<BaseAPIResponse> {
    let url = `${BACKEND_URL}/school-affiliations/v1/curriculum-groups/${curriculumGrouopId}/content-creators`;
    const actions = {
      add: 1,
      remove: 2,
    };
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ action: actions[action], content_creator_ids }),
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
  DownloadCSV: function (
    curriculumGrouopId: CurriculumGroup['id'],
    query: {
      start_date?: string;
      end_date?: string;
    } = {},
  ): Promise<Blob | FailedAPIResponse> {
    let url = `${BACKEND_URL}/school-affiliations/v1/curriculum-groups/${curriculumGrouopId}/content-creators/download/csv`;
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

export default ContentCreatorRestAPI;
