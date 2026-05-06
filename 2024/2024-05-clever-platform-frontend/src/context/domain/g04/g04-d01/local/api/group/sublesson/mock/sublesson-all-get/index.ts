import { pagination } from '@core/helper/api-mock';
import { PaginationAPIResponse } from '@core/helper/api-type';
import { SublessonItemList } from '@domain/g04/g04-d01/local/type';
import MockJson from './index.json';

const SublessonAllGet = (
  lessonId: string,
): Promise<PaginationAPIResponse<SublessonItemList>> => {
  return Promise.resolve(
    pagination({
      data: MockJson.filter((item) => item.lesson_id === lessonId) as SublessonItemList[],
      page: 1,
      limit: -1,
    }),
  );
};

export default SublessonAllGet;
