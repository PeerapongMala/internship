/**
 * * Formats time to M.SS.t (minutes.seconds.tenth)
 * - Minutes: displayed
 * - Seconds: always 2 digits
 * * example
 * formatTimeString(90.5)    "1.30.5"
 * formatTimeString(45.123)  // "0.45.1"
 * formatTimeString(60)      // "1.00.0"
 * Tenth: 1 decimal digit
 * @param {number | string} inputSeconds - Input time in seconds
 * @returns {string} Formatted time string (M.SS.t)
 */
export function formatTimeString(inputSeconds: number | string): string {
  if (['undefined', 'unknown'].includes(typeof inputSeconds) || inputSeconds == null) {
    return formatTimeString(0);
  }

  if (typeof inputSeconds === 'string') {
    const parsedNumber = parseFloat(inputSeconds) || 0;
    return formatTimeString(parsedNumber);
  }

  const totalSeconds = inputSeconds;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.floor((totalSeconds % 1) * 10); // 2ตำแหน่ง

  const pad = (num: number, size: number) => num.toString().padStart(size, '0');

  return `${minutes}.${pad(seconds, 2)}.${milliseconds}`;
}
