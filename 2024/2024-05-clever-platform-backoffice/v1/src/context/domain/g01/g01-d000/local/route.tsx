import DomainG01D01P00Route from '../g01-d01-p00-test/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG01D01P00Route, routePath: routePath },
];

const DomainG01D000 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG01D000;
