/**
 * Determines whether a failed operation should be retried based on the error.
 *
 * @param error - The error object to evaluate
 * @returns boolean - true if the operation should be retried, false otherwise
 */
export const shouldRetryError = (error: any): boolean => {
  // Check for specific network-related TypeErrors that shouldn't be retried
  if (error instanceof TypeError) {
    const networkErrorMessages = [
      'Failed to fetch',
      'Failed to fetch file',
      'Network request failed',
      'NetworkError',
    ];
    // If it's a network connectivity error, don't retry (false)
    if (networkErrorMessages.some((msg) => error.message.includes(msg))) {
      return false;
    }
  }

  // Extract the HTTP status code from various error object structures
  const status =
    error.status || // Direct status property
    error.response?.status || // Nested in response object
    (error instanceof Response && error.status) || // Fetch API Response object
    (error.constructor.name === 'HttpErrorResponse' && error.status); // Angular HTTP errors

  // Don't retry for these specific HTTP status codes:
  // 403 - Forbidden (no permission)
  // 404 - Not Found (resource doesn't exist)
  // For all other cases (including no status code), retry is allowed (true)
  return !(status === 403 || status === 404);
};
