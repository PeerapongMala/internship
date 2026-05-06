import DomainG02D02P01Route from '../g02-d02-p01-post/route';
import DomainG02D02P02Route from '../g02-d02-p02-verify/route';

import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG02D02P01Route, routePath: routePath },
  { domain: DomainG02D02P02Route, routePath: `${routePath}/verify` },

];

const Domaing02D02 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default Domaing02D02;
