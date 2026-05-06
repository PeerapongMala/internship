import { pagination, responseOk } from '@core/helper/api-mock';
import { DataAPIResponse, PaginationAPIResponse } from '@core/helper/api-type';
import { MonsterItemList } from '@domain/g04/g04-d01/local/type';
import MockJson from './index.json';

const LessonMonstersById = (lessonId: string): Promise<PaginationAPIResponse<MonsterItemList[]>> => {
  return Promise.resolve(
    pagination({
      data: [MockJson] as MonsterItemList[][],
      page: 1,
      limit: -1,
    }),
  );
};

export default LessonMonstersById;
