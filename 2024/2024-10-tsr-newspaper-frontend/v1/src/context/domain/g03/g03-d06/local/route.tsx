import DomainG03D05P01Route from '../g03-d02-p01-download/route';


import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG03D05P01Route, routePath: routePath },


];

const Domaing03D05 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default Domaing03D05;

