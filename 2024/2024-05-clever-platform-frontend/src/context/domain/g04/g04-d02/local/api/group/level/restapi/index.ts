import { RepositoryPatternInterface } from '../../../repository-pattern';
import LevelListGet, { GetHomeworkBySubjectId } from './level-list-get';

const Level: RepositoryPatternInterface['LevelList'] = {
  Level: { Get: LevelListGet },
};

export const Level2: RepositoryPatternInterface['Level'] = {
  GetHomeworkBySubjectId,
};

export default Level;
