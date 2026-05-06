import { RepositoryPatternInterface } from '../../../repository-pattern';
import SubjectAllGet from './subject-selection-get';

const Subject: RepositoryPatternInterface['Subject'] = {
  SubjectSelection: { Get: SubjectAllGet },
};

export default Subject;
