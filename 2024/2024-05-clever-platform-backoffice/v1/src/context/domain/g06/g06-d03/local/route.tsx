import './index.css';

import I18NInit from './i18n';
import DomainG06D03P01Route from '../g06-d03-p01-data-entry/route';
import DomainG06D03P02Route from '../g06-d03-p02-data-entry-edit/route';
import DomainG06D03P03Route from '../g06-d03-p03-data-entry-history/route';
import DomainG06D03P04Route from '../g06-d03-p04-data-entry-compare/route';
import DomainG06D03P05Route from '../g06-d03-p05-data-entry-view-mode/route';

const domainList = (routePath: string) => [
  { domain: DomainG06D03P01Route, routePath: `${routePath}` },
  { domain: DomainG06D03P02Route, routePath: `${routePath}/$sheetId` },
  { domain: DomainG06D03P03Route, routePath: `${routePath}/$sheetId/history` },
  { domain: DomainG06D03P04Route, routePath: `${routePath}/compare` },
  { domain: DomainG06D03P05Route, routePath: `${routePath}/view-mode` },
];

const DomainG06D03 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG06D03;
