import RestAPI from './infrastructure/restapi';
import { RepositoryPatternInterface } from './repository-pattern';

// ======================= Environment Import ================================
let InfrastructureAPI: RepositoryPatternInterface = RestAPI;

// const mockIs = !import.meta.env.PROD && import.meta.env.VITE_DEBUG_API_IS_MOCK === 'true';

// InfrastructureAPI = await import('./infrastructure/restapi').then(
//   (module) => module.default,
// );

// ======================= Export API ================================

// ===========================================================================
const API: RepositoryPatternInterface = { ...InfrastructureAPI };
export default API;
