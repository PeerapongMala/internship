import {
  TextTranslation,
  TranslateTextAny,
  TranslateTextRecord,
} from '@domain/g02/g02-d06/local/type';
import {
  AcademicTranslationFilterQueryParams,
  AcademicTranslationRepository,
} from '../../../repository/academicTranslation';
import downloadCSV from '@global/utils/downloadCSV';
import { DataAPIResponse, PaginationAPIResponse } from '../../../helper';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const RestAPITranslation: AcademicTranslationRepository = {
  GetG02D06A01: function (
    curriculumGroupId: string,
    query: AcademicTranslationFilterQueryParams,
  ): Promise<PaginationAPIResponse<TranslateTextRecord>> {
    const url = `${BACKEND_URL}/academic-translation/v1/${curriculumGroupId}/saved-text`;
    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    if (filterQuery.text) {
      filterQuery.text = filterQuery.text.replace(/\\/g, '\\\\');
    }
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
          } as PaginationAPIResponse<TranslateTextRecord>;
        }
        return res;
      });
  },
  CreateG02D06A02: function (
    textObject: Partial<TranslateTextAny>,
  ): Promise<DataAPIResponse<TranslateTextAny>> {
    let url = `${BACKEND_URL}/academic-translation/v1/saved-text/translate`;

    const body = JSON.stringify(textObject);
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: body,
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<TranslateTextAny>) => {
        return res;
      });
  },
  GetG02D06A03: function (
    curriculumGroupId: string,
    query: AcademicTranslationFilterQueryParams,
  ): Promise<void> {
    const url = `${BACKEND_URL}/academic-translation/v1/${curriculumGroupId}/saved-text/download/csv`;
    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString(), {
      method: 'GET',
      headers: {
        Accept: 'text/csv',
      },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.blob();
        } else {
          return res.json().then((json) => {
            throw new Error(json.message || 'Failed to download CSV');
          });
        }
      })
      .then((blob) => {
        if (blob instanceof Blob) {
          downloadCSV(blob, 'saved-text.csv');
        }
      });
  },
  UploadG02D06A04: function (
    curriculumGroupId: string,
    formData: FormData,
  ): Promise<DataAPIResponse<TranslateTextAny>> {
    let url = `${BACKEND_URL}/academic-translation/v1/${curriculumGroupId}/saved-text/upload/csv`;

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
      },
      body: formData,
    };

    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<TranslateTextAny>) => {
        return res;
      });
  },
  CreateG02D06A06: function (
    curriculumGroupId: string,
    formData: FormData,
  ): Promise<DataAPIResponse<TextTranslation>> {
    let url = `${BACKEND_URL}/academic-translation/v1/${curriculumGroupId}/saved-text`;

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
      },
      body: formData,
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<TextTranslation>) => {
        return res;
      });
  },
  UpdateG02D06A07: function (
    curriculumGroupId: string,
    textObject: Partial<TranslateTextAny>,
  ): Promise<DataAPIResponse<TextTranslation>> {
    let url = `${BACKEND_URL}/academic-translation/v1/saved-text/translate`;

    const body = JSON.stringify(textObject);
    const options = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      body: body,
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<TextTranslation>) => {
        return res;
      });
  },
  GetG02D06A08: function (groupId: string): Promise<DataAPIResponse<TextTranslation>> {
    const url = `${BACKEND_URL}/academic-translation/v1/saved-text/${groupId}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<TextTranslation>) => {
        return res;
      });
  },
  UpdateG02D06A09: function (
    groupId: string,
    textObject: Partial<TranslateTextAny>,
  ): Promise<DataAPIResponse<TranslateTextAny>> {
    let url = `${BACKEND_URL}/academic-translation/v1/saved-text/${groupId}/speech/toggle`;

    const body = JSON.stringify(textObject);
    const options = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      body: body,
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<TranslateTextAny>) => {
        return res;
      });
  },
  UpdateG02D06A10: function (
    groupId: string,
    textObject: Partial<TranslateTextAny>,
  ): Promise<DataAPIResponse<TranslateTextAny>> {
    let url = `${BACKEND_URL}/academic-translation/v1/saved-text/${groupId}/status`;

    const body = JSON.stringify(textObject);
    const options = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      body: body,
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<TranslateTextAny>) => {
        return res;
      });
  },
  UpdateG02D06A11: function (
    textObject: Partial<TranslateTextAny>,
  ): Promise<DataAPIResponse<TextTranslation>> {
    let url = `${BACKEND_URL}/academic-translation/v1/saved-text/bulk-edit`;

    const body = JSON.stringify(textObject);
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: body,
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<TextTranslation>) => {
        return res;
      });
  },
  UpdateG02D06A12: function (
    groupId: string,
    textObject: Partial<TranslateTextAny>,
  ): Promise<DataAPIResponse<TextTranslation>> {
    let url = `${BACKEND_URL}/academic-translation/v1/saved-text/${groupId}`;

    const body = JSON.stringify(textObject);
    const options = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      body: body,
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<TextTranslation>) => {
        return res;
      });
  },
};

export default RestAPITranslation;
