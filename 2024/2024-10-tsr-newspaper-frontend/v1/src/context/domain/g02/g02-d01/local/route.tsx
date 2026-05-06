import DomainG02D02P01Route from '../g02-d01-p01-profile/route';
import DomainG02D02P02Route from '../g02-d01-p02-change-password/route';
import DomainG02D02P03Route from '../g02-d01-p03-payment-history/route';
import DomainG02D02P04Route from '../g02-d01-p04-annoucement-history/route';

import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG02D02P01Route, routePath: routePath },
  { domain: DomainG02D02P02Route, routePath: `${routePath}/password` },
  { domain: DomainG02D02P03Route, routePath: `${routePath}/payment-history` },
  { domain: DomainG02D02P04Route, routePath: `${routePath}/post-history` },

];

const Domaing02D01 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default Domaing02D01;

