import { RepositoryPatternInterface } from '../../../repository-pattern';
import LevelListGet from './level-list-get';
import { LevelGetZip, LevelQuizGet } from './level-quiz-get';

const Level: Partial<RepositoryPatternInterface['Level']> = {
  LevelQuiz: {
    Get: LevelQuizGet,
    GetZip: LevelGetZip,
  },
  LevelList: { Get: LevelListGet },
};

export default Level;
