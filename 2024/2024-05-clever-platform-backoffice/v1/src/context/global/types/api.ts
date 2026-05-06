import { ESortOrder } from '@global/enums';

export type TBasePaginationResponse<T = unknown> = {
  status_code: number;
  message: string;
  _pagination: TPagination;
  data: T[];
};

export type TBaseResponse<T = unknown> = Omit<
  TBasePaginationResponse<T>,
  '_pagination' | 'data'
> & {
  data: T;
};

export type TBaseErrorResponse<T = unknown> = TBaseResponse<T>;

export type TPagination = {
  page: number;
  limit: number;
  total_count: number;
};

export type TPaginationReq<ST = never> = Partial<Pick<TPagination, 'page' | 'limit'>> & {
  sort_by?: ST;
  sort_order?: ESortOrder;
};
