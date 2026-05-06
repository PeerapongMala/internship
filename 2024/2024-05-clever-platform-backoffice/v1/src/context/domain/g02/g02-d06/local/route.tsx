import './index.css';

import DomainG02D06P00Route from '../g02-d06-p00-translation/route';

import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG02D06P00Route, routePath: `${routePath}/` },
  { domain: DomainG02D06P00Route, routePath: `${routePath}/$curriculumGroupId` },
];

const DomainG02D06 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG02D06;
