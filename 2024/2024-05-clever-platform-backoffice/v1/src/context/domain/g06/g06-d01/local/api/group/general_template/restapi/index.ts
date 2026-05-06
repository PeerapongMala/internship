import fetchWithAuth from '@global/utils/fetchWithAuth';
import { GeneralTemplatesRepository } from '../../../repository';
import { DataAPIResponse, PaginationAPIResponse } from '../../../helper';
import { GeneralTemplates } from '../../../type';
import { DataAPIRequest } from '@global/utils/apiResponseHelper';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const GeneralTemplatesRestAPI: GeneralTemplatesRepository = {
  Gets: function (
    school_id: number,
    query,
  ): Promise<PaginationAPIResponse<GeneralTemplates>> {
    const url = `${BACKEND_URL}/grade-system-template/v1/${school_id}/general-template`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );

    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<GeneralTemplates>) => {
        return res;
      });
  },

  GetById: function (id: number): Promise<DataAPIResponse<GeneralTemplates>> {
    const url = `${BACKEND_URL}/grade-system-template/v1/general-template/${id}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<GeneralTemplates>) => {
        return res;
      });
  },

  Update: function (
    id: number,
    general_templates: Partial<GeneralTemplates>,
  ): Promise<DataAPIResponse<GeneralTemplates>> {
    const url = `${BACKEND_URL}/grade-system-template/v1/general-template/${id}`;
    const body = JSON.stringify(general_templates);
    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<GeneralTemplates>) => {
        return res;
      });
  },

  Create: function (
    general_templates: DataAPIRequest<GeneralTemplates>,
  ): Promise<DataAPIResponse<GeneralTemplates>> {
    let url = `${BACKEND_URL}/grade-system-template/v1/general-template`;

    const body = JSON.stringify(general_templates);
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<GeneralTemplates[]>) => {
        if (res.status_code === 200 && Array.isArray(res.data))
          return { ...res, data: res.data?.at(0) } as DataAPIResponse<GeneralTemplates>;
        return res as DataAPIResponse<GeneralTemplates>;
      });
  },
};

export default GeneralTemplatesRestAPI;
