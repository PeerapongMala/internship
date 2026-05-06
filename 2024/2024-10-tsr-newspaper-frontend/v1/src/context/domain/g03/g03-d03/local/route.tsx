import DomainG03D03P01Route from '../g03-d02-p01-faq/route';


import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG03D03P01Route, routePath: routePath },


];

const Domaing03D03 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default Domaing03D03;

