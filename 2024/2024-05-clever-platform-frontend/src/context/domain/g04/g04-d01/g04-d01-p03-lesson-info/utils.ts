/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Converts a number of bytes into a human-readable format with appropriate units.
 *
 * The function steps through memory units (Bytes, KB, MB, GB, etc.) by dividing
 * the input by 1024 until the value is less than 1024 or the largest unit (PB) is reached.
 *
 * @param {number} numBytes - The number of bytes to convert.
 * @returns {string} - A formatted string representing the value with two decimal places and the correct unit (B, KB, MB, etc.).
 *
 * @example
 * // Example usage:
 * convertBytesToString(1048576); // Returns: "1.00 MB"
 */
export function convertBytesToString(numBytes: number): string {
  // Define the list of units from bytes to petabytes
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

  let index = 0; // Initialize index to track the current unit

  // Loop to divide the number of bytes by 1024 until it's less than 1024,
  // or until we've reached the largest unit (PB).
  while (numBytes >= 1024 && index < units.length - 1) {
    numBytes /= 1024; // Divide the number of bytes by 1024 to step up a unit
    index++; // Move to the next unit in the list (e.g., from KB to MB)
  }

  // Format the result to 2 decimal places and return it with the appropriate unit
  return `${numBytes.toFixed(2)} ${units[index]}`;
}
