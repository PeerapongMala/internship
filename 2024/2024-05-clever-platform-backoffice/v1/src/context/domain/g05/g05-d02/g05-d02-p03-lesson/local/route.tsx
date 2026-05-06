import DomainG05D03P02P00Route from '../g05-d02-p03-p02-lesson/route';
import DomainG05D03P03P03Route from '../g05-d02-p03-p03-sublesson/route';
import DomainG05D03P03P04Route from '../g05-d02-p03-p04-sublesson-level/route';
import DomainG05D03P03P05Route from '../g05-d02-p03-p05-sublesson-level-get/route';
import DomainG05D02P00Route from '../g05-d02-p03-p01-classroom/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  {
    domain: DomainG05D02P00Route,
    routePath: `${routePath}/clever/$studentId`,
  },
  {
    domain: DomainG05D03P02P00Route,
    routePath: `${routePath}/clever/$studentId/$classId`,
  },
  {
    domain: DomainG05D03P03P03Route,
    routePath: `${routePath}/clever/$studentId/$classId/subject/$subjectId/$lessonId`,
  },
  {
    domain: DomainG05D03P03P04Route,
    routePath: `${routePath}/clever/$studentId/$classId/subject/$subjectId/$lessonId/sublesson/$sublessonId`,
  },
  {
    domain: DomainG05D03P03P05Route,
    routePath: `${routePath}/clever/$studentId/$classId/subject/$subjectId/$lessonId/sublesson/$sublessonId/level/$levelId`,
  },
];

const DomainG05D02 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG05D02;
