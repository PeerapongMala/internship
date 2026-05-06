import RestAPIAffiliation from './group/affiliation/restapi';
import RestAPIAffiliationContract from './group/affiliation-contract/restapi';
import { AffiliationRepository } from './repository/affiliation';
import { AffiliationContractRepository } from './repository/affiliation-contract';
import { CurriculumGroupRepository } from './repository/curriculum-group';
import CurriculumGroupRestAPI from './group/curriculum-group/restapi';
import { SeedYearRepository } from './repository/seed-year';
import SeedYearRestAPI from './group/seed-year/restapi';
import { ContentCreatorRepository } from './repository/content-creator';
import ContentCreatorRestAPI from './group/content-creator/restapi';

// ======================= Environment Import ================================
let affiliationAPI: AffiliationRepository = RestAPIAffiliation;
let affiliationContractAPI: AffiliationContractRepository = RestAPIAffiliationContract;
let curriculumGroupAPI: CurriculumGroupRepository = CurriculumGroupRestAPI;
let seedYearAPI: SeedYearRepository = SeedYearRestAPI;
let contentCreatorAPI: ContentCreatorRepository = ContentCreatorRestAPI;

const mockIs = !import.meta.env.PROD && import.meta.env.VITE_DEBUG_API_IS_MOCK === 'true';

if (mockIs) {
  // dynamic for test only dev without include build file
  // InfrastructureAPI = Mock;
  affiliationAPI = await import('./group/affiliation/mock').then(
    (module) => module.default,
  );

  affiliationContractAPI = await import('./group/affiliation-contract/mock').then(
    (module) => module.default,
  );
}

// ===========================================================================
const API = {
  affiliation: affiliationAPI,
  affiliationContract: affiliationContractAPI,
  curriculumGroup: curriculumGroupAPI,
  seedYear: seedYearAPI,
  contentCreator: contentCreatorAPI,
};

export default API;
