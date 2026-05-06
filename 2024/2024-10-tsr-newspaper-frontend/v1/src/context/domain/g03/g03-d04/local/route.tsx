import DomainG03D04P01Route from '../g03-d04-p01-cover/route';


import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG03D04P01Route, routePath: routePath },


];

const Domaing03D04 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default Domaing03D04;

