import { RepositoryPatternInterface } from '../../../repository-pattern';
import AccountChangePIN from '../restapi/change-pin';
import AccountCurrentGet from './account-current-get';

const Account: RepositoryPatternInterface['Account'] = {
  AccountCurrent: { Get: AccountCurrentGet, ChangePIN: AccountChangePIN },
};

export default Account;
