import CreatePhorpor5 from '../group/phorpor5/restapi/create-phorpor5';
import GetDetailPhorpor5 from '../group/phorpor5/restapi/get-detail-phorpor5';
import GetEvaluation from '../group/phorpor5/restapi/get-evalution';
import GetPhorpor5List from '../group/phorpor5/restapi/get-phorpor5-list';
import UpdateDetailPhorpor5 from '../group/phorpor5/restapi/update-detail-phorpor5';
import { RepositoryPatternInterface } from '../repository-pattern';

const RestAPI: RepositoryPatternInterface = {
  CreatePhorpor5: CreatePhorpor5,
  GetDetailPhorpor5: GetDetailPhorpor5,
  GetPhorpor5List: GetPhorpor5List,
  UpdateDetailPhorpor5: UpdateDetailPhorpor5,
  GetEvaluation: GetEvaluation,
};

export default RestAPI;
