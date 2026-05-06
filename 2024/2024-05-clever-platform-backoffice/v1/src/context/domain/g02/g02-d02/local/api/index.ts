import RestAPIManageYear from './group/manage-year/restapi';
import SeedYearRestAPI from './group/seed-year/restapi';
import SubjectGroupRestAPI from './group/subject-group/restapi';
import SubjectRestApi from './group/subject/restapi';
import SeedSubjectGroupRestAPI from './group/seed-subject-group/restapi';
import TagRestAPI from './group/tag/restapi';
import TagGroupRestAPI from './group/tag-group/restapi';

import { ManageYearRepository } from './repository/manage-year';
import { SeedYearRepository } from './repository/seed-year';
import { SubjectGroupRepository } from './repository/subject-group';
import { SubjectRepository } from './repository/subject';
import { SeedSubjectGroupRepository } from './repository/seed-subject-group';
import { TagRepository } from './repository/tag';
import { TagGroupRepository } from './repository/tag-group';
import { PlatformRepository } from './repository/platform';
import PlatformRestAPI from './group/platform/restapi';
import { SeedPlatformRepository } from './repository/seed-platform';
import SeedPlatformRestAPI from './group/seed-platform/restapi';

// ======================= Environment Import ================================
let manageYearAPI: ManageYearRepository = RestAPIManageYear;
let seedYearApi: SeedYearRepository = SeedYearRestAPI;
let subjectGroupApi: SubjectGroupRepository = SubjectGroupRestAPI;
let subjectApi: SubjectRepository = SubjectRestApi;
let seedSubjectGroupApi: SeedSubjectGroupRepository = SeedSubjectGroupRestAPI;
let tagApi: TagRepository = TagRestAPI;
let tagGroupApi: TagGroupRepository = TagGroupRestAPI;
let platformApi: PlatformRepository = PlatformRestAPI;
let seedPlatformApi: SeedPlatformRepository = SeedPlatformRestAPI;

const mockIs = !import.meta.env.PROD && import.meta.env.VITE_DEBUG_API_IS_MOCK === 'true';

if (mockIs) {
  // dynamic for test only dev without include build file
  // InfrastructureAPI = Mock;
  // manageYearAPI = await import('./group/manage-year/mock').then(
  //   (module) => module.default,
  // );

  // seedYearApi = await import('./group/seed-year/mock').then((module) => module.default);

  // subjectGroupApi = await import('./group/subject-group/mock').then(
  //   (module) => module.default,
  // );

  // subjectApi = await import('./group/subject/mock').then((module) => module.default);

  // seedSubjectGroupApi = await import('./group/seed-subject-group/mock').then(
  //   (module) => module.default,
  // );

  tagApi = await import('./group/tag/mock').then((module) => module.default);

  tagGroupApi = await import('./group/tag-group/mock').then((module) => module.default);
}

// ===========================================================================
const API = {
  manageYear: manageYearAPI,
  seedYear: seedYearApi,
  subjectGroup: subjectGroupApi,
  subject: subjectApi,
  seedSubjectGroup: seedSubjectGroupApi,
  tag: tagApi,
  tagGroup: tagGroupApi,
  platform: platformApi,
  seedPlatform: seedPlatformApi,
};

export default API;
