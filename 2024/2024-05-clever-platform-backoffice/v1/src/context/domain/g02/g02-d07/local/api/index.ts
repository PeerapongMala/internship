import RestAPITranslation from './group/academic-profile/restapi';
import { AcademicProfileAPITranslationRepository } from './repository/profile';

// ======================= Environment Import ================================
let AcademicProfileAPI: AcademicProfileAPITranslationRepository = RestAPITranslation;

// ===========================================================================
const API = { academicProfile: AcademicProfileAPI };

export default API;
