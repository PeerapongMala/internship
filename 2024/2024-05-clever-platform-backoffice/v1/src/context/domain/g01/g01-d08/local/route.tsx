import DomainG01D08P00Route from '../g01-d08-p00-family/route';
import DomainG01D08P01Route from '../g01-d08-p01-family-info/route.tsx';
import DomainG01D08P02Route from '../g01-d08-p02-family-parent/route.tsx';
import DomainG01D08P03Route from '../g01-d08-p03-family-student/route.tsx';
import DomainG01D08P04Route from '../g01-d08-p04-family-add/route.tsx';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG01D08P00Route, routePath: routePath },
  { domain: DomainG01D08P01Route, routePath: `${routePath}/$familyId/info` },
  { domain: DomainG01D08P02Route, routePath: `${routePath}/$familyId/parent` },
  { domain: DomainG01D08P03Route, routePath: `${routePath}/$familyId/student` },
  { domain: DomainG01D08P04Route, routePath: `${routePath}/add` },
];

const DomainG01D08 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG01D08;
