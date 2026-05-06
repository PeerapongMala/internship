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

export type BaseAPIResponse = {
  status_code: HTTPStatusCode;
  message: string;
};

export type DataAPIResponse<T> =
  | {
      status_code: HTTPStatusCodeOK | HTTPStatusCodeCreated;
      message: string;
      data: T;
    }
  | FailedAPIResponse;

export type FailedAPIResponse = {
  status_code: HTTPStatusCodeFailed;
  message: string;
};
