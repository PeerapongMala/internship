import { RepositoryPatternInterface } from '../../../repository-pattern';
import LessonAllGet from './lesson-all-get';
import LessonDetailGet from './lesson-details-get';

const Lesson: RepositoryPatternInterface['Lesson'] = {
  LessonAll: { Get: LessonAllGet },
  LessonDetail: { Get: LessonDetailGet },
};

export default Lesson;
