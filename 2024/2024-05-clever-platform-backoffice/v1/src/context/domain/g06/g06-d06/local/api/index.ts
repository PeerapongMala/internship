import apiStudentDetailRepository from './group/student-detail/restapi';
import apiStudentRepository from './group/student-records/restapi';

export const api = {
  student: apiStudentRepository,
  studentDetail: apiStudentDetailRepository,
};
