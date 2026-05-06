import DomainG05D01P01Route from '../g05-d01-p01-teacher-dashboard/g05-d01-p01-dashboard/route';
import DomainG05D01P02RouteList from '../g05-d01-p02-teacher-homework/local/route';
import DomainG05D01P03RouteList from '../g05-d01-p03-teacher-reward/local/route';
import DomainG05D01P04Route from '../g05-d01-p04-teacher-chat/g05-d01-p01-chat/route';

import DomainG05D01P05RouteList from '../g05-d01-p05-teacher-announcement/local/route';
import DomainG05D01P06RouteList from '../g05-d01-p06-teacher-setting/local/route';

import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG05D01P01Route, routePath: `${routePath}/dashboard` },
  ...DomainG05D01P02RouteList(`${routePath}/homework`),
  ...DomainG05D01P03RouteList(`${routePath}/reward`),

  { domain: DomainG05D01P04Route, routePath: `${routePath}/chat` },
  ...DomainG05D01P05RouteList(`${routePath}/announcement`),
  ...DomainG05D01P06RouteList(`${routePath}/setting`),
];

const DomainG05D01 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default DomainG05D01;
