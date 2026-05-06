import DomainG01D05P01Route from '../g01-d05-p01-contact/route';


import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG01D05P01Route, routePath: routePath },


];

const Domaing01D05 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default Domaing01D05;

