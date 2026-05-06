import RestAPI from './infrastructure/restapi';
import { RepositoryPatternInterface } from './repository-pattern';

// ======================= Environment Import ================================
let InfrastructureAPI: RepositoryPatternInterface = RestAPI;

const restAPIReady = true;
const mockIs = !import.meta.env.PROD && import.meta.env.VITE_DEBUG_API_IS_MOCK === 'true';
// debug
// const mockIs = true;

// if (!restAPIReady || mockIs) {
//   // dynamic for test only dev without include build file
//   // InfrastructureAPI = Mock;
//   console.log(`${ConfigJSON['key']} use mock API`);
//   InfrastructureAPI = await import('./infrastructure/mock').then(
//     (module) => module.default,
//   );
// }

// ===========================================================================
const API: RepositoryPatternInterface = { ...InfrastructureAPI };
export default API;
