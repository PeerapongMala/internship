import { pagination, responseOk } from '@core/helper/api-mock';
import { RepositoryPatternInterface } from '../../../../repository-pattern';
import MockJson from './index.json';

export const NotificationGet: RepositoryPatternInterface['Global']['Notification']['Get'] =
  (subjectId: string) => {
    return Promise.resolve(
      pagination({
        data: MockJson,
        page: 1,
        limit: -1,
      }),
    );
  };

export const NotificationRead: RepositoryPatternInterface['Global']['Notification']['Read'] =
  (announcementId: string) => {
    return Promise.resolve(
      responseOk({
        data: undefined,
        message: `Announcement Id ${announcementId} has read`,
      }),
    );
  };

export const NotificationReadAll: RepositoryPatternInterface['Global']['Notification']['ReadAll'] =
  (subjectId: string) => {
    return Promise.resolve(
      responseOk({ data: undefined, message: 'Announcements Read' }),
    );
  };

export const NotificationDelete: RepositoryPatternInterface['Global']['Notification']['Delete'] =
  (announcementId: string) => {
    return Promise.resolve(responseOk({ data: undefined, message: 'Deleted' }));
  };

export const NotificationDeleteAllRead: RepositoryPatternInterface['Global']['Notification']['DeleteAllRead'] =
  (subjectId: string) => {
    return Promise.resolve(responseOk({ data: undefined, message: 'Deleted' }));
  };

const Notifications: RepositoryPatternInterface['Global']['Notification'] = {
  Get: NotificationGet,
  Read: NotificationRead,
  ReadAll: NotificationReadAll,
  Delete: NotificationDelete,
  DeleteAllRead: NotificationDeleteAllRead,
};

export default Notifications;
