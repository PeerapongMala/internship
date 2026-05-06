import DomainG03D07P01 from '../g03-d07-p01-reward/route';
import DomainG03D07P02 from '../g03-d07-p02-reward-create/route';
import DomainG03D07P03 from '../g03-d07-p03-reward-edit/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  {
    domain: DomainG03D07P01,
    routePath: `${routePath}`,
  },
  {
    domain: DomainG03D07P02,
    routePath: `${routePath}/create`,
  },
];

const DomainG03D07 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default DomainG03D07;
