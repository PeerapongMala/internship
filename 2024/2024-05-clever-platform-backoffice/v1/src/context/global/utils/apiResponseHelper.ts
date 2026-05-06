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
  search?: string;
  status?: 'enabled' | 'disabled' | 'draft' | (string & {});
  access_name?: string;
  name?: string;
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
      status_code: HTTPStatusCodeOK | HTTPStatusCodeCreated;
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

export type BulkDataAPIRequest<T> = {
  bulk_edit_list: T[];
};

export function prepareRequestData<T extends TimestampMutationData>(
  data: Partial<T>,
): DataAPIRequest<T> {
  // extract timestamp data out of request data
  const { created_by, created_at, updated_at, updated_by, ...rest } = data;
  return rest;
}

export function getQueryParams(query: Record<string, any>) {
  const filterQuery = Object.fromEntries(
    Object.entries(query).filter(([k, v]) => v !== undefined),
  );
  return new URLSearchParams({
    ...(filterQuery as Record<string, string>),
  });
}

export const callWithRetry = async <T extends { status_code: number }>(
  apiFunc: (params: any) => Promise<T>,
  params: any,
  retries = 3,
  delay = 5000,
): Promise<T> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const resp = await apiFunc(params);
      // if server error, retry
      if (resp.status_code === 500 && attempt < retries) {
        await new Promise((r) => setTimeout(r, delay * attempt));
        continue;
      }
      return resp;
    } catch (err) {
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, delay * attempt));
        continue;
      }
      throw err;
    }
  }
  throw new Error('callWithRetry: no response');
};
