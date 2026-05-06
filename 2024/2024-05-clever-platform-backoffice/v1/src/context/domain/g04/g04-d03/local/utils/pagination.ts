import { useState } from 'react';

export function getPagination() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  return {
    page,
    setPage,
    limit,
    setLimit,
    totalRecords,
    setTotalRecords,
  };
}
