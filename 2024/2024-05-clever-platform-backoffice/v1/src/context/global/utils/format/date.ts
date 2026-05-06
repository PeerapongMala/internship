import dayjs from '@global/utils/dayjs';
import 'dayjs/locale/th';

export type TConfigFormatDate = {
  /** Locale to use for formatting. Defaults to 'th' (Thai). */
  locale?: 'th' | 'en';
  /** Custom Day.js format string. If not provided, a default is used. */
  format?: string;
  withTime?: boolean;
};

/**
 * Formats a date string using Day.js, with support for Thai and English locales.
 *
 * - Defaults to Thai locale (`'th'`) and format `'DD MMM YYYY HH:mm'`.
 * - If the locale is `'th'` and no custom format is given, uses Buddhist year (`'BBBB'`) instead of `'YYYY'`.
 *
 * @param {dayjs.ConfigType} dateString - The input date (string, Date, number, etc.)
 * @param {TConfigFormatDate} [config] - Optional configuration for locale and format.
 * @returns {string} The formatted date string.
 */
export const formatToDate = (
  dateString: dayjs.ConfigType,
  config?: TConfigFormatDate & { shortMonth?: boolean },
): string => {
  const locale = config?.locale ?? 'th';
  let date;

  if (typeof dateString === 'string' && dateString.includes('/')) {
    const [day, month, year] = dateString.split('/');
    const christianYear = parseInt(year) - 543;
    date = dayjs(`${christianYear}-${month}-${day}`).locale(locale);
  } else {
    date = dayjs(dateString).locale(locale);
  }

  if (!date.isValid()) {
    return '-';
  }

  let format = config?.format;
  if (!format) {
    format = locale === 'th' ? 'DD MMMM BBBB' : 'DD MMMM YYYY';
  }

  if (config?.shortMonth) format = format.replace('MMMM', 'MMM');

  if (config?.withTime) format = `${format} HH:mm`;

  return date.format(format);
};
