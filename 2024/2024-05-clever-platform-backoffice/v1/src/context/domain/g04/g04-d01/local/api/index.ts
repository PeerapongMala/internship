import RestAPIAnnounceEvent from './group/annoucement/event/restapi';
import RestAPIAnnounceGlobal from './group/annoucement/global/restapi';
import RestAPIAnnounceNotification from './group/annoucement/notification/restapi';
import RestAPIAnnounceReward from './group/annoucement/reward/restapi';
import RestAPIOther from './group/other/restapi';
import { AnnounceEventRepository } from './repository/announcement/event';
import { AnnounceGlobalRepository } from './repository/announcement/global';
import { AnnounceNotificationRepository } from './repository/announcement/notification';
import { AnnounceRewardRepository } from './repository/announcement/reward';
import { OtherRepository } from './repository/other';

// ======================= Environment Import ================================
const announceGlobal: AnnounceGlobalRepository = RestAPIAnnounceGlobal;
const announceEvent: AnnounceEventRepository = RestAPIAnnounceEvent;
const announceReward: AnnounceRewardRepository = RestAPIAnnounceReward;
const announceNotification: AnnounceNotificationRepository = RestAPIAnnounceNotification;
const otherAPI: OtherRepository = RestAPIOther;

const mockIs = !import.meta.env.PROD && import.meta.env.VITE_DEBUG_API_IS_MOCK === 'true';

// classroomAPI = await import('./infrastructure/restapi').then(
//   (module) => module.default,
// );

// ======================= Export API ================================

// ===========================================================================
const API = {
  announce: {
    system: announceGlobal,
    event: announceEvent,
    reward: announceReward,
    notification: announceNotification,
  },
  other: otherAPI,
};
export default API;
