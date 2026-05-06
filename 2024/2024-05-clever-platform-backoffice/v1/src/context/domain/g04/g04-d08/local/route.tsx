import DomainG04D08P01 from '../g04-d08-p01-chat-config/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  {
    domain: DomainG04D08P01,
    routePath: `${routePath}`,
  },
];

const DomainG04D08 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default DomainG04D08;
