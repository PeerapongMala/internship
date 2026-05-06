import DomainG02D03P01Route from '../g02-d03-p01-lesson/route';
import DomainG02D03P02Route from '../g02-d03-p02-lesson-create/route';
import DomainG02D03P03Route from '../g02-d03-p03-lesson-update/route';

import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG02D03P01Route, routePath: `${routePath}` },
  { domain: DomainG02D03P02Route, routePath: `${routePath}/create/$subjectID` },
  { domain: DomainG02D03P03Route, routePath: `${routePath}/$lessonId/edit` },
];

const DomainG02D03 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG02D03;
