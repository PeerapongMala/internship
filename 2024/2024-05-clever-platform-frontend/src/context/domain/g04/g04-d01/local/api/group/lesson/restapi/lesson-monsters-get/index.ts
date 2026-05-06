import { convertToDataResponseList, PaginationAPIResponse } from '@core/helper/api-type';
import { MonsterItemList } from '@domain/g04/g04-d01/local/type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

const LessonMonstersByIdGet = (
  lessonId: string,
): Promise<PaginationAPIResponse<MonsterItemList[]>> => {
  return (
    fetchWithAuth(
      `${backendURL}/academic-lesson/v1/lessons/${lessonId}/monsters?page=&limit=-1`,
    )
      // for mock data
      // return fetchWithCustomToken(`${backendURL}/academic-lesson/v1/lessons/${lessonId}/monsters?page=&limit=-1`, "")
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<MonsterItemList>) => {
        if (res.status_code === 200) {
          const convertedResponse = convertToDataResponseList(res);
          return {
            ...res,
            data: Array.isArray(convertedResponse.data) ? convertedResponse.data : [],
          };
        }
        return res;
      })
  );
};

export default LessonMonstersByIdGet;
