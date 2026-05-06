import { RepositoryPatternInterface } from '../../../repository-pattern';
import AccountInfoGet from './get-account-info';
import LevelInfoGet from './get-level-info';
import LevelLeaderBoardGet from './get-level-leaderboard';

const Leaderboard: RepositoryPatternInterface['LevelLeaderBoardData'] = {
  LevelLeaderBoard: { Get: LevelLeaderBoardGet },
  LevelInfo: { Get: LevelInfoGet },
  AccountInfo: { Get: AccountInfoGet },
};

export default Leaderboard;
