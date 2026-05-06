import './index.css';

import I18NInit from './i18n';
import DomainG06D07P01Route from '../g06-d07-p01-setting/route';
import DomainG06D07P02Route from '../g06-d07-p02-setting-edit-student/route';
import DomainG06D07P03Route from '../g06-d07-p03-setting-form-template/route';

const domainList = (routePath: string) => [
  { domain: DomainG06D07P01Route, routePath: `${routePath}` },
  { domain: DomainG06D07P02Route, routePath: `${routePath}/student/$student_id` },
  { domain: DomainG06D07P03Route, routePath: `${routePath}/document-template/create` },
  { domain: DomainG06D07P03Route, routePath: `${routePath}/document-template/edit/$template_id` },

];

const DomainG06D07 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG06D07;
