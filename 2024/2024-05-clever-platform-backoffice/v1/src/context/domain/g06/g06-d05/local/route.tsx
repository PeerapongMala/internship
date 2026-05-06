import './index.css';

import I18NInit from './i18n';

import DomainG06D05P00Route from '../g06-d05-p00-path/route';
import DomainG06D05P01Route from '../g06-d05-p01-course/route';
// import DomainG06D05P02Route from '../g06-d05-p02-phorpor5-class/route';
// import DomainG06D05P03Route from '../g06-d05-p03-phorpor5-course/route';
import DomainG06D05P04Route from '../g06-d05-p04-students/route';
import DomainG06D05P05Route from '../g06-d05-p05-father-mother/route';
import DomainG06D05P06Route from '../g06-d05-p06-parents/route';
import DomainG06D05P07Route from '../g06-d05-p07-class-time/route';
import DomainG06D05P08Route from '../g06-d05-p08-nutritional-summary/route';
import DomainG06D05P09Route from '../g06-d05-p09-learning-outcomes/route';
import DomainG06D05P10Route from '../g06-d05-p10-desired-attributes/route';
import DomainG06D05P11Route from '../g06-d05-p11-competencies/route';
import DomainG06D05P12Route from '../g06-d05-p12-student-development-activities/route';

const domainList = (routePath: string) => [
  { domain: DomainG06D05P00Route, routePath: `${routePath}/$path` },
  // { domain: DomainG06D05P02Route, routePath: `${routePath}/phorpor5-class` },
  // { domain: DomainG06D05P03Route, routePath: `${routePath}/phorpor5-course` },
  { domain: DomainG06D05P04Route, routePath: `${routePath}/students` },
  { domain: DomainG06D05P05Route, routePath: `${routePath}/father-mother` },
  { domain: DomainG06D05P06Route, routePath: `${routePath}/parents` },
  { domain: DomainG06D05P07Route, routePath: `${routePath}/class-time` },
  { domain: DomainG06D05P08Route, routePath: `${routePath}/nutritional-summary` },
  { domain: DomainG06D05P09Route, routePath: `${routePath}/learning-outcomes` },
  { domain: DomainG06D05P10Route, routePath: `${routePath}/desired-attributes` },
  { domain: DomainG06D05P11Route, routePath: `${routePath}/competencies` },
  {
    domain: DomainG06D05P12Route,
    routePath: `${routePath}/student-development-activities`,
  },
];

const DomainG06D05 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG06D05;
