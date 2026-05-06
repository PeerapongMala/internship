import { RepositoryPatternInterface } from '../../../repository-pattern';
import SublessonAllGet from './sublesson-all-get';
import SublessonByIdGet from './sublesson-by-id-get';

const Sublesson: RepositoryPatternInterface['Sublesson'] = {
  SublessonAll: { Get: SublessonAllGet },
  SublessonById: { Get: SublessonByIdGet },
};

export default Sublesson;
