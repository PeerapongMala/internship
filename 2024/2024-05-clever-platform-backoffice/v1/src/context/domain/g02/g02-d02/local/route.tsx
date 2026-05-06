import './index.css';
import I18NInit from './i18n';

import DomainG02D02P01Route from '../g02-d02-p01-manage-year/route';
import DomainG02D02P02Route from '../g02-d02-p02-manage-year-create/route';
import DomainG02D02P02UpdateRoute from '../g02-d02-p02-manage-year-update/route';
import DomainG02D02P03Route from '../g02-d02-p03-subject-group/route';
import DomainG02D02P04Route from '../g02-d02-p04-subject-group-create/route';
import DomainG02D02P04UpdateRoute from '../g02-d02-p04-subject-group-update/route';
import DomainG02D02P05Route from '../g02-d02-p05-subject-info/route';
import DomainG02D02P06Route from '../g02-d02-p06-subject-info-create/route';
import DomainG02D02P06UpdateRoute from '../g02-d02-p06-subject-info-update/route';
import DomainG02D02P07Route from '../g02-d02-p07-platform/route';
import DomainG02D02P08Route from '../g02-d02-p08-platform-create/route';
import DomainG02D02P09Route from '../g02-d02-p09-platform-update/route';

const domainList = (routePath: string) => [
  {
    domain: DomainG02D02P07Route,
    routePath: `${routePath}`,
  },
  {
    domain: DomainG02D02P07Route,
    routePath: `${routePath}/platform`,
  },
  {
    domain: DomainG02D02P08Route,
    routePath: `${routePath}/platform/create`,
  },
  {
    domain: DomainG02D02P09Route,
    routePath: `${routePath}/platform/$platformId/edit`,
  },
  {
    domain: DomainG02D02P01Route,
    routePath: `${routePath}/platform/$platformId/year`,
  },
  // { domain: DomainG02D02P01Route, routePath: `${routePath}` },
  {
    domain: DomainG02D02P02Route,
    routePath: `${routePath}/platform/$platformId/year/create`,
  },
  {
    domain: DomainG02D02P02UpdateRoute,
    routePath: `${routePath}/platform/$platformId/year/$yearId`,
  },
  {
    domain: DomainG02D02P03Route,
    routePath: `${routePath}/platform/$platformId/year/$yearId/subject-group`,
  },
  {
    domain: DomainG02D02P04Route,
    routePath: `${routePath}/platform/$platformId/year/$yearId/subject-group/create`,
  },
  {
    domain: DomainG02D02P04UpdateRoute,
    routePath: `${routePath}/platform/$platformId/year/$yearId/subject-group/$subjectGroupId`,
  }, // ? For update
  {
    domain: DomainG02D02P05Route,
    routePath: `${routePath}/platform/$platformId/year/$yearId/subject-group/$subjectGroupId/subject-info`,
  },
  {
    domain: DomainG02D02P06Route,
    routePath: `${routePath}/platform/$platformId/year/$yearId/subject-group/$subjectGroupId/subject-info/create`,
  },
  {
    domain: DomainG02D02P06UpdateRoute,
    routePath: `${routePath}/platform/$platformId/year/$yearId/subject-group/$subjectGroupId/subject-info/$subjectId`,
  },
];

const DomainG02D02 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG02D02;
