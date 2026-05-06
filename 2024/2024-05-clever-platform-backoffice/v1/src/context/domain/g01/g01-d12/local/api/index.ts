import SchoolRestAPI from '@domain/g01/g01-d04/local/api/group/school/restapi';
import SchoolStudentRestAPI from '@domain/g01/g01-d04/local/api/group/school-student/restapi';
import { SchoolRepository } from '@domain/g01/g01-d04/local/api/repository/school.ts';
import { SchoolStudentRepository } from '@domain/g01/g01-d04/local/api/repository/school-student.ts';
import { AdminUserAccountRepository } from './repository/admin-user-account.ts';
import RestAPIAdminUserAccount from './group/user-account/index.ts';
import RestAPIParentsAccount from './group/parents-account/index.ts';
import { ParentsAccountRepository } from './repository/parents-account.ts';
import RestAPIObserversAccount from './group/observers-account/index.ts';
import { ObserversAccountRepository } from './repository/observers-account.ts';
import AdminUserAccountRestAPI from './group/user-account/index.ts';

// ======================= Environment Import ================================

let schoolAPI: SchoolRepository = SchoolRestAPI;
const schoolStudentAPI: SchoolStudentRepository = SchoolStudentRestAPI;

let parentsAccountAPI: ParentsAccountRepository = RestAPIParentsAccount;
let observersAccountAPI: ObserversAccountRepository = RestAPIObserversAccount;
const mockIs = !import.meta.env.PROD && import.meta.env.VITE_DEBUG_API_IS_MOCK === 'true';

// if (mockIs) {
//   // dynamic for test only dev without include build file
//   // InfrastructureAPI = Mock;
//   schoolTeacherAPI = await import('./group/school-teacher/mock').then(
//     (module) => module.default,
//   );

//   schoolAnnouncerAPI = await import('./group/school-announcer/mock').then(
//     (module) => module.default,
//   );
// }

// ===========================================================================
const API = {
  observersAccount: observersAccountAPI,
  parentsAccount: parentsAccountAPI,
  school: schoolAPI,
  schoolStudent: schoolStudentAPI,
  adminUserAccount: AdminUserAccountRestAPI,
};

export default API;
