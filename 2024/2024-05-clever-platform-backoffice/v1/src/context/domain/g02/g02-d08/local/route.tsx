import DomainG02D08P01 from '../g02-d08-p01-how-to-use/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  {
    domain: DomainG02D08P01,
    routePath: `${routePath}`,
  },
];

const DomainG02D08 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default DomainG02D08;
