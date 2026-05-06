import StoreGlobalPersist from '@global/store/global/persist';
import fetchResponseInterceptor from './interceptor/index-fetch';
import { removeUndefinedQueryParamsFromUrl } from './format/url';

export type FetchOptions = Omit<RequestInit, 'headers'> & {
  headers?: HeadersInit;
};

export default async function fetchWithAuth(
  url: string,
  options: FetchOptions = {},
): Promise<Response> {
  // fix encode url
  url = encodeURI(url).replace(/%25/g, '%');
  url = removeUndefinedQueryParamsFromUrl(url);

  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
  const headers: HeadersInit = {
    ...options.headers,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  const response = await fetch(url, { ...options, headers });
  await fetchResponseInterceptor(response);

  return response;
}
