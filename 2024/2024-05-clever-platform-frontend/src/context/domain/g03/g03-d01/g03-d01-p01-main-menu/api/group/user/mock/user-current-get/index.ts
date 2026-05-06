import { APITypeAPIResponse } from '@core/helper/api-type';
import { IProfile } from '../../../../../type';
import MockJson from './index.json';

const UserCurrentGet = (): APITypeAPIResponse<IProfile> => {
  return new Promise((resolve, reject) => {
    resolve({ json: () => MockJson as unknown as IProfile });
  });
};

export default UserCurrentGet;
