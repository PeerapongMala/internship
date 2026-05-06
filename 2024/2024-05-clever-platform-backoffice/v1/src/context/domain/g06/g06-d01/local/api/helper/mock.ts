import {
  DataAPIResponse,
  FailedAPIResponse,
  HTTPStatusCodeFailed,
  PaginationAPIResponse,
} from '.';

export function pagination<T>({
  data,
  page,
  limit,
  message,
}: {
  data: T[];
  page: number;
  limit: number;
  message?: string;
}): PaginationAPIResponse<T> {
  const totalCount = data.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);
  return {
    status_code: 200,
    message: message ?? 'Data retrieved successfully',
    _pagination: {
      limit,
      page,
      total_count: totalCount,
    },
    data: paginatedData,
  };
}

export function responseOk<T>({
  data,
  message = '',
}: {
  data: T[];
  message?: string;
}): DataAPIResponse<T> {
  return {
    status_code: 200,
    message: message ?? 'Data retrieved successfully',
    data,
  };
}

export function responseFailed({
  statusCode,
  message = '',
}: {
  statusCode: HTTPStatusCodeFailed;
  message?: string;
}): FailedAPIResponse {
  return {
    status_code: statusCode,
    message,
  };
}
