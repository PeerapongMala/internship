import DomainG00D01P01Route from '../g00-d01-p01-login/route';
import DomainG00D01P02Route from '../g00-d01-p02-forgot-password/route';


import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG00D01P01Route, routePath: routePath },
  { domain: DomainG00D01P02Route, routePath: `/forgot-password`},

];

const DomainG00D01 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default DomainG00D01;




