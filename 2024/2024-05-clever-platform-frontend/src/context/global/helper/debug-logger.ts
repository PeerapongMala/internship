/**
 * Debug Logger Utility
 *
 * Provides conditional logging based on environment.
 * Debug logs are only shown in development mode.
 */

const IS_DEV = import.meta.env.DEV;

/**
 * Log debug information (only in development)
 */
export const debugLog = (...args: any[]) => {
  if (IS_DEV) console.log(...args);
};

/**
 * Log warnings (only in development for debug warnings, always for important warnings)
 */
export const debugWarn = (...args: any[]) => {
  if (IS_DEV) console.warn(...args);
};

/**
 * Log errors (always logged - these are important)
 */
export const debugError = (...args: any[]) => {
  console.error(...args);
};

/**
 * Log important warnings (always logged, regardless of environment)
 */
export const warnAlways = (...args: any[]) => {
  console.warn(...args);
};
