import { APITypeAPIResponse } from '../../../../../../../../../../core/helper/api-type';
import { ArcadeLeaderboardData } from '../../../../../types';
import MockJson from './index.json';

const AccountInfoGet = (): APITypeAPIResponse<ArcadeLeaderboardData[]> => {
  return new Promise((resolve, reject) => {
    resolve({ json: () => MockJson as unknown as ArcadeLeaderboardData[] });
  });
};

export default AccountInfoGet;
