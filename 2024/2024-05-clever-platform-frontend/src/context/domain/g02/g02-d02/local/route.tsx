import DomainG02D02P01AnnoucementRoute from '../g02-d02-p01-annoucement/route';
import DomainG02D02P02SubjectSelectRoute from '../g02-d02-p02-subject-select/route';
import DomainG02D02P03PreloadingRoute from '../g02-d02-p03-preloading/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG02D02P01AnnoucementRoute, routePath: routePath + 'annoucement' },
  { domain: DomainG02D02P02SubjectSelectRoute, routePath: routePath + 'subject-select' },
  { domain: DomainG02D02P03PreloadingRoute, routePath: routePath + 'preloading' },
];

const DomainG02D02 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG02D02;
