/**
 * Removes all query parameters from a URL whose value is the string `'undefined'`.
 *
 * This is useful for cleaning up URLs before making network requests,
 * especially when query parameters are dynamically generated and may include
 * the string `'undefined'` due to missing or optional values.
 *
 * @param url - The full URL string to clean.
 * @returns The cleaned URL with all `'undefined'` query parameters removed.
 *
 * @example
 * const cleanedUrl = removeUndefinedQueryParamsFromUrl(
 *   "https://test.com/test?key1=undefined&key2=undefined&key3=undefined&key4=1"
 * );
 * console.log(cleanedUrl); // Output: "https://test.com/test?key4=1"
 */
export function removeUndefinedQueryParamsFromUrl(url: string): string {
  const [baseUrl, queryString] = url.split('?');
  if (!queryString) return url;

  const params = new URLSearchParams(queryString);

  // Convert entries to array first to avoid mutation during iteration
  const entries = Array.from(params.entries());
  for (const [key, value] of entries) {
    if (value === 'undefined') {
      params.delete(key);
    }
  }

  const cleanedQuery = params.toString();
  return cleanedQuery ? `${baseUrl}?${cleanedQuery}` : baseUrl;
}
