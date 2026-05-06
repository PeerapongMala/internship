import { APITypeAPIResponse } from '../../../../../../../../../../core/helper/api-type';
import { LessonLeaderboardData } from '../../../../../types';
import MockJson from './index.json';

const AccountInfoGet = (): APITypeAPIResponse<LessonLeaderboardData[]> => {
  return new Promise((resolve, reject) => {
    resolve({ json: () => MockJson as unknown as LessonLeaderboardData[] });
  });
};

export default AccountInfoGet;
