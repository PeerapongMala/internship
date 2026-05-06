import DropdownRestAPI from '@domain/g06/g06-d03/local/api/group/dropdown/restapi';
import { academicRepository } from './repository/academic';
import { TeacherRepository } from './repository/teacher';
import YearRestAPI from '@domain/g06/g06-d01/local/api/group/Year/restapi';
import { SubjectTemplateRepository } from './repository/subject-template';

const API = {
  Academic: academicRepository,
  Teacher: TeacherRepository,
  Dropdown: DropdownRestAPI,
  Year: YearRestAPI,
  SubjectTemplate: SubjectTemplateRepository,
};

export default API;
