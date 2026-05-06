import DomainG05D01P05P00Route from '../g05-d01-p05-announcement/route.tsx';
import DomainG05D01P05P01Route from '../g05-d01-p05-announcement-add/route.tsx';
import DomainG05D01P05P02Route from '../g05-d01-p05-announcement-edit/route.tsx';

import I18NInit from './i18n/index.ts';

const DomainG05D01P05RouteList = (routePath: string) => [
  { domain: DomainG05D01P05P00Route, routePath: routePath },
  { domain: DomainG05D01P05P01Route, routePath: `${routePath}/add` },
  { domain: DomainG05D01P05P02Route, routePath: `${routePath}/edit/$announceId` },
];

// const DomainG05D01P05 = {
//   domainList: domainList,
//   i18NInit: I18NInit,
// };
export default DomainG05D01P05RouteList;
