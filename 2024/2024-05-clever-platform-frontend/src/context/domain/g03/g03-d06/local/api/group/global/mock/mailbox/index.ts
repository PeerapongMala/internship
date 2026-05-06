import { pagination, responseOk } from '@core/helper/api-mock';
import { RepositoryPatternInterface } from '../../../../repository-pattern';
import MockJson from './index.json';

export const MailboxGet: RepositoryPatternInterface['Global']['Mailboxes']['Get'] = (
  subjectId: string,
) => {
  return Promise.resolve(
    pagination({
      data: MockJson,
      page: 1,
      limit: -1,
    }),
  );
};

export const MailboxRead: RepositoryPatternInterface['Global']['Mailboxes']['Read'] = (
  announcementId: string,
) => {
  return Promise.resolve(
    responseOk({
      data: undefined,
      message: `Announcement Id ${announcementId} has read`,
    }),
  );
};

export const MailboxReadAll: RepositoryPatternInterface['Global']['Mailboxes']['ReadAll'] =
  (subjectId: string) => {
    return Promise.resolve(
      responseOk({ data: undefined, message: 'Announcements Read' }),
    );
  };

export const MailboxDelete: RepositoryPatternInterface['Global']['Mailboxes']['Delete'] =
  (announcementId: string) => {
    return Promise.resolve(responseOk({ data: undefined, message: 'Deleted' }));
  };

export const MailboxDeleteAllRead: RepositoryPatternInterface['Global']['Mailboxes']['DeleteAllRead'] =
  (subjectId: string) => {
    return Promise.resolve(responseOk({ data: undefined, message: 'Deleted' }));
  };

export const MailboxReceiveItem: RepositoryPatternInterface['Global']['Mailboxes']['ReceiveItem'] =
  (subjectId: string, announcementId: string) => {
    return Promise.resolve(responseOk({ data: undefined, message: 'Receive Item' }));
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
