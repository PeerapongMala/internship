import RestAPITranslation from './group/bug-report/restapi';
import { ChatConfigRestAPITranslationRepository } from './repository/chatConfig';

// ======================= Environment Import ================================
let ChatConfigAPI: ChatConfigRestAPITranslationRepository = RestAPITranslation;

// ===========================================================================
const API = { chatConfig: ChatConfigAPI };

export default API;
