export type APITypeJSONResponse<T> =
  | (Omit<Response, 'json'> & {
      json: () => T;
    })
  | { json: () => T };

export type APITypeAPIResponse<T> = Promise<APITypeJSONResponse<T>> | never;

export type HTTPStatusCodeOK = 200;
export type HTTPStatusCodeCreated = 201;
export type HTTPStatusCodeBadRequest = 400;
export type HTTPStatusCodeUnauthorized = 401;
export type HTTPStatusCodeForbidden = 403;
export type HTTPStatusCodeNotFound = 404;
export type HTTPStatusCodeConflict = 409;
export type HTTPStatusCodeInternalServerError = 500;

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
  [key: string]: unknown;
};

export type FailedAPIResponse = {
  status_code: HTTPStatusCodeFailed;
  message: string;
  [key: string]: unknown;
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

export function convertToDataResponse<T>(
  response: PaginationAPIResponse<T> | DataAPIResponse<T>,
): DataAPIResponse<T> {
  // if response is pagination response type
  if (response.status_code === 200 && Array.isArray(response.data)) {
    const { data } = response;
    return { ...response, data: data.at(0) } as DataAPIResponse<T>;
  }
  // otherwise, response is data response type
  return response as DataAPIResponse<T>;
}

export function convertToDataResponseList<T>(
  response: PaginationAPIResponse<T> | DataAPIResponse<T>,
): DataAPIResponse<T> {
  // if response is pagination response type
  if (response.status_code === 200 && Array.isArray(response.data)) {
    const { data } = response;
    return { ...response, data: data } as DataAPIResponse<T>;
  }
  // otherwise, response is data response type
  return response as DataAPIResponse<T>;
}

export function convertTOFormData<T extends Record<string, any>>(data: T): FormData {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (typeof value === 'string') {
      formData.append(key, value);
    } else {
      formData.append(key, JSON.stringify(value));
    }
  });
  return formData;
}
