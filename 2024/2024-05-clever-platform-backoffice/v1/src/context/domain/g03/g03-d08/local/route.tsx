import DomainG03D08P00Route from '../g03-d08-p00-year/route';
import DomainG03D08P01Route from '../g03-d08-p01-item/route';
import DomainG03D08P02Route from '../g03-d08-p02-item-create/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG03D08P00Route, routePath: `${routePath}` },
  { domain: DomainG03D08P01Route, routePath: `${routePath}/$subjectId` },
  { domain: DomainG03D08P01Route, routePath: `${routePath}/$subjectId/$itemType` },
  { domain: DomainG03D08P02Route, routePath: `${routePath}/$subjectId/$itemType/create` },
  {
    domain: DomainG03D08P02Route,
    routePath: `${routePath}/$subjectId/$itemType/$itemId`,
  },
];

const DomainG03D08 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG03D08;
