import RestAPI from './infrastructure/restapi';
import { RepositoryPatternInterface } from './repository-pattern';

// ======================= Environment Import ================================
let InfrastructureAPI: RepositoryPatternInterface = RestAPI;

// ===========================================================================
const API: RepositoryPatternInterface = { ...InfrastructureAPI };
export default API;
