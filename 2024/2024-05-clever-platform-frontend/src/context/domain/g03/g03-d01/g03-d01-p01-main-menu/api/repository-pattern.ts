import { APITypeAPIResponse } from '@core/helper/api-type';
import {
  IProfile,
  MainMenuFooter,
  MainMenuNotification,
  MainMenuStatistic,
} from '../type';

export interface RepositoryPatternInterface {
  Global: {
    Statistic: {
      Get(userId: string): APITypeAPIResponse<MainMenuStatistic>;
    };
    Notifications: {
      Get(userId: string): APITypeAPIResponse<MainMenuNotification>;
    };
    Announcement: { Get(): APITypeAPIResponse<MainMenuFooter> };
  };
  User: {
    UserCurrent: { Get(): APITypeAPIResponse<IProfile> };
  };
}
