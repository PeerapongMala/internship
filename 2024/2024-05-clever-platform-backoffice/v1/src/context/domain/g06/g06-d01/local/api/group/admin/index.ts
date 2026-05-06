import { AdminSchoolRepository } from '../../repository';
import { getSubjectBySchoolID } from './get-subject-by-school-id';

export const AdminSchoolRestAPI: AdminSchoolRepository = {
  GetSubjectBySchoolID: getSubjectBySchoolID,
};
