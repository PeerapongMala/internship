import { AxiosResponse } from 'axios';
import { TGetBugReportReq, TGetBugReportRes } from '../helper/bug-report';
import { getBugReport } from '../group/bug-report/restapi';

export interface IBugReportRepository {
  GetBugReport: (req: TGetBugReportReq) => Promise<AxiosResponse<TGetBugReportRes, any>>;
}

export const BugReportRepository: IBugReportRepository = {
  GetBugReport: getBugReport,
};
import {
  BasePaginationAPIQueryParams,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import { TBugReport } from '../../types/bug-report';

export interface FilterQueryParams extends BasePaginationAPIQueryParams {}
export interface BugReportRepository {
  BugList: (query: FilterQueryParams) => Promise<PaginationAPIResponse<TBugReport>>;
  BugGet: (
    bug_id: number,
    query: FilterQueryParams,
  ) => Promise<DataAPIResponse<TBugReport>>;
  Create: (query: any) => Promise<DataAPIResponse<any>>;
}
