import { IBulkEdit, Sublesson } from '@domain/g02/g02-d04/local/Type';
import { DataAPIResponse } from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const BulkEdit = async (lessonList: IBulkEdit): Promise<DataAPIResponse<Sublesson>> => {
  let url = `${BACKEND_URL}/academic-sub-lesson/v1/sub-lessons/bulk-edit`;

  const body = JSON.stringify(lessonList);
  console.log({ body: body });
  return fetchWithAuth(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: body,
  })
    .then((res) => res.json())
    .then((res: DataAPIResponse<Sublesson>) => {
      // pull it out of array
      // note: when create succesfully, it response HTTP 201 Created

      return res as DataAPIResponse<Sublesson>;
    });
};

export default BulkEdit;
