import DomainG03D09P01ReportBugRoute from '../g03-d09-p01-report-bug/route';
import I18NInit from './i18n';
const domainList = (routePath: string) => [
  // { domain: DomainG01D01P01Route, routePath: routePath },
  {
    domain: DomainG03D09P01ReportBugRoute,
    routePath: routePath + 'report-bug',
  },
];
//   // { domain: DomainG03D09, routePath: '/report-bug' },

const DomainG03D09 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG03D09;
