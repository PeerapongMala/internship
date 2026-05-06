import './index.css';

import DomainG01D03P00Route from '../g01-d03-p00-translation/route';
import DomainG02D06P00Route from '@domain/g02/g02-d06/g02-d06-p00-translation/route';

import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG01D03P00Route, routePath: `${routePath}` },
  { domain: DomainG02D06P00Route, routePath: `${routePath}/$curriculumGroupId` },
];

const DomainG01D03 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG01D03;
