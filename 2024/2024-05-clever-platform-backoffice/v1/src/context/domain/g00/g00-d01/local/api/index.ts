import RestAPIBugReport from './group/bug-report/restapi';
import { BugReportRepository } from './repository/bug-report';

// ======================= Environment Import ================================
let bugReportAPI: BugReportRepository = RestAPIBugReport;

// ===========================================================================
const API = {
  BugReport: bugReportAPI,
};

export { API };
export default API;
