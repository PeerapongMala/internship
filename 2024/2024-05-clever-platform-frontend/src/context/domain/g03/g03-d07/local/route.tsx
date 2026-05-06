import DomainG03D07P01Route from '../g03-d07-p01-chat/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG03D07P01Route, routePath: routePath + 'chat' },
];
//   // { domain: DomainG03D07, routePath: '/chat' },

const DomainG03D07 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG03D07;
