import { RepositoryPatternInterface } from '../../../repository-pattern';
import UserCurrentGet from '../mock/user-current-get';

const User: RepositoryPatternInterface['User'] = {
  UserCurrent: { Get: UserCurrentGet },
};

export default User;
