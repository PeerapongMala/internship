import SchoolRestAPI from '@domain/g01/g01-d04/local/api/group/school/restapi';
import SchoolStudentRestAPI from '@domain/g01/g01-d04/local/api/group/school-student/restapi';
import { SchoolRepository } from '@domain/g01/g01-d04/local/api/repository/school.ts';
import { SchoolStudentRepository } from '@domain/g01/g01-d04/local/api/repository/school-student.ts';

import RestAPISchoolTeacher from './group/school-teacher/restapi';
import { SchoolTeacherRepository } from './repository/school-teacher';
import { SchoolAnnouncerRepository } from './repository/school-announcer';
import { SchoolObserverRepository } from './repository/school-observer';
import RestAPISchoolAnnouncer from './group/school-announcer/restapi';
import RestAPISchoolObserver from './group/school-observer/restapi';

// ======================= Environment Import ================================

let schoolAPI: SchoolRepository = SchoolRestAPI;
const schoolStudentAPI: SchoolStudentRepository = SchoolStudentRestAPI;
let schoolTeacherAPI: SchoolTeacherRepository = RestAPISchoolTeacher;
let schoolAnnouncerAPI: SchoolAnnouncerRepository = RestAPISchoolAnnouncer;
let schoolObserverAPI: SchoolObserverRepository = RestAPISchoolObserver;

const mockIs = !import.meta.env.PROD && import.meta.env.VITE_DEBUG_API_IS_MOCK === 'true';

if (mockIs) {
  // dynamic for test only dev without include build file
  // InfrastructureAPI = Mock;
  schoolTeacherAPI = await import('./group/school-teacher/mock').then(
    (module) => module.default,
  );

  schoolAnnouncerAPI = await import('./group/school-announcer/mock').then(
    (module) => module.default,
  );
}

// ===========================================================================
const API = {
  school: schoolAPI,
  schoolStudent: schoolStudentAPI,
  schoolTeacher: schoolTeacherAPI,
  schoolObserver: schoolObserverAPI,
  schoolAnnouncer: schoolAnnouncerAPI,
};

export default API;
