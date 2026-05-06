import DomainG03D08P01ArcadeGameRoute from '../g03-d08-p01-arcade-game/route';
import DomainG03D08P02ArcadeLeaderboardRoute from '../g03-d08-p02-arcade-leaderboard/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG03D08P01ArcadeGameRoute, routePath: routePath + 'arcade-game' },
  {
    domain: DomainG03D08P02ArcadeLeaderboardRoute,
    routePath: routePath + 'arcade-leaderboard/$gameId',
  },
];

const DomainG03D08 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG03D08;
