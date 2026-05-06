import { responseOk } from '@core/helper/api-mock';
import { DataAPIResponse } from '@core/helper/api-type';
import { SublessonEntity } from '@domain/g04/g04-d01/local/type';
import MockJson from './index.json';

const SublessonByIdGet = (
  sublessonId: string,
): Promise<DataAPIResponse<SublessonEntity>> => {
  return Promise.resolve(
    responseOk({
      data: MockJson.find((item) => item.id === sublessonId) as SublessonEntity,
    }),
  );
};

export default SublessonByIdGet;
