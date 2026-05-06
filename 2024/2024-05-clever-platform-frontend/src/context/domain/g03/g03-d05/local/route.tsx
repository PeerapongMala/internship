import DomainG03D05P01ShopRoute from '../g03-d05-p01-shop/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG03D05P01ShopRoute, routePath: routePath + 'shop' },
];

const DomainG03D05 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG03D05;
