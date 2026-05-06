import SchoolRestAPI from '../api/group/school/restapi';
import TeacherStudentRestAPI from './group/teacher-student/restapi/index.ts';
import AcademicYearRestAPI from './group/academic-year/restapi/index.ts';
import AccountStudentRestAPI from './group/account-student/restapi/index.ts';
import CurriculumGroupsRestAPI from './group/cirriculum-group/restapi/index.ts';

import { SchoolRepository } from '../api/repository/school.ts';
import { TeacherStudentRepository } from './repository/teacher-student.ts';
import { AcademicYearRepository } from './repository/academic-year.ts';
import { AccountStudentRepository } from '@domain/g03/g03-d04/local/api/repository/account-student.ts';
import { CurriculumGroupsRepository } from '@domain/g03/g03-d04/local/api/repository/cirriculum-group.ts';

// ======================= Environment Import ================================

const schoolAPI: SchoolRepository = SchoolRestAPI;
const teacherStudentAPI: TeacherStudentRepository = TeacherStudentRestAPI;
const academicYearAPI: AcademicYearRepository = AcademicYearRestAPI;
const accountStudentRestAPI: AccountStudentRepository = AccountStudentRestAPI;
const curriculumGroupsAPI: CurriculumGroupsRepository = CurriculumGroupsRestAPI;

const mockIs = !import.meta.env.PROD && import.meta.env.VITE_DEBUG_API_IS_MOCK === 'true';

if (mockIs) {
  // dynamic for test only dev without include build file
  // InfrastructureAPI = Mock;
}

// ===========================================================================
const API = {
  school: schoolAPI,
  teacherStudent: teacherStudentAPI,
  academicYear: academicYearAPI,
  accountStudent: accountStudentRestAPI,
  curriculumGroups: curriculumGroupsAPI,
};

export default API;
