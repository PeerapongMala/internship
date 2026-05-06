import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosResponse } from 'axios';
import { TGetBugReportReq, TGetBugReportRes } from '../../../helper/bug-report';

export const getBugReport = async (req: TGetBugReportReq) => {
  let response: AxiosResponse<TGetBugReportRes>;
  try {
    response = await axiosWithAuth.get(`/line-parent/v1/report-bug/${req.bug_id}`, {});
  } catch (error) {
    throw error;
  }

  return response;
};

import { DataAPIResponse, PaginationAPIResponse } from '@global/utils/apiResponseHelper';
import { BugReportRepository, FilterQueryParams } from '../../../repository/bug-report';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { TBugReport } from '@domain/g05/g05-d02/local/types/bug-report';
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const RestAPIBugReport: BugReportRepository = {
  BugList: function (
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<TBugReport>> {
    const url = `${BACKEND_URL}/line-parent/v1/report-bug`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<TBugReport>) => {
        return res;
      });
  },
  BugGet: function (
    bug_id: number,
    query: FilterQueryParams,
  ): Promise<DataAPIResponse<TBugReport>> {
    const url = `${BACKEND_URL}/line-parent/v1/report-bug/${bug_id}`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: DataAPIResponse<TBugReport>) => {
        return res;
      });
  },
  Create: function (query: FormData): Promise<DataAPIResponse<any>> {
    let url = `${BACKEND_URL}/line-parent/v1/report-bug/create`;

    const body = query;
    return fetchWithAuth(url, {
      method: 'POST',
      body: body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<any[]>) => {
        if (res.status_code === 201 && Array.isArray(res.data))
          return { ...res, data: res.data?.at(0) } as DataAPIResponse<any>;
        return res as DataAPIResponse<any>;
      });
  },
};
export default RestAPIBugReport;
