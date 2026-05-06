import { PaginationAPIResponse } from '@core/helper/api-type';
import { BugReportItem } from '@domain/g03/g03-d09/g03-d09-p01-report-bug/type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';

const ReportBugGet = async (): Promise<PaginationAPIResponse<BugReportItem>> => {
  const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;
  const url = `${backendURL}/report-bug/v1/bugs`;

  const response = await fetchWithAuth(url, {
    method: 'GET',
  });
  const data = await response.json();

  return data as PaginationAPIResponse<BugReportItem>;
};

export default ReportBugGet;
