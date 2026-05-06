// ======================= Environment Import ================================

import DropdownRestAPI from '@domain/g06/g06-d03/local/api/group/dropdown/restapi';
import { GradeRepository, gradeRepository } from './repository/grade';
import { adminRepository, AdminRepository } from './repository/admin';

const mockIs = !import.meta.env.PROD && import.meta.env.VITE_DEBUG_API_IS_MOCK === 'true';

if (mockIs) {
  // dynamic for test only dev without include build file
  // InfrastructureAPI = Mock;
  // historyAPI = await import('./group/history/mock').then(
  //   (module) => module.default,
  // );
  // noteAPI = await import('./group/note/mock').then(
  //   (module) => module.default,
  // );
  // sheetAPI = await import('./group/sheet/mock').then(
  //   (module) => module.default,
  // );
}
let GradeRestAPI: GradeRepository = gradeRepository;
let AdminRestAPI: AdminRepository = adminRepository;

// ===========================================================================
const API = {
  Grade: GradeRestAPI,
  Dropdown: DropdownRestAPI,
  Admin: AdminRestAPI,
};

export default API;
