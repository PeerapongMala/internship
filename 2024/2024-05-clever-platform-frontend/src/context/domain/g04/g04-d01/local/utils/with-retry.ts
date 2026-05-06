const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;

export async function withRetry<T>(
  fn: () => Promise<T>,
  operationName: string = 'unknown operation',
  attempts = MAX_RETRY_ATTEMPTS,
  delay = RETRY_DELAY_MS,
  timeoutMs: number = 30000,
): Promise<T> {
  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs),
    );
    return await Promise.race([fn(), timeoutPromise]);
  } catch (error) {
    if (attempts <= 1) {
      console.error(`Retry Final attempt failed for "${operationName}"`, error);
      throw error;
    }

    const remainingAttempts = attempts - 1;
    console.warn(
      `Retry Attempt ${MAX_RETRY_ATTEMPTS - remainingAttempts}/${MAX_RETRY_ATTEMPTS} ` +
        `for "${operationName}". Retrying in ${delay}ms...`,
      `Error:`,
      error,
    );

    await new Promise((resolve) => setTimeout(resolve, delay));
    return withRetry(fn, operationName, remainingAttempts, delay);
  }
}
