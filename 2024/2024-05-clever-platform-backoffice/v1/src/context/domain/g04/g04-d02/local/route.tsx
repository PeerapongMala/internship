import I18NInit from './i18n';
import DomainG04D02P00Route from '../g04-d02-p00-item/route';
import DomainG04D02P01Route from '../g04-d02-p01-item-create/route';

const domainList = (routePath: string) => [
  { domain: DomainG04D02P00Route, routePath: `${routePath}` },
  { domain: DomainG04D02P00Route, routePath: `${routePath}/$itemType` },
  { domain: DomainG04D02P01Route, routePath: `${routePath}/$itemType/create` },
  { domain: DomainG04D02P01Route, routePath: `${routePath}/$itemType/$itemId` },
];

const DomainG04D02 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG04D02;
