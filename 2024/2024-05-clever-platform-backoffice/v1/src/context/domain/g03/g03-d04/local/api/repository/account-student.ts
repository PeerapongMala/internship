import {
  AccountStudentOAuthResponse,
  AccountStudentProfileResponse,
  AccountStudentRequest,
  AccountStudentResponse,
  FamilyResponse,
  PlayingHistoryResponse,
} from '@domain/g03/g03-d04/local/api/group/account-student/type.ts';
import {
  BaseAPIResponse,
  BasePaginationAPIQueryParams,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper.ts';

export interface AccountStudentRepository {
  // g03-d04-a01
  GetAccountStudent(
    query: AccountStudentRequest,
  ): Promise<PaginationAPIResponse<AccountStudentResponse>>;

  // g03-d04-a02
  UpdateStudentPin(studentId: string, newPin: string): Promise<BaseAPIResponse>;

  // g03-d04-a03
  GetAccountStudentProfile(
    studentId: string,
  ): Promise<DataAPIResponse<AccountStudentProfileResponse>>;

  // g03-d04-a04
  GetStudentOAuth(
    studentId: string,
  ): Promise<PaginationAPIResponse<AccountStudentOAuthResponse>>;

  // g03-d04-axx
  GetPlayingHistory(
    studentId: string,
    query?: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<PlayingHistoryResponse>>;

  // g03-d04-a07
  GetFamily(studentId: string): Promise<PaginationAPIResponse<FamilyResponse>>;
}
