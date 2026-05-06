import { RepositoryPatternInterface } from '../../../repository-pattern';
import AccountInfoGet from './get-account-info';
import ArcadeInfoGet from './get-arcade-info';
import ArcadeLeaderBoardGet from './get-arcade-leaderboard';

const Leaderboard: RepositoryPatternInterface['ArcadeLeaderBoardData'] = {
  ArcadeLeaderBoard: { Get: ArcadeLeaderBoardGet },
  ArcadeInfo: { Get: ArcadeInfoGet },
  AccountInfo: { Get: AccountInfoGet },
};

export default Leaderboard;
