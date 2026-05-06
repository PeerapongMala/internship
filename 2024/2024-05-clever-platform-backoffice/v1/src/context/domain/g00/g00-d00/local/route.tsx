import DomainG00D00P01Route from '../g00-d00-p01-login/route';
import DomainG00D00P02Route from '../g00-d00-p02-curriculum/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG00D00P01Route, routePath: routePath },
  { domain: DomainG00D00P02Route, routePath: `/curriculum` },
];

const DomainG00D00 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG00D00;
