import DomainG03D06P01Route from '../g03-d06-p01-template/route';
import DomainG03D06P02Route from '../g03-d06-p02-template-one/route';
import DomainG03D06P03Route from '../g03-d06-p03-template-post-template/route';
import DomainG03D06P04Route from '../g03-d06-p04-homework/route';
import DomainG03D06P05Route from '../g03-d06-p05-homework-one/route';
import DomainG03D06P06Route from '../g03-d06-p06-homework-post-homework/route';
import DomainG03D06P07Route from '../g03-d06-p07-homework-edit-homework/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  // { domain: DomainG03D06P01Route, routePath: `${routePath}/template` },
  // { domain: DomainG03D06P02Route, routePath: `${routePath}/template/$subjectId` },
  // { domain: DomainG03D06P03Route, routePath: `${routePath}/template/$subjectId/create` },
  // { domain: DomainG03D14P04Route, routePath: `${routePath}/homework` },
  { domain: DomainG03D06P05Route, routePath: `${routePath}/homework` },
  { domain: DomainG03D06P06Route, routePath: `${routePath}/homework/create` },
  {
    domain: DomainG03D06P07Route,
    routePath: `${routePath}/homework/edithomework/$homeworkId`,
  },
  // {
  //   domain: DomainG03D06P03Route,
  //   routePath: `${routePath}/template/$subjectId/edittemplate/$templateId`,
  // },
];

const DomainG03D06V2 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG03D06V2;
