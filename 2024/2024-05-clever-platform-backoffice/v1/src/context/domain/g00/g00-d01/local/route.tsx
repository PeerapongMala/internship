import DomainG00D01P01Route from '../g00-d01-p01-bug-report/route.tsx';
import DomainG05D01P06P02Route from '../g00-d01-p02-bug-report-create/route.tsx';
import DomainG05D01P06P03Route from '../g00-d01-p03-bug-report-view/route.tsx';
import I18NInit from './i18n/index.ts';

const domainList = (routePath: string) => [
  //bug-report
  {
    domain: DomainG00D01P01Route,
    routePath: `${routePath}/bug-report`,
  },
  {
    domain: DomainG05D01P06P02Route,
    routePath: `${routePath}/bug-report/create`,
  },
  {
    domain: DomainG05D01P06P03Route,
    routePath: `${routePath}/bug-report/$bugId/view`,
  },
];
const DomainG00D01PRouteBugReport = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default DomainG00D01PRouteBugReport;
