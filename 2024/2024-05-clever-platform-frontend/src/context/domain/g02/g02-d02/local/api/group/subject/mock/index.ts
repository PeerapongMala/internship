import { RepositoryPatternInterface } from '../../../repository-pattern';
import SubjectSelectionGet from './subject-selection-get';

const Subject: RepositoryPatternInterface['Subject'] = {
  SubjectSelection: { Get: SubjectSelectionGet },
};

export default Subject;
