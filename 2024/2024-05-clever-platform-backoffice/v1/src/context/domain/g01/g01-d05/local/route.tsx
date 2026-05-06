import DomainG01D05P00Route from '../g01-d05-p00-classroom/route';
import DomainG01D05P01Route from '../g01-d05-p01-classroom-create/route';
import DomainG01D05P02Route from '../g01-d05-p02-classroom-teacher/route';
import DomainG01D05P03Route from '../g01-d05-p03-classroom-student/route';
import DomainG01D05P04Route from '../g01-d05-p04-classroom-edit/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  // { domain: DomainG01D05P00Route, routePath: routePath },
  { domain: DomainG01D05P01Route, routePath: `${routePath}/create` },
  {
    domain: DomainG01D05P02Route,
    routePath: `${routePath}/$classroomId/teacher`,
  },
  {
    domain: DomainG01D05P03Route,
    routePath: `${routePath}/$classroomId/student`,
  },
  { domain: DomainG01D05P04Route, routePath: `${routePath}/$classroomId` },
];

const DomainG01D05 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG01D05;
