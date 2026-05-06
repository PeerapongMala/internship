import DomainG03G12P01 from '../g03-d12-p01-techer-profile/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  {
    domain: DomainG03G12P01,
    routePath: `${routePath}`,
  },
];

const DomainG03D12 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default DomainG03D12;
