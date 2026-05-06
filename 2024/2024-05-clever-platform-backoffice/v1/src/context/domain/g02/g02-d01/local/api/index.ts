import ContentRestAPI from './group/content/restapi';
import LearningAreaRestAPI from './group/learning-area/restapi';
import StandardRestAPI from './group/standard/restapi';
import LearningContentRestAPI from './group/learning-content/restapi';
import IndicatorRestAPI from './group/indicator/restapi';
import YearRestAPI from './group/year/restapi';
import SubStandardRestAPI from './group/sub-standard/restapi';
import ReportRestAPI from './group/report/restapi';

import {
  LearningAreaRepository,
  ContentRepository,
  StandardRepository,
  LearningContentRepository,
  IndicatorRepository,
  YearRepository,
  SubStandardRepository,
  ReportRepository,
} from './repository';

// ======================= Environment Import ================================
let learningareaRestAPI: LearningAreaRepository = LearningAreaRestAPI;
let contentRestAPI: ContentRepository = ContentRestAPI;
let standardRestAPI: StandardRepository = StandardRestAPI;
let learningContentRestAPI: LearningContentRepository = LearningContentRestAPI;
let indicatorRestAPI: IndicatorRepository = IndicatorRestAPI;
let yearRestAPI: YearRepository = YearRestAPI;
let subStandardRestAPI: SubStandardRepository = SubStandardRestAPI;
let reportRestAPI: ReportRepository = ReportRestAPI;

// const mockIs = !import.meta.env.PROD && import.meta.env.VITE_DEBUG_API_IS_MOCK === 'true';

// if (mockIs) {
//   // dynamic for test only dev without include build file
//   // InfrastructureAPI = Mock;
//   academicLevelAPI = await import('./group/affiliation/mock').then(
//     (module) => module.default,
//   );
// }

// ===========================================================================
const API = {
  LearningArea: learningareaRestAPI,
  Content: contentRestAPI,
  Standard: standardRestAPI,
  learningContent: learningContentRestAPI,
  Indicator: indicatorRestAPI,
  Year: yearRestAPI,
  SubStandard: subStandardRestAPI,
  Report: reportRestAPI,
};

export default API;
