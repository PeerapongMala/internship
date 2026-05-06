import I18NInit from './i18n';
import DomainG05D00P00Route from '../g05-d00-p00-connect-account/route';
import DomainG05D00P01Route from '../g05-d00-p01-login-teacher/route';
import DomainG05D00P02Route from '../g05-d00-p02-login-family/route';
import DomainG05D00P03Route from '../g05-d00-p03-login-student/route';
import DomainG05D00P04Route from '../g05-d00-p04-login-family-full/route';

const domainList = (routePath: string) => [
  { domain: DomainG05D00P00Route, routePath: `${routePath}` },
  { domain: DomainG05D00P01Route, routePath: `${routePath}/login-teacher` },
  { domain: DomainG05D00P02Route, routePath: `${routePath}/login-family` },
  { domain: DomainG05D00P04Route, routePath: `${routePath}/login-family-full` },

  { domain: DomainG05D00P03Route, routePath: `${routePath}/login-student` },
];

const DomainG05D00 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG05D00;
