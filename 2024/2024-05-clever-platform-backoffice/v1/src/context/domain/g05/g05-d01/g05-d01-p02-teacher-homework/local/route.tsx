import I18NInit from './i18n';

import DomainG05D01P02P01Route from '../g05-d01-p02-template/route';
import DomainG05D01P02P02Route from '../g05-d01-p02-template-one/route';
import DomainG05D01P02P03Route from '../g05-d01-p02-template-post-template/route';
import DomainG05D01P02P04Route from '../g05-d01-p02-homework/route';
import DomainG05D01P02P05Route from '../g05-d01-p02-homework-one/route';
import DomainG05D01P02P06Route from '../g05-d01-p02-homework-post-homework/route';
import DomainG05D01P02P07Route from '../g05-d01-p02-homework-edit-homework/route';
import DomainG05D01P02P08Route from '../g05-d01-p02-template-edit-template/route';

const DomainG05D01P02RouteList = (routePath: string) => [
  // { domain: DomainG05D01P02P01Route, routePath: `${routePath}/template` },
  // { domain: DomainG05D01P02P02Route, routePath: `${routePath}/template/$subjectId` },
  // {
  //   domain: DomainG05D01P02P03Route,
  //   routePath: `${routePath}/template/$subjectId/create`,
  // },
  // { domain: DomainG05D01P02P04Route, routePath: `${routePath}/homework` },
  { domain: DomainG05D01P02P05Route, routePath: `${routePath}/homework` },
  {
    domain: DomainG05D01P02P06Route,
    routePath: `${routePath}/homework/create`,
  },
  {
    domain: DomainG05D01P02P07Route,
    routePath: `${routePath}/homework/edithomework/$homeworkId`,
  },
  // {
  //   domain: DomainG05D01P02P03Route,
  //   routePath: `${routePath}/template/$subjectId/edittemplate/$templateId`,
  // },
];

// const DomainG05D01P02 = {
//   domainList: domainList,
//   i18NInit: I18NInit,
// };
export default DomainG05D01P02RouteList;
