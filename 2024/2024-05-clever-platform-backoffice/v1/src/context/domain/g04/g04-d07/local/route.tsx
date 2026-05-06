import DomainG04G07P01 from '../g04-d07-p01-profile/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  {
    domain: DomainG04G07P01,
    routePath: `${routePath}`,
  },
];

const DomainG04D07 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default DomainG04D07;
