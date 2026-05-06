import DomainG04D05P01 from '../g04-d05-p01-redeem/route';
import DomainG04D05P02 from '../g04-d05-p02-redeem-create/route';
import DomainG04D05P03 from '../g04-d05-p03-redeem-edit/route';
import DomainG04D05P04 from '../g04-d05-p04-redeem-history/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  {
    domain: DomainG04D05P01,
    routePath: `${routePath}`,
  },
  {
    domain: DomainG04D05P02,
    routePath: `${routePath}/create`,
  },
  {
    domain: DomainG04D05P03,
    routePath: `${routePath}/$redeemId/edit`,
  },
  {
    domain: DomainG04D05P04,
    routePath: `${routePath}/$historyId/history`,
  },
];

const DomainG04D05 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default DomainG04D05;
