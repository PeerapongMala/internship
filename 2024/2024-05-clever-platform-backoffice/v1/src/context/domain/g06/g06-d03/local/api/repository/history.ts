import { DataAPIResponse, PaginationAPIResponse } from '@global/utils/apiResponseHelper';
import { IGetHistoryCompare, IGetHistoryList, THistorySubject } from '../../type';
import { TPaginationReq } from '@global/types/api';

export interface HistoryRepository {
  GetHistoryList: (
    evaluationSheetId: number,
    options?: TPaginationReq<keyof IGetHistoryList>,
  ) => Promise<PaginationAPIResponse<IGetHistoryList>>;
  GetHistorySubject: (
    evaluationSheetId: number,
  ) => Promise<PaginationAPIResponse<THistorySubject>>;
  GetHistoryCompare: (
    evaluationSheetId: number,
    versionIdLeft: number,
    versionIdRight: number,
  ) => Promise<DataAPIResponse<IGetHistoryCompare>>;
  PostRetrieveVersion: (
    sheetId: number,
    versionId: number,
  ) => Promise<DataAPIResponse<null>>;
}
