import { AxiosResponse } from 'axios';
import {
  TGetAcademicLessonReq,
  TGetAcademicLessonRes,
  TGetAcademicSubLessonReq,
  TGetAcademicSubLessonRes,
  TGetLevelListByIndicatorIDRes,
} from '../helpers/academic';
import { getSubLessonByLessonID } from '../group/academic/get-sub-lesson-list/restapi';
import { getLessonByLessonID } from '../group/academic/get-lesson-list/restapi';
import { getLevelListByIndicatorID } from '../group/academic/get-level-list-by-indicator-id/restapi';

interface AcademicRepository {
  GetSubLessonByLessonID: (
    lessonID: number,
    params?: TGetAcademicSubLessonReq,
  ) => Promise<AxiosResponse<TGetAcademicSubLessonRes, any>>;
  GetLessonByLessonID: (
    subjectID: number,
    params?: TGetAcademicLessonReq,
  ) => Promise<AxiosResponse<TGetAcademicLessonRes, any>>;
  GetLevelListByIndicatorID: (
    indicatorID: number,
  ) => Promise<AxiosResponse<TGetLevelListByIndicatorIDRes>>;
}

export const academicRepository: AcademicRepository = {
  GetSubLessonByLessonID: getSubLessonByLessonID,
  GetLessonByLessonID: getLessonByLessonID,
  GetLevelListByIndicatorID: getLevelListByIndicatorID,
};
