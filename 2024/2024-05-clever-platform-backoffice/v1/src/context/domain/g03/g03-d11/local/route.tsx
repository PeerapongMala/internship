import I18NInit from './i18n';
import DomainG03D11P01Route from '../g03-d11-p00-chat/route';

const domainList = (routePath: string) => [
  {
    domain: DomainG03D11P01Route,
    routePath: `${routePath}`,
  },
];

const DomainG03D11 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG03D11;
