import DomainG01D01P01Route from '../g01-d01-p01-report-progress-dashboard/route';
import DomainG01D01P03Route from '../g01-d01-p03-provincial-dashboard/route.tsx';
import DomainG01D01P04Route from '../g01-d01-p04-school-stat/route.tsx';
import DomainG01D01P05Route from '../g01-d01-p04-progress-table-obec/route.tsx';
import DomainG01D01P06Route from '../g01-d01-p05-progress-table-obec-district/route.tsx';
import DomainG01D01P07Route from '../g01-d01-p06-progress-table-obec-area/route.tsx';
import DomainG01D01P08Route from '../g01-d01-p07-progress-table-obec-school/route.tsx';
import DomainG01D01P09Route from '../g01-d01-p08-progress-table-doe/route.tsx';
import DomainG01D01P10Route from '../g01-d01-p09-progress-table-doe-district_group/route.tsx';
import DomainG01D01P11Route from '../g01-d01-p10-progress-table-doe-district/route.tsx';
import DomainG01D01P12Route from '../g01-d01-p11-progress-table-doe-school/route.tsx';
import DomainG01D01P13Route from '../g01-d01-p13-progress-table-lao/route.tsx';
import I18NInit from './i18n';
import DomainG01D01P14Route from '../g01-d01-p14-progress-table-lao-province/route.tsx';
import DomainG01D01P15Route from '../g01-d01-p15-progress-table-lao-district/route.tsx';
import DomainG01D01P16Route from '../g01-d01-p16-progress-table-lao-school/route.tsx';
import DomainG01D01P17Route from '../g01-d01-p17-progress-table-opec/route.tsx';
import DomainG01D01P18Route from '../g01-d01-p18-progress-table-opec-school/route.tsx';
import DomainG01D01P19Route from '../g01-d01-p19-progress-table-other/route.tsx';
import DomainG01D01P20Route from '../g01-d01-p20-progress-table-other-school/route.tsx';
import DomainG01D01P22Route from '../g01-d01-p22-school-stat-class/route.tsx';
import DomainG01D01P23Route from '../g01-d01-p23-school-stat-student/route.tsx';
import DomainG01D01P24Route from '../g01-d01-p24-school-stat-lesson/route.tsx';
import DomainG01D01P25Route from '../g01-d01-p25-school-stat-sub-lesson/route.tsx';
import DomainG01D01P26Route from '../g01-d01-p26-school-stat-level/route.tsx';
import DomainG01D01P27Route from '../g01-d01-p27-school-stat-level-play-log/route.tsx';
import DomainG01D01P28Route from '../g01-d01-p28-overall-statistics-summary/route.tsx';

const domainList = (routePath: string) => [
  { domain: DomainG01D01P01Route, routePath: `${routePath}/progress-dashboard` },

  { domain: DomainG01D01P05Route, routePath: `${routePath}/report-obec` },
  {
    domain: DomainG01D01P06Route,
    routePath: `${routePath}/report-obec/$district_zone`,
  },
  {
    domain: DomainG01D01P07Route,
    routePath: `${routePath}/report-obec/$district_zone/$area_office`,
  },
  {
    domain: DomainG01D01P08Route,
    routePath: `${routePath}/report-obec/$district_zone/$area_office/$school`,
  },
  { domain: DomainG01D01P09Route, routePath: `${routePath}/report-doe` },
  {
    domain: DomainG01D01P10Route,
    routePath: `${routePath}/report-doe/$district_group`,
  },
  {
    domain: DomainG01D01P11Route,
    routePath: `${routePath}/report-doe/$district_group/$district`,
  },
  {
    domain: DomainG01D01P12Route,
    routePath: `${routePath}/report-doe/$district_group/$district/$school`,
  },
  { domain: DomainG01D01P13Route, routePath: `${routePath}/report-lao` },
  { domain: DomainG01D01P14Route, routePath: `${routePath}/report-lao/$province` },
  {
    domain: DomainG01D01P15Route,
    routePath: `${routePath}/report-lao/$province/$district`,
  },
  {
    domain: DomainG01D01P16Route,
    routePath: `${routePath}/report-lao/$province/$district/$school`,
  },
  { domain: DomainG01D01P17Route, routePath: `${routePath}/report-opec` },
  { domain: DomainG01D01P18Route, routePath: `${routePath}/report-opec/$school` },
  { domain: DomainG01D01P19Route, routePath: `${routePath}/report-other` },
  { domain: DomainG01D01P20Route, routePath: `${routePath}/report-other/$school` },

  { domain: DomainG01D01P03Route, routePath: `${routePath}/provincial-dashboard` },
  // SchoolStat
  { domain: DomainG01D01P04Route, routePath: `${routePath}/school-stat` },
  {
    domain: DomainG01D01P22Route,
    routePath: `${routePath}/school-stat/school/$schoolId`,
  },
  {
    domain: DomainG01D01P23Route,
    routePath: `${routePath}/school-stat/school/$schoolId/class/$classId`,
  },
  {
    domain: DomainG01D01P24Route,
    routePath: `${routePath}/school-stat/school/$schoolId/class/$classId/student/$studentId`,
  },
  {
    domain: DomainG01D01P25Route,
    routePath: `${routePath}/school-stat/school/$schoolId/class/$classId/student/$studentId/lesson/$lessonId`,
  },
  {
    domain: DomainG01D01P26Route,
    routePath: `${routePath}/school-stat/school/$schoolId/class/$classId/student/$studentId/lesson/$lessonId/sub-lesson/$subLessonId`,
  },
  {
    domain: DomainG01D01P27Route,
    routePath: `${routePath}/school-stat/school/$schoolId/class/$classId/student/$studentId/lesson/$lessonId/sub-lesson/$subLessonId/level/$levelId`,
  },
  {
    domain: DomainG01D01P28Route,
    routePath: `${routePath}/overall-statistics-summary`,
  },
];

const DomainG01D101 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG01D101;
