import DomainG01D03P01Route from '../g01-d03-p01-download/route';


import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG01D03P01Route, routePath: routePath },


];

const Domaing01D03 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default Domaing01D03;

