import DomainG01D11P01 from '../g01-d11-p01-report-bug/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  {
    domain: DomainG01D11P01,
    routePath: `${routePath}`,
  },
];

const DomainG01D11 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default DomainG01D11;
