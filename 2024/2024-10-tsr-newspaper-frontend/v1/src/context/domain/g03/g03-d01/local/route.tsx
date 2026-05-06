import DomainG03D01P01Route from '../g03-d01-p01-annoucement/route';


import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG03D01P01Route, routePath: routePath },


];

const Domaing03D01 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default Domaing03D01;

