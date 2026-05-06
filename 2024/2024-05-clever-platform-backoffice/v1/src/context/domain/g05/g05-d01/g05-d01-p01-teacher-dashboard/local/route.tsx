import DomainG05D01P01RouteDashboard from '../g05-d01-p01-dashboard/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  {
    domain: DomainG05D01P01RouteDashboard,
    routePath: `${routePath}`,
  },
];

const DomainG05D01 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default DomainG05D01;
