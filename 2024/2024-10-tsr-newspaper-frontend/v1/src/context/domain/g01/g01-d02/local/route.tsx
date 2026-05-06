import DomainG01D02P01Route from '../g01-d02-p01-post/route';


import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG01D02P01Route, routePath: routePath },


];

const DomainG01D02 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default DomainG01D02;

