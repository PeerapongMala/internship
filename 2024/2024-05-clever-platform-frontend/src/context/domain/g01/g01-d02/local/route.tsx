import DomainG01D02P03TermsRoute from '../g01-d02-p03-terms/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG01D02P03TermsRoute, routePath: routePath + 'terms' },
];

const DomainG01D02 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG01D02;
