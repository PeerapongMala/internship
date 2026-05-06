import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';
import { RepositoryPatternInterface } from '../../../../repository-pattern';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

// g03-d06-a03
export const NotificationGet: RepositoryPatternInterface['Global']['Notification']['Get'] =
  (subjectId: string) => {
    const url = `${backendURL}/mail-box/v1/announcement/${subjectId}/system?limit=-1`;
    return fetchWithAuth(url, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  };

// g03-d06-a04
export const NotificationRead: RepositoryPatternInterface['Global']['Notification']['Read'] =
  (announcementId: string) => {
    const url = `${backendURL}/mail-box/v1/announcement/${announcementId}`;
    return fetchWithAuth(url, {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  };

// g03-d06-a10
export const NotificationReadAll: RepositoryPatternInterface['Global']['Notification']['ReadAll'] =
  (subjectId: string) => {
    const url = `${backendURL}/mail-box/v1/announcement/${subjectId}/system`;
    return fetchWithAuth(url, {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  };

// g03-d06-a05
export const NotificationDelete: RepositoryPatternInterface['Global']['Notification']['Delete'] =
  (announcementId: string) => {
    const url = `${backendURL}/mail-box/v1/announcement/${announcementId}`;
    return fetchWithAuth(url, {
      method: 'PATCH',
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  };

// g03-d06-a08
export const NotificationDeleteAllRead: RepositoryPatternInterface['Global']['Notification']['DeleteAllRead'] =
  (subjectId: string) => {
    const url = `${backendURL}/mail-box/v1/announcement/${subjectId}/system`;
    return fetchWithAuth(url, {
      method: 'PATCH',
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  };

const Notifications: RepositoryPatternInterface['Global']['Notification'] = {
  Get: NotificationGet,
  Read: NotificationRead,
  ReadAll: NotificationReadAll,
  Delete: NotificationDelete,
  DeleteAllRead: NotificationDeleteAllRead,
};

export default Notifications;
