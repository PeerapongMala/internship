import RestAPITranslation from './group/admin-translation/restapi';
import { AdminTranslationRepository } from './repository/adminTranslation';

// ======================= Environment Import ================================
let AdminTranslationAPI: AdminTranslationRepository = RestAPITranslation;

// ===========================================================================
const API = { adminTranslation: AdminTranslationAPI };

export default API;
