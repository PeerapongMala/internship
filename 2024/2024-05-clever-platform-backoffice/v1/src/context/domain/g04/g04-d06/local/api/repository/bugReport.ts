import { FailedAPIResponse } from '@global/utils/apiResponseHelper';
import { DataAPIResponse, DataDetailAPIResponse, PaginationAPIResponse } from '../helper';
import {
  IBugReportDetailProps,
  IBugReportLogProps,
  IBugReportProps,
} from '@domain/g04/g04-d05/local/type';

export interface ICreateBugReportQueryParams {
  page?: string | number;
  limit?: string | number;
  status?: string | undefined;
  platform?: string;
  type?: string;
  priority?: string;
  start_date?: string;
  end_date?: string;
  search_text?: string;
}

export interface IUpdateBugStatus {
  bug_id: number;
  status: string;
  message: string;
}

export interface IGetCSVFilter {
  startDate: string;
  endDate: string;
}

export interface BugReportRestAPITranslationRepository {
  GetG04D06A01: (
    query: ICreateBugReportQueryParams,
  ) => Promise<PaginationAPIResponse<IBugReportProps>>;
  GetG04D06A02: (bugId: string) => Promise<DataDetailAPIResponse<IBugReportDetailProps>>;
  GetG04D06A03: (bugId: string) => Promise<DataAPIResponse<IBugReportLogProps>>;
  PostG04D06A04: (updateStatus: IUpdateBugStatus) => Promise<any>;
  GetG04D06A05: (filter: any) => Promise<void | FailedAPIResponse>;
}
