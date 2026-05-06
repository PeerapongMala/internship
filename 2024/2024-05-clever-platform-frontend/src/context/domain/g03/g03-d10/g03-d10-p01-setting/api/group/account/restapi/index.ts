import { RepositoryPatternInterface } from '../../../repository-pattern';
import AccountCurrentGet from './account-current-get';
import AccountChangePIN from './change-pin';

const Account: RepositoryPatternInterface['Account'] = {
  AccountCurrent: { Get: AccountCurrentGet, ChangePIN: AccountChangePIN },
};

export default Account;
