import I18NInit from './i18n';
import DomainG03D07P01 from '../g03-d07-p01-redeem-list/route';
import DomainG03D07P02 from '../g03-d07-p02-reward/route';
import DomainG03D07P03 from '../g03-d07-p03-reward-create/route';
import DomainG03D07P04 from '../g03-d07-p04-shop/route';
import DomainG03D07P05 from '../g03-d07-p05-shop-create/route';
import DomainG03D07P06 from '../g03-d07-p06-shop-edit/route';
import DomainG03D07P07 from '../g03-d07-p07-shop-history/route';

const domainList = (routePath: string) => [
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

const DomainG03D07V2 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default DomainG03D07V2;
