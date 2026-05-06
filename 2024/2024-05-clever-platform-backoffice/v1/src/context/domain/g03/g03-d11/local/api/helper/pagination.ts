export type TResPagination = {
  _pagination: {
    page: number;
    limit: number;
    total_count: number;
  };
};

export type TReqPagination = {
  page: number;
  limit: number;
};
