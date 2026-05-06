import RestAPI from './infrastructure/restapi';
import { RepositoryPatternInterface } from './repository-pattern';

// ======================= Environment Import ================================
let InfrastructureAPI: RepositoryPatternInterface = RestAPI;

const mockIs = !import.meta.env.PROD && import.meta.env.VITE_DEBUG_API_IS_MOCK === 'true';

// if (mockIs) {
//   // dynamic for test only dev without include build file
//   // InfrastructureAPI = Mock;
//   InfrastructureAPI = await import('./infrastructure/mock').then(
//     (module) => module.default,
//   );
// }

// ===========================================================================
const API: RepositoryPatternInterface = { ...InfrastructureAPI };
export default API;
