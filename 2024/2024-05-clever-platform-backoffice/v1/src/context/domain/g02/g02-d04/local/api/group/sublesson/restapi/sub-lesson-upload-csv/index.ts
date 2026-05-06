import { Sublesson } from '@domain/g02/g02-d04/local/Type';
import { DataAPIResponse } from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const CsvUpload = async function (
  file: File,
  lessonId: number,
): Promise<DataAPIResponse<Sublesson[]>> {
  const url = `${BACKEND_URL}/academic-sub-lesson/v1/${lessonId}/sub-lessons/upload/csv`;

  const formData = new FormData();
  formData.append('csv_file', file);

  const res = await fetchWithAuth(url, {
    method: 'POST',
    body: formData,
  });

  return await res.json();
};

export default CsvUpload;
