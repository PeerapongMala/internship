import './index.css';

import DomainG02D05P00Route from '../g02-d05-p00-content-list/route';
import DomainG02D05P01Route from '../g02-d05-p01-content-setting/route';
import DomainG02D05P02Route from '../g02-d05-p02-content-question/route';
import DomainG02D05P03Route from '../g02-d05-p03-content-translate/route';
import DomainG02D05P04Route from '../g02-d05-p04-content-sound/route';
import DomainG02D05P05Route from '../g02-d05-p05-content-public/route';

import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG02D05P00Route, routePath: `${routePath}/$subLessonId` },
  {
    domain: DomainG02D05P01Route,
    routePath: `${routePath}/$subLessonId/create-setting/`,
  },
  {
    domain: DomainG02D05P01Route,
    routePath: `${routePath}/$subLessonId/create-setting/$academicLevelId`,
  },
  {
    domain: DomainG02D05P02Route,
    routePath: `${routePath}/$subLessonId/create-question/$academicLevelId`,
  },
  {
    domain: DomainG02D05P03Route,
    routePath: `${routePath}/$subLessonId/create-translate/$academicLevelId`,
  },
  {
    domain: DomainG02D05P04Route,
    routePath: `${routePath}/$subLessonId/create-sound/$academicLevelId`,
  },
  {
    domain: DomainG02D05P05Route,
    routePath: `${routePath}/$subLessonId/create-public/$academicLevelId`,
  },
];

const DomainG02D05 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG02D05;
