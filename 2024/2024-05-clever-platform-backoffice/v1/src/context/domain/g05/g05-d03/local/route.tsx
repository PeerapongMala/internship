import DomainG05D03P04P01Route from '../g05-d03-p04-dashboard/route';
import DomainG05D03P05P01Route from '../g05-d03-p05-homework/g05-d02-p05-p01-homework/route';
import DomainG05D03P05P02Route from '../g05-d03-p05-homework/g05-d02-p05-p02-homework-info/route';
import DomainG05D03P06P00Route from '../g05-d03-p06-setting/g05-d03-p06-p00-setting/route';

import DomainG05D03P06P01Route from '../g05-d03-p06-setting/g05-d03-p06-p01-bug-report/route';
import DomainG05D03P06P02Route from '../g05-d03-p06-setting/g05-d03-p06-p02-bug-report-create/route';
import DomainG05D03P06P03Route from '../g05-d03-p06-setting/g05-d03-p06-p03-bug-report-view/route';

import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG05D03P04P01Route, routePath: `${routePath}/clever/dashboard` },

  {
    domain: DomainG05D03P05P01Route,
    routePath: `${routePath}/clever/homework`,
  },
  {
    domain: DomainG05D03P05P02Route,
    routePath: `${routePath}/clever/homework/student/$studentId/homework/$homeworkId`,
  },

  { domain: DomainG05D03P06P00Route, routePath: `${routePath}/clever/setting` },
  { domain: DomainG05D03P06P01Route, routePath: `${routePath}/clever/bug-report` },
  {
    domain: DomainG05D03P06P02Route,
    routePath: `${routePath}/clever/bug-report/create`,
  },
  {
    domain: DomainG05D03P06P03Route,
    routePath: `${routePath}/clever/bug-report/$bugId/view`,
  },
];

const DomainG05D03 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG05D03;
