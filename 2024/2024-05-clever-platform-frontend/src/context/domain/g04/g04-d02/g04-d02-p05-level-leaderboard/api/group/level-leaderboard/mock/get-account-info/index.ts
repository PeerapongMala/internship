import { LevelLeaderboardData } from '@domain/g04/g04-d02/g04-d02-p05-level-leaderboard/types';
import { APITypeAPIResponse } from '../../../../../../../../../../core/helper/api-type';
import MockJson from './index.json';

const AccountInfoGet = (): APITypeAPIResponse<LevelLeaderboardData[]> => {
  return new Promise((resolve, reject) => {
    resolve({ json: () => MockJson as unknown as LevelLeaderboardData[] });
  });
};

export default AccountInfoGet;
