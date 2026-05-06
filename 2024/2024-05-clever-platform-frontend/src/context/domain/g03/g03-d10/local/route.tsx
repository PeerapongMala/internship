import DomainG03D10P01SettingRoute from '../g03-d10-p01-setting/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG03D10P01SettingRoute, routePath: routePath + 'setting' },
];

const DomainG03D10 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG03D10;
