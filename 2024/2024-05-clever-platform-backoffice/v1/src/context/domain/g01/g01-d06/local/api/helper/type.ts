export type HTTPStatusCodeOK = 200;
export type HTTPStatusCodeCreated = 201;
type HTTPStatusCodeBadRequest = 400;
type HTTPStatusCodeUnauthorized = 401;
type HTTPStatusCodeForbidden = 403;
type HTTPStatusCodeNotFound = 404;
type HTTPStatusCodeConflict = 409;
type HTTPStatusCodeInternalServerError = 500;
export type HTTPStatusCodeFailed =
  | HTTPStatusCodeBadRequest
  | HTTPStatusCodeUnauthorized
  | HTTPStatusCodeForbidden
  | HTTPStatusCodeNotFound
  | HTTPStatusCodeConflict
  | HTTPStatusCodeInternalServerError;

export type HTTPStatusCode =
  | HTTPStatusCodeOK
  | HTTPStatusCodeCreated
  | HTTPStatusCodeFailed;

export type BasePaginationAPIQueryParams = {
  page?: number;
  limit?: number;
  search_text?: string;
};

export type BaseAPIResponse = {
  status_code: HTTPStatusCode;
  message: string;
};

export type FailedAPIResponse = {
  status_code: HTTPStatusCodeFailed;
  message: string;
};

export type DataAPIResponse<T> =
  | {
      status_code: HTTPStatusCodeOK | HTTPStatusCodeCreated;
      message: string;
      data: T;
    }
  | FailedAPIResponse;

export type PaginationAPIResponse<T> =
  | {
      status_code: HTTPStatusCodeOK;
      message: string;
      _pagination: {
        limit: number;
        page: number;
        total_count: number;
      };
      data: T[];
    }
  | FailedAPIResponse;

type TimestampMutationData = {
  created_by?: string | number | Date;
  created_at?: string | number | Date;
  updated_by?: string | number | Date;
  updated_at?: string | number | Date;
};

export type DataAPIRequest<T> = Omit<Partial<T>, keyof TimestampMutationData>;

export function prepareRequestData<T extends TimestampMutationData>(
  data: Partial<T>,
): DataAPIRequest<T> {
  // extract timestamp data out of request data
  const { created_by, created_at, updated_at, updated_by, ...rest } = data;
  return rest;
}
