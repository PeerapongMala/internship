import './index.css';

import DomainG06D01P01Route from '../g06-d01-p01-setting-template/route';
import DomainG06D01P02Route from '../g06-d01-p02-template-create-and-edit/route';
import DomainG06D01P03Route from '../g06-d01-p03-template-info/route';
import DomainG06D01P04Route from '../g06-d01-p04-template-general-create-and-edit/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG06D01P01Route, routePath: `${routePath}/template` },
  { domain: DomainG06D01P02Route, routePath: `${routePath}/template/create` },
  { domain: DomainG06D01P02Route, routePath: `${routePath}/template/edit/$template_id` },
  { domain: DomainG06D01P03Route, routePath: `${routePath}/template/info/$template_id` },
  { domain: DomainG06D01P04Route, routePath: `${routePath}/template/general/create` },
  { domain: DomainG06D01P04Route, routePath: `${routePath}/template/general/edit/$id` },
];

const DomainG06D01 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG06D01;
