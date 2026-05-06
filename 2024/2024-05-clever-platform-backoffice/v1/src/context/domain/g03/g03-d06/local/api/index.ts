import TeacherHomeworkItemRestAPI from './group/teacher-homework/restapi/index';
import { TeacherHomeworkRepository } from './repository/teacher-homework';

// ======================= Environment Import ================================
let teacherHomeworkItemAPI: TeacherHomeworkRepository = TeacherHomeworkItemRestAPI;

// ======================= Export API ================================

// ===========================================================================
const API = {
  teacherHomework: teacherHomeworkItemAPI,
};
export default API;
