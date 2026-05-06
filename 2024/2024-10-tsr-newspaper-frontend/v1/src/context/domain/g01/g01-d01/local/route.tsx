import DomainG01D01P01Route from '../../../g01/g01-d01/g01-d01-p01-home/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG01D01P01Route, routePath: routePath },
];

const Domaing01D01 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default Domaing01D01;
