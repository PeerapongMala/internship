import { DataAPIRequest } from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { DataAPIResponse, PaginationAPIResponse } from '../../../helper';
import { TemplatesRepository } from '../../../repository';
import {
  GradeTemplateContent,
  GradeTemplateRecord,
  TCreateGradeTemplateContent,
} from '../../../type';
import { TPatchUpdateTemplateReq } from '../../../helper/grade';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const TemplateRestAPI: TemplatesRepository = {
  Gets: function (school_id, query): Promise<PaginationAPIResponse<GradeTemplateRecord>> {
    const url = `${BACKEND_URL}/grade-system-template/v1/${school_id}/grade-template`;

    const paramsObj: Record<string, any> = {};

    if (query.status) paramsObj.status = query.status;
    if (query.search_text) paramsObj.search_text = query.search_text;
    if (query.year) paramsObj.year = query.year;
    if (query.page) paramsObj.page = query.page;
    if (query.limit) paramsObj.limit = query.limit;

    const params = new URLSearchParams(paramsObj);

    // const params = new URLSearchParams({
    //   ...(filterQuery as Record<string, string>),
    // });

    // const filterQuery = query.status ? { status: query.status } : {};
    // const params = new URLSearchParams(filterQuery)

    return fetchWithAuth(url + `?${params.toString()}`)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<GradeTemplateRecord>) => {
        return res;
      });
  },

  GetById: function (id: number): Promise<DataAPIResponse<GradeTemplateContent>> {
    const url = `${BACKEND_URL}/grade-system-template/v1/grade-template/${id}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<GradeTemplateContent>) => {
        if (res.status_code === 200 && Array.isArray(res.data))
          return {
            ...res,
            data: res.data,
          } as DataAPIResponse<GradeTemplateContent>;
        return res as DataAPIResponse<GradeTemplateContent>;
      })
      .then((res: DataAPIResponse<GradeTemplateContent>) => {
        return res;
      });
  },

  Create: function (
    template: DataAPIRequest<TCreateGradeTemplateContent>,
  ): Promise<DataAPIResponse<GradeTemplateContent>> {
    let url = `${BACKEND_URL}/grade-system-template/v1/grade-template`;
    const body = JSON.stringify(template);
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<GradeTemplateContent[]>) => {
        if (res.status_code === 201 && Array.isArray(res.data))
          return {
            ...res,
            data: res.data?.at(0),
          } as DataAPIResponse<GradeTemplateContent>;
        return res as DataAPIResponse<GradeTemplateContent>;
      });
  },
  Update: function (
    templateId: number,
    GradeTemplateContent: TPatchUpdateTemplateReq,
  ): Promise<Omit<DataAPIResponse<GradeTemplateContent>, 'data'>> {
    let url = `${BACKEND_URL}/grade-system-template/v1/grade-template/${templateId}`;
    const body = JSON.stringify(GradeTemplateContent);
    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
      .then((res) => res.json())
      .then((res: Omit<DataAPIResponse<GradeTemplateContent>, 'data'>) => {
        if (res.status_code === 200)
          return {
            ...res,
          } as Omit<DataAPIResponse<GradeTemplateContent>, 'data'>;
        return res as Omit<DataAPIResponse<GradeTemplateContent>, 'data'>;
      });
  },
  UpdateDetail: function (
    templateId: number,
    GradeTemplateContent: Partial<GradeTemplateContent>,
  ): Promise<DataAPIResponse<GradeTemplateContent>> {
    let url = `${BACKEND_URL}/grade-system-template/v1/grade-template-detail/${templateId}`;
    const body = JSON.stringify(GradeTemplateContent);
    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<GradeTemplateContent[]>) => {
        if (res.status_code === 200 && Array.isArray(res.data))
          return {
            ...res,
            data: res?.data?.at?.(0),
          } as DataAPIResponse<GradeTemplateContent>;
        return res as DataAPIResponse<GradeTemplateContent>;
      });
  },
};

export default TemplateRestAPI;
