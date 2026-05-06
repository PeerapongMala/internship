import { TBasePaginationResponse, TPaginationReq } from '@domain/g06/g06-d02/local/types';
import { TSubject } from '../../type/subject';

export type TGetSubjectBySchoolIDReq = TPaginationReq & {
  year?: string;
};
export type TGetSubjectBySchoolIDRes = TBasePaginationResponse<
  Omit<TSubject, 'created_at' | 'updated_at'> & {
    created_at: string;
    updated_at: string;
  }
>;
