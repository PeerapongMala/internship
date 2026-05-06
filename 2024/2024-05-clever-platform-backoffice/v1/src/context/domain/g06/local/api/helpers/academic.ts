import {
  TBasePaginationResponse,
  TBaseResponse,
  TPaginationReq,
} from '@domain/g06/g06-d02/local/types';
import { TLesson, TSubLesson } from '../../types/academic';
import { LevelType } from '@domain/g06/local/constant/level.ts';

export type TGetAcademicSubLessonReq = TPaginationReq & {
  search_text?: string;
};
export type TGetAcademicSubLessonRes = TBasePaginationResponse<TSubLesson>;

export type TGetAcademicLessonReq = TPaginationReq & {
  no_details?: boolean;
  search_text?: string;
};
export type TGetAcademicLessonRes = TBasePaginationResponse<TLesson>;

export type TGetLevelListByIndicatorIDRes = TBaseResponse<{
  [key in LevelType]: number[];
}>;
