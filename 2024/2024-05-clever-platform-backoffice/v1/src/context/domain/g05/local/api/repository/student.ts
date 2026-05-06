import { AxiosResponse } from 'axios';
import {
  TGetStudentInFamilyReq,
  TGetStudentInFamilyRes,
  TGetStudentInfoReq,
  TGetStudentInfoRes,
  TGetHomeworkStatusReq,
  TGetHomeworkStatusRes,
  TGetHomeworksReq,
  TGetHomeworksRes,
} from '../helper/student';
import { getStudentInFamily } from '../group/student/get-student-by-family/restapi';
import { getStudentInfo } from '../group/student/get-student-info/restapi';
import { getHomeworkStatus } from '../group/student/get-homework-status/restapi';
import { getHomeworks } from '../group/student/get-homeworks/restapi';

export interface IStudentRepository {
  GetStudentInFamily: (
    req: TGetStudentInFamilyReq,
  ) => Promise<AxiosResponse<TGetStudentInFamilyRes, any>>;

  GetStudentInfo: (
    req: TGetStudentInfoReq,
  ) => Promise<AxiosResponse<TGetStudentInfoRes, any>>;

  GetHomeworkStatus: (
    req: TGetHomeworkStatusReq,
  ) => Promise<AxiosResponse<TGetHomeworkStatusRes, any>>;

  GetHomeworks: (req: TGetHomeworksReq) => Promise<AxiosResponse<TGetHomeworksRes, any>>;
}

export const StudentRepository: IStudentRepository = {
  GetStudentInFamily: getStudentInFamily,
  GetStudentInfo: getStudentInfo,
  GetHomeworkStatus: getHomeworkStatus,
  GetHomeworks: getHomeworks,
};
