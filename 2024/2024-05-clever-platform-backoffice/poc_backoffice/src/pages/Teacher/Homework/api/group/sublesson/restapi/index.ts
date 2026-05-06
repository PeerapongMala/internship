import { RepositoryPatternInterface } from '../../../repository-pattern';
import SublessonAllGet from './sublesson-all-get';
import SublessonDetailGet from './sublesson-details-get';

const Sublesson: RepositoryPatternInterface['Sublesson'] = {
  SublessonAll: { Get: SublessonAllGet },
  SublessonDetail: { Get: SublessonDetailGet },
};

export default Sublesson;
