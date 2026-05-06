import DomainG06D06P01Route from '../g06-d06-p01-student-records/route';
import DomainG06D06P02Route from '../g06-d06-p02-phorpor6/route';
import DomainG06D06P03Route from '../g06-d06-p03-phorpor6-report/route';
import DomainG06D06P04Route from '../g06-d06-p04-phorpor6-certificate/route';
import DomainG06D06P05Route from '../g06-d06-p05-phorpor6-report-recommend/route';
import DomainG06D06P06Route from '../g06-d06-p06-phorpor6-report-information/route';
import DomainG06D06P07Route from '../g06-d06-p07-phorpor6-report-assessment/route';
import DomainG06D06P08Route from '../g06-d06-p08-phorpor6-report-feedback/route';
import DomainG06D06P09Route from '../g06-d06-p09-phorpor6-student-report-form/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG06D06P01Route, routePath: `${routePath}/student-records` },
  { domain: DomainG06D06P02Route, routePath: `${routePath}/student-records/$id` },
  { domain: DomainG06D06P03Route, routePath: `${routePath}/student-records/$id/report` },
  {
    domain: DomainG06D06P04Route,
    routePath: `${routePath}/student-records/$id/certificate`,
  },
  {
    domain: DomainG06D06P05Route,
    routePath: `${routePath}/student-records/$id/report/recommend`,
  },
  {
    domain: DomainG06D06P06Route,
    routePath: `${routePath}/student-records/$id/report/information`,
  },
  {
    domain: DomainG06D06P07Route,
    routePath: `${routePath}/student-records/$id/report/assessment`,
  },
  {
    domain: DomainG06D06P08Route,
    routePath: `${routePath}/student-records/$id/report/feedback`,
  },
  {
    domain: DomainG06D06P09Route,
    routePath: `${routePath}/student-records/report-form/$id`,
  },
];

const DomainG06D06 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG06D06;
