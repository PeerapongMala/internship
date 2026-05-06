import RestAPITranslation from './group/profile/restapi/index';
import { ProfileTeacherRestAPITranslationRepository } from './repository/profile';

// ======================= Environment Import ================================
let BugReportAPI: ProfileTeacherRestAPITranslationRepository = RestAPITranslation;

// ===========================================================================
const API = { bugReport: BugReportAPI };

export default API;
