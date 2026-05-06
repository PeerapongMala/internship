import { RepositoryPatternInterface } from '../../../repository-pattern';
import CreatePhorpor5 from './create-phorpor5';
import GetDetailPhorpor5 from './get-detail-phorpor5';
import GetEvaluation from './get-evalution';
import GetPhorpor5List from './get-phorpor5-list';
import UpdateDetailPhorpor5 from './update-detail-phorpor5';

const Phorpor5: RepositoryPatternInterface = {
  CreatePhorpor5: CreatePhorpor5,
  GetDetailPhorpor5: GetDetailPhorpor5,
  GetPhorpor5List: GetPhorpor5List,
  UpdateDetailPhorpor5: UpdateDetailPhorpor5,
  GetEvaluation: GetEvaluation,
};

export default Phorpor5;
