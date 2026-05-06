import { IBulkEdit, Lesson } from '@domain/g02/g02-d03/local/Type';
import { DataAPIResponse } from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const BulkEdit = async (
  lessonList: Partial<IBulkEdit>,
): Promise<DataAPIResponse<Lesson>> => {
  let url = `${BACKEND_URL}/academic-lesson/v1/lessons/bulk-edit`;

  const body = JSON.stringify(lessonList);
  return fetchWithAuth(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: body,
  })
    .then((res) => res.json())
    .then((res: DataAPIResponse<Lesson>) => {
      // pull it out of array
      // note: when create succesfully, it response HTTP 201 Created

      return res as DataAPIResponse<Lesson>;
    });
};

export default BulkEdit;
