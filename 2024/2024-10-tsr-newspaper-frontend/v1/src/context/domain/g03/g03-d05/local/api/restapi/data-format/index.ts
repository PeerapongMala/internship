/**
 * Formats a date to YYYY-MM-DD string
 */
export const formatDateToString = (date: Date | null): string => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Creates a new Date and returns it in YYYY-MM-DD format
 */
export const getTodayString = (): string => {
  return formatDateToString(new Date());
};

/**
 * Parses a YYYY-MM-DD string to Date object
 */
export const parseDateString = (dateString: string): Date => {
  return new Date(dateString);
};

/**
 * Checks if a date string is valid YYYY-MM-DD format
 */
export const isValidDateString = (dateString: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};
