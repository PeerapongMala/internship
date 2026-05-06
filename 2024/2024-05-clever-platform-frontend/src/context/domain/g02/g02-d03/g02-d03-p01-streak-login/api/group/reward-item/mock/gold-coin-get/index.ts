import { APITypeAPIResponse } from '@core/helper/api-type';
import { UserStat } from '../../../../../type';
import MockJson from './index.json';

const UserStatGet = (): APITypeAPIResponse<UserStat> => {
  return new Promise((resolve, reject) => {
    resolve({ json: () => MockJson as UserStat });
  });
};

export default UserStatGet;
