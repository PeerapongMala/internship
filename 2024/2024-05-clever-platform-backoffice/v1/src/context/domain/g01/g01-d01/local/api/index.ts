// import { ProgressDashboardRepository } from './repository/progress-dashboard-contract';
// import ProgressDashboardRestAPI from "./group/progress-dashboard/restapi";
import { ProgressDashboardRepository } from './repository/progress-dashboard';
import ProgressTableRestAPI from './group/progress-table/restapi';
import { ProgressTableRepository } from './repository/progress-table';
import ProvincialDashboardRestAPI from './group/provincial-dashboard/restapi';
import { ProvincialDashboardRepository } from './repository/provincial-dashboard';
import { SchoolStatRepository } from './repository/school-stat';
import SchoolStatRestAPI from './group/school-stat/restapi';
import ProgressDashboardRestAPI from './group/progress-dashboard/restapi';

// ======================= Environment Import ================================

const ProgressTableAPI: ProgressTableRepository = ProgressTableRestAPI;

// ======================= Environment Import ================================
// let familyAPI: FamilyRepository = FamilyRestAPI;
const ProvincialDashboardAPI: ProvincialDashboardRepository = ProvincialDashboardRestAPI;
const SchoolStatAPI: SchoolStatRepository = SchoolStatRestAPI;
const ProgressDashboardAPI: ProgressDashboardRepository = ProgressDashboardRestAPI;

// ===========================================================================
const API = {
  progressDashboard: ProgressDashboardAPI,
  ProgressTable: ProgressTableAPI,
  provincialDashboard: ProvincialDashboardAPI,
  SchoolStat: SchoolStatAPI,
};

export default API;
