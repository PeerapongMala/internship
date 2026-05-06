import DomainG03D13P01 from '../g03-d13-p01-how-to-use/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  {
    domain: DomainG03D13P01,
    routePath: `${routePath}`,
  },
];

const DomainG03D13 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default DomainG03D13;
