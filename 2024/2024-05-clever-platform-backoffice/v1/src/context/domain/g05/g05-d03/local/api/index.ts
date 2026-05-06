import RestAPIOverview from './group/overview/restapi';
import { BugReportRepository } from './repository/bug-report';
import { OverviewRepository } from './repository/overview';
import RestAPIBugReport from './group/bug-report/restapi';
// ======================= Environment Import ================================
let overviewAPI: OverviewRepository = RestAPIOverview;
let bugReportAPI: BugReportRepository = RestAPIBugReport;
// ===========================================================================
const API = {
  Overview: overviewAPI,
  BugReport: bugReportAPI,
};

export { API };
export default API;
