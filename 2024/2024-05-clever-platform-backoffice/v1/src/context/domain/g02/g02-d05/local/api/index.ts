import RestAPIAffiliation from './group/academic-level/restapi';
import { AcademicLevelRepository } from './repository/academicLevel';

// ======================= Environment Import ================================
let academicLevelAPI: AcademicLevelRepository = RestAPIAffiliation;

// ===========================================================================
const API = { academicLevel: academicLevelAPI };

export default API;
