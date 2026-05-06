/**
 * Converts a numerical amount into a more readable format by adding appropriate
 * monetary suffixes (like "K" for thousands, "M" for millions, "B" for billions, etc.).
 * It scales the number based on its size and returns it as a string formatted to
 * two decimal places along with the corresponding suffix.
 *
 * @param amount - The numerical amount to be converted.
 * @returns A string representing the amount with a monetary suffix.
 */
export function convertToMonetarySuffix(amount: number | string): string {
  // Convert string input to a number
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  // Handle invalid or NaN cases
  if (isNaN(numericAmount)) {
    console.warn('Invalid amount provided:', amount);
    return '0';
  }

  // Check if the amount is zero
  if (numericAmount === 0) return '0';

  // Define the suffixes and the corresponding power of 1000
  const suffixes: string[] = ['', 'K', 'M', 'B', 'T'];
  const suffixIndex: number = Math.min(
    suffixes.length - 1,
    Math.max(0, Math.floor(Math.log10(Math.abs(numericAmount)) / 3)),
  );

  // Calculate the scaled amount
  const scaledAmount: number = numericAmount / Math.pow(1000, suffixIndex);
  // Format the number to 2 decimal places, remove trailing zeros, and append the appropriate suffix
  const formattedAmount: string = `${parseFloat(scaledAmount.toFixed(3))}${suffixes[suffixIndex]}`;
  return formattedAmount;
}
