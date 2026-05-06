import I18NInit from './i18n';
import DomainG05D02P04P00Route from '../g05-d02-p04-account-managment/g05-d02-p04-p00-family/route';
import DomainG05D02P04P01Route from '../g05-d02-p04-account-managment/g05-d02-p04-p01-family-create/route';
import DomainG05D02P04P02Route from '../g05-d02-p04-account-managment/g05-d02-p04-p02-family-management/route';
import DomainG05D02P04P03Route from '../g05-d02-p04-account-managment/g05-d02-p04-p03-family-management-add/route';
import DomainG05D02P00P02Route from '../g05-d02-p00-login/g05-d02-p00-p02-line/route';
import DomainG05D02P00P01Route from '../g05-d02-p00-login/g05-d02-p00-p01-clever/route';
import DomainG05D02P01P01Route from '../g05-d02-p01-dashboard/g05-d02-p01-p01-dashboard/route';
import DomainG05D02P06P01Route from '../g05-d02-p06-bug-report/g05-d02-p06-p01-bug-report/route';
import DomainG05D02P05P01Route from '../g05-d02-p05-announcement/g05-d02-p05-p01-announcement/route';
import DomainG05D02P05P02Route from '../g05-d02-p05-announcement/g05-d02-p05-p02-announcement-view/route';
import DomainG05D02P01P00Route from '../g05-d02-p01-dashboard/g05-d02-p01-p00-choose-student/route';
import DomainG05D02P02P00Route from '../g05-d02-p02-homework/g05-d02-p02-p00-choose-student/route';
import DomainG05D02P02P01Route from '../g05-d02-p02-homework/g05-d02-p02-p01-homework/route';
import DomainG05D02P02P02Route from '../g05-d02-p02-homework/g05-d02-p02-p02-homework-info/route';
//line-parent
import DomainG05D02P03P00Route from '../g05-d02-p03-lesson/g05-d02-p03-p00-choose-student/route';
import DomainG05D02P03P01Route from '../g05-d02-p03-lesson/g05-d02-p03-p01-classroom/route';
import DomainG05D02P03P02Route from '../g05-d02-p03-lesson/g05-d02-p03-p02-lesson/route';
import DomainG05D02P03P03Route from '../g05-d02-p03-lesson/g05-d02-p03-p03-sublesson/route';
import DomainG05D02P03P04Route from '../g05-d02-p03-lesson/g05-d02-p03-p04-sublesson-level/route';
import DomainG05D02P03P05Route from '../g05-d02-p03-lesson/g05-d02-p03-p05-sublesson-level-get/route';
import DomainG05D02P06P02Route from '../g05-d02-p06-bug-report/g05-d02-p06-p02-bug-report-create/route';
import DomainG05D02P06P03Route from '../g05-d02-p06-bug-report/g05-d02-p06-p03-bug-report-view/route';
import DomainG05D02P05P00Route from '../g05-d02-p05-announcement/g05-d02-p05-p00-choose-student/route';

const domainList = (routePath: string) => [
  { domain: DomainG05D02P00P02Route, routePath: `${routePath}/line/login` },
  { domain: DomainG05D02P00P01Route, routePath: `${routePath}/clever/login` },

  //dashboard
  {
    domain: DomainG05D02P01P00Route,
    routePath: `${routePath}/clever/dashboard/choose-student`,
  },
  {
    domain: DomainG05D02P01P01Route,
    routePath: `${routePath}/clever/dashboard/$user_id`,
  },

  //homework
  {
    domain: DomainG05D02P02P00Route,
    routePath: `${routePath}/clever/homework/choose-student`,
  },
  {
    domain: DomainG05D02P02P01Route,
    routePath: `${routePath}/clever/homework/student/$studentId`,
  },
  {
    domain: DomainG05D02P02P02Route,
    routePath: `${routePath}/clever/homework/student/$studentId/homework/$homeworkId`,
  },

  //lesson
  { domain: DomainG05D02P03P00Route, routePath: `${routePath}/choose-student` },
  {
    domain: DomainG05D02P03P01Route,
    routePath: `${routePath}/clever/$studentId`,
  },
  {
    domain: DomainG05D02P03P02Route,
    routePath: `${routePath}/clever/$studentId/$classId`,
  },
  {
    domain: DomainG05D02P03P03Route,
    routePath: `${routePath}/clever/$studentId/$classId/subject/$subjectId/$lessonId`,
  },
  {
    domain: DomainG05D02P03P04Route,
    routePath: `${routePath}/clever/$studentId/$classId/subject/$subjectId/$lessonId/sublesson/$sublessonId`,
  },

  {
    domain: DomainG05D02P03P05Route,
    routePath: `${routePath}/clever/$studentId/$classId/subject/$subjectId/$lessonId/sublesson/$sublessonId/level/$levelId`,
  },

  //management account
  { domain: DomainG05D02P04P00Route, routePath: `${routePath}/family` },
  { domain: DomainG05D02P04P01Route, routePath: `${routePath}/family/create` },
  {
    domain: DomainG05D02P04P02Route,
    routePath: `${routePath}/family/$family_id/management`,
  },
  {
    domain: DomainG05D02P04P03Route,
    routePath: `${routePath}/family/add/member`,
  },

  //announcement
  {
    domain: DomainG05D02P05P00Route,
    routePath: `${routePath}/clever/announcement/choose-student`,
  },
  {
    domain: DomainG05D02P05P01Route,
    routePath: `${routePath}/clever/announcement/student/$user_id`,
  },
  {
    domain: DomainG05D02P05P02Route,
    routePath: `${routePath}/clever/announcement/student/$user_id/announcement/$announcementId`,
  },

  //bug-report
  {
    domain: DomainG05D02P06P01Route,
    routePath: `${routePath}/clever/bug-report`,
  },
  {
    domain: DomainG05D02P06P02Route,
    routePath: `${routePath}/clever/bug-report/create`,
  },
  {
    domain: DomainG05D02P06P03Route,
    routePath: `${routePath}/clever/bug-report/$bugId/view`,
  },
];

const DomainG05D02 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG05D02;
