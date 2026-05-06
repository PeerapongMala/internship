import RestAPITranslation from './group/reward/restapi';
import { RewardRepository } from './repository';

// ======================= Environment Import ================================
let rewardAPI: RewardRepository = RestAPITranslation;

// ===========================================================================
const API = { reward: rewardAPI };

export default API;
