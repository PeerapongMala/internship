import { RepositoryPatternInterface } from '../../../repository-pattern';
import AnnouncementGet from './announcement-get';
import NotificationsGet from './notifications-get';
import StatisticGet from './statistic-get';

const Global: RepositoryPatternInterface['Global'] = {
  Statistic: { Get: StatisticGet },
  Notifications: { Get: NotificationsGet },
  Announcement: { Get: AnnouncementGet },
};

export default Global;
