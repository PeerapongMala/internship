import { RepositoryPatternInterface } from '../../../repository-pattern';
import LevelListGet from './level-list-get';
import LevelQuizGet, {
  LevelGetZip,
  LevelSubLessonCaseCheck,
  LevelSubLessonCaseCheckV2,
  LevelSubLessonUrlGet,
} from './level-quiz-get';

const Level: RepositoryPatternInterface['Level'] = {
  LevelQuiz: {
    Get: LevelQuizGet,
    GetZip: LevelGetZip,
  },
  LevelList: {
    Get: LevelListGet,
  },
  LevelSubLessonUrl: {
    Get: LevelSubLessonUrlGet,
    Post: LevelSubLessonCaseCheck,
    PostV2: LevelSubLessonCaseCheckV2,
  },
};

export default Level;
