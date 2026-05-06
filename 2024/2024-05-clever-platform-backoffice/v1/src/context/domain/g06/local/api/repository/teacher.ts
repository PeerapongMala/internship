import { AxiosResponse } from 'axios';
import { TGetListAcademicYearReq, TGetListAcademicYearRes } from '../helpers/teacher';
import { getAcademicYearBySchoolID } from '../group/teacher/get-academic-year';

interface TeacherRepository {
  GetAcademicYearBySchoolID: (
    params: TGetListAcademicYearReq,
  ) => Promise<AxiosResponse<TGetListAcademicYearRes, any>>;
}

export const TeacherRepository: TeacherRepository = {
  GetAcademicYearBySchoolID: getAcademicYearBySchoolID,
};
