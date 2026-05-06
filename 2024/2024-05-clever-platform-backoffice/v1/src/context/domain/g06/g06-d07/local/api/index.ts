// ======================= Environment Import ================================

import { GradeSettingRepository } from './repository/setting';

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

// ===========================================================================
const API = {
  GradeSetting: GradeSettingRepository,
};

export default API;
