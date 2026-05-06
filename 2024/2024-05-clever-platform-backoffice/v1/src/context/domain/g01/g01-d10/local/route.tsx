import DomainG01D10P01 from '../g01-d10-p01-how-to-use/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  {
    domain: DomainG01D10P01,
    routePath: `${routePath}`,
  },
];

const DomainG01D10 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default DomainG01D10;
