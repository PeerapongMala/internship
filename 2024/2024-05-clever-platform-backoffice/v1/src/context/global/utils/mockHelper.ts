import {
  PaginationAPIResponse,
  DataAPIResponse,
  HTTPStatusCodeFailed,
  FailedAPIResponse,
} from './apiResponseHelper';
import downloadCSV from './downloadCSV';

export function pagination<T>({
  data,
  page,
  limit,
  message,
}: {
  data: T[];
  page: number;
  limit: number;
  message?: string;
}): PaginationAPIResponse<T> {
  const totalCount = data.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);
  return {
    status_code: 200,
    message: message ?? 'Data retrieved successfully',
    _pagination: {
      limit,
      page,
      total_count: totalCount,
    },
    data: paginatedData,
  };
}

export function responseOk<T>({
  data,
  message,
}: {
  data: T;
  message?: string;
}): DataAPIResponse<T> {
  return {
    status_code: 200,
    message: message ?? 'Data retrieved successfully.',
    data,
  };
}

export function responseCreated<T>({
  data,
  message,
}: {
  data: T;
  message?: string;
}): DataAPIResponse<T> {
  return {
    status_code: 201,
    message: message ?? 'Data created successfully.',
    data,
  };
}

export function responseFailed({
  statusCode,
  message,
}: {
  statusCode: HTTPStatusCodeFailed;
  message?: string;
}): FailedAPIResponse {
  return {
    status_code: statusCode,
    message: message ?? 'Something went wrong.',
  };
}

export function responseDownloadCSV<T extends Object>(
  data: T[],
  { fileName }: { fileName?: string } = { fileName: 'download.csv' },
) {
  const firstData = data?.at(0);
  // Empty array for storing the values
  const csvRows = [];
  if (firstData) {
    // Headers
    const headers = Object.keys(firstData);
    csvRows.push(headers.join(','));

    // Records
    data.forEach((record) => {
      const values = Object.values(record);
      csvRows.push(values.join(','));
    });
  }
  // join all records together
  const csvData = csvRows.join('\n');
  if (csvData) {
    // Create a Blob with the CSV data and type
    const blob = new Blob([csvData], { type: 'text/csv' });
    downloadCSV(blob, fileName ?? 'download.csv');
  }
}
