import DomainG04D09P01 from '../g04-d09-p01-how-to-use/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  {
    domain: DomainG04D09P01,
    routePath: `${routePath}`,
  },
];

const DomainG04D09 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default DomainG04D09;
