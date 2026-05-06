import { IDownloadCsvFilter } from '@domain/g02/g02-d03/local/Type';
import { FailedAPIResponse } from '@global/utils/apiResponseHelper';
import downloadCSV from '@global/utils/downloadCSV';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const DownloadCsv = (filter: IDownloadCsvFilter): Promise<void | FailedAPIResponse> => {
  const url = `${BACKEND_URL}/academic-lesson/v1/${filter.subject_id}/lessons/download/csv?start_date=${filter.start_date}&end_date=${filter.end_date}`;

  return fetchWithAuth(url)
    .then((res) => res.blob())
    .then((blob) => downloadCSV(blob, `lesson.csv`));
};

export default DownloadCsv;
