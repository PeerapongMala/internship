export type APITypeJSONResponse<T> =
  | (Omit<Response, 'json'> & {
      json: () => T;
    })
  | { json: () => T };

export type APITypeAPIResponse<T> = Promise<APITypeJSONResponse<T>> | never;
