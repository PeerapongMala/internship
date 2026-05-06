import dayjs from '@global/utils/dayjs';

/**
 * Triggers a browser download for a raw string of data.
 * @param {string} content The raw string content to be downloaded (e.g., a CSV string).
 * @param {string} filename ชื่อโดเมน_ตามด้วยชื่อเพจ_ตามด้วยdate-rangeถ้ามี (e.g., report_progress-dashboard_20250301-20250331.csv )
 * @param {string} mimeType The MIME type of the content (e.g., 'text/csv').
 */
export const downloadStringAsFile = (
  content: string,
  filename: string,
  mimeType: string = 'text/csv',
): void => {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
