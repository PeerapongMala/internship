import { responseOk } from '@core/helper/api-mock';
import { DataAPIResponse } from '@core/helper/api-type';

import MockJson from './mock.json';

const TermGet = (): Promise<DataAPIResponse<TermOfService>> => {
  return Promise.resolve(responseOk({ data: MockJson, message: 'Data retrieved' }));
};

export default TermGet;
