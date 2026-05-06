import { AdminUserAccountQueryParams, UserAccountResponse } from '../../type';
import { PaginationAPIResponse } from '@global/utils/apiResponseHelper';
import { BulkEditRequest } from '../../type';

export interface AdminUserAccountRepository {
  // g07-d00-a01: admin user account list
  Gets(
    query: AdminUserAccountQueryParams,
  ): Promise<PaginationAPIResponse<UserAccountResponse>>;
  GetById(id: string): Promise<UserAccountResponse>;
  Close(id: string): Promise<void>;
  Open(id: string): Promise<void>;
  BulkEdit(data: BulkEditRequest): Promise<void>;
  Update(id: string, data: FormData): Promise<void>;
  UpdateRoles(id: string, roles: number[]): Promise<void>;
  UpdatePassword(userId: string, password: string): Promise<void>;
  DownloadCSV(role: 'admin' | 'parent' | 'observer' | 'content-creator'): Promise<void>;
  Create(data: FormData): Promise<{ id: string }>;
  UploadCSV(
    role: 'admin' | 'parent' | 'observer' | 'content-creator',
    file: File,
  ): Promise<void>;
}
