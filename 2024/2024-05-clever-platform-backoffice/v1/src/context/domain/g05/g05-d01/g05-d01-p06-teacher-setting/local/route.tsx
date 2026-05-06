import DomainG05D01P06P02Route from '../g05-d01-p06-bug-report-create/route.tsx';
import DomainG05D01P06P03Route from '../g05-d01-p06-bug-report-view/route.tsx';
import DomainG05D01P06P01Route from '../g05-d01-p06-bug-report/route.tsx';
import DomainG05D01P06P00Route from '../g05-d01-p06-setting/route.tsx';
import DomainG05D01P06P04Route from '../g05-d01-p06-techer-profile/route.tsx';
import I18NInit from './i18n/index.ts';

const DomainG05D01P06RouteList = (routePath: string) => [
  //bug-report
  {
    domain: DomainG05D01P06P00Route,
    routePath: `${routePath}/setting`,
  },
  {
    domain: DomainG05D01P06P01Route,
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
  {
    domain: DomainG05D01P06P04Route,
    routePath: `${routePath}/teacher-profile`,
  },
];

export default DomainG05D01P06RouteList;
