import DomainG03D02P01RoutePhorPor6 from '../g03-d02-p01/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  {
    domain: DomainG03D02P01RoutePhorPor6,
    routePath: `${routePath}/phor-por-6`,
  },
];

const DomainG03D02 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default DomainG03D02;
