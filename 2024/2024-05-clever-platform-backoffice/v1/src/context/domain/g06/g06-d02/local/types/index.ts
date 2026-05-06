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

export type TBaseErrorResponse = Omit<TBasePaginationResponse, '_pagination' | 'data'>;

export type TPagination = {
  page: number;
  limit: number;
  total_count: number;
};

export type TPaginationReq = Partial<Pick<TPagination, 'page' | 'limit'>>;

export type TPageStatus = {
  isFirstPage: boolean;
  isLastPage: boolean;
};

export type Tab = {
  id: number;
  label: string;
  icon: JSX.Element;
};
