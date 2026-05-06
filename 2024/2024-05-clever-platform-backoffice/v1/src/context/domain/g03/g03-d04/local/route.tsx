import DomainG03D04P01Route from '@domain/g03/g03-d04/g03-d04-p01-game-statistic/route';
import DomainG03D04P02Route from '@domain/g03/g03-d04/g03-d04-p02-all-student/route';
import DomainG03D04P03Route from '@domain/g03/g03-d04/g03-d04-p03-select-student/route';
import DomainG03D04P04Route from '@domain/g03/g03-d04/g03-d04-p04-game-statistic-overview/route';
import DomainG03D04P05Route from '@domain/g03/g03-d04/g03-d04-p05-group/route';
import DomainG03D04P06Route from '@domain/g03/g03-d04/g03-d04-p06-level-overview/route';
import DomainG03D04P07Route from '@domain/g03/g03-d04/g03-d04-p07-reward/route';
import DomainG03D04P08Route from '@domain/g03/g03-d04/g03-d04-p08-teacher-comments/route';
import DomainG03D04P09Route from '@domain/g03/g03-d04/g03-d04-p09-manage-year-classroom/route';
import DomainG03D04P10Route from '@domain/g03/g03-d04/g03-d04-p10-game-statistic-lesson/route';
import DomainG03D04P11Route from '@domain/g03/g03-d04/g03-d04-p11-game-statistic-sub-lesson/route';
import DomainG03D04P12Route from '@domain/g03/g03-d04/g03-d04-p12-game-statistic-level/route';
import DomainG03D04P13Route from '@domain/g03/g03-d04/g03-d04-p13-account-pin/route';
import DomainG03D04P14Route from '@domain/g03/g03-d04/g03-d04-p14-account-student-profile/route';
import DomainG03D04P15Route from '@domain/g03/g03-d04/g03-d04-p15-account-student-pin/route';
import DomainG03D04P17Route from '@domain/g03/g03-d04/g03-d04-p17-account-student-class-history/route';
import DomainG03D04P18Route from '@domain/g03/g03-d04/g03-d04-p18-account-student-family/route';
import DomainG03D04P19Route from '@domain/g03/g03-d04/g03-d04-p19-playing-history-info/route.tsx';

import I18NInit from './i18n';

const domainList = (routePath: string) => [
  // tab สถิตินักเรียนรายบทเรียน
  { domain: DomainG03D04P01Route, routePath: `${routePath}` },
  // tab จัดการบัญชี & พิน
  { domain: DomainG03D04P13Route, routePath: `${routePath}/account-pin` },

  // tab สถิตินักเรียนรายคน
  { domain: DomainG03D04P02Route, routePath: `${routePath}/all-student` },
  { domain: DomainG03D04P03Route, routePath: `${routePath}/student-info/$studentId` },
  {
    domain: DomainG03D04P19Route,
    routePath: `${routePath}/student-info/$studentId/history/$classId/$academicYear`,
  },
  {
    domain: DomainG03D04P04Route,
    routePath: `${routePath}/all-student/$studentId/history/game-statistic-overview`,
  },
  {
    domain: DomainG03D04P05Route,
    routePath: `${routePath}/all-student/$studentId/history/group`,
  },
  {
    domain: DomainG03D04P06Route,
    routePath: `${routePath}/all-student/$studentId/history/level-overview`,
  },
  {
    domain: DomainG03D04P07Route,
    routePath: `${routePath}/all-student/$studentId/history/reward`,
  },
  {
    domain: DomainG03D04P08Route,
    routePath: `${routePath}/all-student/$studentId/history/teacher-comments`,
  },
  {
    domain: DomainG03D04P09Route,
    routePath: `${routePath}/all-student/$studentId/history/teacher-comments/add-note`,
  },

  // game-statistic-lesson
  {
    domain: DomainG03D04P10Route,
    routePath: `${routePath}/all-student/$studentId/history/game-statistic-overview/$mainLessonId`,
  },
  {
    domain: DomainG03D04P11Route,
    routePath: `${routePath}/all-student/$studentId/history/game-statistic-overview/$mainLessonId/$subLessonId`,
  },
  {
    domain: DomainG03D04P12Route,
    routePath: `${routePath}/all-student/$studentId/history/game-statistic-overview/$mainLessonId/$subLessonId/$levelId`,
  },

  // tab จัดการบัญชี & พิน > ดูข้อมูล
  { domain: DomainG03D04P14Route, routePath: `${routePath}/all-student/$studentId` },
  {
    domain: DomainG03D04P15Route,
    routePath: `${routePath}/all-student/$studentId/account-pin`,
  },
  // p16 ซ้ำ ลบแล้ว
  {
    domain: DomainG03D04P17Route,
    routePath: `${routePath}/all-student/$studentId/class-history`,
  },
  {
    domain: DomainG03D04P18Route,
    routePath: `${routePath}/all-student/$studentId/family`,
  },
];

const DomainG03D04 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG03D04;
