import DomainG00D02P01Route from '../g00-d02-p01-signup/route';


import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG00D02P01Route, routePath: routePath },
];

const DomainG00D02 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default DomainG00D02;




