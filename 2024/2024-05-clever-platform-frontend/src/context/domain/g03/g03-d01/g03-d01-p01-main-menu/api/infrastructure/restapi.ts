import Global from '../group/global/restapi';
import User from '../group/user/restapi';
import { RepositoryPatternInterface } from '../repository-pattern';

const RestAPI: RepositoryPatternInterface = {
  Global,
  User,
};

export default RestAPI;
