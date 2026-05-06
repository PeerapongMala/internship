import RestAPITranslation from './group/profile/restapi/index';
import { ProfileRestAPITranslationRepository } from './repository/profile';

// ======================= Environment Import ================================
let BugReportAPI: ProfileRestAPITranslationRepository = RestAPITranslation;

// ===========================================================================
const API = { bugReport: BugReportAPI };

export default API;
