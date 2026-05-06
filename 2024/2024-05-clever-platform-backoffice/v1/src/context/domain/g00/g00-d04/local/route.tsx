import DomainG01D01P00Route from '../g01-d01-p00-components/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG01D01P00Route, routePath: routePath },
];

const DomainG01D004 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG01D004;
