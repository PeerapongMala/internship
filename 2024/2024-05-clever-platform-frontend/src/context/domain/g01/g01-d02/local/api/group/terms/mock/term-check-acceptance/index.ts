import { responseOk } from '@core/helper/api-mock';
import { DataAPIResponse } from '@core/helper/api-type';

const TermCheckAcceptance = (): Promise<DataAPIResponse<boolean>> => {
  return Promise.resolve(responseOk({ data: false, message: 'Data retrieved' }));
};

export default TermCheckAcceptance;
