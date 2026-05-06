import { DataAPIResponse, PaginationAPIResponse } from '@global/utils/apiResponseHelper';
import {
  ETypeTab,
  IGetSheetCompare,
  IGetSheetDetail,
  IGetSheetList,
  IGetTitleSheet,
  IUpdateSheetRequest,
} from '../../type';
import { TBaseResponse } from '@global/types/api';
import {
  TEvaluationFormSettingGetScoreReq,
  TEvaluationFormSettingGetScoreRes,
  TGetSheetDataOptions,
} from '../helpers/sheet';

export interface SheetRepository {
  GetSheet: (
    evaluationSheetId: number,
    options?: TGetSheetDataOptions,
  ) => Promise<DataAPIResponse<IGetSheetDetail>>;
  GetStudentLessonScore: (
    evaluationSheetId: number,
    indicatorId: number,
  ) => Promise<DataAPIResponse<Pick<IGetSheetDetail, 'json_student_score_data'>>>;
  GetSheetList: (
    schoolId: number,
    typeTab: ETypeTab,
    status: string | undefined,
    academicYear: number,
    seedYear: string,
    classId: string,
    subjectId: string,
    page?: number,
    limit?: number,
  ) => Promise<PaginationAPIResponse<IGetSheetList>>;
  RetrieveVersion(sheetId: number, dataEntryId: number): Promise<DataAPIResponse<null>>;
  UpdateSheet: (data: IUpdateSheetRequest) => Promise<DataAPIResponse<IGetSheetDetail>>;
  GetTitleSheet: (formId: number) => Promise<PaginationAPIResponse<IGetTitleSheet>>;
  GetHistoryCompare: (
    sheetId: number,
    versionLeft: string,
    versionRight: string,
  ) => Promise<TBaseResponse<IGetSheetCompare>>;
  PostEvaluationFormSettingGetScore: (
    req: TEvaluationFormSettingGetScoreReq,
  ) => Promise<TBaseResponse<TEvaluationFormSettingGetScoreRes[]>>;
}
