import DomainG02D09P01 from '../g02-d09-p01-list/route';
import DomainG02D09P02 from '../g02-d09-p02-create-edit/route';
import DomainG02D09P03 from '../g02-d09-p03-view/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  {
    domain: DomainG02D09P01,
    routePath: `${routePath}`,
  },
  {
    domain: DomainG02D09P02,
    routePath: `${routePath}/create`,
  },
  {
    domain: DomainG02D09P02,
    routePath: `${routePath}/edit/$template_id`,
  },
  {
    domain: DomainG02D09P03,
    routePath: `${routePath}/view/$template_id`,
  },
];

const DomainG02D09 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default DomainG02D09;
