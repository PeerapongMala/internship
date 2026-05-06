import DomainG03D09P00Route from '../g03-d09-p00-year/route';
import DomainG03D09P01Route from '../g03-d09-p01-shop/route';
import DomainG03D09P02Route from '../g03-d09-p02-shop-form/route';
import DomainG03D09P03Route from '../g03-d09-p03-shop-history/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG03D09P00Route, routePath: `${routePath}` },
  { domain: DomainG03D09P01Route, routePath: `${routePath}/$subjectId` },
  { domain: DomainG03D09P01Route, routePath: `${routePath}/$subjectId/$itemType` },
  { domain: DomainG03D09P02Route, routePath: `${routePath}/$subjectId/$itemType/create` },
  {
    domain: DomainG03D09P02Route,
    routePath: `${routePath}/$subjectId/$itemType/$storeItemId`,
  },
  {
    domain: DomainG03D09P03Route,
    routePath: `${routePath}/$subjectId/$itemType/$storeItemId/history`,
  },
];

const DomainG03D09 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG03D09;
