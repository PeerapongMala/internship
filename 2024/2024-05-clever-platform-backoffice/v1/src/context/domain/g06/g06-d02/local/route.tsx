import './index.css';

import I18NInit from './i18n';
import DomainG06D02P01Route from '../g06-d02-p01-evaluation-form/route';
import DomainG06D02P02Route from '../g06-d02-p02-evaluation-form-create/route';
import DomainG06D02P03Route from '../g06-d02-p03-evaluation-form-edit/route';
import DomainG06D02P04Route from '../g06-d02-p04-info/route';
import DomainG06D02P05Route from '../g06-d02-p05-evaluation-form-report/route';

const domainList = (routePath: string) => [
  { domain: DomainG06D02P01Route, routePath: `${routePath}` },
  { domain: DomainG06D02P02Route, routePath: `${routePath}/create` },
  { domain: DomainG06D02P03Route, routePath: `${routePath}/edit/$evaluation_form_id` },
  { domain: DomainG06D02P04Route, routePath: `${routePath}/info/$evaluation_form_id` },
  { domain: DomainG06D02P05Route, routePath: `${routePath}/report/$evaluation_form_id` },
];

const DomainG06D02 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG06D02;
