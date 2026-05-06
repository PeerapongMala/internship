import DomainG02D02P01LearningArea from '../g02-d01-p01-learning-area/route';
import DomainG02D02P02LearningAreaEdit from '../g02-d01-p02-learning-area-edit/route';
import DomainG02D01P03Content from '../g02-d01-p03-content/route';
import DomainG02D01P04ContentEdit from '../g02-d01-p04-content-edit/route';
import DomainG02D01P05Standard from '../g02-d01-p05-standard/route';
import DomainG02D01P06StandardEdit from '../g02-d01-p06-standard-edit/route';
import DomainG02D01P07LearningContent from '../g02-d01-p07-learning-content/route';
import DomainG02D01P08LearningContentEdit from '../g02-d01-p08-learning-content-edit/route';
import DomainG02D01P09Indicator from '../g02-d01-p09-indicator/route';
import DomainG02D01P10IndicatorEdit from '../g02-d01-p10-indicator-edit/route';
import DomainG02D01P11SubStandard from '../g02-d01-p11-sub-standard/route';
import DomainG02D01P12SubStandardCreate from '../g02-d01-p12-sub-standard-create/route';
import DomainG02D01P13SubStandardEdit from '../g02-d01-p13-sub-standard-edit/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  {
    domain: DomainG02D02P01LearningArea,
    routePath: `${routePath}/learning-area`,
  },
  {
    domain: DomainG02D02P02LearningAreaEdit,
    routePath: `${routePath}/learning-area/$learningAreaId/edit`,
  },
  {
    domain: DomainG02D01P03Content,
    routePath: `${routePath}/content`,
  },
  {
    domain: DomainG02D01P04ContentEdit,
    routePath: `${routePath}/content/$contentId/edit`,
  },
  {
    domain: DomainG02D01P05Standard,
    routePath: `${routePath}/standard`,
  },
  {
    domain: DomainG02D01P06StandardEdit,
    routePath: `${routePath}/standard/$standardId/edit`,
  },
  {
    domain: DomainG02D01P07LearningContent,
    routePath: `${routePath}/learning-content`,
  },
  {
    domain: DomainG02D01P08LearningContentEdit,
    routePath: `${routePath}/learning-content/$learningContentId/edit`,
  },
  {
    domain: DomainG02D01P09Indicator,
    routePath: `${routePath}/indicator`,
  },
  {
    domain: DomainG02D01P10IndicatorEdit,
    routePath: `${routePath}/indicator/$indicatorId/edit`,
  },
  {
    domain: DomainG02D01P11SubStandard,
    routePath: `${routePath}/sub-standard`,
  },
  {
    domain: DomainG02D01P12SubStandardCreate,
    routePath: `${routePath}/sub-standard-create`,
  },
  {
    domain: DomainG02D01P13SubStandardEdit,
    routePath: `${routePath}/sub-standard/$subStandardId/edit`,
  },
];

const DomainG02D01 = {
  domainList: domainList,
  i18NInit: I18NInit,
};

export default DomainG02D01;
