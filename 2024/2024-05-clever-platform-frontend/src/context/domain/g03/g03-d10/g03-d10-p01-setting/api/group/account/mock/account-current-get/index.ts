import { APITypeAPIResponse } from '@core/helper/api-type';
import { Account } from '../../../../../type';
import MockJson from './index.json';

const AccountCurrentGet = (): APITypeAPIResponse<Account> => {
  return new Promise((resolve, reject) => {
    resolve({ json: () => MockJson as Account });
  });
};

export default AccountCurrentGet;
