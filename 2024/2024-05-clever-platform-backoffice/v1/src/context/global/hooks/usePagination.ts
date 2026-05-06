import config from '@core/config';
import { TPagination } from '@global/types/api';
import { useState } from 'react';

const initialPagination: TPagination = {
  page: 1,
  limit: config.pagination.itemsPerPage,
  total_count: 0,
};

type usePaginationOptions = {
  initialPage?: number;
  isModal?: boolean;
  initialLimit?: number;
};

const usePagination = (options: usePaginationOptions = {}) => {
  const computedLimit =
    options.initialLimit ??
    (options.isModal
      ? config.pagination.modalItemPerPage
      : config.pagination.itemsPerPage);

  const [pagination, setPagination] = useState<TPagination>({
    ...initialPagination,
    page: options.initialPage ?? initialPagination.page,
    limit: computedLimit,
  });

  const pageSizeOptions = config.pagination.itemPerPageOptions;

  const setPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const setPageSize = (limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  };

  const setTotalCount = (total_count: number) => {
    setPagination((prev) => ({ ...prev, total_count }));
  };

  return {
    pagination,
    setPagination,
    pageSizeOptions,

    // for second style usage
    page: pagination.page,
    pageSize: pagination.limit,
    totalCount: pagination.total_count,
    setPage,
    setPageSize,
    setTotalCount,
  };
};

export default usePagination;
