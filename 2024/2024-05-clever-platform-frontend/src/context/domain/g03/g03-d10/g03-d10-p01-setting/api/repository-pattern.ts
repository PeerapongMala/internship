import { APITypeAPIResponse, BaseAPIResponse } from '@core/helper/api-type';
import { Account } from '../type';

export interface RepositoryPatternInterface {
  Account: {
    AccountCurrent: {
      Get(): APITypeAPIResponse<Account>;
      ChangePIN(pin: string): Promise<BaseAPIResponse>;
    };
  };
}
