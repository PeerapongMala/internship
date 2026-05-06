import {
  TBasePaginationResponse,
  TBaseResponse,
  TPaginationReq,
} from '@domain/g06/g06-d02/local/types';
import { TBugReport } from '../../types/bug-report';

export type TGetBugReportReq = { bug_id: string };
export type TGetBugReportRes = TBaseResponse<TBugReport>;
