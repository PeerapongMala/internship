import { SubjectLessons } from '@domain/g02/g02-d03/local/Type';
import StoreGlobalPersist, { IStoreGlobalPersist } from '@global/store/global/persist';
import { DataAPIResponse } from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
// ตั้งค่า axios instance
const LessonGetBy = async (
  lessonId: string,
): Promise<DataAPIResponse<SubjectLessons>> => {
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
  let url = `${BACKEND_URL}/academic-lesson/v1/lessons/${lessonId}`;

  return fetchWithAuth(url)
    .then((res) => res.json())
    .then((res: DataAPIResponse<SubjectLessons[]>) => {
      // we assume only get single data but backend response as a array
      // we pull it out of array, tricky but worked
      if (res.status_code === 200 && Array.isArray(res.data))
        return { ...res, data: res.data?.at(0) } as DataAPIResponse<SubjectLessons>;
      return res as DataAPIResponse<SubjectLessons>;
    })
    .then((res: DataAPIResponse<SubjectLessons>) => {
      return res;
    });
};

export default LessonGetBy;
