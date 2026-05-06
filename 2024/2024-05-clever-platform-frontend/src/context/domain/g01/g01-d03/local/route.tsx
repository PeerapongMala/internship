import DomainG01D03P01GameInitRoute from '../g01-d03-p01-game-init/route';
import DomainG01D03P01LoadModelRoute from '../g01-d03-p01-load-model/route';
import DomainG01D03P01VersionUpdateRoute from '../g01-d03-p01-version-update/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG01D03P01VersionUpdateRoute, routePath: routePath + 'version-update' },
  { domain: DomainG01D03P01GameInitRoute, routePath: routePath + 'game-init' },
  { domain: DomainG01D03P01GameInitRoute, routePath: routePath }, // Home page
  { domain: DomainG01D03P01LoadModelRoute, routePath: routePath + 'load-model' },
];

const DomainG01D03 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG01D03;
