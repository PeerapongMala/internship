import { responseMessage } from '@core/helper/api-mock';
import { BaseAPIResponse } from '@core/helper/api-type';

const TermAcceptAcceptance = (): Promise<BaseAPIResponse> => {
  return Promise.resolve(responseMessage({ message: 'Accepted' }));
};

export default TermAcceptAcceptance;
