import { IChatConfig } from '@domain/g04/g04-d05/local/type';
import { BaseAPIResponse, PaginationAPIResponse } from '@global/utils/apiResponseHelper';

export interface ICreateBugReportQueryParams {
  page?: string;
  limit?: string;
}

export interface IUpdateBugStatus {
  bug_id: string;
  status: string;
  message: string;
}

export interface IGetCSVFilter {
  startDate: string;
  endDate: string;
}

export interface IUpdateChatConfig {
  chat_level: 'subject' | 'class' | 'group' | 'private';
  status: boolean;
}

export interface ChatConfigRestAPITranslationRepository {
  GetG04D08A01: (
    query: ICreateBugReportQueryParams,
  ) => Promise<PaginationAPIResponse<IChatConfig>>;
  PatchG04D08A02: (data: IUpdateChatConfig) => Promise<BaseAPIResponse>;
}
