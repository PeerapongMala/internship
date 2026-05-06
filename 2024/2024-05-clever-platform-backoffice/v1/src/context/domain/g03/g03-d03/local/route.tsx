import DomainG03D03P00Route from '@domain/g03/g03-d03/g03-d03-p00-teacher-student-group/route';
import DomainG03D03P01Route from '@domain/g03/g03-d03/g03-d03-p01-teacher-student-group-edit/route';
import DomainG03D03P02Route from '@domain/g03/g03-d03/g03-d03-p02-teacher-student-group-create/route';

import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG03D03P00Route, routePath: `${routePath}` },
  { domain: DomainG03D03P01Route, routePath: `${routePath}/$studentGroupId/edit` },
  { domain: DomainG03D03P02Route, routePath: `${routePath}/create` },
];

const DomainG03D03 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG03D03;
