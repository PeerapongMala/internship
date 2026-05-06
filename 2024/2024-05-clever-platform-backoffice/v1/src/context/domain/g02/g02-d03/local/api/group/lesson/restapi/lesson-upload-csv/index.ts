import { Lesson } from '@domain/g02/g02-d03/local/Type';
import { DataAPIResponse } from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const CsvUpload = async function (
  file: File,
  subjectId: number,
): Promise<DataAPIResponse<Lesson[]>> {
  const url = `${BACKEND_URL}/academic-lesson/v1/${subjectId}/lessons/upload/csv`;

  const formData = new FormData();
  formData.append('csv_file', file);
  formData.append('subjectId', subjectId.toString());

  const res = await fetchWithAuth(url, {
    method: 'POST',
    body: formData,
  });

  return await res.json();
};

export default CsvUpload;
