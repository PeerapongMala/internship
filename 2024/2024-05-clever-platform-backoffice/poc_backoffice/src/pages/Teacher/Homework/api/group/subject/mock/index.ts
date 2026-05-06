import { RepositoryPatternInterface } from '../../../repository-pattern';
import SubjectAllGet from './subject-all-get';
import SubjectByIdGet from './subject-by-id-get';

const Subject: RepositoryPatternInterface['Subject'] = {
    SubjectAll: { Get: SubjectAllGet},
    SubjectById: { Get: SubjectByIdGet },
};

export default Subject;
