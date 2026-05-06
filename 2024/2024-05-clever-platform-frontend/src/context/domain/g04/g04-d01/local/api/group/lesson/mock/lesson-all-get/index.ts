import { pagination } from '@core/helper/api-mock';
import { PaginationAPIResponse } from '@core/helper/api-type';
import { LessonItemList } from '@domain/g04/g04-d01/local/type';
import MockJson from './index.json';

const LessonAllGet = (
  subjectId: string,
): Promise<PaginationAPIResponse<LessonItemList>> => {
  return Promise.resolve(
    pagination({
      data: MockJson.filter((item) => item.subject_id === subjectId) as LessonItemList[],
      page: 1,
      limit: -1,
    }),
  );
};

export default LessonAllGet;
