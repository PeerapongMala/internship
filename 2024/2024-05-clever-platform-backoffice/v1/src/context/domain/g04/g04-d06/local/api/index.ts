import RestAPITranslation from './group/bug-report/restapi';
import { BugReportRestAPITranslationRepository } from './repository/bugReport';

// ======================= Environment Import ================================
let BugReportAPI: BugReportRestAPITranslationRepository = RestAPITranslation;

// ===========================================================================
const API = { bugReport: BugReportAPI };

export default API;
