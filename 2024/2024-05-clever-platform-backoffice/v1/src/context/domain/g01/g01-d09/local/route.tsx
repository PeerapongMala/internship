import I18NInit from './i18n';
import DomainG01D09P00Route from '../g01-d09-a00-permission/route';
import DomainG01D09P01Route from '../g01-d09-a01-permission-info/route';

const domainList = (routePath: string) => [
  {
    domain: DomainG01D09P00Route,
    routePath: `${routePath}`,
  },
  {
    domain: DomainG01D09P01Route,
    routePath: `${routePath}/info`,
  },
];

const DomainG01D09 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG01D09;
