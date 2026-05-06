import DomainG01D04P01Route from '../g01-d04-p01-about-us/route';


import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG01D04P01Route, routePath: routePath },


];

const Domaing01D04 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default Domaing01D04;

