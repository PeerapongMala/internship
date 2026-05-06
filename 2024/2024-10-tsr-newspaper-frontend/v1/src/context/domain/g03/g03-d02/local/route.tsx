import DomainG03D02P02Route from '../g03-d02-01-banner/route';


import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG03D02P02Route, routePath: routePath },


];

const Domaing03D02 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default Domaing03D02;

