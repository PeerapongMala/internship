import './index.css';

import I18NInit from './i18n';
import DomainG07D00P00Route from '../g01-d07-p01-p04-user-account/route';
import DomainG07D00P01Route from '../g07-d00-p01-edit-user/route';
const domainList = (routePath: string) => [
  { domain: DomainG07D00P00Route, routePath: `${routePath}` },
  { domain: DomainG07D00P01Route, routePath: `${routePath}/$userId` },
  { domain: DomainG07D00P01Route, routePath: `${routePath}/parent/$userId` },
  { domain: DomainG07D00P01Route, routePath: `${routePath}/observer/$userId` },
  { domain: DomainG07D00P01Route, routePath: `${routePath}/content-creator/$userId` },
  { domain: DomainG07D00P01Route, routePath: `${routePath}/create` },
  { domain: DomainG07D00P01Route, routePath: `${routePath}/parent/create` },
  { domain: DomainG07D00P01Route, routePath: `${routePath}/observer/create` },
  { domain: DomainG07D00P01Route, routePath: `${routePath}/content-creator/create` },
];

const DomainG01D07 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG01D07;
