import { RepositoryPatternInterface } from '../../../repository-pattern';
import ReportBugGet from './report-bug-get';

const Global: RepositoryPatternInterface['Global'] = {
  ReportBug: { Get: ReportBugGet },
};

export default Global;
