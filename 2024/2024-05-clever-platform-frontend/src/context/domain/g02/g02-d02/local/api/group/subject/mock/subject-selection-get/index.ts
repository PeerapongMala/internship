import { responseOk } from '@core/helper/api-mock';
import { DataAPIResponse } from '@core/helper/api-type';
import { SubjectListItem } from '@domain/g02/g02-d02/local/type';
import MockJson from './index.json';

const SubjectSelectionGet = (): Promise<DataAPIResponse<SubjectListItem[]>> => {
  return Promise.resolve(
    responseOk({
      data: MockJson as SubjectListItem[],
    }),
  );
};

export default SubjectSelectionGet;
