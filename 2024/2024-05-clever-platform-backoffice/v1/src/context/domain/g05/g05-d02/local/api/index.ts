import RestAPIBugReport from './group/bug-report/restapi';
import RestAPIOverview from './group/overview/restapi';
import { AnnouncementRepository } from './repository/announcement';
import { BugReportRepository } from './repository/bug-report';
import { FamilyRepository } from './repository/family';
import { ILocalRepository, LocalRepository } from './repository/local';
import { OverviewRepository } from './repository/overview';

// ======================= Environment Import ================================
let overviewAPI: OverviewRepository = RestAPIOverview;
let bugReportAPI: BugReportRepository = RestAPIBugReport;
let localAPI: ILocalRepository = LocalRepository;

// ===========================================================================
const API = {
  Overview: overviewAPI,
  BugReport: bugReportAPI,
  Announcement: AnnouncementRepository,
  Family: FamilyRepository,
  Local: localAPI,
};

export { API };
export default API;
