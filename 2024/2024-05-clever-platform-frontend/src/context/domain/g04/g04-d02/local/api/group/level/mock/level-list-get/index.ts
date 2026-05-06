import { APITypeAPIResponse } from '@core/helper/api-type';
import { LevelList } from '../../../../../../g04-d02-p01-level/type';
import MockJson from './index.json';

const RewardListGet = (): APITypeAPIResponse<LevelList[]> => {
  return new Promise((resolve, reject) => {
    resolve({ json: () => MockJson as unknown as LevelList[] });
  });
};

export default RewardListGet;
