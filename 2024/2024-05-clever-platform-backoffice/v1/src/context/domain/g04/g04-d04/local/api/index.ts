import RestAPITranslation from './group/gamification/restapi';
import { GamificationRepository } from './repository';

// ======================= Environment Import ================================
let gamificationAPI: GamificationRepository = RestAPITranslation;

// ===========================================================================
const API = { gamification: gamificationAPI };

export default API;
