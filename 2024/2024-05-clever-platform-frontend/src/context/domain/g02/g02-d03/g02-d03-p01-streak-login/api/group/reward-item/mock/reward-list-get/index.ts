import { APITypeAPIResponse } from '@core/helper/api-type';
import { RewardList } from '../../../../../type';
import MockJson from './index.json';

const RewardListGet = (): APITypeAPIResponse<RewardList[]> => {
  return new Promise((resolve, reject) => {
    resolve({ json: () => MockJson as RewardList[] });
  });
};

export default RewardListGet;
