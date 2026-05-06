import DomainG03D01P01RouteDashboard from '../g03-d01-p01-dashboard/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  {
    domain: DomainG03D01P01RouteDashboard,
    routePath: `${routePath}`,
  },
];

const DomainG03D01 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default DomainG03D01;
