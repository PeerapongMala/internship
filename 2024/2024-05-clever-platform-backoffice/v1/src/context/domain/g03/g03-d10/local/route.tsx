import DomainG03D10P00Route from '../g03-d10-p00-announcement/route.tsx';
import DomainG03D10P01Route from '../g03-d10-p01-announcement-add/route.tsx';
import DomainG03D10P02Route from '../g03-d10-p02-announcement-edit/route.tsx';

import I18NInit from './i18n/index.ts';

const domainList = (routePath: string) => [
  { domain: DomainG03D10P00Route, routePath: routePath },
  { domain: DomainG03D10P01Route, routePath: `${routePath}/add` },
  { domain: DomainG03D10P02Route, routePath: `${routePath}/edit/$announceId` },
];

const DomainG03D10 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG03D10;
