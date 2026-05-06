import { AdminSchoolRestAPI } from './group/admin';
import CleverPlatformRestAPI from './group/cleverPlatform/restapi';
import GeneralTemplateDropdownRestAPI from './group/general_template-dropdown/restapi';
import GeneralTemplatesRestAPI from './group/general_template/restapi';
import IndicatorRestAPI from './group/indicator/restapi';
import SubjectsRestAPI from './group/subjects/restapi';
import TemplateRestAPI from './group/templates/restapi';
import YearRestAPI from './group/Year/restapi';
import {
  AdminSchoolRepository,
  CleverPlatformRepository,
  GeneralTemplateDropdownRepository,
  GeneralTemplatesRepository,
  IndicatorsRepository,
  SubjectsRepository,
  TemplatesRepository,
  YearRepository,
} from './repository';

// ======================= Environment Import ================================
let TemplatesRestAPI: TemplatesRepository = TemplateRestAPI;
let SubjectsRestAPIInstance: SubjectsRepository = SubjectsRestAPI;
let IndicatorsRestAPI: IndicatorsRepository = IndicatorRestAPI;
let GeneralTemplatesRestAPIInstance: GeneralTemplatesRepository = GeneralTemplatesRestAPI;
let GeneralTemplateDropdownRestAPIInstance: GeneralTemplateDropdownRepository =
  GeneralTemplateDropdownRestAPI;
let Year: YearRepository = YearRestAPI;
let CleverPlatformRestAPIInstance: CleverPlatformRepository = CleverPlatformRestAPI;
let AdminSchoolAPIInstance: AdminSchoolRepository = AdminSchoolRestAPI;
// ===========================================================================
const API = {
  Templates: TemplatesRestAPI,
  Subjects: SubjectsRestAPIInstance,
  Indicators: IndicatorsRestAPI,
  GeneralTemplates: GeneralTemplatesRestAPIInstance,
  GeneralTemplateDropdown: GeneralTemplateDropdownRestAPIInstance,
  Year,
  CleverPlatform: CleverPlatformRestAPIInstance,
  AdminSchool: AdminSchoolAPIInstance,
};

export default API;
