import { RepositoryPatternInterface } from '../../../repository-pattern';
import AccountInfoGet from './get-acccount-info';
import LessonInfoGet from './get-lesson-info';
import LessonLeaderBoardGet from './get-lesson-leaderboard';

const Leaderboard: RepositoryPatternInterface['LessonLeaderBoardData'] = {
  LessonLeaderBoard: { Get: LessonLeaderBoardGet },
  LessonInfo: { Get: LessonInfoGet },
  AccountInfo: { Get: AccountInfoGet },
};

export default Leaderboard;
