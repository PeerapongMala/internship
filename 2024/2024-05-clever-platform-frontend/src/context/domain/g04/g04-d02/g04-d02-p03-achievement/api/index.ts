import RestAPIachievement from './group/achievement/restapi';
import { AchievementRepository } from './repository';

// ======================= Environment Import ================================
let achievementAPI: AchievementRepository = RestAPIachievement;

// ===========================================================================
const API = { achievement: achievementAPI };

export default API;
