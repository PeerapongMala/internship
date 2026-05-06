import DomainG01D06P01Route from '../g01-d06-p00-subject-teacher-edit/route';
import DomainG01D06P00Route from '../g01-d06-p00-subject-teacher/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  // { domain: DomainG01D06P00Route, routePath: routePath },
  { domain: DomainG01D06P01Route, routePath: `${routePath}/$subjectId` },
];

const DomainG01D06 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG01D06;
