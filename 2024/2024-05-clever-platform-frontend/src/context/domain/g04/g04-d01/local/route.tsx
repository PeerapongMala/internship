import DomainG04D01P01LessonRoute from '../g04-d01-p01-lesson/route';
import DomainG04D01P02LessonStateRoute from '../g04-d01-p02-lesson-state/route';
import DomainG04D01P03LessonInfoRoute from '../g04-d01-p03-lesson-info/route';
import DomainG04D01P04SublessonRoute from '../g04-d01-p04-sublesson/route';
import DomainG04D01P05SublessonInfoRoute from '../g04-d01-p05-sublesson-info/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG04D01P01LessonRoute, routePath: routePath + 'lesson' },
  {
    domain: DomainG04D01P02LessonStateRoute,
    routePath: routePath + 'lesson-state/$subjectId',
  },
  {
    domain: DomainG04D01P03LessonInfoRoute,
    routePath: routePath + 'lesson-info/$lessonId',
  },
  {
    domain: DomainG04D01P04SublessonRoute,
    routePath: routePath + 'sublesson/$lessonId',
  },
  {
    domain: DomainG04D01P05SublessonInfoRoute,
    routePath: routePath + 'sublesson-info/$sublessonId',
  },
];

const DomainG04D01 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG04D01;
