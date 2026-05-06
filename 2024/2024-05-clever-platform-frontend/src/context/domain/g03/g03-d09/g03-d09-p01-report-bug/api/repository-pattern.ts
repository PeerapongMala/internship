import { PaginationAPIResponse } from '@core/helper/api-type';
import { BugReportItem } from '../type';

export interface RepositoryPatternInterface {
  Global: {
    ReportBug: { Get(): Promise<PaginationAPIResponse<BugReportItem>> };
  };
}
