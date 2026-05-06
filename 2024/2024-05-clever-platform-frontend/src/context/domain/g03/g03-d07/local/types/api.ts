export type TPaginationReq = {
  page?: number;
  limit?: number;
};
export type TPaginationRes = {
  page: number;
  limit: number;
  total_count: string;
};

export type TBaseResponse = {
  message: string;
  status_code: number;
};

export type TGetListResponse<T = any> = TBaseResponse & {
  _pagination: TPaginationRes;
  data: T[];
};
