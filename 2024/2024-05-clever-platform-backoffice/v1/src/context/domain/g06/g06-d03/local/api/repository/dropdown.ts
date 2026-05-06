import { TPaginationReq } from '@global/types/api';
import { PaginationAPIResponse } from '@global/utils/apiResponseHelper';
import { IGetHistoryList, IGetHistoryDropdown } from '../../type';

export interface DropdownRepository {
  GetSeedAcaDemicYearList: () => Promise<PaginationAPIResponse<number>>;
  GetSubjectList: (
    schoolId: number,
    academicYear: number,
  ) => Promise<PaginationAPIResponse<string>>;
  GetSeedYearList: () => Promise<PaginationAPIResponse<string>>;
  GetClassList: (
    schoolId: number,
    seedYear: string,
    academicYear: string,
  ) => Promise<PaginationAPIResponse<string>>;
  GetHistoryList(
    evaluationSheetId: number,
    options?: TPaginationReq<keyof IGetHistoryList>,
  ): Promise<PaginationAPIResponse<IGetHistoryDropdown>>;
}
