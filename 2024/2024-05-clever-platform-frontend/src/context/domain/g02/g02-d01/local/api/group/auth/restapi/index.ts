import { RepositoryPatternInterface } from '../../../repository-pattern';
import CheckAdmin from './check-admin';
import LoginAsAdmin from './login-as-admin';
import LoginWithPin from './login-with-pin';
import {
  BindLogin,
  CheckAuthWithProvider,
  CheckBindProvider,
  CheckSchoolId,
  CheckStudentId,
} from './oauth/restapi';

const RestAPIAuth: RepositoryPatternInterface['Auth'] = {
  LoginWithPin,
  LoginAsAdmin,
  CheckAdmin,
  CheckAuthWithProvider,
  CheckBindProvider,
  CheckSchoolId,
  CheckStudentId,
  BindLogin,
};

export default RestAPIAuth;
