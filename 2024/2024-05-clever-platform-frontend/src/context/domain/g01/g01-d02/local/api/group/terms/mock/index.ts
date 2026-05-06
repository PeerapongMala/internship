import { RepositoryPatternInterface } from '../../../repository-pattern';

import AcceptAcceptance from './term-accept-acceptance';
import CheckAcceptance from './term-check-acceptance';
import Get from './term-get';

const Terms: RepositoryPatternInterface['Terms'] = {
  CheckAcceptance,
  AcceptAcceptance,
  Get,
};

export default Terms;
