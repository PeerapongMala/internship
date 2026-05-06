import DomainG04D04P01Gamification from '../g04-d04-p01-gamification/route';
import DomainG04D04P02GamificationSpecial from '../g04-d04-p02-gamification-special/route';
import DomainG04D04P03GamificationSpecial from '../g04-d04-p03-gamification-special-view/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  {
    domain: DomainG04D04P01Gamification,
    routePath: `${routePath}`,
  },
  {
    domain: DomainG04D04P02GamificationSpecial,
    routePath: `${routePath}/$specialId/create`,
  },
  {
    domain: DomainG04D04P03GamificationSpecial,
    routePath: `${routePath}/$specialId/view`,
  },
];

const DomainG04D04 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default DomainG04D04;
