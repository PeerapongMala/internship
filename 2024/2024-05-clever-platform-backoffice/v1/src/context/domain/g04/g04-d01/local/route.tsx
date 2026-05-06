import I18NInit from './i18n';
import DomainG04D01P00Route from '../g04-d01-p00-announement/route';
import DomainG04D01P01Route from '../g04-d01-p01-announement-create/route';

const domainList = (routePath: string) => [
  { domain: DomainG04D01P00Route, routePath: `${routePath}` },
  { domain: DomainG04D01P00Route, routePath: `${routePath}/$announceType` },
  { domain: DomainG04D01P01Route, routePath: `${routePath}/$announceType/create` },
  { domain: DomainG04D01P01Route, routePath: `${routePath}/$announceType/$announceId` },
];

const DomainG04D01 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG04D01;
