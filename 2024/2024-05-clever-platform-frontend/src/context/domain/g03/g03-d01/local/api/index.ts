import RestAPICharacter from '../../g03-d01-p01-main-menu/api/group/character/restapi.ts';
import RestAPIachievement from './group/achievement/restapi';
import RestAPIMainMenu from './group/main-menu/restapi';
import {
  AchievementRepository,
  CharacterRepository,
  MainMenuRepository,
} from './repository';

// ======================= Environment Import ================================
let achievementAPI: AchievementRepository = RestAPIachievement;
let mainMenuAPI: MainMenuRepository = RestAPIMainMenu;
let characterAPI: CharacterRepository = RestAPICharacter;

// ===========================================================================
const API = {
  achievement: achievementAPI,
  mainMenu: mainMenuAPI,
  character: characterAPI,
};

export default API;
