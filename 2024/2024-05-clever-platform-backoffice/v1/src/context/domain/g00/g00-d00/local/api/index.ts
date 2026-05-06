import AuthRestAPI from './group/auth/restapi';
import CurriculumAPI from './group/curriculum/restapi';
import { AuthRepository } from './repository/auth';
import { CurriculumRepository } from './repository/curriculum';

// ======================= Environment Import ================================
let authAPI: AuthRepository = AuthRestAPI;
let curriculumApi: CurriculumRepository = CurriculumAPI;

const mockIs = !import.meta.env.PROD && import.meta.env.VITE_DEBUG_API_IS_MOCK === 'true';

if (mockIs) {
  // dynamic for test only dev without include build file
  // InfrastructureAPI = Mock;
  authAPI = await import('./group/auth/mock').then((module) => module.default);

  curriculumApi = await import('./group/curriculum/mock').then(
    (module) => module.default,
  );
}

// ===========================================================================
const API = {
  auth: authAPI,
  curriculum: curriculumApi,
};

export default API;
