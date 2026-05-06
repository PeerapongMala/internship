import DomainG04D02P01LevelRoute from '../g04-d02-p01-level/route';
import DomainG04D02P02HomeworkRoute from '../g04-d02-p02-homework/route';
import DomainG04D02P03AchievementRoute from '../g04-d02-p03-achievement/route';
import DomainG04D02P04LessonLeaderboardRoute from '../g04-d02-p04-lesson-leaderboard/route';
import DomainG04D02P05LevelLeaderboardRoute from '../g04-d02-p05-level-leaderboard/route';

import I18NInit from './i18n';

const domainList = (routePath: string) => [
  {
    domain: DomainG04D02P01LevelRoute,
    routePath: routePath + 'level/$sublessonId',
  },
  {
    domain: DomainG04D02P02HomeworkRoute,
    routePath: routePath + 'homework/$sublessonId',
  },
  {
    domain: DomainG04D02P03AchievementRoute,
    routePath: routePath + 'achievement/$sublessonId',
  },
  {
    domain: DomainG04D02P04LessonLeaderboardRoute,
    routePath: routePath + 'lesson-leaderboard/$sublessonId',
  },
  {
    domain: DomainG04D02P05LevelLeaderboardRoute,
    routePath: routePath + 'level-leaderboard/$sublessonId',
  },
];

const DomainG04D02 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG04D02;
