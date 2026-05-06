import DomainG01D06P01Route from '../g01-d06-p01-faq/route';


import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG01D06P01Route, routePath: routePath },


];

const Domaing01D06 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default Domaing01D06;

