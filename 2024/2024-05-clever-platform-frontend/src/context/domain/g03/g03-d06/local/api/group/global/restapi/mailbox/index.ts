import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';
import { RepositoryPatternInterface } from '../../../../repository-pattern';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

// g03-d06-a02
export const MailboxGet: RepositoryPatternInterface['Global']['Mailboxes']['Get'] = (
  subjectId: string,
) => {
  const url = `${backendURL}/mail-box/v1/announcement/${subjectId}/reward?limit=-1`;
  return fetchWithAuth(url, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((res) => {
      return res;
    });
};

// g03-d06-a04
export const MailboxRead: RepositoryPatternInterface['Global']['Mailboxes']['Read'] = (
  announcementId: string,
) => {
  const url = `${backendURL}/mail-box/v1/announcement/${announcementId}`;
  return fetchWithAuth(url, {
    method: 'POST',
  })
    .then((res) => res.json())
    .then((res) => {
      return res;
    });
};

// g03-d06-a11
export const MailboxReadAll: RepositoryPatternInterface['Global']['Mailboxes']['ReadAll'] =
  (subjectId: string) => {
    const url = `${backendURL}/mail-box/v1/announcement/${subjectId}/reward`;
    return fetchWithAuth(url, {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  };

// g03-d06-a05
export const MailboxDelete: RepositoryPatternInterface['Global']['Mailboxes']['Delete'] =
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

// g03-d06-a07
export const MailboxDeleteAllRead: RepositoryPatternInterface['Global']['Mailboxes']['DeleteAllRead'] =
  (subjectId: string) => {
    const url = `${backendURL}/mail-box/v1/announcement/${subjectId}/reward`;
    return fetchWithAuth(url, {
      method: 'PATCH',
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  };

// g03-d06-a06
export const MailboxReceiveItem: RepositoryPatternInterface['Global']['Mailboxes']['ReceiveItem'] =
  (subjectId: string, announcementId: string) => {
    const url = `${backendURL}/mail-box/v1/announcement/${subjectId}/reward/${announcementId}`;
    return fetchWithAuth(url, {
      method: 'PATCH',
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  };

const Mailboxes: RepositoryPatternInterface['Global']['Mailboxes'] = {
  Get: MailboxGet,
  Read: MailboxRead,
  ReadAll: MailboxReadAll,
  Delete: MailboxDelete,
  DeleteAllRead: MailboxDeleteAllRead,
  ReceiveItem: MailboxReceiveItem,
};

export default Mailboxes;
