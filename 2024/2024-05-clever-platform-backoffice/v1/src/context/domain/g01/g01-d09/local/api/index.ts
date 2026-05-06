import { adminReportPermissionRepo } from './repository/admin-report-permission';
import { schoolAffiliationRepo } from './repository/school-affiliation';

const API = {
  adminReportPermissionAPI: adminReportPermissionRepo,
  schoolAffiliationAPI: schoolAffiliationRepo,
};

export default API;
