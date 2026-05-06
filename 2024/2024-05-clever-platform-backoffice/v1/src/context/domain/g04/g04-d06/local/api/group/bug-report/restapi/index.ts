import downloadCSV from '@global/utils/downloadCSV';
import {
  DataAPIResponse,
  DataDetailAPIResponse,
  PaginationAPIResponse,
} from '../../../helper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import {
  ICreateBugReportQueryParams,
  BugReportRestAPITranslationRepository,
  IUpdateBugStatus,
} from '../../../repository/bugReport';
import StoreGlobalPersist from '@store/global/persist';
import { FailedAPIResponse } from '@global/utils/apiResponseHelper';
import {
  IBugReportDetailProps,
  IBugReportLogProps,
  IBugReportProps,
} from '@domain/g04/g04-d05/local/type';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

const RestAPITranslation: BugReportRestAPITranslationRepository = {
  GetG04D06A01: async function (
    query: ICreateBugReportQueryParams,
  ): Promise<PaginationAPIResponse<IBugReportProps>> {
    const url = `${BACKEND_URL}/bug-report/v1/bugs`;
    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined && v !== ''),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });
    const response = await fetchWithAuth(url + '?' + params.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },
  GetG04D06A02: async function (
    bugId: string,
  ): Promise<DataDetailAPIResponse<IBugReportDetailProps>> {
    const url = `${BACKEND_URL}/bug-report/v1/bug/${bugId}`;
    const response = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },
  GetG04D06A03: async function (
    bugId: string,
  ): Promise<DataAPIResponse<IBugReportLogProps>> {
    const url = `${BACKEND_URL}/bug-report/v1/bug/${bugId}/logs`;
    const response = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },
  PostG04D06A04: async function (updateStatus: IUpdateBugStatus): Promise<any> {
    const url = `${BACKEND_URL}/bug-report/v1/bug/status`;
    const response = await fetchWithAuth(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateStatus),
    });
    return response.json();
  },
  GetG04D06A05: async function (filter: any): Promise<void | FailedAPIResponse> {
    const url = `${BACKEND_URL}/bug-report/v1/bug/download/csv?start_date=${filter.startDate}&end_date=${filter.endDate}`;
    return fetchWithAuth(url)
      .then((res) => {
        if (res.status === 200) {
          return res.blob();
        } else {
          return res.json();
        }
      })
      .then((res) => {
        if (res instanceof Blob) {
          downloadCSV(res, 'bug-report.csv');
        } else {
          return res as FailedAPIResponse;
        }
      });
  },
};

export default RestAPITranslation;
