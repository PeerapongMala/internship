import DomainG03D03P01RedeemRoute from '../g03-d03-p01-redeem/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG03D03P01RedeemRoute, routePath: routePath + 'redeem' },
];

const DomainG03D03 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG03D03;
