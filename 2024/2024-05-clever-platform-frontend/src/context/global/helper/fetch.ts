import StoreGlobalPersist from '@global/store/global/persist';
import fetchResponseInterceptor from './interceptor/index-fetch';

type FetchOptions = Omit<RequestInit, 'headers'> & {
  headers?: HeadersInit;
};

/**
 * Fetch with authentication
 * If the current session was admin session and the method is not GET,
 * the "admin_id" will be added to the body of the request.
 *
 * @param url API endpoint
 * @param options options for the fetch request
 * @returns Promise<Response>
 * @example
 * const response = await fetchWithAuth('https://api.example.com/data', {
 *   method: 'POST',
 * });
 */
export async function fetchWithAuth(
  url: string,
  options: FetchOptions = {},
): Promise<Response> {
  const { accessToken, adminId } = StoreGlobalPersist.StateGetAllWithUnsubscribe();
  const headers: HeadersInit = {
    ...options.headers,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  // if have adminId and method is not GET requests, add "admin_id" to the body
  if (adminId && options.method && options.method?.toLowerCase() !== 'get') {
    const body = options.body ? JSON.parse(options.body as string) : {};
    options.body = JSON.stringify({ ...body, admin_id: adminId });
  }

  const response = await fetch(url, { ...options, headers });

  await fetchResponseInterceptor(response);
  return response;
}

/**
 * Fetch PATCH method to update with JSON body
 * If the current session was admin session and the method is not GET,
 * the "admin_id" will be added to the body of the request.
 *
 * @param url API endpoint
 * @param body JSON body
 * @param options options for the fetch request
 * @returns Promise<Response>
 * @example
 * const response = await updateWithAuth('https://api.example.com/data', {
 *   msg: "Updated"
 * });
 */
export async function updateWithAuth(
  url: string,
  body: any,
  options: FetchOptions = {},
): Promise<Response> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  return fetchWithAuth(url, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(body),
    headers,
  });
}

/**
 * Fetch with custom authentication token
 *
 * @param url API endpoint
 * @param token custom authentication token
 * @param options options for the fetch request
 * @returns Promise<Response>
 * @example
 * const response = await fetchWithCustomToken('https://api.example.com/data', 'token', {
 *   method: 'POST',
 * });
 */
export async function fetchWithCustomToken(
  url: string,
  token: string,
  options: FetchOptions = {},
): Promise<Response> {
  const headers: HeadersInit = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, { ...options, headers });
  await fetchResponseInterceptor(response);

  return response;
}
