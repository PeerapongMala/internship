import { PaginationAPIResponse } from '@core/helper/api-type';
import { BugReportItem } from '../../../../../type';
import MockJson from './index.json';

const ActivityGet = (): Promise<PaginationAPIResponse<BugReportItem>> => {
  return new Promise((resolve) => {
    const response: PaginationAPIResponse<BugReportItem> = {
      status_code: 200,
      _pagination: MockJson._pagination,
      data: MockJson.data as BugReportItem[],
      message: MockJson.Message,
    };

    resolve(response);
  });
};

export default ActivityGet;
