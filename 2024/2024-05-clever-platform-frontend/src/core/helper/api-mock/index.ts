import {
  BaseAPIResponse,
  DataAPIResponse,
  FailedAPIResponse,
  HTTPStatusCodeFailed,
  HTTPStatusCodeOK,
  PaginationAPIResponse,
} from '../api-type';

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
  if (limit > 0) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = data.slice(startIndex, endIndex);
    return {
      status_code: 200 as HTTPStatusCodeOK,
      message: message ?? 'Data retrieved successfully',
      _pagination: {
        limit,
        page,
        total_count: totalCount,
      },
      data: paginatedData,
    };
  }
  return {
    status_code: 200 as HTTPStatusCodeOK,
    message: message ?? 'Data retrieved successfully',
    _pagination: {
      limit: -1,
      page,
      total_count: totalCount,
    },
    data: data,
  };
}

export function responseOk<T>({
  data,
  message,
}: {
  data: T;
  message?: string;
}): DataAPIResponse<T> {
  return {
    status_code: 200 as HTTPStatusCodeOK,
    message: message ?? 'Data retrieved successfully.',
    data,
  };
}

export function responseMessage({ message }: { message?: string }): BaseAPIResponse {
  return {
    status_code: 200 as HTTPStatusCodeOK,
    message: message ?? 'Data retrieved successfully.',
  };
}

export function responseCreated<T>({
  data,
  message,
}: {
  data: T;
  message?: string;
}): DataAPIResponse<T> {
  return {
    status_code: 201,
    message: message ?? 'Data created successfully.',
    data,
  };
}

export function responseFailed({
  statusCode,
  message,
}: {
  statusCode: HTTPStatusCodeFailed;
  message?: string;
}): FailedAPIResponse {
  return {
    status_code: statusCode,
    message: message ?? 'Something went wrong.',
  };
}
