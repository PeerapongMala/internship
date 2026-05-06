import RestAPITranslation from './group/academic-translation/restapi';
import { AcademicTranslationRepository } from './repository/academicTranslation';

// ======================= Environment Import ================================
let AcademicTranslationAPI: AcademicTranslationRepository = RestAPITranslation;

// ===========================================================================
const API = { academicTranslation: AcademicTranslationAPI };

export default API;
