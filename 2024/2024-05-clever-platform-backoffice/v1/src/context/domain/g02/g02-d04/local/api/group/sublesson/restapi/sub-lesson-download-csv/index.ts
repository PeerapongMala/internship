import { IDownloadCsvFilter } from '@domain/g02/g02-d04/local/Type';
import { DataAPIResponse, FailedAPIResponse } from '@global/utils/apiResponseHelper';
import downloadCSV from '@global/utils/downloadCSV';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const DownloadCsv = (
  filter: IDownloadCsvFilter,
): Promise<void | FailedAPIResponse | DataAPIResponse<any>> => {
  const url = `${BACKEND_URL}/academic-sub-lesson/v1/${filter.lesson_id}/sub-lessons/download/csv?start_date=${filter.start_date}&end_date=${filter.end_date}`;

  return fetchWithAuth(url)
    .then((res) => res.blob())
    .then((blob) => downloadCSV(blob, `sub-lesson.csv`));
};

export default DownloadCsv;
