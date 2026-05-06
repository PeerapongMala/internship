import RestAPIBugReport from './group/bug-report/restapi';
import RestAPIOverview from './group/overview/restapi';
import { AnnouncementRepository } from './repository/announcement';
import { BugReportRepository } from './repository/bug-report';
import { FamilyRepository } from './repository/family';
import { OverviewRepository } from './repository/overview';

// ======================= Environment Import ================================
let overviewAPI: OverviewRepository = RestAPIOverview;
let bugReportAPI: BugReportRepository = RestAPIBugReport;

// ===========================================================================
const API = {
  Overview: overviewAPI,
  BugReport: bugReportAPI,
  Announcement: AnnouncementRepository,
  Family: FamilyRepository,
};

export { API };
export default API;
