import DomainG01D04P00Route from '../g01-d04-p00-school/route';
import DomainG01D04P01Route from '../g01-d04-p01-school-contract/route';
import DomainG01D04P04Route from '../g01-d04-p04-school-teacher/route';
import DomainG01D04P05Route from '../g01-d04-p05-school-observer/route';
import DomainG01D04P06Route from '../g01-d04-p06-school-observer-id/route';
import DomainG01D04P07Route from '../g01-d04-p07-school-announcer/route';
import DomainG01D04P08Route from '../g01-d04-p08-school-announcer-id/route';
import DomainG01D04P09Route from '../g01-d04-p09-school-teacher-create/route';
import DomainG01D04P10Route from '../g01-d04-p10-school-teacher-id/route';
import DomainG01D04P11Route from '../g01-d04-p11-school-observer-create/route';
import DomainG01D04P12Route from '../g01-d04-p12-school-announcer-create/route';
import DomainG01D04P13Route from '../g01-d04-p13-school-playing-history/route';
import DomainG01D04P14Route from '@domain/g01/g01-d04/g01-d04-p14-playing-history-info/route.tsx';

import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG01D04P00Route, routePath: routePath },
  { domain: DomainG01D04P01Route, routePath: `${routePath}/$schoolId` },
  { domain: DomainG01D04P04Route, routePath: `${routePath}/$schoolId/teacher` },
  {
    domain: DomainG01D04P09Route,
    routePath: `${routePath}/$schoolId/teacher/create`,
  },
  {
    domain: DomainG01D04P10Route,
    routePath: `${routePath}/$schoolId/teacher/$teacherId`,
  },
  {
    domain: DomainG01D04P05Route,
    routePath: `${routePath}/$schoolId/observer`,
  },
  {
    domain: DomainG01D04P11Route,
    routePath: `${routePath}/$schoolId/observer/create`,
  },
  {
    domain: DomainG01D04P06Route,
    routePath: `${routePath}/$schoolId/observer/$observerId`,
  },
  { domain: DomainG01D04P07Route, routePath: `${routePath}/announcer` },
  {
    domain: DomainG01D04P08Route,
    routePath: `${routePath}/$schoolId/announcer/$announcerId`,
  },
  {
    domain: DomainG01D04P12Route,
    routePath: `${routePath}/$schoolId/announcer/create`,
  },
  {
    domain: DomainG01D04P13Route,
    routePath: `${routePath}/$schoolId/student/$studentId`,
  },
  {
    domain: DomainG01D04P14Route,
    routePath: `${routePath}/$schoolId/student/$studentId/history/$classId/$academicYear`,
  },
];

const DomainG01D04 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG01D04;
