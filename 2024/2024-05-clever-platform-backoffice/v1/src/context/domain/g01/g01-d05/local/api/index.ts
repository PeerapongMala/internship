import RestAPIClassroom from './group/classroom/restapi';
import RestAPITeacher from './group/teacher/restapi';
import RestAPIOther from './group/other/restapi';
import { ClassroomRepository } from './repository/classroom';
import { OtherRepository } from './repository/other';
import { TeacherRepository } from './repository/teacher';
import { StudentRepository } from './repository/student';
import RestAPIStudent from './group/student/restapi';

// ======================= Environment Import ================================
let classroomAPI: ClassroomRepository = RestAPIClassroom;
let teacherAPI: TeacherRepository = RestAPITeacher;
let studentAPI: StudentRepository = RestAPIStudent;
let otherAPI: OtherRepository = RestAPIOther;

const mockIs = !import.meta.env.PROD && import.meta.env.VITE_DEBUG_API_IS_MOCK === 'true';

// classroomAPI = await import('./infrastructure/restapi').then(
//   (module) => module.default,
// );

// ======================= Export API ================================

// ===========================================================================
const API = {
  classroom: classroomAPI,
  teacher: teacherAPI,
  other: otherAPI,
  student: studentAPI,
};
export default API;
