import DomainG03D01P01MainMenuRoute from '../g03-d01-p01-main-menu/route';
import DomainG03D01P02AccountRoute from '../g03-d01-p02-account/route';
import DomainG03D01P04ProfileShareRoute from '../g03-d01-p04-profile-share/route';
import DomainG03D01P05MainMenuLeaderboardRoute from '../g03-d01-p05-main-menu-leaderboard/route';
import DomainG03D01P06HomeworkLevelRoute from '../g03-d01-p06-main-menu-homework/route';
import DomainG03D01P07AchievementLevelRoute from '../g03-d01-p07-main-menu-achievement/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG03D01P01MainMenuRoute, routePath: routePath + 'main-menu' },
  { domain: DomainG03D01P02AccountRoute, routePath: routePath + 'account' },
  // { domain: DomainG03D01P01MainMenuRoute, routePath: routePath + '' },
  { domain: DomainG03D01P04ProfileShareRoute, routePath: routePath + 'profile-share' },
  {
    domain: DomainG03D01P05MainMenuLeaderboardRoute,
    routePath: routePath + 'main-menu-leaderboard',
  },
  {
    domain: DomainG03D01P06HomeworkLevelRoute,
    routePath: routePath + 'homework-level',
  },
  {
    domain: DomainG03D01P07AchievementLevelRoute,
    routePath: routePath + 'achievement-level',
  },
];

const DomainG03D01 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG03D01;
