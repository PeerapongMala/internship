export const retryAsyncOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000,
  shouldRetry: (error: any) => boolean = (error) => true,
): Promise<T> => {
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      const isRetryable = shouldRetry(error);

      if (i < maxRetries - 1 && isRetryable) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } else if (!isRetryable) {
        throw error;
      }
    }
  }

  throw lastError;
};
