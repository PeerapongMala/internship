import DomainG03D05P01Route from '../g03-d05-p01-lesson/route';
import DomainG03D05P02Route from '../g03-d05-p02-sublesson/route';
import DomainG03D05P03Route from '../g03-d05-p03-sublesson-level/route';
import DomainG03D05P04Route from '../g03-d05-p04-sublesson-level-get/route';
import DomainG03D05P00Route from '../g03-d05-p00-classroom/route';
import I18NInit from './i18n';
import DomainG03D05P05Route from '../g03-d05-p05-extra-get/route';

const domainList = (routePath: string) => [
  // /teacher/lesson
  { domain: DomainG03D05P00Route, routePath: `${routePath}` },

  { domain: DomainG03D05P01Route, routePath: `${routePath}/$classId` },

  // /teacher/lesson/:extra
  {
    domain: DomainG03D05P05Route,
    routePath: `${routePath}/$classId/subject/$subjectId/extra/$extraId`,
  },
  // /teacher/lesson/:lessonId
  {
    domain: DomainG03D05P02Route,
    routePath: `${routePath}/$classId/subject/$subjectId/$lessonId`,
  },

  // /teacher/lesson/:lessonId/sublesson/:sublessonId
  {
    domain: DomainG03D05P03Route,
    routePath: `${routePath}/$classId/subject/$subjectId/$lessonId/sublesson/$sublessonId`,
  },

  // /teacher/lesson/:lessonId/sublesson/:sublessonId/level/:levelId
  {
    domain: DomainG03D05P04Route,
    routePath: `${routePath}/$classId/subject/$subjectId/$lessonId/sublesson/$sublessonId/level/$levelId`,
  },
];

const DomainG03D05 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG03D05;
