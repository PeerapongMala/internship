import { DataAPIResponse, PaginationAPIResponse } from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { SubjectSubLessons, SubLessonData } from '../../../../type';
import { FilterQueryParams } from '../../../../repository-pattern';
import StoreGlobalPersist from '@store/global/persist';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

const SubLessonGet = async (
  subLessonId: number,
): Promise<DataAPIResponse<SubLessonData>> => {
  const url = `${BACKEND_URL}/academic-sub-lesson/v1/sub-lessons/${subLessonId}`;
  return fetchWithAuth(url)
    .then((res) => res.json())
    .then((res: DataAPIResponse<SubLessonData[]>) => {
      // we assume only get single data but backend response as a array
      // we pull it out of array, tricky but worked
      if (res.status_code === 200 && Array.isArray(res.data))
        return {
          ...res,
          data: res.data?.at(0),
        } as DataAPIResponse<SubLessonData>;
      return res as DataAPIResponse<SubLessonData>;
    })
    .then((res: DataAPIResponse<SubLessonData>) => {
      return res;
    });
};

export default SubLessonGet;
