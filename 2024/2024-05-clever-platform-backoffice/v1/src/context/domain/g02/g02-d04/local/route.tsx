import DomainG02D04P01Route from '../g02-d04-p01-sublesson/route';
import DomainG02D04P02Route from '../g02-d04-p02-sublesson-create/route';
import DomainG02D04P03Route from '../g02-d04-p03-sublesson-update/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG02D04P01Route, routePath: `${routePath}/$lessonId` },
  { domain: DomainG02D04P02Route, routePath: `${routePath}/$lessonId/create` },
  { domain: DomainG02D04P03Route, routePath: `${routePath}/$lessonId/$sublessonId/edit` },
];

const DomainG02D04 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG02D04;
