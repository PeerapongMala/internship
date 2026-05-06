import DomainG01D02P00Route from '../g01-d02-p00-affiliation/route';
import DomainG01D02P01Route from '../g01-d02-p01-affiliation-create/route';
import DomainG01D02P02Route from '../g01-d02-p02-affiliation-edit/route';
import DomainG01D02P03Route from '../g01-d02-p03-affiliation-contract/route';
import DomainG01D02P04Route from '../g01-d02-p04-affiliation-contract-create/route';
import DomainG01D02P05Route from '../g01-d02-p05-affiliation-contract-edit/route';
import DomainG01D02P06Route from '../g01-d02-p06-curriculum/route';
import DomainG01D02P07Route from '../g01-d02-p07-curriculum-form/route';
import DomainG01D02P08Route from '../g01-d02-p08-year/route';
import DomainG01D02P09Route from '../g01-d02-p09-year-form/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG01D02P00Route, routePath: routePath },
  { domain: DomainG01D02P01Route, routePath: `${routePath}/create` },
  { domain: DomainG01D02P02Route, routePath: `${routePath}/$affiliationId` },
  { domain: DomainG01D02P03Route, routePath: `${routePath}/$affiliationId/contract` },
  {
    domain: DomainG01D02P04Route,
    routePath: `${routePath}/$affiliationId/contract/create`,
  },
  {
    domain: DomainG01D02P05Route,
    routePath: `${routePath}/$affiliationId/contract/$contractId`,
  },
  { domain: DomainG01D02P06Route, routePath: '/admin/curriculum' },
  { domain: DomainG01D02P07Route, routePath: '/admin/curriculum/create' },
  { domain: DomainG01D02P07Route, routePath: '/admin/curriculum/$curriculumGroupId' },
  { domain: DomainG01D02P08Route, routePath: '/admin/year' },
  { domain: DomainG01D02P09Route, routePath: '/admin/year/create' },
  { domain: DomainG01D02P09Route, routePath: '/admin/year/$yearId' },
];

const DomainG01D02 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG01D02;
