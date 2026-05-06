import { RepositoryPatternInterface } from '../../../repository-pattern';
import LessonAllGet from './lesson-all-get';
import LessonByIdGet from './lesson-by-id-get';
import LessonMonstersByIdGet from './lesson-monsters-get';

const Lesson: RepositoryPatternInterface['Lesson'] = {
  LessonAll: { Get: LessonAllGet },
  LessonById: { Get: LessonByIdGet },
  LessonMonstersById: { Get: LessonMonstersByIdGet },
};

export default Lesson;
