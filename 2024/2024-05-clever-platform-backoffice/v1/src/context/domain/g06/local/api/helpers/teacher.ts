import { TBasePaginationResponse, TPaginationReq } from '@domain/g06/g06-d02/local/types';

export type TGetListAcademicYearReq = TPaginationReq & { school_id: number };
export type TGetListAcademicYearRes = TBasePaginationResponse<{
  id: number;
  school_id: number;
  name: string;
  start_date: string;
  end_date: string;
}>;
