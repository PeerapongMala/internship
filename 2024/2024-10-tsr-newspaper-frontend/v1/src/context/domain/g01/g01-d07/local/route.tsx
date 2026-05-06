import DomainG01D07P01Route from '../g01-d07-p01-01/route';


import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG01D07P01Route, routePath: routePath },


];

const Domaing01D07 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default Domaing01D07;

