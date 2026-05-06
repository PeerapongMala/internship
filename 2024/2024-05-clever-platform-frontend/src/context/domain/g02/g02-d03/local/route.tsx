import DomainG02D03P01StreakLoginRoute from '../g02-d03-p01-streak-login/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG02D03P01StreakLoginRoute, routePath: routePath + 'streak-login' },
];

const DomainG02D03 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG02D03;
