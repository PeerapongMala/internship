import { pagination } from '@core/helper/api-mock';
import { PaginationAPIResponse } from '@core/helper/api-type';
import { MinigameList } from '../../../../../type';
import MockJson from './index.json';

const MinigameListGet = (): Promise<PaginationAPIResponse<MinigameList>> => {
  return new Promise((resolve, reject) => {
    resolve(pagination({ data: MockJson, page: 1, limit: -1 }));
  });
};

export default MinigameListGet;
