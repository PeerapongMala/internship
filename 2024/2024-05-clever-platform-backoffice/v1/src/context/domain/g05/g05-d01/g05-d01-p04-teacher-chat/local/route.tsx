import DomainG05D01P04Route from '../g05-d01-p01-chat/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  {
    domain: DomainG05D01P04Route,
    routePath: `${routePath}`,
  },
];

const DomainG05D04 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG05D04;
