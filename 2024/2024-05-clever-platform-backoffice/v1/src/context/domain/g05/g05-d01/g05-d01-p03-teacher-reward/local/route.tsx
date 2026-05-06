import I18NInit from './i18n';
import DomainG03D07P01 from '../g05-d01-p01-redeem-list/route';
import DomainG03D07P02 from '../g05-d01-p02-reward/route';
import DomainG03D07P03 from '../g05-d01-p03-reward-create/route';
import DomainG03D07P04 from '../g05-d01-p04-shop/route';
import DomainG03D07P05 from '../g05-d01-p05-shop-create/route';
import DomainG03D07P06 from '../g05-d01-p06-shop-edit/route';
import DomainG03D07P07 from '../g05-d01-p07-shop-history/route';

const DomainG05D01P03RouteList = (routePath: string) => [
  {
    domain: DomainG03D07P01,
    routePath: `${routePath}`,
  },
  {
    domain: DomainG03D07P02,
    routePath: `${routePath}/free`,
  },
  {
    domain: DomainG03D07P03,
    routePath: `${routePath}/free/create`,
  },
  {
    domain: DomainG03D07P04,
    routePath: `${routePath}/store/coupon`,
  },
  {
    domain: DomainG03D07P05,
    routePath: `${routePath}/store/coupon/create`,
  },
  {
    domain: DomainG03D07P06,
    routePath: `${routePath}/store/coupon/$storeItemId`,
  },
  {
    domain: DomainG03D07P07,
    routePath: `${routePath}/store/coupon/$storeItemId/history`,
  },
];

export default DomainG05D01P03RouteList;
