import DomainG04D06P01 from '../g03-d06-p01-bug-report/route';
import DomainG04D06P02 from '../g03-d06-p02-bug-report-create/route';
import DomainG04D06P03 from '../g03-d06-p03-bug-report-edit/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  {
    domain: DomainG04D06P01,
    routePath: `${routePath}`,
  },
  {
    domain: DomainG04D06P02,
    routePath: `${routePath}/create`,
  },
  {
    domain: DomainG04D06P03,
    routePath: `${routePath}/$reportId/edit`,
  },
];

const DomainG04D06 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default DomainG04D06;
