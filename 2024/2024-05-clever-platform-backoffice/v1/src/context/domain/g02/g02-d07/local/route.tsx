import './index.css';

import DomainG02D07P00Route from '../g02-d07-p00-profile/route';

import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG02D07P00Route, routePath: `${routePath}` },
];

const DomainG02D07 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG02D07;
