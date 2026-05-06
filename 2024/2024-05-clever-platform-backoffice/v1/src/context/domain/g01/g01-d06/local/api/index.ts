import SchoolRestAPI from './group/school/restapi';
import RestAPISubjectTeacher from './group/subject-teacher/restapi';
import { SchoolRepository } from './repository/school';
import { SubjectTeacherRepository } from './repository/subject-teacher';

// ======================= Environment Import ================================
let subjectTeacherAPI: SubjectTeacherRepository = RestAPISubjectTeacher;
let schoolAPI: SchoolRepository = SchoolRestAPI;

const mockIs = !import.meta.env.PROD && import.meta.env.VITE_DEBUG_API_IS_MOCK === 'true';

if (false) {
  // dynamic for test only dev without include build file
  // InfrastructureAPI = Mock;
  // subjectTeacherAPI = await import('./group/subject-teacher/mock').then(
  //   (module) => module.default,
  // );
}

// ===========================================================================
const API = {
  subjectTeacher: subjectTeacherAPI,
  school: schoolAPI,
};

export default API;
