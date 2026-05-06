import './index.css';

import I18NInit from './i18n';

import DomainG01D12P01Route from '../g07-d00-p01-profile/route';
const domainList = (routePath: string) => [
  { domain: DomainG01D12P01Route, routePath: `${routePath}` },
];

const DomainG01D12 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG01D12;
