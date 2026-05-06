import I18NInit from './i18n';
import DomainG04D03P00Route from '../g04-d03-p00-shop/route';
import DomainG04D03P01Route from '../g04-d03-p01-shop-form/route';
import DomainG04D03P02Route from '../g04-d03-p02-shop-history/route';

const domainList = (routePath: string) => [
  { domain: DomainG04D03P00Route, routePath: `${routePath}` },
  { domain: DomainG04D03P00Route, routePath: `${routePath}/$itemType` },
  { domain: DomainG04D03P01Route, routePath: `${routePath}/$itemType/create` },
  { domain: DomainG04D03P01Route, routePath: `${routePath}/$itemType/$storeItemId` },
  {
    domain: DomainG04D03P02Route,
    routePath: `${routePath}/$itemType/$storeItemId/history`,
  },
];

const DomainG04D03 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG04D03;
